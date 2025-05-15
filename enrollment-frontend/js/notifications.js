/**
 * Notifications System
 * This module provides notification functionality for system events,
 * including messages, announcements, schedule changes, and grade updates.
 */

// Initialize the notifications system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize security modules if available
    if (window.SecurityModule) {
        SecurityModule.init();
    }
    
    if (window.SessionManager) {
        SessionManager.init();
    }
    
    // Load notifications for the current user
    loadNotifications();
    
    // Setup event listeners
    setupEventListeners();
    
    // Log page access
    logAccessEvent('notifications_page_access');
});

// Setup event listeners
function setupEventListeners() {
    // Mark all as read button
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllAsRead();
        });
    }
    
    // Clear all button
    const clearAllBtn = document.getElementById('clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            clearAllNotifications();
        });
    }
    
    // Type filter
    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Priority filter
    const priorityFilter = document.getElementById('priority-filter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Unread filter
    const unreadFilter = document.getElementById('unread-filter');
    if (unreadFilter) {
        unreadFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
}

// Load notifications for the current user
function loadNotifications() {
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = '<div class="loading">Loading notifications...</div>';
    
    // In a real implementation, we would fetch from the API
    /*
    fetch('/api/notifications', {
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayNotifications(data.notifications);
    })
    .catch(error => {
        console.error('Error fetching notifications:', error);
        notificationList.innerHTML = '<div class="error">Error loading notifications. Please try again.</div>';
    });
    */
    
    // For demo purposes, use mock data
    const mockNotifications = generateMockNotifications();
    
    // Display notifications
    setTimeout(() => {
        if (mockNotifications.length > 0) {
            displayNotifications(mockNotifications);
        } else {
            showEmptyState();
        }
    }, 300); // Simulate API delay
}

// Generate mock notifications for demo
function generateMockNotifications() {
    const notifications = [];
    const types = ['message', 'announcement', 'schedule', 'grade'];
    const priorities = ['low', 'medium', 'high'];
    
    // Generate some message notifications
    for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Random date within last week
        
        notifications.push({
            id: `message-${i}`,
            type: 'message',
            title: 'New Message',
            content: `You have received a new message from ${['John Smith', 'Maria Garcia', 'David Johnson'][i % 3]}.`,
            createdAt: date.toISOString(),
            isRead: Math.random() > 0.5, // 50% chance of being unread
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            relatedId: `message-${i}`,
            link: 'messaging.html'
        });
    }
    
    // Generate some announcement notifications
    for (let i = 0; i < 2; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Random date within last week
        
        notifications.push({
            id: `announcement-${i}`,
            type: 'announcement',
            title: 'School Announcement',
            content: `${['Important school event coming up this Friday.', 'Parent-teacher conference scheduled for next week.'][i % 2]}`,
            createdAt: date.toISOString(),
            isRead: Math.random() > 0.3, // 30% chance of being unread
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            relatedId: `announcement-${i}`,
            link: 'messaging.html'
        });
    }
    
    // Generate some schedule notifications
    for (let i = 0; i < 2; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Random date within last week
        
        notifications.push({
            id: `schedule-${i}`,
            type: 'schedule',
            title: 'Schedule Change',
            content: `${['Your class schedule has been updated for next week.', 'Room change for your Mathematics class tomorrow.'][i % 2]}`,
            createdAt: date.toISOString(),
            isRead: Math.random() > 0.7, // 70% chance of being unread
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            relatedId: `schedule-${i}`,
            link: 'schedule-management.html'
        });
    }
    
    // Generate some grade notifications
    for (let i = 0; i < 1; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Random date within last week
        
        notifications.push({
            id: `grade-${i}`,
            type: 'grade',
            title: 'Grade Updated',
            content: 'New grades have been posted for your students.',
            createdAt: date.toISOString(),
            isRead: false, // Always unread
            priority: 'high',
            relatedId: `grade-${i}`,
            link: 'teacher-dashboard.html#grades'
        });
    }
    
    // Sort by date (newest first) and read status (unread first)
    return notifications.sort((a, b) => {
        if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

// Display notifications in the notification list
function displayNotifications(notifications) {
    const notificationList = document.getElementById('notification-list');
    const template = document.getElementById('notification-item-template');
    
    // Clear the list
    notificationList.innerHTML = '';
    
    if (notifications.length === 0) {
        showEmptyState();
        return;
    }
    
    // Add notifications to the list
    notifications.forEach(notification => {
        const notificationItem = template.content.cloneNode(true).querySelector('.notification-item');
        
        // Set notification status
        if (notification.isRead) {
            notificationItem.classList.add('read');
        } else {
            // Add unread badge
            const badge = document.createElement('div');
            badge.classList.add('notification-badge');
            notificationItem.appendChild(badge);
        }
        
        // Set notification type
        const typeElement = notificationItem.querySelector('.notification-type');
        typeElement.textContent = capitalizeFirstLetter(notification.type);
        typeElement.classList.add(notification.type);
        
        // Add priority marker
        const title = notificationItem.querySelector('.notification-title');
        const priorityMarker = document.createElement('span');
        priorityMarker.classList.add('priority-marker', `priority-${notification.priority}`);
        title.prepend(priorityMarker);
        
        // Set notification content
        title.appendChild(document.createTextNode(notification.title));
        
        const time = notificationItem.querySelector('.notification-time');
        time.textContent = formatDate(notification.createdAt);
        
        const content = notificationItem.querySelector('.notification-content');
        content.textContent = notification.content;
        
        // Setup notification actions
        const markReadLink = notificationItem.querySelector('.mark-read');
        if (notification.isRead) {
            markReadLink.textContent = 'Mark as Unread';
        }
        markReadLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleReadStatus(notification.id, notification.isRead);
        });
        
        const viewDetailsLink = notificationItem.querySelector('.view-details');
        viewDetailsLink.setAttribute('href', notification.link);
        
        const dismissLink = notificationItem.querySelector('.dismiss');
        dismissLink.addEventListener('click', function(e) {
            e.preventDefault();
            dismissNotification(notification.id);
        });
        
        // Add to DOM
        notificationList.appendChild(notificationItem);
    });
    
    // Setup notification pagination
    setupPagination(notifications.length);
}

// Show empty state when no notifications are available
function showEmptyState() {
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🔔</div>
            <div class="empty-text">No notifications to display</div>
            <p>Notifications will appear here when you receive new messages, announcements, or updates.</p>
        </div>
    `;
    
    // Hide pagination
    document.getElementById('notification-pagination').style.display = 'none';
}

// Setup pagination for notifications
function setupPagination(totalItems, itemsPerPage = 10) {
    const paginationContainer = document.getElementById('notification-pagination');
    paginationContainer.innerHTML = '';
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // Current page
    const currentPage = 1;
    
    // Add page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('div');
        pageItem.classList.add('page-item');
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.textContent = i;
        
        // Add click event
        pageItem.addEventListener('click', function() {
            // In a real implementation, we would load the appropriate page of notifications
            // For now, just update the active class
            const pageItems = document.querySelectorAll('.page-item');
            pageItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
        
        paginationContainer.appendChild(pageItem);
    }
}

// Mark all notifications as read
function markAllAsRead() {
    // In a real implementation, we would send to the API
    /*
    fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Reload notifications
        loadNotifications();
    })
    .catch(error => {
        console.error('Error marking all as read:', error);
        alert('Error marking all as read. Please try again.');
    });
    */
    
    // For demo, update the UI
    const notificationItems = document.querySelectorAll('.notification-item:not(.read)');
    notificationItems.forEach(item => {
        item.classList.add('read');
        item.querySelector('.notification-badge')?.remove();
        const markReadLink = item.querySelector('.mark-read');
        markReadLink.textContent = 'Mark as Unread';
    });
    
    // Show success message
    alert('All notifications marked as read');
}

// Clear all notifications
function clearAllNotifications() {
    // Confirm action
    if (!confirm('Are you sure you want to delete all notifications?')) {
        return;
    }
    
    // In a real implementation, we would send to the API
    /*
    fetch('/api/notifications/clear-all', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Show empty state
        showEmptyState();
    })
    .catch(error => {
        console.error('Error clearing all notifications:', error);
        alert('Error clearing all notifications. Please try again.');
    });
    */
    
    // For demo, show empty state
    showEmptyState();
}

// Toggle read status for a notification
function toggleReadStatus(notificationId, currentStatus) {
    // In a real implementation, we would send to the API
    /*
    fetch(`/api/notifications/${notificationId}/toggle-read`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Update UI
        const notificationItem = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.classList.toggle('read');
            const markReadLink = notificationItem.querySelector('.mark-read');
            if (notificationItem.classList.contains('read')) {
                markReadLink.textContent = 'Mark as Unread';
                notificationItem.querySelector('.notification-badge')?.remove();
            } else {
                markReadLink.textContent = 'Mark as Read';
                const badge = document.createElement('div');
                badge.classList.add('notification-badge');
                notificationItem.appendChild(badge);
            }
        }
    })
    .catch(error => {
        console.error('Error toggling read status:', error);
        alert('Error updating notification. Please try again.');
    });
    */
    
    // For demo, update the UI
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        // Find the notification item (in a real app, we'd use data-id attribute)
        const markReadLink = item.querySelector('.mark-read');
        if (markReadLink.textContent === (currentStatus ? 'Mark as Unread' : 'Mark as Read')) {
            item.classList.toggle('read');
            
            if (item.classList.contains('read')) {
                markReadLink.textContent = 'Mark as Unread';
                item.querySelector('.notification-badge')?.remove();
            } else {
                markReadLink.textContent = 'Mark as Read';
                const badge = document.createElement('div');
                badge.classList.add('notification-badge');
                item.appendChild(badge);
            }
            
            // If we're filtering by unread, we might need to reapply filters
            if (document.getElementById('unread-filter').checked) {
                // This would hide the item if it's now read
                if (item.classList.contains('read')) {
                    item.style.display = 'none';
                }
            }
        }
    });
}

// Dismiss a single notification
function dismissNotification(notificationId) {
    // In a real implementation, we would send to the API
    /*
    fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Remove from UI
        const notificationItem = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.remove();
        }
        
        // Check if we need to show empty state
        const remainingItems = document.querySelectorAll('.notification-item');
        if (remainingItems.length === 0) {
            showEmptyState();
        }
    })
    .catch(error => {
        console.error('Error dismissing notification:', error);
        alert('Error dismissing notification. Please try again.');
    });
    */
    
    // For demo, update the UI
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        // Find the notification item by looking for the one with the dismiss link we clicked
        const dismissLink = item.querySelector('.dismiss');
        dismissLink.addEventListener('click', function(e) {
            if (e.target === dismissLink) {
                // Remove the notification
                item.remove();
                
                // Check if we need to show empty state
                const remainingItems = document.querySelectorAll('.notification-item:not([style*="display: none"])');
                if (remainingItems.length === 0) {
                    showEmptyState();
                }
            }
        });
    });
}

// Apply filters to the notification list
function applyFilters() {
    const typeFilter = document.getElementById('type-filter').value;
    const priorityFilter = document.getElementById('priority-filter').value;
    const unreadFilter = document.getElementById('unread-filter').checked;
    
    // In a real implementation, we would fetch filtered data from the API
    /*
    fetch(`/api/notifications?type=${typeFilter}&priority=${priorityFilter}&unread=${unreadFilter}`, {
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayNotifications(data.notifications);
    })
    .catch(error => {
        console.error('Error fetching filtered notifications:', error);
        alert('Error applying filters. Please try again.');
    });
    */
    
    // For demo, filter the existing items
    const notificationItems = document.querySelectorAll('.notification-item');
    let visibleCount = 0;
    
    notificationItems.forEach(item => {
        // Default to visible
        let isVisible = true;
        
        // Check type filter
        if (typeFilter !== 'all') {
            const type = item.querySelector('.notification-type').textContent.toLowerCase();
            if (type !== typeFilter) {
                isVisible = false;
            }
        }
        
        // Check priority filter
        if (priorityFilter !== 'all' && isVisible) {
            const priorityMarker = item.querySelector('.priority-marker');
            const priority = Array.from(priorityMarker.classList)
                .find(cls => cls.startsWith('priority-'))
                ?.replace('priority-', '');
            
            if (priority !== priorityFilter) {
                isVisible = false;
            }
        }
        
        // Check unread filter
        if (unreadFilter && isVisible) {
            if (item.classList.contains('read')) {
                isVisible = false;
            }
        }
        
        // Show or hide based on filters
        item.style.display = isVisible ? 'block' : 'none';
        
        if (isVisible) {
            visibleCount++;
        }
    });
    
    // Show empty state if no visible notifications
    if (visibleCount === 0) {
        const notificationList = document.getElementById('notification-list');
        notificationList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <div class="empty-text">No notifications match your filters</div>
                <p>Try adjusting your filter settings to see more notifications.</p>
            </div>
        `;
        
        // Hide pagination
        document.getElementById('notification-pagination').style.display = 'none';
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if the date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, format the date
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Log security and access events
function logAccessEvent(eventType, details = {}) {
    if (window.SecurityModule) {
        SecurityModule.logEvent(eventType, details);
    }
    
    console.log(`[EVENT] ${eventType}`, details);
}

// Logout function
function logout() {
    if (window.SessionManager) {
        SessionManager.clearSession();
    }
    
    // Redirect to login page
    window.location.href = 'loginpage.html';
}
