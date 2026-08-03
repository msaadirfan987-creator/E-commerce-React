// Import the User model to perform database operations on the users collection
const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
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

    // Check if a user with the provided email already exists in MongoDB permanent Users collection
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // Check if there is an unverified pending signup for this email
    const existingPending = await PendingUser.findOne({ email: normalizedEmail });
    if (existingPending) {
      return res.status(400).json({
        success: false,
        isUnverified: true,
        email: existingPending.email,
        message: "An account with this email address already exists.",
      });
    }

    // Generate a secure cryptographic 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    // Expiration time set strictly to 5 minutes from now
    const expirationMinutes = 5;
    const verificationExpires = new Date(Date.now() + expirationMinutes * 60 * 1000);

    // Hash the password securely using bcrypt before storing in PendingUser
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new pending user document in MongoDB
    const pendingUser = await PendingUser.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      verificationCode,
      verificationExpires,
    });

    // Determine if we are running in local development mode
    const isDevelopment = process.env.NODE_ENV !== "production" || 
                          (req.headers.host && (req.headers.host.includes("localhost") || req.headers.host.includes("127.0.0.1")));

    // Send the verification code email in production, otherwise bypass to show on screen for development
    if (!isDevelopment) {
      await sendVerificationEmail(pendingUser.email, verificationCode);
    }

    // Return a 201 Created response
    const responsePayload = {
      success: true,
      message: "Signup started. Please verify your account.",
      user: {
        fullName: pendingUser.fullName,
        email: pendingUser.email,
        role: pendingUser.role,
        isVerified: false,
      },
    };

    if (isDevelopment) {
      responsePayload.verificationCode = verificationCode;
    }

    res.status(201).json(responsePayload);
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
      // Check if there is a pending, unverified user
      const pendingUser = await PendingUser.findOne({ email: normalizedEmail });
      if (pendingUser) {
        const isDevelopment = process.env.NODE_ENV !== "production" || 
                              (req.headers.host && (req.headers.host.includes("localhost") || req.headers.host.includes("127.0.0.1")));
        const responsePayload = {
          success: false,
          isUnverified: true,
          email: pendingUser.email,
          message: "Please verify your account before logging in.",
        };

        if (isDevelopment) {
          responsePayload.verificationCode = pendingUser.verificationCode;
        }

        return res.status(400).json(responsePayload);
      }

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

    // Look up the pending signup record
    const pendingUser = await PendingUser.findOne({ email: normalizedEmail });
    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    // Verify the verification code matches
    if (pendingUser.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    // Verify the verification code has not expired (strictly 5 minutes validity)
    if (pendingUser.verificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired.",
      });
    }

    // Create the permanent User document in the database
    const user = await User.create({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password, // Already hashed using bcryptjs during signup
      role: pendingUser.role,
      isVerified: true,
      sellerStatus: pendingUser.role === "seller" ? "Pending" : "Approved",
    });

    // Delete the pending signup record
    await PendingUser.deleteOne({ _id: pendingUser._id });

    // Generate JWT token containing user ID and role for auto-login
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

    // Look up the pending signup record
    const pendingUser = await PendingUser.findOne({ email: normalizedEmail });
    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "No pending registration found for this email address.",
      });
    }

    // Rate Limit/Cooldown check (60 seconds)
    if (pendingUser.updatedAt) {
      const timeSinceLastCode = Date.now() - new Date(pendingUser.updatedAt).getTime();
      const cooldownRemaining = Math.ceil((60 * 1000 - timeSinceLastCode) / 1000);
      if (cooldownRemaining > 0) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${cooldownRemaining} seconds before requesting a new code.`,
        });
      }
    }

    // Generate a completely new random cryptographic 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    pendingUser.verificationCode = verificationCode;
    // Set code validity strictly to 5 minutes
    pendingUser.verificationExpires = new Date(Date.now() + 5 * 60 * 1000);
    await pendingUser.save();

    // Determine if we are running in local development mode
    const isDevelopment = process.env.NODE_ENV !== "production" || 
                          (req.headers.host && (req.headers.host.includes("localhost") || req.headers.host.includes("127.0.0.1")));

    // Send the verification code email in production, otherwise bypass to show on screen for development
    if (!isDevelopment) {
      await sendVerificationEmail(pendingUser.email, verificationCode);
    }

    const responsePayload = {
      success: true,
      message: "Verification code sent successfully.",
    };

    if (isDevelopment) {
      responsePayload.verificationCode = verificationCode;
    }

    res.status(200).json(responsePayload);
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