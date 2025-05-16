const AuditLog = require("../models/AuditLog");

/**
 * Service for logging audit events
 */
const auditService = {
  /**
   * Log an audit event
   * @param {Object} req - Express request object
   * @param {String} action - Action being performed
   * @param {Object} details - Details of the action
   * @param {Object} target - Target of the action (if applicable)
   */
  log: async (req, action, details, target = null) => {
    try {
      // Extract user info from request
      const { user } = req;
      
      if (!user) {
        console.error("Cannot log audit event: No user in request");
        return;
      }
      
      // Create audit log entry
      const auditLog = new AuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action,
        details,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
      });
      
      // Add target information if provided
      if (target) {
        auditLog.targetId = target.id;
        auditLog.targetName = target.name;
        auditLog.targetRole = target.role;
      }
      
      // Save audit log
      await auditLog.save();
    } catch (error) {
      console.error("Error logging audit event:", error);
    }
  },
  
  /**
   * Get audit logs with filtering and pagination
   * @param {Object} filters - Filters to apply
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   */
  getAuditLogs: async (filters = {}, page = 1, limit = 20) => {
    try {
      const query = {};
      
      // Apply filters
      if (filters.userId) query.userId = filters.userId;
      if (filters.action) query.action = filters.action;
      if (filters.targetId) query.targetId = filters.targetId;
      if (filters.userRole) query.userRole = filters.userRole;
      if (filters.startDate && filters.endDate) {
        query.timestamp = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }
      
      // Count total matching documents
      const total = await AuditLog.countDocuments(query);
      
      // Get paginated results
      const skip = (page - 1) * limit;
      const auditLogs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email role")
        .populate("targetId", "name email role");
      
      return {
        auditLogs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error("Error getting audit logs:", error);
      throw error;
    }
  }
};

module.exports = auditService;
