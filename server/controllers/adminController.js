const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

/**
 * @desc    Get dashboard statistics for Admin
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: "customer" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const pendingSellers = await User.countDocuments({ role: "seller", sellerStatus: "Pending" });
    const approvedSellers = await User.countDocuments({ role: "seller", sellerStatus: "Approved" });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Sum total platform revenue (excluding Cancelled/Rejected orders)
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $nin: ["Cancelled", "Rejected"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBuyers,
        totalSellers,
        pendingSellers,
        approvedSellers,
        blockedUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching admin stats: " + error.message
    });
  }
};

/**
 * @desc    Get all users (excluding admins)
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getUsers = async (req, res) => {
  try {
    const { search, role, isBlocked } = req.query;
    const query = { role: { $ne: "admin" } };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === "true";
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching users list: " + error.message
    });
  }
};

/**
 * @desc    Toggle block/unblock status of any buyer or seller
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin only)
 */
const updateUserBlockStatus = async (req, res) => {
  try {
    const { isBlocked } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot modify block status of an Admin account." });
    }

    user.isBlocked = !!isBlocked;
    
    // Automatically toggle seller status to Suspended or Approved based on block toggle
    if (user.role === "seller") {
      user.sellerStatus = !!isBlocked ? "Suspended" : "Approved";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been successfully ${user.isBlocked ? "suspended" : "activated"}.`,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error updating block status: " + error.message
    });
  }
};

/**
 * @desc    Update a user's role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin only)
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!["customer", "seller"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role value." });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.role = role;
    if (role === "seller") {
      user.sellerStatus = "Approved"; // Auto-approve on role upgrade
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error updating user role: " + error.message
    });
  }
};

/**
 * @desc    Approve a pending seller account
 * @route   PUT /api/admin/sellers/:id/approve
 * @access  Private (Admin only)
 */
const approveSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ success: false, message: "Seller account not found." });
    }

    seller.sellerStatus = "Approved";
    seller.isBlocked = false;
    seller.approvedBy = req.user._id;
    seller.approvedAt = new Date();
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller account approved successfully.",
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error approving seller: " + error.message
    });
  }
};

/**
 * @desc    Reject a pending seller account
 * @route   PUT /api/admin/sellers/:id/reject
 * @access  Private (Admin only)
 */
const rejectSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ success: false, message: "Seller account not found." });
    }

    seller.sellerStatus = "Rejected";
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller account rejected successfully.",
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error rejecting seller: " + error.message
    });
  }
};

/**
 * @desc    Delete a user and clean up their listings
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Admin accounts cannot be deleted." });
    }

    // Delete seller's listed products to prevent orphan catalog items
    if (user.role === "seller") {
      await Product.deleteMany({ seller: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error deleting user: " + error.message
    });
  }
};

/**
 * @desc    Get all products for moderation
 * @route   GET /api/admin/products
 * @access  Private (Admin only)
 */
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("seller", "fullName email").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error retrieving products: " + error.message
    });
  }
};

/**
 * @desc    Moderate product visibility (Hide / Restore)
 * @route   PUT /api/admin/products/:id/visibility
 * @access  Private (Admin only)
 */
const updateProductVisibility = async (req, res) => {
  try {
    const { visibility } = req.body;
    if (!["Visible", "Hidden"].includes(visibility)) {
      return res.status(400).json({ success: false, message: "Invalid visibility status." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product listing not found." });
    }

    product.visibility = visibility;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product is now successfully ${visibility === "Visible" ? "restored to storefront" : "hidden from storefront"}.`,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error modifying product visibility: " + error.message
    });
  }
};

/**
 * @desc    Moderate product featured status
 * @route   PUT /api/admin/products/:id/featured
 * @access  Private (Admin only)
 */
const updateProductFeatured = async (req, res) => {
  try {
    const { featured } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product listing not found." });
    }

    product.featured = !!featured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product featured state updated.`,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error modifying product featured state: " + error.message
    });
  }
};

/**
 * @desc    Delete any product
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin only)
 */
const deleteAdminProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product listing not found." });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully by admin."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error deleting product: " + error.message
    });
  }
};

/**
 * @desc    Get all orders across platform
 * @route   GET /api/admin/orders
 * @access  Private (Admin only)
 */
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("buyer", "fullName email")
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error retrieving platform orders: " + error.message
    });
  }
};

/**
 * @desc    Override status of any order
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private (Admin only)
 */
const updateAdminOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // COD is paid upon delivery, update payment status and calculate revenue / decrease stock accordingly
    if (orderStatus === "Delivered") {
      order.paymentStatus = "Paid";
      
      // Run calculations ONLY if this is the first time the order is marked Delivered
      if (previousStatus !== "Delivered") {
        const orderTotal = order.totalPrice;
        const sellerRevenue = orderTotal * 0.90;
        const adminRevenue = orderTotal * 0.10;
        
        order.orderTotal = orderTotal;
        order.sellerRevenue = sellerRevenue;
        order.adminRevenue = adminRevenue;
        order.orderDate = new Date();
        order.month = new Date().toLocaleString("en-US", { month: "long" });
        order.year = new Date().getFullYear();

        // Increase Seller's accumulated revenue balance in the database
        await User.findByIdAndUpdate(order.seller, {
          $inc: { revenue: sellerRevenue }
        });

        // Decrease stock and increase sold count for each item
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { 
              stock: -item.quantity,
              soldCount: item.quantity
            }
          });
        }
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order details updated successfully.",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error overriding order status: " + error.message
    });
  }
};

module.exports = {
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
};
