const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAdminStats,
  getUsers,
  updateUserBlockStatus,
  updateUserRole,
  approveSeller,
  rejectSeller,
  deleteUser,
  getAdminProducts,
  updateProductVisibility,
  updateProductFeatured,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus
} = require("../controllers/adminController");

// Secure all endpoints under /api/admin to require logged-in admin role
router.use(protect);
router.use(authorize("admin"));

// Statistics metric card logs
router.get("/stats", getAdminStats);

// Accounts list controls
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserBlockStatus);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Seller verification state modifiers
router.put("/sellers/:id/approve", approveSeller);
router.put("/sellers/:id/reject", rejectSeller);

// Catalog listing moderation controls
router.get("/products", getAdminProducts);
router.put("/products/:id/visibility", updateProductVisibility);
router.put("/products/:id/featured", updateProductFeatured);
router.delete("/products/:id", deleteAdminProduct);

// Global orders overrides
router.get("/orders", getAdminOrders);
router.put("/orders/:id/status", updateAdminOrderStatus);

module.exports = router;
