require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

// Import WebSocket service - temporarily disabled to fix connectivity issues
// const { initWebSocketServer } = require("./services/websocket");

// Import the configured Express application from app.js
const app = require("./app");

// Database connection with improved retry mechanism and error handling
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectDB = async (retryCount = 0) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      heartbeatFrequencyMS: 30000, // Check server status every 30 seconds
    });
    console.log(`MongoDB connected successfully at ${new Date().toISOString()}`);
    
    // Add connection event listeners for better monitoring
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Attempting to reconnect...');
      setTimeout(() => connectDB(), 3000);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection (${retryCount + 1}/${MAX_RETRIES}) in ${RETRY_INTERVAL/1000} seconds...`);
      setTimeout(() => connectDB(retryCount + 1), RETRY_INTERVAL);
    } else {
      console.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts. Exiting...`);
      process.exit(1);
    }
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

// Simple health check endpoint
app.get("/health", (req, res) => {
  // Get memory usage in MB
  const memUsage = process.memoryUsage();
  const formatMemory = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
  
  // Get system info
  const os = require('os');
  const cpuUsage = process.cpuUsage();
  const totalCPUs = os.cpus().length;
  
  // Check all connections for database health status
  const dbState = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: "ok",
    version: require('./package.json').version,
    serverTime: new Date().toISOString(),
    startedAt: new Date(Date.now() - process.uptime() * 1000).toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: dbState[mongoose.connection.readyState] || 'unknown',
      connectionState: mongoose.connection.readyState,
      collections: Object.keys(mongoose.connection.collections).length || 0,
      models: Object.keys(mongoose.models).length || 0
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      cpus: totalCPUs,
      loadAvg: os.loadavg(),
      freeMemory: formatMemory(os.freemem()),
      totalMemory: formatMemory(os.totalmem()),
      hostname: os.hostname()
    },
    process: {
      pid: process.pid,
      memory: {
        rss: formatMemory(memUsage.rss),
        heapTotal: formatMemory(memUsage.heapTotal),
        heapUsed: formatMemory(memUsage.heapUsed),
        external: formatMemory(memUsage.external)
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      }
    }
  });
});

// 404 handler
app.use((_, res) => {
  res.status(404).json({ status: "error", message: "Resource not found" });
});

// Error handling middleware
app.use((err, _, res, __) => {
  // Log the error
  console.error(`[${new Date().toISOString()}] Server Error:`, err.stack);

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

  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return res.status(503).json({
      status: "error",
      message: "Database service unavailable",
      details: isProduction ? undefined : err.message,
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

// WebSocket server is disabled for troubleshooting
// Uncomment the line below to enable WebSocket server
// initWebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server disabled for troubleshooting`);
});
