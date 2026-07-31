const express = require("express");
const router = express.Router();

const {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Base order creation route for authenticated buyers/users
router.route("/").post(protect, createOrder);

// Specific order listing queries for buyers and sellers respectively
router.route("/buyer").get(protect, getBuyerOrders);
router.route("/seller").get(protect, authorize("seller"), getSellerOrders);

// Single order parameters and status modulators
router.route("/:id").get(protect, getOrderById);
router.route("/:id/status").put(protect, authorize("seller"), updateOrderStatus);
router.route("/:id/cancel").put(protect, cancelOrder);

module.exports = router;
