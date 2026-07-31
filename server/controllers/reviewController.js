const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * @desc    Leave a product review
 * @route   POST /api/reviews
 * @access  Private (Buyer only)
 */
const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be an integer between 1 and 5." });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Please include a written review comment." });
    }

    // Load order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order record not found." });
    }

    // Verify buyer owns this order
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden. You did not place this order." });
    }

    // Verify order is Delivered
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({ success: false, message: "You can only review items after they have been Delivered." });
    }

    // Verify the product exists in order items
    const hasProduct = order.items.some(item => item.product.toString() === productId);
    if (!hasProduct) {
      return res.status(400).json({ success: false, message: "This product was not part of the specified order." });
    }

    // Check if buyer has already reviewed this product for this order
    const existingReview = await Review.findOne({
      buyer: req.user.id,
      order: orderId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already left a review for this product on this order." });
    }

    // Create review
    const review = await Review.create({
      buyer: req.user.id,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error submitting review: " + error.message,
    });
  }
};

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("buyer", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error loading product reviews: " + error.message,
    });
  }
};

/**
 * @desc    Get reviews for all seller's products
 * @route   GET /api/reviews/seller
 * @access  Private (Seller only)
 */
const getSellerReviews = async (req, res) => {
  try {
    // Find all products owned by the seller
    const products = await Product.find({ seller: req.user.id });
    const productIds = products.map(p => p._id);

    // Fetch all reviews matching these product IDs
    const reviews = await Review.find({ product: { $in: productIds } })
      .populate("buyer", "fullName email")
      .populate("product", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error loading merchant feedback: " + error.message,
    });
  }
};

/**
 * @desc    Moderate/Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Seller/Admin only)
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("product");
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    // Verify ownership: only product's seller or admin can delete
    const isSeller = review.product.seller.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isSeller && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden. Unauthorized to delete this feedback." });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review moderated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error deleting review: " + error.message,
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getSellerReviews,
  deleteReview,
};
