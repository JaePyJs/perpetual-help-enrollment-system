const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { auth } = require("../middleware/auth");
const Notification = require("../models/Notification");

/**
 * @route   GET /api/notifications
 * @desc    Get notifications for the current user
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, isRead } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { user: req.user.id };
    
    // Add filters if provided
    if (type) {
      query.type = type;
    }
    
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }
    
    // Get total count for pagination
    const total = await Notification.countDocuments(query);
    
    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Return notifications with pagination info
    res.json({
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/notifications/count
 * @desc    Get count of unread notifications
 * @access  Private
 */
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    console.error("Error getting notification count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/notifications/:id
 * @desc    Mark a notification as read or dismissed
 * @access  Private
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const { action } = req.body;
    
    // Find the notification
    const notification = await Notification.findOne({
      _id: notificationId,
      user: req.user.id
    });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    let result = false;
    
    // Perform the requested action
    switch (action) {
      case "read":
        result = await notification.markAsRead();
        break;
      case "dismiss":
        result = await notification.dismiss();
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }
    
    if (result) {
      res.json({ success: true, message: `Notification ${action} successfully` });
    } else {
      res.status(400).json({ success: false, message: `Failed to ${action} notification` });
    }
  } catch (error) {
    console.error(`Error updating notification:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/notifications/all/read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put("/all/read", auth, async (req, res) => {
  try {
    const count = await Notification.markAllAsRead(req.user.id);
    res.json({ success: true, count, message: `Marked ${count} notifications as read` });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    
    // Find and delete the notification
    const result = await Notification.deleteOne({
      _id: notificationId,
      user: req.user.id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/notifications/all
 * @desc    Delete all notifications for the user
 * @access  Private
 */
router.delete("/all", auth, async (req, res) => {
  try {
    const { type, isRead } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    // Add filters if provided
    if (type) {
      query.type = type;
    }
    
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }
    
    // Delete matching notifications
    const result = await Notification.deleteMany(query);
    
    res.json({ 
      success: true, 
      count: result.deletedCount,
      message: `Deleted ${result.deletedCount} notifications` 
    });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/notifications/test
 * @desc    Create a test notification (for development only)
 * @access  Private
 */
router.post("/test", auth, async (req, res) => {
  try {
    const { type, title, content } = req.body;
    
    // Create test notification
    const notification = await Notification.createNotification({
      user: req.user.id,
      type: type || "system",
      title: title || "Test Notification",
      content: content || "This is a test notification",
      priority: "normal"
    });
    
    if (!notification) {
      return res.status(400).json({ message: "Failed to create test notification" });
    }
    
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating test notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
