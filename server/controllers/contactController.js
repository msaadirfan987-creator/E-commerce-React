const Contact = require("../models/Contact");

/**
 * @desc    Submit a contact form message
 * @route   POST /api/contacts
 * @access  Public
 */
const createContactMessage = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields (Full Name, Email, Subject, and Message).",
      });
    }

    const contact = await Contact.create({
      fullName,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. Thank you!",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error submitting message: " + error.message,
    });
  }
};

/**
 * @desc    Get all contact messages
 * @route   GET /api/contacts
 * @access  Private (Admin only)
 */
const getContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error retrieving messages: " + error.message,
    });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
};
