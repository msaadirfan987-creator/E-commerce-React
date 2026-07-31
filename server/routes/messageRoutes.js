const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createMessage,
  getMessagesByConversation,
  getUserConversations,
  markMessagesAsRead,
} = require("../controllers/messageController");

// Mount specific endpoints
router.post("/messages", protect, createMessage);
router.get("/messages/:conversationId", protect, getMessagesByConversation);
router.get("/conversations", protect, getUserConversations);
router.patch("/messages/read", protect, markMessagesAsRead);

module.exports = router;
