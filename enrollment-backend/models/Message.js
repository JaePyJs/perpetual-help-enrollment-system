const mongoose = require("mongoose");

/**
 * Message Model
 * Handles communication between users in the system
 */
const messageSchema = new mongoose.Schema({
  // Sender of the message
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Recipients of the message (can be multiple)
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    readAt: Date, // Timestamp when user read the message
    deleted: {
      type: Boolean,
      default: false
    }
  }],
  
  // If message is sent to a class/group instead of specific users
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  
  // Type of message
  messageType: {
    type: String,
    enum: ["direct", "announcement", "class", "system"],
    default: "direct",
  },
  
  // Subject/title of the message
  subject: {
    type: String,
    required: true,
  },
  
  // Message content
  content: {
    type: String,
    required: true,
  },

  // Priority level (for announcements)
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  },
  
  // Optional file attachments
  attachments: [{
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // For message threads/replies
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  // If message has been deleted by sender
  deleted: {
    type: Boolean,
    default: false
  },
  
  // Expiry date for announcements/system messages
  expiresAt: Date
});

// Indexes for efficient querying
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ "recipients.user": 1, createdAt: -1 });
messageSchema.index({ course: 1, createdAt: -1 });
messageSchema.index({ parentMessage: 1 });

// Virtual for read status summary
messageSchema.virtual('readCount').get(function() {
  return this.recipients.filter(recipient => recipient.readAt).length;
});

messageSchema.virtual('totalRecipients').get(function() {
  return this.recipients.length;
});

// Update timestamps
messageSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to mark message as read for a user
messageSchema.methods.markAsRead = async function(userId) {
  const recipientIndex = this.recipients.findIndex(
    recipient => recipient.user.toString() === userId.toString()
  );
  
  if (recipientIndex !== -1 && !this.recipients[recipientIndex].readAt) {
    this.recipients[recipientIndex].readAt = new Date();
    await this.save();
    return true;
  }
  
  return false;
};

// Method to mark message as deleted for a user
messageSchema.methods.markAsDeletedForUser = async function(userId) {
  const recipientIndex = this.recipients.findIndex(
    recipient => recipient.user.toString() === userId.toString()
  );
  
  if (recipientIndex !== -1) {
    this.recipients[recipientIndex].deleted = true;
    await this.save();
    return true;
  }
  
  return false;
};

// Method to check if user has access to this message
messageSchema.methods.hasAccess = function(userId) {
  // Sender always has access
  if (this.sender.toString() === userId.toString()) {
    return !this.deleted; // Unless sender deleted the message
  }
  
  // Check if user is a recipient and hasn't deleted the message
  const recipientIndex = this.recipients.findIndex(
    recipient => recipient.user.toString() === userId.toString()
  );
  
  return recipientIndex !== -1 && !this.recipients[recipientIndex].deleted;
};

module.exports = mongoose.model("Message", messageSchema);
