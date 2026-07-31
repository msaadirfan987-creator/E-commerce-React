const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createReview,
  getProductReviews,
  getSellerReviews,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/", protect, createReview);
router.get("/product/:productId", getProductReviews);
router.get("/seller", protect, getSellerReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;
