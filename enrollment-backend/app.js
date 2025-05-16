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

// Configure CORS to allow frontend origins
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow frontend origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
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

// CSRF protection
app.use(setCsrfToken);
// Temporarily disabled for testing
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

// API routes - these would typically be imported from separate route files
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");

// Add detailed logging middleware for API routes
app.use("/api", (req, res, next) => {
  const startTime = Date.now();
  console.log(
    `[${new Date().toISOString()}] API Request: ${req.method} ${
      req.originalUrl
    }`
  );

  // Log request body for debugging (except passwords)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = "[REDACTED]";
    console.log(`Request Body:`, sanitizedBody);
  }

  // Capture and log response
  const originalSend = res.send;
  res.send = function (data) {
    const responseTime = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] Response: ${
        res.statusCode
      } (${responseTime}ms)`
    );
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
