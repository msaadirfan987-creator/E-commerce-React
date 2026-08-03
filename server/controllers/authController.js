// Import the User model to perform database operations on the users collection
const User = require("../models/User");
// Import jsonwebtoken to create signed tokens for authentication state
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { sendVerificationEmail } = require("../utils/emailService");

// Helper function to generate JWT token containing user ID and role, signed with JWT_SECRET
const generateToken = (id, role) => {
  // Use jwt.sign to create token with 30-day expiration time
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res) => {
  try {
    // Destructure fullName, email, password, and role from the incoming request body
    const { fullName, email, password, role } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : "";
    console.log(`[Signup Attempt] Email: ${normalizedEmail}`);

    // Check if any of the required fields are missing in the request
    if (!fullName || !email || !password || !role) {
      // Return 400 Bad Request if validation fails with an error message
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: fullName, email, password, and role.",
      });
    }

    // Validate that the role matches either 'customer' or 'seller'
    if (role !== "customer" && role !== "seller") {
      // Return 400 Bad Request if an invalid role is supplied
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be either 'customer' or 'seller'.",
      });
    }

    // Validate that the password length is at least 6 characters
    if (password.length < 6) {
      // Return 400 Bad Request if the password is too short
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check if a user with the provided email already exists in MongoDB Atlas
    const existingUser = await User.findOne({ email: normalizedEmail });
    // If user exists, send error response
    if (existingUser) {
      // Return 400 Bad Request denoting email conflict
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Expiration time set to 10 minutes from now
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create a new user document in MongoDB (pre-save hook hashes password)
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password, // Bcryptjs will hash this automatically in the User schema pre-save hook
      role,
      isVerified: false,
      verificationCode,
      verificationExpires,
      lastCodeSentAt: new Date(),
      sellerStatus: role === "seller" ? "Pending" : "Approved", // Sellers are pending admin approval
    });

    // Send the verification code email
    await sendVerificationEmail(user.email, verificationCode);

    // Return a 201 Created response
    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for the verification code.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus,
        isBlocked: user.isBlocked,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    // Return 500 Internal Server Error if something fails unexpectedly
    res.status(500).json({
      success: false,
      message: "Server Error during registration: " + error.message,
    });
  }
};

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : "";
    console.log(`[Login Attempt] Email: ${normalizedEmail}`);

    try {
      const client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
      const db = client.db();
      const dbUsers = await db.collection("users").find({}).toArray();
      await client.close();

      fs.writeFileSync(
        path.join(__dirname, "../login_debug.txt"),
        JSON.stringify({
          attemptTime: new Date().toISOString(),
          enteredEmail: email,
          enteredPassword: password,
          normalizedEmail,
          allDbUsers: dbUsers
        }, null, 2)
      );
    } catch (err) {
      fs.writeFileSync(
        path.join(__dirname, "../login_debug.txt"),
        JSON.stringify({
          attemptTime: new Date().toISOString(),
          error: err.message
        }, null, 2)
      );
    }

    // Validate that email and password are provided in the payload
    if (!email || !password) {
      // Return 400 Bad Request if inputs are missing
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    // Look up the user in MongoDB Atlas using the provided email
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    console.log(`[Login Info] Found user in DB: ${!!user}`);

    // If no user is found with this email
    if (!user) {
      // Return 401 Unauthorized for invalid credentials to protect system details
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if the user is suspended
    if (user.isBlocked) {
      return res.status(401).json({
        success: false,
        message: "Your account has been suspended by the administrator.",
      });
    }



    // Verify if the password matches the hashed password stored in the database
    const isMatch = await user.comparePassword(password);
    console.log(`[Login Info] Password Match: ${isMatch}`);

    // If password does not match
    if (!isMatch) {
      // Return 401 Unauthorized for invalid credentials
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if the user's account email has been verified
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        isUnverified: true,
        email: user.email,
        message: "Please verify your email before logging in.",
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token containing user ID and role for authorization
    const token = generateToken(user._id, user.role);

    // Return 200 OK with the generated token and user details (excluding password)
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    // Return 500 Internal Server Error if there is a server crash
    res.status(500).json({
      success: false,
      message: "Server Error during login: " + error.message,
    });
  }
};

// Helper diagnostic function to get all users in database (local development only)
const getDiagnosticUsers = async (req, res) => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db();
    const rawUsers = await db.collection("users").find({}).toArray();
    await client.close();

    res.status(200).json({
      success: true,
      count: rawUsers.length,
      users: rawUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Diagnostic Error: " + error.message,
    });
  }
};

const testCreate = async (req, res) => {
  try {
    const testEmail = `test_${Date.now()}@gmail.com`;
    const createdUser = await User.create({
      fullName: "Test User",
      email: testEmail,
      password: "password123",
      role: "customer"
    });

    const mongooseUser = await User.findOne({ email: testEmail });
    const mongooseUserWithPassword = await User.findOne({ email: testEmail }).select("+password").lean();

    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db();
    const rawUser = await db.collection("users").findOne({ email: testEmail });
    await client.close();

    res.status(200).json({
      success: true,
      testEmail,
      createdUser,
      mongooseUser,
      mongooseUserWithPassword,
      rawUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : "";

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit verification code are required.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account has already been verified. Please log in.",
      });
    }

    if (user.verificationCode !== code || user.verificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // Complete verification
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    // Auto-login upon verification
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error during verification: " + error.message,
    });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : "";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required to resend verification code.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. Please log in.",
      });
    }

    // Rate Limit/Cooldown check (60 seconds)
    if (user.lastCodeSentAt) {
      const timeSinceLastCode = Date.now() - new Date(user.lastCodeSentAt).getTime();
      const cooldownRemaining = Math.ceil((60 * 1000 - timeSinceLastCode) / 1000);
      if (cooldownRemaining > 0) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${cooldownRemaining} seconds before requesting a new code.`,
        });
      }
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    user.lastCodeSentAt = new Date();
    await user.save();

    await sendVerificationEmail(user.email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

// Export the controller methods to be bound to auth routes
module.exports = {
  signup,
  login,
  getDiagnosticUsers,
  testCreate,
  verifyEmail,
  resendVerificationCode,
};