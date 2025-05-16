require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

// Import WebSocket service
const { initWebSocketServer } = require("./services/websocket");

// Import the configured Express application from app.js
const app = require("./app");

// Database connection with retry
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/teacher", require("./routes/teacher"));
app.use("/api/students", require("./routes/students"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/academic", require("./routes/academic"));
app.use("/api/finance", require("./routes/finance"));
app.use("/api/enrollment", require("./routes/enrollment"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/schedules", require("./routes/schedules"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/notifications", require("./routes/notifications"));

// Security logging route
app.post("/api/security/log", (req, res) => {
  // Only accept logs from authenticated users
  if (!req.user) {
    return res.status(403).json({ status: "error", message: "Unauthorized" });
  }

  try {
    const { eventType, details, isViolation } = req.body;
    logSecurityEvent(eventType, details, isViolation, req);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error logging security event:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to log security event" });
  }
});

// 404 handler
app.use((_, res) => {
  res.status(404).json({ status: "error", message: "Resource not found" });
});

// Error handling middleware
app.use((err, _, res, __) => {
  // Log the error
  console.error(err.stack);

  // Don't expose error details in production
  const isProduction = process.env.NODE_ENV === "production";

  // Send appropriate response based on error type
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      details: isProduction ? undefined : err.message,
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    status: "error",
    message: isProduction ? "An unexpected error occurred" : err.message,
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server - temporarily disabled for troubleshooting
// initWebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server disabled for troubleshooting`);
});
