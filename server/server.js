// Load environment variables from the .env file into process.env
require("dotenv").config();
// Import the express library to create our web server application
const express = require("express");
// Import the cors package to handle cross-origin resource sharing permission
const cors = require("cors");
// Import the database connection configuration function
const connectDB = require("./config/db");
// Import the authentication router defining login and signup endpoints
const authRoutes = require("./routes/authRoutes");

// Initialize the express application instance
const app = express();

// Establish connection to MongoDB Atlas cluster using configuration logic
connectDB();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  mongoose.connection.once("open", async () => {
    try {
      const User = require("./models/User");
      const users = await User.find({}).select("+password").lean();
      fs.writeFileSync(
        path.join(__dirname, "debug_log.txt"),
        JSON.stringify({
          timestamp: new Date().toISOString(),
          users,
        }, null, 2)
      );
    } catch (err) {
      fs.writeFileSync(
        path.join(__dirname, "debug_log.txt"),
        JSON.stringify({
          timestamp: new Date().toISOString(),
          error: err.message,
        }, null, 2)
      );
    }
  });
}

// Assign the port number from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Enable CORS middleware to allow requests from client-side origins (like React frontend)
app.use(cors());
// Parse incoming requests with JSON payloads and attach to req.body
app.use(express.json());

// Mount authentication routing middleware on the '/api/auth' path prefix
app.use("/api/auth", authRoutes);

// Mount product management routing middleware on the '/api/products' path prefix
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// Define a default base route to verify that the backend API server is online and running
app.get("/", (req, res) => {
  // Send a simple plain text greeting confirming server status
  res.send("Cartify Backend Running 🚀");
});

// Middleware to capture and handle any 404 Route Not Found errors
app.use((req, res, next) => {
  // Create an error instance indicating path not found
  const error = new Error(`Not Found - ${req.originalUrl}`);
  // Set the response status to 404
  res.status(404);
  // Pass the error to the next middleware (which will be the global error handler)
  next(error);
});

// Global central error handler middleware for catching and formatting application errors
app.use((err, req, res, next) => {
  // Extract or default the status code (if 200, default to 500 server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // Set the HTTP response status code
  res.status(statusCode);
  // Send a JSON response detailing error message and stack trace if in development
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start the Express server to listen for incoming connections on the specified port (if not on Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    // Log message to system console confirming the server is actively running
    console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}

// Export the app instance for Vercel serverless deployment
module.exports = app;