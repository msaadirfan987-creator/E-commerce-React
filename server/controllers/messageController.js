const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Order = require("../models/Order");

/**
 * @desc    Send Message / Create Conversation
 * @route   POST /api/messages
 * @access  Private
 */
const createMessage = async (req, res) => {
  try {
    const { orderId, productId, sellerId, message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message content cannot be blank." });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ success: false, message: "Conversation not found." });
      }
    } else if (productId && sellerId) {
      // Find or create conversation by buyer, seller, product, and optional order
      const query = {
        buyer: req.user.id,
        seller: sellerId,
        product: productId,
        order: orderId || null,
      };

      conversation = await Conversation.findOne(query);

      if (!conversation) {
        conversation = await Conversation.create({
          buyer: req.user.id,
          seller: sellerId,
          product: productId,
          order: orderId || null,
          lastMessage: message,
          lastMessageTime: new Date(),
        });
      }
    } else if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order record not found." });
      }

      // Verify that sender is the buyer or seller of the order
      const isBuyer = order.buyer.toString() === req.user.id;
      const isSeller = order.seller.toString() === req.user.id;

      if (!isBuyer && !isSeller) {
        return res.status(403).json({ success: false, message: "Access forbidden. You do not own this order transaction." });
      }

      // Determine product context: use first item if present
      const firstProduct = order.items && order.items.length > 0 ? order.items[0].product : null;

      conversation = await Conversation.findOne({
        buyer: order.buyer,
        seller: order.seller,
        order: order._id,
        product: firstProduct,
      });

      if (!conversation) {
        conversation = await Conversation.create({
          buyer: order.buyer,
          seller: order.seller,
          order: order._id,
          product: firstProduct,
          lastMessage: message,
          lastMessageTime: new Date(),
        });
      }
    } else {
      return res.status(400).json({ success: false, message: "Please specify either conversationId, orderId, or both productId and sellerId." });
    }

    // Determine receiver
    const isSenderBuyer = conversation.buyer.toString() === req.user.id;
    const receiver = isSenderBuyer ? conversation.seller : conversation.buyer;

    // Verify ownership of the loaded conversation
    if (conversation.buyer.toString() !== req.user.id && conversation.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access forbidden." });
    }

    // Create message
    const newMessage = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      receiver,
      message,
      order: conversation.order || null,
      product: conversation.product || null,
    });

    // Update conversation summary details
    conversation.lastMessage = message;
    conversation.lastMessageTime = new Date();
    await conversation.save();

    // Populate the conversation for rich client response
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("buyer", "fullName email")
      .populate("seller", "fullName email")
      .populate("order", "orderNumber orderStatus")
      .populate("product", "title images price");

    res.status(201).json({
      success: true,
      message: newMessage,
      conversation: populatedConversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error dispatching message: " + error.message,
    });
  }
};

/**
 * @desc    Get Message history for a conversation
 * @route   GET /api/messages/:conversationId
 * @access  Private
 */
const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation logs not found." });
    }

    // Secure conversation check: only buyer or seller allowed
    if (conversation.buyer.toString() !== req.user.id && conversation.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access Forbidden." });
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error loading messages logs: " + error.message,
    });
  }
};

/**
 * @desc    Get user's active conversations
 * @route   GET /api/conversations
 * @access  Private
 */
const getUserConversations = async (req, res) => {
  try {
    // Return conversations where current user is either buyer or seller
    const conversations = await Conversation.find({
      $or: [{ buyer: req.user.id }, { seller: req.user.id }],
    })
      .populate("buyer", "fullName email")
      .populate("seller", "fullName email")
      .populate("order", "orderNumber orderStatus")
      .populate("product", "title images price")
      .sort({ lastMessageTime: -1 });

    // Calculate unread message counts for each conversation
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          receiver: req.user.id,
          isRead: false,
        });

        return {
          ...conv.toObject(),
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      conversations: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching active channels: " + error.message,
    });
  }
};

/**
 * @desc    Mark conversation messages as read
 * @route   PATCH /api/messages/read
 * @access  Private
 */
const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({ success: false, message: "conversationId parameter is required." });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }

    // Verify conversation membership
    if (conversation.buyer.toString() !== req.user.id && conversation.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access forbidden." });
    }

    // Set messages destined to logged-in user in this conversation to read
    await Message.updateMany(
      { conversation: conversationId, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error marking messages as read: " + error.message,
    });
  }
};

module.exports = {
  createMessage,
  getMessagesByConversation,
  getUserConversations,
  markMessagesAsRead,
};
