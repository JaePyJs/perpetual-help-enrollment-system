/**
 * Role-based Access Control Middleware
 * Checks if the authenticated user has the required role(s)
 *
 * @param {Array|String} roles - Single role or array of roles that are allowed access
 */

module.exports = function (roles) {
  // Convert single role to array for consistent handling
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return function (req, res, next) {
    // Make sure user object exists (auth middleware should set this)
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "No user data, authentication required" });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions" });
    }

    // User is authorized, proceed
    next();
  };
};
