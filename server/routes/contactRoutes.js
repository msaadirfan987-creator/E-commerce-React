const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createContactMessage,
  getContactMessages,
} = require("../controllers/contactController");

// Public endpoint to send contact queries
router.post("/", createContactMessage);

// Protected admin endpoint to fetch all queries
router.get("/", protect, authorize("admin"), getContactMessages);

module.exports = router;
