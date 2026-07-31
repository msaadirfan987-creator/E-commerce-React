const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Helper to generate a unique order number
const generateOrderNumber = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const random = Math.floor(100 + Math.random() * 900);
  return `CARTIFY-${timestamp}-${random}`;
};

// @desc    Create new orders (splits items by seller if multi-vendor)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided.",
      });
    }

    const { fullName, phone, email, country, city, address, postalCode } = shippingAddress || {};
    if (!fullName || !phone || !email || !country || !city || !address || !postalCode) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all shipping details.",
      });
    }

    // Resolve products from database to get official sellers, stock status, and prices
    const resolvedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product || item.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title || item.name}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for '${product.title}'. Only ${product.stock} left.`,
        });
      }

      resolvedItems.push({
        product: product._id,
        seller: product.seller.toString(),
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.images && product.images[0] ? product.images[0] : "",
      });
    }

    // Group items by seller ID
    const itemsBySeller = {};
    for (const item of resolvedItems) {
      const sellerId = item.seller;
      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = [];
      }
      itemsBySeller[sellerId].push(item);
    }

    // Create an order for each seller group
    const createdOrders = [];
    for (const sellerId of Object.keys(itemsBySeller)) {
      const sellerItems = itemsBySeller[sellerId];
      const totalPrice = sellerItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      const orderNumber = generateOrderNumber();

      const order = await Order.create({
        buyer: req.user.id,
        seller: sellerId,
        orderNumber,
        items: sellerItems,
        shippingAddress,
        totalPrice,
      });

      createdOrders.push(order);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      orderNumbers: createdOrders.map((o) => o.orderNumber),
      orders: createdOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error placing order: " + error.message,
    });
  }
};

// @desc    Get logged in buyer's orders
// @route   GET /api/orders/buyer
// @access  Private
const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders: " + error.message,
    });
  }
};

// @desc    Get logged in seller's orders
// @route   GET /api/orders/seller
// @access  Private
const getSellerOrders = async (req, res) => {
  try {
    // Only sellers should access their orders
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to merchants only.",
      });
    }

    const orders = await Order.find({ seller: req.user.id })
      .populate("buyer", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch merchant orders: " + error.message,
    });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "fullName email")
      .populate("seller", "fullName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order record not found.",
      });
    }

    // Security check: only buyer or seller of the order can view details
    if (
      order.buyer._id.toString() !== req.user.id &&
      order.seller._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to inspect this order record.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to view order: " + error.message,
    });
  }
};

// @desc    Update order dispatch/delivery status (seller only)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order record not found.",
      });
    }

    // Verify ownership
    if (order.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You do not own this order listing.",
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    // COD is paid upon delivery, update payment status and calculate revenue / decrease stock accordingly
    if (status === "Delivered") {
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
      message: `Order status updated to '${status}'.`,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status: " + error.message,
    });
  }
};

// @desc    Cancel order (buyer only, only if Pending)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order record not found.",
      });
    }

    // Verify requesting user is the buyer
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only the buyer can cancel this order.",
      });
    }

    // Verify order status is Pending
    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled.",
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order: " + error.message,
    });
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
