// Import the jsonwebtoken library to decode and verify JWTs
const jwt = require("jsonwebtoken");
// Import the User model to fetch user data associated with the token
const User = require("../models/User");

/**
 * @desc    Middleware to protect routes and verify JWT tokens
 */
const protect = async (req, res, next) => {
  // Initialize a variable to hold the token value
  let token;

  // Check if the Authorization header exists and starts with the 'Bearer' scheme
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Split the Authorization header to extract the actual token value (index 1 is the token)
      token = req.headers.authorization.split(" ")[1];

      // Verify the signature and contents of the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from database using decoded ID, and exclude the password field for security
      req.user = await User.findById(decoded.id).select("-password");

      // Check if the user still exists in the database
      if (!req.user) {
        // Return 401 Unauthorized if the user associated with the token no longer exists
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found in the database.",
        });
      }

      // Check if the user's account has been suspended by an Admin
      if (req.user.isBlocked) {
        return res.status(401).json({
          success: false,
          message: "Your account has been suspended by the administrator.",
          isBlocked: true,
        });
      }

      // Check if the user's account email has been verified
      if (!req.user.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your account before accessing this route.",
          isUnverified: true,
        });
      }

      // Proceed to the next middleware or request handler function in the pipeline
      next();
    } catch (error) {
      // Log the JWT verification error for server debugging purposes
      console.error("JWT Verification Error:", error.message);
      // Return 401 Unauthorized if the token is invalid or expired
      return res.status(401).json({
        success: false,
        message: "Not authorized, token verification failed.",
      });
    }
  }

  // If no token was found in the Authorization header
  if (!token) {
    // Return 401 Unauthorized indicating a token is required to access the endpoint
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided.",
    });
  }
};

/**
 * @desc    Optional authorization middleware helper to restrict access by role
 * @param   {...string} roles - Allowed roles (e.g., 'customer', 'seller')
 */
const authorize = (...roles) => {
  // Return the middleware function
  return (req, res, next) => {
    // Check if the authenticated user's role is included in the permitted roles
    if (!req.user || !roles.includes(req.user.role)) {
      // Return 403 Forbidden since user is authenticated but lacks required permission level
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : "none"}' is not authorized to access this route.`,
      });
    }
    // Proceed if the user role matches the authorized list
    next();
  };
};

/**
 * @desc    Middleware to verify that a seller is approved by the admin
 */
const isApprovedSeller = (req, res, next) => {
  if (req.user && req.user.role === "seller" && req.user.sellerStatus !== "Approved") {
    return res.status(403).json({
      success: false,
      message: "Your seller account is pending approval from the administrator.",
      isPendingSeller: true,
    });
  }
  next();
};

// Export the middleware handlers for use in routes
module.exports = {
  protect,
  authorize,
  isApprovedSeller,
};
