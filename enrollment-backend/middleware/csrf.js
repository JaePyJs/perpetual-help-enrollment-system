/**
 * CSRF Protection Middleware
 * This middleware implements CSRF protection for the application.
 */

const crypto = require("crypto");

// CSRF token configuration
const csrfConfig = {
  tokenName: "X-CSRF-TOKEN",
  cookieName: "XSRF-TOKEN",
  cookieMaxAge: 24 * 60 * 60 * 1000, // 24 hours
  ignoreMethods: ["GET", "HEAD", "OPTIONS"],
  ignorePaths: [
    "/api/auth/login",
    "/api/auth/reset-password",
    "/api/auth/register",
    "/api/auth/forgot-password",
  ],
};

/**
 * Generate a CSRF token
 * @returns {String} Random CSRF token
 */
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Set CSRF token in cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const setCsrfToken = (req, res, next) => {
  // Skip for specified methods
  if (csrfConfig.ignoreMethods.includes(req.method)) {
    return next();
  }

  // Check if token already exists in cookies
  if (!req.cookies || !req.cookies[csrfConfig.cookieName]) {
    // Generate a new token
    const token = generateToken();

    // Set the token in a cookie
    res.cookie(csrfConfig.cookieName, token, {
      httpOnly: false, // Must be accessible from JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: csrfConfig.cookieMaxAge,
    });

    // Store the token in the request for the next middleware
    req.csrfToken = token;
  } else {
    // Use the existing token
    req.csrfToken = req.cookies[csrfConfig.cookieName];
  }

  next();
};

/**
 * Verify the CSRF token in requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyCsrfToken = (req, res, next) => {
  // Skip for specified methods
  if (csrfConfig.ignoreMethods.includes(req.method)) {
    return next();
  }

  // Skip for specified paths
  if (csrfConfig.ignorePaths.some((path) => req.path.startsWith(path))) {
    return next();
  }

  // Get the token from the request header or form body
  const token =
    req.headers[csrfConfig.tokenName.toLowerCase()] ||
    (req.body && req.body[csrfConfig.tokenName]);

  // Get the expected token from the cookie
  const expectedToken = req.cookies && req.cookies[csrfConfig.cookieName];

  // If tokens don't match, return CSRF error
  if (!token || !expectedToken || token !== expectedToken) {
    console.warn(
      `CSRF token validation failed: ${req.method} ${req.originalUrl}`
    );
    return res.status(403).json({
      status: "error",
      message: "CSRF token validation failed",
    });
  }

  next();
};

module.exports = {
  setCsrfToken,
  verifyCsrfToken,
};
