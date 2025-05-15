/**
 * WebSocket Client Module
 * Provides real-time communication functionality for the frontend
 */

class WebSocketClient {
  /**
   * Initialize the WebSocket client
   * @param {string} url - The WebSocket server URL
   * @param {Object} options - Configuration options
   */
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      ...options
    };
    
    this.socket = null;
    this.reconnectAttempts = 0;
    this.events = {};
    this.isConnected = false;
    this.messageQueue = [];
    
    // Bind event handlers
    this._onOpen = this._onOpen.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onError = this._onError.bind(this);
    
    // Connect immediately if autoConnect is true
    if (this.options.autoConnect !== false) {
      this.connect();
    }
  }
  
  /**
   * Connect to the WebSocket server
   * @returns {Promise} - A promise that resolves when connected
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }
      
      try {
        this.socket = new WebSocket(this.url);
        
        // Setup one-time connect handlers for this promise
        const onOpen = () => {
          this.socket.removeEventListener('open', onOpen);
          resolve();
        };
        
        const onError = (error) => {
          this.socket.removeEventListener('error', onError);
          reject(error);
        };
        
        this.socket.addEventListener('open', onOpen);
        this.socket.addEventListener('error', onError);
        
        // Setup regular event handlers
        this.socket.addEventListener('open', this._onOpen);
        this.socket.addEventListener('close', this._onClose);
        this.socket.addEventListener('message', this._onMessage);
        this.socket.addEventListener('error', this._onError);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Disconnect from the WebSocket server
   * @param {number} code - Close code
   * @param {string} reason - Close reason
   */
  disconnect(code = 1000, reason = 'Client disconnected') {
    if (!this.socket) return;
    
    this.reconnectAttempts = 0; // Reset reconnect attempts
    this.isConnected = false;
    
    try {
      this.socket.close(code, reason);
    } catch (error) {
      console.error('Error disconnecting from WebSocket:', error);
    }
  }
  
  /**
   * Send a message to the WebSocket server
   * @param {string} type - Message type
   * @param {Object} data - Message data
   * @returns {boolean} - Whether the message was sent successfully
   */
  send(type, data = {}) {
    const message = JSON.stringify({
      type,
      data,
      timestamp: Date.now()
    });
    
    if (!this.isConnected) {
      // Queue message for later if not connected
      this.messageQueue.push(message);
      return false;
    }
    
    try {
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }
  
  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
  }
  
  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Event callback to remove
   */
  off(event, callback) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
  
  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   * @private
   */
  _emit(event, data) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in WebSocket ${event} event handler:`, error);
      }
    });
  }
  
  /**
   * Handle WebSocket open event
   * @private
   */
  _onOpen() {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    console.log('WebSocket connection opened');
    
    // Process queued messages
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.socket.send(message);
    }
    
    this._emit('connect', null);
  }
  
  /**
   * Handle WebSocket close event
   * @param {Event} event - Close event
   * @private
   */
  _onClose(event) {
    this.isConnected = false;
    
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    
    this._emit('disconnect', {
      code: event.code,
      reason: event.reason
    });
    
    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000 && event.code !== 1001) {
      this._attemptReconnect();
    }
  }
  
  /**
   * Handle WebSocket message event
   * @param {MessageEvent} event - Message event
   * @private
   */
  _onMessage(event) {
    try {
      const message = JSON.parse(event.data);
      
      // Emit event for this message type
      this._emit(message.type, message.data);
      
      // Also emit 'message' event for all messages
      this._emit('message', message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }
  
  /**
   * Handle WebSocket error event
   * @param {Event} event - Error event
   * @private
   */
  _onError(event) {
    console.error('WebSocket error:', event);
    
    this._emit('error', event);
  }
  
  /**
   * Attempt to reconnect to the WebSocket server
   * @private
   */
  _attemptReconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error(`Maximum reconnect attempts (${this.options.maxReconnectAttempts}) reached`);
      this._emit('reconnect_failed', null);
      return;
    }
    
    this.reconnectAttempts++;
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts}) in ${this.options.reconnectInterval}ms`);
    
    this._emit('reconnecting', {
      attempt: this.reconnectAttempts,
      max: this.options.maxReconnectAttempts
    });
    
    setTimeout(() => {
      this.connect()
        .then(() => {
          this._emit('reconnect', {
            attempt: this.reconnectAttempts
          });
        })
        .catch(() => {
          // Reconnect error handled by _onError
        });
    }, this.options.reconnectInterval);
  }
}

// Expose globally
window.WebSocketClient = WebSocketClient;

// Default instance for notifications and updates
window.wsClient = new WebSocketClient('ws://localhost:3000/ws', {
  autoConnect: false, // Don't connect automatically, wait for user login
  reconnectInterval: 3000,
  maxReconnectAttempts: 10
});
