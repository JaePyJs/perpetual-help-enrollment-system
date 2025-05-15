/**
 * WebSocket Service
 * Handles real-time communication with clients
 */

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { logSecurityEvent } = require('../middleware/accessLogger');

// Client connection store
const clients = new Map();

// Event handlers for different message types
const messageHandlers = {
  // User presence and status
  user_status: handleUserStatus,
  
  // Notifications
  notification_read: handleNotificationRead,
  notification_delete: handleNotificationDelete,
  
  // Messages
  message_sent: handleMessageSent,
  message_read: handleMessageRead,
  message_reply: handleMessageReply,
  
  // Real-time data updates
  data_update: handleDataUpdate
};

/**
 * Initialize WebSocket server
 * @param {Object} server - HTTP server instance
 */
function initWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });
  
  wss.on('connection', handleConnection);
  
  // Heartbeat interval to keep connections alive
  setInterval(() => {
    wss.clients.forEach(client => {
      if (client.isAlive === false) {
        clients.delete(client.userId);
        return client.terminate();
      }
      
      client.isAlive = false;
      client.ping();
    });
  }, 30000);
  
  console.log('WebSocket server initialized');
  
  return wss;
}

/**
 * Handle new WebSocket connection
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} req - HTTP request
 */
function handleConnection(ws, req) {
  ws.isAlive = true;
  ws.userId = null;
  
  // Handle pong response (heartbeat)
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  // Handle client messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Authenticate first message
      if (!ws.userId && data.type !== 'authenticate') {
        sendError(ws, 'Authentication required');
        return;
      }
      
      // Handle authentication
      if (data.type === 'authenticate') {
        authenticateClient(ws, data.data.token);
        return;
      }
      
      // Handle other message types
      const handler = messageHandlers[data.type];
      if (handler) {
        handler(ws, data.data);
      } else {
        sendError(ws, `Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      sendError(ws, 'Error processing message');
    }
  });
  
  // Handle connection close
  ws.on('close', () => {
    if (ws.userId) {
      clients.delete(ws.userId);
      
      // Notify other users that this user is offline
      broadcastToAll({
        type: 'user_offline',
        data: {
          userId: ws.userId
        }
      }, [ws.userId]);
      
      console.log(`WebSocket client disconnected: ${ws.userId}`);
    }
  });
  
  // Send welcome message
  sendToClient(ws, {
    type: 'welcome',
    data: {
      message: 'Connected to School Enrollment System WebSocket server',
      timestamp: Date.now()
    }
  });
}

/**
 * Authenticate a WebSocket client
 * @param {WebSocket} ws - WebSocket client
 * @param {string} token - JWT token
 */
function authenticateClient(ws, token) {
  if (!token) {
    sendError(ws, 'No authentication token provided');
    return;
  }
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set client user ID
    ws.userId = decoded.id;
    
    // Store client in clients map
    clients.set(decoded.id, ws);
    
    // Log successful authentication
    logSecurityEvent('websocket_auth_success', { userId: decoded.id }, false);
    
    // Send authentication success response
    sendToClient(ws, {
      type: 'authenticated',
      data: {
        userId: decoded.id,
        timestamp: Date.now()
      }
    });
    
    // Notify other users that this user is online
    broadcastToAll({
      type: 'user_online',
      data: {
        userId: decoded.id,
        displayName: decoded.name,
        role: decoded.role
      }
    }, [decoded.id]);
    
    console.log(`WebSocket client authenticated: ${decoded.id}`);
  } catch (error) {
    // Log failed authentication
    logSecurityEvent('websocket_auth_failure', 
      { error: error.message, token: token.substring(0, 10) + '...' }, 
      true
    );
    
    sendError(ws, 'Authentication failed');
  }
}

/**
 * Send an error message to a client
 * @param {WebSocket} ws - WebSocket client
 * @param {string} message - Error message
 */
function sendError(ws, message) {
  sendToClient(ws, {
    type: 'error',
    data: {
      message,
      timestamp: Date.now()
    }
  });
}

/**
 * Send a message to a specific client
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} message - Message object
 */
function sendToClient(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Send a message to a specific user by ID
 * @param {string} userId - User ID
 * @param {Object} message - Message object
 * @returns {boolean} Whether the message was sent
 */
function sendToUser(userId, message) {
  const client = clients.get(userId);
  
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
    return true;
  }
  
  return false;
}

/**
 * Broadcast a message to all connected clients
 * @param {Object} message - Message object
 * @param {Array} excludeIds - User IDs to exclude from broadcast
 */
function broadcastToAll(message, excludeIds = []) {
  const excludeSet = new Set(excludeIds);
  
  clients.forEach((client, userId) => {
    if (!excludeSet.has(userId) && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

/**
 * Broadcast a message to users with specific roles
 * @param {Object} message - Message object
 * @param {Array} roles - User roles to include
 */
function broadcastToRoles(message, roles) {
  const roleSet = new Set(roles);
  
  clients.forEach((client, userId) => {
    if (client.role && roleSet.has(client.role) && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

/**
 * Handle user status update message
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} data - Message data
 */
function handleUserStatus(ws, data) {
  // Update user status and broadcast to other users
  broadcastToAll({
    type: 'user_status_update',
    data: {
      userId: ws.userId,
      status: data.status,
      timestamp: Date.now()
    }
  }, [ws.userId]);
}

/**
 * Handle notification read message
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} data - Message data
 */
function handleNotificationRead(ws, data) {
  // Process notification read status
  console.log(`User ${ws.userId} marked notification ${data.notificationId} as read`);
}

/**
 * Handle notification delete message
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} data - Message data
 */
function handleNotificationDelete(ws, data) {
  // Process notification deletion
  console.log(`User ${ws.userId} deleted notification ${data.notificationId}`);
}

/**
 * Handle message sent message
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} data - Message data
 */
function handleMessageSent(ws, data) {
  // Notify recipients about new message
  if (data.recipients && Array.isArray(data.recipients)) {
    data.recipients.forEach(recipientId => {
      sendToUser(recipientId, {
        type: 'new_message',
        data: {
          messageId: data.messageId,
          senderId: ws.userId,
          senderName: data.senderName,
          subject: data.subject,
          preview: data.preview,
          timestamp: Date.now()
        }
      });
    });
  }
}

/**
 * Handle message read message
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} data - Message data
 */
function handleMessageRead(ws, data) {
  // Notify sender that message was read
  sendToUser(data.senderId, {
    type: 'message_read',
    data: {
      messageId: data.messageId,
      readerId: ws.userId,
      timestamp: Date.now()
    }
  });
}

/**
 * Handle message reply message
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} data - Message data
 */
function handleMessageReply(ws, data) {
  // Notify original sender about reply
  sendToUser(data.recipientId, {
    type: 'message_reply',
    data: {
      messageId: data.messageId,
      replyId: data.replyId,
      senderId: ws.userId,
      senderName: data.senderName,
      preview: data.preview,
      timestamp: Date.now()
    }
  });
}

/**
 * Handle data update message
 * @param {WebSocket} ws - WebSocket client
 * @param {Object} data - Message data
 */
function handleDataUpdate(ws, data) {
  // Check if user has permission to broadcast updates
  // This would typically be limited to admin users
  if (data.broadcast && data.entityType) {
    // Broadcast data update to relevant users
    broadcastToAll({
      type: 'data_update',
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        updateType: data.updateType,
        timestamp: Date.now()
      }
    });
  }
}

module.exports = {
  initWebSocketServer,
  sendToUser,
  broadcastToAll,
  broadcastToRoles
};
