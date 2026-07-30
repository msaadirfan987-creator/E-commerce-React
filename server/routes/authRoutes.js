// Import the express module to use the router framework
const express = require("express");
// Create a new router instance to define specific auth routes
const router = express.Router();
// Import the signup, login, diagnostic, and test-create functions from the auth controller
const { signup, login, getDiagnosticUsers, testCreate } = require("../controllers/authController");
// Import the protect middleware to secure authentication endpoints
const { protect } = require("../middleware/authMiddleware");

// Define GET routes for local debugging
router.get("/diagnostic-users", getDiagnosticUsers);
router.get("/test-create", testCreate);

// Define a POST route for user registration and bind it to the signup controller
router.post("/signup", signup);

// Define a POST route for user login authentication and bind it to the login controller
router.post("/login", login);

// Define a GET route for fetching the logged-in user's profile, secured by JWT middleware
router.get("/me", protect, (req, res) => {
  // Return a 200 OK status containing the user profile attached to the request by the protect middleware
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully.",
    user: req.user,
  });
});

// Export the router instance to be mounted in the main server application
module.exports = router;