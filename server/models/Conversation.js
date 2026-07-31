const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate conversations for the same buyer, seller, and order
ConversationSchema.index({ buyer: 1, seller: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
