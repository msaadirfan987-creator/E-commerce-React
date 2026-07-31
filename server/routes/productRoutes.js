const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, authorize, isApprovedSeller } = require("../middleware/authMiddleware");

// Base routes for retrieving all products (public) or creating a new product (authenticated sellers only)
router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("seller"), isApprovedSeller, createProduct);

// Specific routes by product ID for retrieving (public), updating (sellers only), or deleting (sellers only)
router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorize("seller"), isApprovedSeller, updateProduct)
  .delete(protect, authorize("seller"), isApprovedSeller, deleteProduct);

module.exports = router;
