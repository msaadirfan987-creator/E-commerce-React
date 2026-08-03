// Import the mongoose package to define schemas and interface with MongoDB
const mongoose = require("mongoose");
// Import the bcryptjs library for hashing passwords securely
const bcrypt = require("bcryptjs");

// Define the schema for the User model, mapping fields to documents in MongoDB Atlas
const userSchema = new mongoose.Schema(
  {
    // The user's full name is required, trimmed to remove leading/trailing spaces
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    // The user's email address is required, unique, lowercase, trimmed, and validated via regex
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    // The user's password is required and must have a minimum length of 6 characters for security
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    // The user's role can be 'customer', 'seller', or 'admin'
    role: {
      type: String,
      enum: {
        values: ["customer", "seller", "admin"],
        message: "Role must be customer, seller, or admin",
      },
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationExpires: {
      type: Date,
      default: null,
    },
    lastCodeSentAt: {
      type: Date,
      default: null,
    },
    sellerStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Suspended"],
      default: "Pending", // Default pending for sellers
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically manage 'createdAt' and 'updatedAt' fields for audit logs
    timestamps: true,
  }
);

// Mongoose pre-save hook to hash the plain text password with bcrypt before saving to database
userSchema.pre("save", async function () {
  console.log(`[Pre-Save Hook] Pre-save run. Password length/content check.`);

  // If the password field hasn't been modified, skip hashing
  if (!this.isModified("password")) {
    console.log("[Pre-Save Hook] Password not modified, skipping.");
    return;
  }

  // If the password is already a bcrypt hash, skip hashing to prevent double-hashing
  const isAlreadyHashed = this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'));
  if (isAlreadyHashed) {
    console.log("[Pre-Save Hook] Password is already a bcrypt hash, skipping hashing.");
    return;
  }

  // Generate a cryptographic salt using bcrypt with a standard strength factor of 10
  const salt = await bcrypt.genSalt(10);
  // Hash the plain text password using the generated salt and overwrite it
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  console.log(`[Pre-Save Hook] Password hashed successfully.`);
});

// Instance method on userSchema to compare an incoming plain text password with stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  console.log(`[comparePassword] Comparing entered password with stored credentials`);
  try {
    // Check if the stored password is a bcrypt hash
    const isHash = this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'));

    if (isHash) {
      const isMatch = await bcrypt.compare(enteredPassword, this.password);
      console.log(`[comparePassword] Bcrypt comparison match: ${isMatch}`);
      return isMatch;
    } else {
      // Fallback for existing plain text passwords
      const isMatch = enteredPassword === this.password;
      console.log(`[comparePassword] Plain text fallback comparison match: ${isMatch}`);

      // Auto-upgrade plain text passwords to bcrypt hashes on successful login
      if (isMatch) {
        console.log("[comparePassword] Upgrading plain text password to bcrypt hash...");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(enteredPassword, salt);
        this.password = hash;
        await this.save();
        console.log("[comparePassword] Password upgraded and saved to DB successfully.");
      }

      return isMatch;
    }
  } catch (error) {
    console.error("[comparePassword] Error comparing passwords:", error.message);
    return false;
  }
};

// Compile and export the User model for use in auth controllers and middleware
module.exports = mongoose.model("User", userSchema);
