/**
 * Session Manager for School Enrollment System
 * This module handles session tracking, timeout notifications, and session refresh
 */

// Session configuration
const sessionConfig = {
    timeout: 30, // Minutes until session expires
    warningTime: 5, // Minutes before expiration to show warning
    checkInterval: 60, // Seconds between session checks
    idleTimeout: 45, // Minutes of inactivity before automatic logout
    requireTwoFactor: true, // Whether two-factor authentication is required
    validRoles: ['student', 'teacher', 'admin'] // Valid user roles
};

// Initialize the session manager
function initSessionManager() {
    // Create the session notification element
    createSessionNotification();
    
    // Start the session check interval
    startSessionCheck();
    
    // Set up activity monitoring
    setupActivityMonitoring();
    
    console.log("Session manager initialized");
}

// Create the session timeout notification element
function createSessionNotification() {
    // Check if notification element already exists
    if (document.getElementById('session-notification')) {
        return;
    }
    
    // Create the notification element
    const notification = document.createElement('div');
    notification.id = 'session-notification';
    notification.className = 'session-notification';
    
    // Create the notification content
    notification.innerHTML = `
        <div class="session-notification-title">Session Expiring Soon</div>
        <div class="session-notification-body">
            Your session will expire in <span id="session-countdown">5:00</span> minutes.
            Would you like to stay logged in?
        </div>
        <div class="session-notification-actions">
            <button id="session-logout" class="session-notification-button">Logout</button>
            <button id="session-extend" class="session-notification-button primary">Stay Logged In</button>
        </div>
    `;
    
    // Add the notification to the body
    document.body.appendChild(notification);
    
    // Add event listeners
    document.getElementById('session-logout').addEventListener('click', function() {
        logoutUser();
    });
    
    document.getElementById('session-extend').addEventListener('click', function() {
        extendSession();
        hideSessionNotification();
    });
}

// Show the session timeout notification
function showSessionNotification() {
    const notification = document.getElementById('session-notification');
    if (notification) {
        notification.classList.add('show');
        startCountdown();
    }
}

// Hide the session timeout notification
function hideSessionNotification() {
    const notification = document.getElementById('session-notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// Start the countdown timer in the notification
function startCountdown() {
    const countdownElement = document.getElementById('session-countdown');
    if (!countdownElement) return;
    
    // Calculate minutes and seconds from warningTime
    let minutes = sessionConfig.warningTime;
    let seconds = 0;
    
    // Update the countdown element
    const updateCountdown = () => {
        countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Initial update
    updateCountdown();
    
    // Start the interval
    const interval = setInterval(() => {
        // Decrement seconds
        seconds--;
        
        // If seconds reach 0, decrement minutes
        if (seconds < 0) {
            minutes--;
            seconds = 59;
        }
        
        // Update the countdown
        updateCountdown();
        
        // If countdown reaches 0, clear interval and logout
        if (minutes === 0 && seconds === 0) {
            clearInterval(interval);
            logoutUser('Your session has expired due to inactivity.');
        }
    }, 1000);
    
    // Store the interval ID for cleanup
    window.sessionCountdownInterval = interval;
}

// Start the session check interval
function startSessionCheck() {
    // Clear any existing interval
    if (window.sessionCheckInterval) {
        clearInterval(window.sessionCheckInterval);
    }
    
    // Start a new interval
    window.sessionCheckInterval = setInterval(() => {
        checkSession();
    }, sessionConfig.checkInterval * 1000);
}

// Check if the session is still valid
function checkSession() {
    // Get the session from local storage
    const session = getSession();
    
    // If no session exists, redirect to login
    if (!session) {
        logoutUser();
        return;
    }
    
    // Calculate the time until expiration
    const expiresAt = new Date(session.expiresAt);
    const now = new Date();
    const timeUntilExpiration = (expiresAt - now) / (60 * 1000); // in minutes
    
    // If the session has expired, logout
    if (timeUntilExpiration <= 0) {
        logoutUser('Your session has expired. Please log in again.');
        return;
    }
    
    // If the session is about to expire, show the notification
    if (timeUntilExpiration <= sessionConfig.warningTime) {
        showSessionNotification();
    }
    
    // Check if the user has been idle for too long
    const lastActivity = new Date(localStorage.getItem('lastActivity') || 0);
    const idleTime = (now - lastActivity) / (60 * 1000); // in minutes
    
    if (idleTime >= sessionConfig.idleTimeout) {
        logoutUser('Your session has expired due to inactivity.');
    }
}

// Get the session from local storage
function getSession() {
    const sessionData = localStorage.getItem('session');
    
    if (!sessionData) {
        return null;
    }
    
    try {
        const session = JSON.parse(sessionData);
        
        // Validate the session data
        if (!session.userId || !session.expiresAt || !session.userRole || !session.token) {
            return null;
        }
        
        // Validate the user role
        if (!sessionConfig.validRoles.includes(session.userRole)) {
            return null;
        }
        
        return session;
    } catch (error) {
        console.error('Error parsing session data:', error);
        return null;
    }
}

// Extend the user's session
function extendSession() {
    const session = getSession();
    
    if (!session) {
        logoutUser();
        return;
    }
    
    // Calculate new expiration time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + sessionConfig.timeout);
    
    // Update the session
    session.expiresAt = expiresAt.toISOString();
    localStorage.setItem('session', JSON.stringify(session));
    
    // Update last activity
    updateLastActivity();
    
    // In a real application, this would also send a request to the server
    console.log('Session extended until:', expiresAt);
    
    // Log the session extension
    logSecurityEvent(session.userId, 'session_extended');
}

// Set up activity monitoring
function setupActivityMonitoring() {
    // Update last activity on user interaction
    ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'].forEach(eventType => {
        document.addEventListener(eventType, updateLastActivity, { passive: true });
    });
    
    // Set initial last activity
    updateLastActivity();
}

// Update the last activity timestamp
function updateLastActivity() {
    localStorage.setItem('lastActivity', new Date().toISOString());
}

// Create a new session for a user
function createUserSession(userId, userRole) {
    // Validate the user role
    if (!sessionConfig.validRoles.includes(userRole)) {
        console.error('Invalid user role:', userRole);
        return false;
    }
    
    // Create the session token
    const token = generateSessionToken();
    
    // Calculate the expiration time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + sessionConfig.timeout);
    
    // Create the session object
    const session = {
        userId: userId,
        userRole: userRole,
        token: token,
        expiresAt: expiresAt.toISOString(),
        created: new Date().toISOString()
    };
    
    // Store the session
    localStorage.setItem('session', JSON.stringify(session));
    localStorage.setItem('sessionToken', token);
    
    // Update last activity
    updateLastActivity();
    
    // Log the session creation
    logSecurityEvent(userId, 'session_created');
    
    return true;
}

// Generate a session token
function generateSessionToken() {
    // In a real application, this would be a more secure token
    return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Log the user out
function logoutUser(message = null) {
    // Get the user ID for logging
    const session = getSession();
    const userId = session ? session.userId : 'unknown';
    
    // Clear any active intervals
    if (window.sessionCheckInterval) {
        clearInterval(window.sessionCheckInterval);
    }
    
    if (window.sessionCountdownInterval) {
        clearInterval(window.sessionCountdownInterval);
    }
    
    // Clear the session data
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('session');
    
    // Log the logout
    logSecurityEvent(userId, 'user_logout');
    
    // Set logout message if provided
    if (message) {
        sessionStorage.setItem('logoutMessage', message);
    }
    
    // Check if we're already on the login page
    if (window.location.href.includes('loginpage.html')) {
        // Refresh the page to show the logout message
        window.location.reload();
    } else {
        // Redirect to login page
        window.location.href = 'loginpage.html';
    }
}

// Log a security event
function logSecurityEvent(userId, event, details = {}, isSuccess = true) {
    // Create the security log entry
    const logEntry = {
        userId: userId,
        event: event,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: '127.0.0.1', // In a real app, this would be populated by the server
        isSuccess: isSuccess,
        details: details
    };
    
    // In a real application, this would send the log to the server
    console.log('Security Log:', logEntry);
    
    // Store locally for demonstration purposes
    const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    securityLogs.push(logEntry);
    
    // Limit the number of stored logs to prevent localStorage from getting too large
    if (securityLogs.length > 100) {
        securityLogs.shift(); // Remove the oldest log
    }
    
    localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
}

// Check if the current user has access to a page
function hasAccess(page) {
    // Get the session
    const session = getSession();
    
    // If no session exists, the user doesn't have access
    if (!session) {
        return false;
    }
    
    // Access level required for each page
    const pageAccessLevels = {
        'student-enrollment.html': ['student', 'admin'],
        'student-grades.html': ['student', 'teacher', 'admin'],
        'teacher-dashboard.html': ['teacher', 'admin'],
        'admin-dashboard.html': ['admin']
    };
    
    // Get the required roles for the page
    const requiredRoles = pageAccessLevels[page] || [];
    
    // If no specific roles are required, everyone has access
    if (requiredRoles.length === 0) {
        return true;
    }
    
    // Check if the user's role is in the required roles
    return requiredRoles.includes(session.userRole);
}

// Get the current user's information
function getCurrentUser() {
    const session = getSession();
    
    if (!session) {
        return null;
    }
    
    return {
        userId: session.userId,
        userRole: session.userRole
    };
}

// Export the session manager
window.SessionManager = {
    init: initSessionManager,
    createSession: createUserSession,
    getSession: getSession,
    extendSession: extendSession,
    logoutUser: logoutUser,
    hasAccess: hasAccess,
    getCurrentUser: getCurrentUser
};
