const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getAdminDashboard, getSellerDashboard } = require("../controllers/dashboardController");

// Admin specific dashboard metrics
router.get("/admin", protect, authorize("admin"), getAdminDashboard);

// Seller specific dashboard metrics
router.get("/seller", protect, authorize("seller"), getSellerDashboard);

module.exports = router;
