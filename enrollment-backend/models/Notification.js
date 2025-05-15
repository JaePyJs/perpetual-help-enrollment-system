const mongoose = require("mongoose");

/**
 * Notification Model
 * Handles system notifications for users
 */
const notificationSchema = new mongoose.Schema({
  // User who receives the notification
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Type of notification
  type: {
    type: String,
    enum: [
      "message", // New message received
      "announcement", // System or class announcement
      "grade", // Grade posted or updated
      "attendance", // Attendance record updated
      "enrollment", // Enrollment status change
      "payment", // Payment confirmation or reminder
      "schedule", // Schedule change or reminder
      "system" // System notification
    ],
    required: true,
  },
  
  // Title of the notification
  title: {
    type: String,
    required: true,
  },
  
  // Content of the notification
  content: {
    type: String,
    required: true,
  },
  
  // Link to related resource
  link: String,
  
  // Related object (e.g., message ID, grade ID)
  relatedId: mongoose.Schema.Types.ObjectId,
  
  // Related model name
  relatedModel: String,
  
  // Notification priority
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  },
  
  // Has the user read this notification?
  isRead: {
    type: Boolean,
    default: false,
  },
  
  // Timestamp when notification was read
  readAt: Date,
  
  // Has the notification been sent via email?
  emailSent: {
    type: Boolean,
    default: false,
  },
  
  // Timestamp when the email was sent
  emailSentAt: Date,
  
  // Is this a push notification?
  isPush: {
    type: Boolean,
    default: false,
  },
  
  // Has the notification been sent as push?
  pushSent: {
    type: Boolean,
    default: false,
  },
  
  // Timestamp when push was sent
  pushSentAt: Date,
  
  // Has the user dismissed this notification?
  isDismissed: {
    type: Boolean,
    default: false,
  },
  
  // Creation and update timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  // Expiry date (optional)
  expiresAt: Date
});

// Indexes for efficient querying
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ relatedId: 1 });

// Update timestamps
notificationSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
    return true;
  }
  return false;
};

// Method to mark notification as dismissed
notificationSchema.methods.dismiss = async function() {
  if (!this.isDismissed) {
    this.isDismissed = true;
    await this.save();
    return true;
  }
  return false;
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  try {
    const notification = new this(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  try {
    return await this.countDocuments({ 
      user: userId, 
      isRead: false,
      isDismissed: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  try {
    const result = await this.updateMany(
      { user: userId, isRead: false },
      { 
        $set: { 
          isRead: true,
          readAt: new Date()
        } 
      }
    );
    return result.nModified || 0;
  } catch (error) {
    console.error('Error marking all as read:', error);
    return 0;
  }
};

module.exports = mongoose.model("Notification", notificationSchema);
