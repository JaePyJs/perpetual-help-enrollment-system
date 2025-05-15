/**
 * Notifications Handler Module
 * Provides real-time notification functionality through WebSockets
 */

class NotificationsHandler {
  /**
   * Initialize the notifications handler
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      containerSelector: '#notifications-container',
      maxNotifications: 50,
      notificationTimeout: 7000, // ms before auto-hide
      soundEnabled: true,
      badgeEnabled: true,
      ...options
    };
    
    this.notificationsContainer = document.querySelector(this.options.containerSelector);
    this.notifications = [];
    this.unreadCount = 0;
    this.initialized = false;
    this.soundEffect = new Audio('/sounds/notification.mp3');
    
    // Create badge element if not exists
    if (this.options.badgeEnabled) {
      this.createBadge();
    }
  }
  
  /**
   * Initialize the notifications system
   * @returns {Promise} - A promise that resolves when initialized
   */
  async init() {
    if (this.initialized) return Promise.resolve();
    
    try {
      // Check if DOM is ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Create notifications container if not exists
      if (!this.notificationsContainer) {
        this.createNotificationsContainer();
      }
      
      // Connect to WebSocket server if WebSocketClient is available
      if (window.wsClient) {
        // Subscribe to notification events
        window.wsClient.on('notification', this.handleNotification.bind(this));
        window.wsClient.on('notification_removed', this.handleNotificationRemoved.bind(this));
        
        // Connect if not already connected
        if (!window.wsClient.isConnected) {
          // Get token from session storage
          const token = window.SessionManager?.getToken() || localStorage.getItem('auth_token');
          
          if (token) {
            await window.wsClient.connect();
            
            // Authenticate with WebSocket server
            window.wsClient.send('authenticate', { token });
          }
        }
      } else {
        console.warn('WebSocketClient not available. Real-time notifications disabled.');
      }
      
      // Load existing notifications from server
      await this.loadNotifications();
      
      this.initialized = true;
      console.log('Notifications system initialized');
    } catch (error) {
      console.error('Failed to initialize notifications system:', error);
    }
  }
  
  /**
   * Create notifications container
   * @private
   */
  createNotificationsContainer() {
    this.notificationsContainer = document.createElement('div');
    this.notificationsContainer.id = 'notifications-container';
    this.notificationsContainer.className = 'notifications-container';
    document.body.appendChild(this.notificationsContainer);
  }
  
  /**
   * Create notification badge
   * @private
   */
  createBadge() {
    // Check if badge already exists
    let badge = document.querySelector('#notifications-badge');
    
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'notifications-badge';
      badge.className = 'notifications-badge hidden';
      badge.textContent = '0';
      
      // Find notification icon to attach badge to
      const notificationIcon = document.querySelector('.notification-icon');
      if (notificationIcon) {
        notificationIcon.style.position = 'relative';
        notificationIcon.appendChild(badge);
      } else {
        // If no icon found, add to document body
        document.body.appendChild(badge);
      }
    }
    
    this.badge = badge;
  }
  
  /**
   * Load existing notifications from server
   * @private
   * @returns {Promise} - A promise that resolves when notifications are loaded
   */
  async loadNotifications() {
    try {
      // Check if API client is available
      if (!window.api) {
        console.warn('API client not available. Cannot load notifications.');
        return;
      }
      
      const response = await window.api.getNotifications();
      
      if (response.status === 'success' && Array.isArray(response.data)) {
        this.notifications = response.data;
        this.unreadCount = this.notifications.filter(notification => !notification.read).length;
        
        // Update badge
        this.updateBadge();
        
        // Render notifications if container exists
        if (window.location.pathname.includes('notifications.html')) {
          this.renderNotifications();
        }
        
        console.log(`Loaded ${this.notifications.length} notifications (${this.unreadCount} unread)`);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }
  
  /**
   * Handle new notification from WebSocket
   * @param {Object} data - Notification data
   * @private
   */
  handleNotification(data) {
    // Check if notification already exists to prevent duplicates
    const existingIndex = this.notifications.findIndex(n => n.id === data.id);
    
    if (existingIndex >= 0) {
      // Update existing notification
      this.notifications[existingIndex] = {
        ...this.notifications[existingIndex],
        ...data,
        lastUpdated: new Date()
      };
    } else {
      // Add new notification
      this.notifications.unshift({
        ...data,
        read: false,
        createdAt: new Date(),
        lastUpdated: new Date()
      });
      
      // Keep notifications under max limit
      if (this.notifications.length > this.options.maxNotifications) {
        this.notifications = this.notifications.slice(0, this.options.maxNotifications);
      }
      
      // Increment unread count
      this.unreadCount++;
      
      // Update badge
      this.updateBadge();
      
      // Play sound
      this.playNotificationSound();
      
      // Show popup notification
      this.showNotificationPopup(data);
    }
    
    // Re-render notifications if on notifications page
    if (window.location.pathname.includes('notifications.html')) {
      this.renderNotifications();
    }
  }
  
  /**
   * Handle notification removed from WebSocket
   * @param {Object} data - Notification data
   * @private
   */
  handleNotificationRemoved(data) {
    const index = this.notifications.findIndex(n => n.id === data.id);
    
    if (index >= 0) {
      const wasUnread = !this.notifications[index].read;
      
      // Remove notification
      this.notifications.splice(index, 1);
      
      // Update unread count if needed
      if (wasUnread) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.updateBadge();
      }
      
      // Re-render notifications if on notifications page
      if (window.location.pathname.includes('notifications.html')) {
        this.renderNotifications();
      }
    }
  }
  
  /**
   * Play notification sound
   * @private
   */
  playNotificationSound() {
    if (this.options.soundEnabled && this.soundEffect) {
      // Reset sound to start
      this.soundEffect.currentTime = 0;
      
      // Try to play sound (may fail if no user interaction yet)
      this.soundEffect.play().catch(error => {
        // Silence error about user interaction required
        if (error.name !== 'NotAllowedError') {
          console.error('Failed to play notification sound:', error);
        }
      });
    }
  }
  
  /**
   * Update notification badge
   * @private
   */
  updateBadge() {
    if (this.options.badgeEnabled && this.badge) {
      if (this.unreadCount > 0) {
        this.badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount.toString();
        this.badge.classList.remove('hidden');
      } else {
        this.badge.classList.add('hidden');
      }
      
      // Update page title as well for unseen notifications
      const title = document.title;
      const prefix = '(';
      
      if (this.unreadCount > 0) {
        if (!title.startsWith(prefix)) {
          document.title = `(${this.unreadCount}) ${title}`;
        } else {
          // Update existing count
          document.title = title.replace(/^\(\d+\)/, `(${this.unreadCount})`);
        }
      } else if (title.startsWith(prefix)) {
        // Remove count from title
        document.title = title.replace(/^\(\d+\)\s/, '');
      }
    }
  }
  
  /**
   * Show notification popup
   * @param {Object} data - Notification data
   * @private
   */
  showNotificationPopup(data) {
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.dataset.id = data.id;
    
    // Determine severity class
    let severityClass = 'notification-info';
    if (data.type === 'warning') severityClass = 'notification-warning';
    if (data.type === 'danger' || data.type === 'error') severityClass = 'notification-danger';
    if (data.type === 'success') severityClass = 'notification-success';
    
    popup.classList.add(severityClass);
    
    // Create popup content
    popup.innerHTML = `
      <div class="notification-header">
        <div class="notification-title">${data.title || 'New Notification'}</div>
        <button class="notification-close" aria-label="Close">&times;</button>
      </div>
      <div class="notification-body">
        ${data.message || ''}
      </div>
      <div class="notification-footer">
        <small>${new Date().toLocaleTimeString()}</small>
      </div>
    `;
    
    // Add to container
    this.notificationsContainer.appendChild(popup);
    
    // Add event listeners
    const closeBtn = popup.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        popup.classList.add('notification-hiding');
        setTimeout(() => {
          popup.remove();
        }, 300); // match animation duration
      });
    }
    
    // Add click handler for the notification
    popup.addEventListener('click', (e) => {
      // Don't trigger if clicking close button
      if (!e.target.matches('.notification-close')) {
        this.markAsRead(data.id);
        
        // Navigate to notifications page if URL provided
        if (data.url) {
          window.location.href = data.url;
        } else if (data.action === 'view_notification') {
          window.location.href = 'notifications.html?id=' + data.id;
        }
      }
    });
    
    // Auto-hide after timeout
    setTimeout(() => {
      popup.classList.add('notification-hiding');
      setTimeout(() => {
        if (popup.parentNode) {
          popup.remove();
        }
      }, 300); // match animation duration
    }, this.options.notificationTimeout);
  }
  
  /**
   * Render notifications in the notifications page
   * @private
   */
  renderNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;
    
    if (this.notifications.length === 0) {
      container.innerHTML = '<div class="no-notifications">No notifications to display</div>';
      return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Sort notifications by date (newest first)
    const sorted = [...this.notifications].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Create notification elements
    sorted.forEach(notification => {
      const notificationElement = document.createElement('div');
      notificationElement.className = 'notification-item';
      if (!notification.read) {
        notificationElement.classList.add('unread');
      }
      
      // Determine severity class
      let severityClass = 'notification-info';
      if (notification.type === 'warning') severityClass = 'notification-warning';
      if (notification.type === 'danger' || notification.type === 'error') severityClass = 'notification-danger';
      if (notification.type === 'success') severityClass = 'notification-success';
      
      notificationElement.classList.add(severityClass);
      
      notificationElement.innerHTML = `
        <div class="notification-item-header">
          <div class="notification-item-title">${notification.title || 'Notification'}</div>
          <div class="notification-item-actions">
            <button class="btn-mark-read" data-id="${notification.id}">
              ${notification.read ? 'Mark as unread' : 'Mark as read'}
            </button>
            <button class="btn-delete" data-id="${notification.id}">Delete</button>
          </div>
        </div>
        <div class="notification-item-body">
          ${notification.message || ''}
        </div>
        <div class="notification-item-footer">
          <small>${new Date(notification.createdAt).toLocaleString()}</small>
        </div>
      `;
      
      container.appendChild(notificationElement);
      
      // Add event listeners
      const markReadBtn = notificationElement.querySelector('.btn-mark-read');
      const deleteBtn = notificationElement.querySelector('.btn-delete');
      
      markReadBtn.addEventListener('click', () => {
        if (notification.read) {
          this.markAsUnread(notification.id);
        } else {
          this.markAsRead(notification.id);
        }
      });
      
      deleteBtn.addEventListener('click', () => {
        this.deleteNotification(notification.id);
      });
    });
  }
  
  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   */
  async markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    
    if (notification && !notification.read) {
      try {
        if (window.api) {
          await window.api.markNotificationAsRead(id);
        }
        
        // Update local state
        notification.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.updateBadge();
        
        // Re-render notifications if on notifications page
        if (window.location.pathname.includes('notifications.html')) {
          this.renderNotifications();
        }
        
        // Notify WebSocket server
        if (window.wsClient && window.wsClient.isConnected) {
          window.wsClient.send('notification_read', { notificationId: id });
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  }
  
  /**
   * Mark notification as unread
   * @param {string} id - Notification ID
   */
  async markAsUnread(id) {
    const notification = this.notifications.find(n => n.id === id);
    
    if (notification && notification.read) {
      try {
        if (window.api) {
          await window.api.markNotificationAsUnread(id);
        }
        
        // Update local state
        notification.read = false;
        this.unreadCount++;
        this.updateBadge();
        
        // Re-render notifications if on notifications page
        if (window.location.pathname.includes('notifications.html')) {
          this.renderNotifications();
        }
      } catch (error) {
        console.error('Failed to mark notification as unread:', error);
      }
    }
  }
  
  /**
   * Delete notification
   * @param {string} id - Notification ID
   */
  async deleteNotification(id) {
    const index = this.notifications.findIndex(n => n.id === id);
    
    if (index >= 0) {
      const wasUnread = !this.notifications[index].read;
      
      try {
        if (window.api) {
          await window.api.deleteNotification(id);
        }
        
        // Update local state
        this.notifications.splice(index, 1);
        
        if (wasUnread) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          this.updateBadge();
        }
        
        // Re-render notifications if on notifications page
        if (window.location.pathname.includes('notifications.html')) {
          this.renderNotifications();
        }
        
        // Notify WebSocket server
        if (window.wsClient && window.wsClient.isConnected) {
          window.wsClient.send('notification_delete', { notificationId: id });
        }
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    }
  }
  
  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      if (window.api) {
        await window.api.markAllNotificationsAsRead();
      }
      
      // Update local state
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      
      this.unreadCount = 0;
      this.updateBadge();
      
      // Re-render notifications if on notifications page
      if (window.location.pathname.includes('notifications.html')) {
        this.renderNotifications();
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }
}

// Initialize notifications handler
window.NotificationsHandler = NotificationsHandler;

// Create default instance
document.addEventListener('DOMContentLoaded', function() {
  window.notificationsManager = new NotificationsHandler();
  
  // Initialize when user is logged in
  if (window.SessionManager && SessionManager.isLoggedIn()) {
    window.notificationsManager.init();
  }
});
