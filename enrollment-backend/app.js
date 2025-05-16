/**
 * Application Setup
 * This file configures and exports the Express application for use in server.js
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// Import security middleware
const { validateRequest, sanitizeInput } = require("./middleware/validation");
const { setCsrfToken, verifyCsrfToken } = require("./middleware/csrf");
const { accessLogger, logSecurityEvent } = require("./middleware/accessLogger");
const { xssProtection } = require("./middleware/xssProtection");
const {
  httpParameterProtection,
  additionalSecurityHeaders,
  sessionSecurity,
  xssCleanMiddleware,
} = require("./middleware/httpProtection");

// Import monitoring module
const monitoring = require("./monitoring");

const app = express();

// Security middleware
app.use(helmet()); // Set secure HTTP headers
app.use(additionalSecurityHeaders); // Add additional security headers

// Configure CORS to allow frontend origins - more permissive for development
app.use(
  cors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "X-Requested-With",
    ],
    exposedHeaders: ["Content-Length", "X-CSRF-Token"],
  })
);

// Parse JSON and url-encoded request bodies
app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Security middleware
app.use(cookieParser());
app.use(mongoSanitize()); // Prevent MongoDB operator injection
app.use(xssProtection); // Prevent XSS attacks
app.use(xssCleanMiddleware()); // Additional XSS protection

// HTTP Parameter Pollution protection (must be after body parsers)
app.use(httpParameterProtection);

// Add security headers
app.use((req, res, next) => {
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "SAMEORIGIN");
  res.header("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Rate limiting
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  })
);

// Session security
app.use(sessionSecurity);

// CSRF protection - completely disabled for development
// Uncomment these lines in production
// app.use(setCsrfToken);
// app.use("/api", verifyCsrfToken);

// Request validation
app.use(validateRequest);
app.use(sanitizeInput);

// Initialize monitoring if available in current environment
if (process.env.NODE_ENV !== "testing") {
  monitoring.init(app);
}

// Add a simple test route
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is working" });
});

// Add a health check endpoint
app.get("/api/health", (req, res) => {
  const healthData = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  // If database is not connected, return 503 Service Unavailable
  if (healthData.database !== "connected") {
    return res.status(503).json({
      ...healthData,
      status: "error",
      message: "Database connection is not established",
    });
  }

  res.json(healthData);
});

// API routes - these would typically be imported from separate route files
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");

// Add enhanced detailed logging middleware for API routes
app.use("/api", (req, res, next) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);

  console.log(
    `[${new Date().toISOString()}][ReqID:${requestId}] 🔍 API Request: ${
      req.method
    } ${req.originalUrl}`
  );
  console.log(`[ReqID:${requestId}] 📡 Headers:`, {
    "user-agent": req.headers["user-agent"],
    "content-type": req.headers["content-type"],
    authorization: req.headers["authorization"] ? "Bearer [REDACTED]" : "None",
    "x-csrf-token": req.headers["x-csrf-token"] ? "[PRESENT]" : "[MISSING]",
  });

  // Log request body for debugging (except passwords)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = "[REDACTED]";
    if (sanitizedBody.token) sanitizedBody.token = "[REDACTED]";
    if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = "[REDACTED]";
    console.log(`[ReqID:${requestId}] 📦 Request Body:`, sanitizedBody);
  }

  // Log query parameters
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`[ReqID:${requestId}] 🔍 Query Params:`, req.query);
  }

  // Capture and log response
  const originalSend = res.send;
  res.send = function (data) {
    const responseTime = Date.now() - startTime;
    let responseData;

    try {
      // Try to parse the response data if it's JSON
      if (typeof data === "string" && data.startsWith("{")) {
        responseData = JSON.parse(data);
        // Redact sensitive information
        if (responseData.token) responseData.token = "[REDACTED]";
        if (responseData.refreshToken) responseData.refreshToken = "[REDACTED]";
      } else {
        responseData =
          typeof data === "object"
            ? "[Object]"
            : data.substring(0, 100) + (data.length > 100 ? "..." : "");
      }
    } catch (e) {
      responseData = "[Unparseable data]";
    }

    console.log(
      `[${new Date().toISOString()}][ReqID:${requestId}] ✅ Response: ${
        res.statusCode
      } (${responseTime}ms)`
    );

    if (res.statusCode >= 400) {
      console.error(`[ReqID:${requestId}] ❌ Error Response:`, responseData);
    } else {
      console.log(`[ReqID:${requestId}] 📤 Response Data:`, responseData);
    }

    return originalSend.call(this, data);
  };

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Log error if monitoring is enabled
  if (monitoring && monitoring.trackError) {
    monitoring.trackError(err, "API");
  }

  res.status(500).json({
    status: "error",
    message: "Something went wrong on the server.",
  });
});

// Export the app for use in server.js and testing
module.exports = app;
