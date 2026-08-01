const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// All routes are private and require user authentication
router.use(protect);

router.route("/profile")
  .get(getUserProfile)
  .put(updateUserProfile);

router.put("/change-password", changePassword);

router.route("/addresses")
  .get(getAddresses)
  .post(addAddress);

router.route("/addresses/:id")
  .put(updateAddress)
  .delete(deleteAddress);

router.patch("/addresses/:id/default", setDefaultAddress);

module.exports = router;
