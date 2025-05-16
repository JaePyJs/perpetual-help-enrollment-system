const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  // Who performed the action
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  
  // What action was performed
  action: {
    type: String,
    required: true,
    enum: [
      "user_create", 
      "user_update", 
      "user_delete", 
      "user_password_reset",
      "user_deactivate",
      "user_activate",
      "login_success",
      "login_failure"
    ]
  },
  
  // Details of the action
  details: {
    type: Object,
    required: true
  },
  
  // Target of the action (if applicable)
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  targetName: String,
  targetRole: String,
  
  // When the action was performed
  timestamp: {
    type: Date,
    default: Date.now,
  },
  
  // IP address of the user
  ipAddress: String,
  
  // User agent of the user
  userAgent: String,
});

// Index for faster queries
auditLogSchema.index({ userId: 1, action: 1, timestamp: -1 });
auditLogSchema.index({ targetId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
