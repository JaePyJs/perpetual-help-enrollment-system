require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

// Import WebSocket service
const { initWebSocketServer } = require("./services/websocket");

// Import the configured Express application from app.js
const app = require("./app");

// Security middleware
app.use(helmet()); // Set secure HTTP headers
app.use(additionalSecurityHeaders); // Add additional security headers

// Configure CORS with stricter options
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:8080"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-TOKEN"],
  })
);

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: "error",
    message: "Too many requests, please try again later",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/", limiter);

// Apply stricter rate limits to authentication routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login attempts per hour
  message: {
    status: "error",
    message: "Too many login attempts, please try again later",
  },
});
app.use("/api/auth/login", authLimiter);

// Body parsing middleware
app.use(express.json({ limit: "1mb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser()); // For CSRF cookies

// Database sanitization to prevent NoSQL injection
app.use(mongoSanitize());

// Access logging
app.use(accessLogger);

// Input sanitization and XSS protection
app.use(sanitizeInput);
app.use(xssProtection);
app.use(xssCleanMiddleware); // Additional XSS protection
app.use(httpParameterProtection); // Prevent HTTP Parameter Pollution
app.use(sessionSecurity); // Enhanced cookie security

// CSRF protection
app.use(setCsrfToken);
app.use(verifyCsrfToken);

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
app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: "Resource not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error
  console.error(err.stack);

  // Log as security event if it's a security-related error
  if (
    err.name === "UnauthorizedError" ||
    err.status === 401 ||
    err.status === 403
  ) {
    logSecurityEvent("authorization_error", { error: err.message }, true, req);
  }

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

// Initialize WebSocket server
initWebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}/ws`);
});
