const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { auth } = require("../middleware/auth");
const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/Notification");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure file upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/attachments");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    // Accept only common file types
    const allowedTypes = [
      ".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", 
      ".xls", ".xlsx", ".ppt", ".pptx", ".txt"
    ];
    
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  },
});

/**
 * @route   POST /api/messages
 * @desc    Send a new message
 * @access  Private
 */
router.post("/", auth, upload.array("attachments", 5), async (req, res) => {
  try {
    const {
      recipients,
      course,
      messageType,
      subject,
      content,
      priority,
      parentMessage
    } = req.body;

    // Create new message object
    const messageData = {
      sender: req.user.id,
      subject,
      content,
      messageType: messageType || "direct",
      recipients: [],
      priority: priority || "normal"
    };

    // Add course if provided (for class-wide messages)
    if (course) {
      messageData.course = course;
    }

    // Add parent message if this is a reply
    if (parentMessage) {
      messageData.parentMessage = parentMessage;
    }

    // Process recipients
    if (recipients) {
      let recipientsList = [];
      
      if (typeof recipients === 'string') {
        // Single recipient or comma-separated list
        recipientsList = recipients.split(',').map(id => id.trim());
      } else if (Array.isArray(recipients)) {
        // Array of recipients
        recipientsList = recipients;
      }
      
      // Add recipients to message data
      messageData.recipients = recipientsList.map(userId => ({
        user: userId,
        readAt: null,
        deleted: false
      }));
    }

    // Process attachments if any
    if (req.files && req.files.length > 0) {
      messageData.attachments = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path.replace(/\\/g, '/'),
        uploadedAt: new Date()
      }));
    }

    // Create and save the message
    const message = new Message(messageData);
    await message.save();

    // Create notifications for recipients
    if (messageData.recipients.length > 0) {
      const notifications = messageData.recipients.map(recipient => ({
        user: recipient.user,
        type: "message",
        title: `New message from ${req.user.name}`,
        content: `Subject: ${subject}`,
        link: `/messages/${message._id}`,
        relatedId: message._id,
        relatedModel: "Message",
        priority: priority || "normal"
      }));

      // Bulk insert notifications
      await Notification.insertMany(notifications);
    }

    // If it's a class message, create notifications for all enrolled students
    if (messageData.course && messageType === "class") {
      // In a real implementation, fetch enrolled students from an Enrollment model
      // and create notifications for each student
      // For demo, we'll skip this part
    }

    // Return created message with populated sender
    const createdMessage = await Message.findById(message._id)
      .populate("sender", "name email studentId")
      .populate("recipients.user", "name email studentId");

    res.status(201).json(createdMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/messages
 * @desc    Get messages for the current user
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const { folder, page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    
    // Build the query based on the folder
    let query = {};
    
    switch (folder) {
      case "inbox":
        // Messages received by the user that aren't deleted
        query = { 
          "recipients.user": req.user.id,
          "recipients.deleted": false
        };
        break;
      case "sent":
        // Messages sent by the user that aren't deleted
        query = { 
          sender: req.user.id,
          deleted: false
        };
        break;
      case "archived":
        // Currently we don't have an archived status
        // This could be implemented by adding an 'archived' flag to messages
        query = { 
          "recipients.user": req.user.id,
          "recipients.deleted": false,
          // Add archived condition here if implemented
        };
        break;
      case "deleted":
        // Messages that the user has deleted
        query = {
          $or: [
            { sender: req.user.id, deleted: true },
            { "recipients.user": req.user.id, "recipients.deleted": true }
          ]
        };
        break;
      default:
        // Default to inbox
        query = { 
          "recipients.user": req.user.id,
          "recipients.deleted": false
        };
    }
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }
    
    // Get total count for pagination
    const total = await Message.countDocuments(query);
    
    // Get messages with pagination
    const messages = await Message.find(query)
      .populate("sender", "name email studentId profileImage")
      .populate("recipients.user", "name email studentId")
      .populate("course", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Return messages with pagination info
    res.json({
      messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/messages/:id
 * @desc    Get a specific message
 * @access  Private
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const messageId = req.params.id;
    
    // Find the message
    const message = await Message.findById(messageId)
      .populate("sender", "name email studentId profileImage")
      .populate("recipients.user", "name email studentId")
      .populate("course", "name code")
      .populate({
        path: "parentMessage",
        select: "subject content sender createdAt",
        populate: {
          path: "sender",
          select: "name email"
        }
      });
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    // Check if user has access to this message
    const hasAccess = message.hasAccess(req.user.id);
    
    if (!hasAccess) {
      return res.status(403).json({ message: "You don't have access to this message" });
    }
    
    // If user is a recipient, mark message as read
    if (message.recipients.some(r => r.user._id.toString() === req.user.id)) {
      await message.markAsRead(req.user.id);
      
      // Mark related notification as read
      await Notification.updateMany(
        { 
          user: req.user.id, 
          relatedId: message._id,
          relatedModel: "Message",
          isRead: false
        },
        { $set: { isRead: true, readAt: new Date() } }
      );
    }
    
    res.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/messages/:id
 * @desc    Mark message as read, deleted, etc.
 * @access  Private
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { action } = req.body;
    
    // Find the message
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    let result = false;
    
    // Perform the requested action
    switch (action) {
      case "read":
        // Mark as read for the user
        result = await message.markAsRead(req.user.id);
        break;
      case "delete":
        // If user is sender, mark message as deleted
        if (message.sender.toString() === req.user.id) {
          message.deleted = true;
          await message.save();
          result = true;
        } else {
          // If user is recipient, mark as deleted for this recipient
          result = await message.markAsDeletedForUser(req.user.id);
        }
        break;
      // Additional actions could be implemented here
      default:
        return res.status(400).json({ message: "Invalid action" });
    }
    
    if (result) {
      res.json({ success: true, message: `Message ${action} successfully` });
    } else {
      res.status(400).json({ success: false, message: `Failed to ${action} message` });
    }
  } catch (error) {
    console.error(`Error updating message:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/messages/thread/:id
 * @desc    Get a message thread (original message and all replies)
 * @access  Private
 */
router.get("/thread/:id", auth, async (req, res) => {
  try {
    const threadId = req.params.id;
    
    // Find the original message
    const originalMessage = await Message.findById(threadId);
    
    if (!originalMessage) {
      return res.status(404).json({ message: "Thread not found" });
    }
    
    // Check if message has a parent (meaning it's already a reply)
    const rootMessageId = originalMessage.parentMessage || threadId;
    
    // Find all messages in the thread
    const thread = await Message.find({
      $or: [
        { _id: rootMessageId },
        { parentMessage: rootMessageId }
      ]
    })
    .populate("sender", "name email studentId profileImage")
    .populate("recipients.user", "name email studentId")
    .sort({ createdAt: 'asc' });
    
    // Check if user has access to this thread
    const hasAccess = thread.some(message => message.hasAccess(req.user.id));
    
    if (!hasAccess) {
      return res.status(403).json({ message: "You don't have access to this thread" });
    }
    
    res.json(thread);
  } catch (error) {
    console.error("Error fetching message thread:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/messages/unread/count
 * @desc    Get count of unread messages
 * @access  Private
 */
router.get("/unread/count", auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      "recipients.user": req.user.id,
      "recipients.readAt": { $exists: false },
      "recipients.deleted": false
    });
    
    res.json({ count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/messages/download/:id/:filename
 * @desc    Download a message attachment
 * @access  Private
 */
router.get("/download/:id/:filename", auth, async (req, res) => {
  try {
    const { id, filename } = req.params;
    
    // Find the message
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    // Check if user has access to this message
    const hasAccess = message.hasAccess(req.user.id);
    
    if (!hasAccess) {
      return res.status(403).json({ message: "You don't have access to this attachment" });
    }
    
    // Find the attachment
    const attachment = message.attachments.find(a => a.filename === filename);
    
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }
    
    // Send the file
    res.download(
      path.join(__dirname, "..", attachment.path), 
      attachment.originalname
    );
  } catch (error) {
    console.error("Error downloading attachment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
