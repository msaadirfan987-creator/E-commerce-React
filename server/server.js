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

// Mount order management routing middleware on the '/api/orders' path prefix
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// Mount admin routing middleware on the '/api/admin' path prefix
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Mount dashboard analytics routing middleware on the '/api/dashboard' path prefix
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Mount message and conversation routing middleware
const messageRoutes = require("./routes/messageRoutes");
app.use("/api", messageRoutes);

// Mount reviews routing middleware
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);

// Temporary test route to check active routing
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Test route is working on Railway!",
    timestamp: new Date()
  });
});

// Define a default base route to verify that the backend API server is online and running
app.get("/", (req, res) => {
  // Send a simple plain text greeting confirming server status
  res.send("Cartify Backend Running 🚀 - Debug Version 2");
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

// Initialize HTTP Server and Socket.IO
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  // Join a private conversation channel
  socket.on("join_room", (conversationId) => {
    socket.join(conversationId);
  });

  // Broadcast message to recipients in the room
  socket.on("send_message", (messageData) => {
    io.to(messageData.conversation).emit("receive_message", messageData);
  });

  // Optional typing state indicator
  socket.on("typing", (typingData) => {
    socket.to(typingData.conversation).emit("typing_status", typingData);
  });
});

// Start the server to listen for incoming connections
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT} with Socket.IO enabled.`);

    // Temporary route printer to console logs (Express 5 app.router)
    console.log("=== REGISTERED ROUTES ===");
    if (app.router && app.router.stack) {
      app.router.stack.forEach((layer) => {
        if (layer.route) {
          console.log(`Direct Route: ${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`);
        } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
          layer.handle.stack.forEach((subLayer) => {
            if (subLayer.route) {
              console.log(`Sub Router Route: ${Object.keys(subLayer.route.methods).join(', ').toUpperCase()} ${layer.path}${subLayer.route.path}`);
            }
          });
        }
      });
    }
    console.log("=========================");
  });
}

// Export the app instance for Vercel serverless deployment
module.exports = app;