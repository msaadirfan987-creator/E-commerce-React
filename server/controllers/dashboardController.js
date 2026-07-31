const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

/**
 * @desc    Get Admin Dashboard Stats & Graphs
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin only)
 */
const getAdminDashboard = async (req, res) => {
  try {
    // 1. Revenue Metrics
    const totalRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered", updatedAt: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered", updatedAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const monthRevenue = monthRevenueAgg[0]?.total || 0;

    // 2. Order Metrics
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "Cancelled" });

    // 3. User Metrics
    const totalBuyers = await User.countDocuments({ role: "customer" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const pendingSellers = await User.countDocuments({ role: "seller", sellerStatus: "Pending" });
    const approvedSellers = await User.countDocuments({ role: "seller", sellerStatus: "Approved" });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    // 4. Product Metrics
    const totalProducts = await Product.countDocuments({});
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });

    // 5. Recent Feeds
    const recentOrders = await Order.find({})
      .populate("buyer", "fullName email")
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProducts = await Product.find({})
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Top Sellers & Top Selling Products
    const topProductsAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $unwind: "$items" },
      { 
        $group: { 
          _id: "$items.product", 
          title: { $first: "$items.title" },
          quantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        } 
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 }
    ]);

    const topSellersAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { 
        $group: { 
          _id: "$seller", 
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" }
        } 
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 }
    ]);

    const topSellers = [];
    for (const sellerItem of topSellersAgg) {
      const sellerUser = await User.findById(sellerItem._id).select("fullName email");
      if (sellerUser) {
        topSellers.push({
          ...sellerItem,
          fullName: sellerUser.fullName,
          email: sellerUser.email
        });
      }
    }

    // 7. Graph Aggregations (Past months)
    const salesChartAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          revenue: { $sum: "$totalPrice" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const orderStatusAgg = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        monthRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalBuyers,
        totalSellers,
        pendingSellers,
        approvedSellers,
        blockedUsers,
        totalProducts,
        outOfStockProducts,
        lowStockProducts
      },
      recentOrders,
      recentUsers,
      recentProducts,
      topProducts: topProductsAgg,
      topSellers,
      charts: {
        salesChart: salesChartAgg,
        orderStatusChart: orderStatusAgg
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error loading Admin dashboard: " + error.message
    });
  }
};

/**
 * @desc    Get Seller Dashboard Stats & Graphs
 * @route   GET /api/dashboard/seller
 * @access  Private (Sellers only)
 */
const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Revenue Metrics
    const totalRevenueAgg = await Order.aggregate([
      { $match: { seller: sellerId, orderStatus: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRevenueAgg = await Order.aggregate([
      { $match: { seller: sellerId, orderStatus: "Delivered", updatedAt: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthRevenueAgg = await Order.aggregate([
      { $match: { seller: sellerId, orderStatus: "Delivered", updatedAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const monthRevenue = monthRevenueAgg[0]?.total || 0;

    // 2. Product Metrics
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const activeProducts = await Product.countDocuments({ seller: sellerId, status: "Active" });
    const draftProducts = await Product.countDocuments({ seller: sellerId, status: "Draft" });
    const outOfStock = await Product.countDocuments({ seller: sellerId, stock: 0 });
    const lowStock = await Product.countDocuments({ seller: sellerId, stock: { $gt: 0, $lte: 10 } });

    // 3. Order Metrics
    const ordersReceived = await Order.countDocuments({ seller: sellerId });
    const pendingOrders = await Order.countDocuments({ seller: sellerId, orderStatus: "Pending" });
    const deliveredOrders = await Order.countDocuments({ seller: sellerId, orderStatus: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ seller: sellerId, orderStatus: { $in: ["Cancelled", "Rejected"] } });

    // 4. Feeds & Recents
    const recentOrders = await Order.find({ seller: sellerId })
      .populate("buyer", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProducts = await Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Graphs (Past months)
    const salesChartAgg = await Order.aggregate([
      { $match: { seller: sellerId, orderStatus: "Delivered" } },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          revenue: { $sum: "$totalPrice" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        monthRevenue,
        totalProducts,
        activeProducts,
        draftProducts,
        outOfStock,
        lowStock,
        ordersReceived,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        averageRating: 0.0 // Default rating metric placeholder placeholder
      },
      recentOrders,
      recentProducts,
      charts: {
        salesChart: salesChartAgg
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error loading Seller dashboard: " + error.message
    });
  }
};

module.exports = {
  getAdminDashboard,
  getSellerDashboard
};
