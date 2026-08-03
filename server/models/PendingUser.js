const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "seller"],
        message: "Role must be customer or seller",
      },
      required: [true, "Role is required"],
    },
    verificationCode: {
      type: String,
      required: true,
    },
    verificationExpires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PendingUser", pendingUserSchema);
