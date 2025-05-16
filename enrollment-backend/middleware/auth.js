const jwt = require("jsonwebtoken");

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to the request
 */
const auth = (req, res, next) => {
  try {
    // Check if token exists in headers
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      console.log("No Authorization header found");
      return res
        .status(401)
        .json({ message: "No token provided, please authenticate" });
    }

    // Extract token (handle both "Bearer token" and plain token formats)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : authHeader;

    console.log("Token received:", token ? "Token present" : "No token");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully for user:", decoded.userId);

    // Add user data to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }

    res.status(401).json({ message: "Please authenticate" });
  }
};

/**
 * Role-based access control middleware
 * Checks if user has one of the allowed roles
 * @param {Array} allowedRoles - Array of roles allowed to access the route
 * @param {Object} options - Additional options for role checking
 * @param {boolean} options.strictGlobalAdmin - If true, only global-admin can access (no override)
 */
const checkRole = (allowedRoles, options = {}) => {
  const { strictGlobalAdmin = false } = options;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Global admin has access to everything except strictly global-admin routes
    if (req.user.role === "global-admin") {
      // For strict global-admin routes, we still need to check
      if (strictGlobalAdmin && !allowedRoles.includes("global-admin")) {
        return res.status(403).json({
          message:
            "This action requires explicit Global Administrator privileges",
        });
      }

      // Log access by global admin for auditing purposes
      console.log(
        `Global Admin ${req.user.userId} accessed ${req.originalUrl}`
      );
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Access denied. You don't have permission to perform this action",
      });
    }

    next();
  };
};

/**
 * Check if user is a global admin
 * Only global admins can perform certain high-privilege actions
 * @param {Object} options - Additional options
 * @param {string} options.action - Description of the action being performed (for logging)
 */
const checkGlobalAdmin = (options = {}) => {
  const { action = "perform this action" } = options;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== "global-admin") {
      // Log unauthorized access attempt for security monitoring
      console.warn(
        `Unauthorized global admin access attempt by ${req.user.userId} (${req.user.role}) for ${req.originalUrl}`
      );

      return res.status(403).json({
        message: `Access denied. Only global administrators can ${action}`,
      });
    }

    // Log successful global admin action for audit trail
    console.log(
      `Global Admin ${req.user.userId} authorized to ${action} at ${req.originalUrl}`
    );
    next();
  };
};

module.exports = { auth, checkRole, checkGlobalAdmin };
