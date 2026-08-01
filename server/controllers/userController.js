const User = require("../models/User");

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    // Convert to object and strip password
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching user profile: " + error.message,
    });
  }
};

/**
 * @desc    Update user profile info
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email, phone, profileImage } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check email uniqueness if changed
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email is already in use by another account." });
      }
      user.email = email;
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating profile: " + error.message,
    });
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide current and new passwords." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password." });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error changing password: " + error.message,
    });
  }
};

/**
 * @desc    Get user addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching addresses: " + error.message,
    });
  }
};

/**
 * @desc    Add new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
const addAddress = async (req, res) => {
  try {
    const { fullName, phone, country, city, area, completeAddress, postalCode, isDefault } = req.body;

    if (!fullName || !phone || !country || !city || !area || !completeAddress || !postalCode) {
      return res.status(400).json({ success: false, message: "Please provide all required address fields." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // If marked default, or this is the first address, set others to false
    const shouldBeDefault = isDefault || user.addresses.length === 0;

    if (shouldBeDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      fullName,
      phone,
      country,
      city,
      area,
      completeAddress,
      postalCode,
      isDefault: shouldBeDefault
    };

    user.addresses.push(newAddress);
    await user.save();

    // Get the newly added address doc from saved user
    const addedAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      success: true,
      message: "Address added successfully.",
      addresses: user.addresses,
      address: addedAddress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error adding address: " + error.message,
    });
  }
};

/**
 * @desc    Update existing address
 * @route   PUT /api/users/addresses/:id
 * @access  Private
 */
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, country, city, area, completeAddress, postalCode, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    if (fullName) address.fullName = fullName;
    if (phone) address.phone = phone;
    if (country) address.country = country;
    if (city) address.city = city;
    if (area) address.area = area;
    if (completeAddress) address.completeAddress = completeAddress;
    if (postalCode) address.postalCode = postalCode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      addresses: user.addresses,
      address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating address: " + error.message,
    });
  }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    const wasDefault = address.isDefault;

    // Use pull to remove subdocument
    user.addresses.pull(id);

    // If we deleted the default address, and we have addresses remaining, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting address: " + error.message,
    });
  }
};

/**
 * @desc    Set default address
 * @route   PATCH /api/users/addresses/:id/default
 * @access  Private
 */
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === id;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default address updated.",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error setting default address: " + error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
