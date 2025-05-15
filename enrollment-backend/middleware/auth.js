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
      return res.status(401).json({ message: "No token provided, please authenticate" });
    }
    
    // Extract token (handle both "Bearer token" and plain token formats)
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.replace("Bearer ", "") 
      : authHeader;
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    
    res.status(401).json({ message: "Please authenticate" });
  }
};

/**
 * Role-based access control middleware
 * Checks if user has one of the allowed roles
 * @param {Array} allowedRoles - Array of roles allowed to access the route
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. You don't have permission to perform this action" 
      });
    }
    
    next();
  };
};

module.exports = { auth, checkRole };
