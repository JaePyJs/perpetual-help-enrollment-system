/**
 * Security Log Viewer Component for Admin Dashboard
 * This provides functionality to view and analyze security logs and access events
 */

// Configuration for the log viewer
const logViewerConfig = {
    maxLogsPerPage: 50,
    refreshInterval: 60, // seconds
    logRetentionDays: 30,
    severityColors: {
        critical: '#e74c3c',
        high: '#e67e22',
        medium: '#f39c12',
        low: '#3498db',
        info: '#2ecc71'
    }
};

// Initialize the security log viewer
function initSecurityLogViewer() {
    // Load security logs
    loadSecurityLogs();
    
    // Load access logs
    loadAccessLogs();
    
    // Setup filter and search functionality
    setupLogFilters();
    
    // Set up auto-refresh
    setupAutoRefresh();
    
    // Setup export functionality
    setupExportLogs();
    
    console.log("Security log viewer initialized");
}

// Load security event logs
function loadSecurityLogs() {
    const securityLogsContainer = document.getElementById('security-logs-container');
    if (!securityLogsContainer) return;
    
    // Get security logs from localStorage (in a real app, these would come from a server)
    const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    
    // Clear the container
    securityLogsContainer.innerHTML = '';
    
    // Display message if no logs
    if (securityLogs.length === 0) {
        securityLogsContainer.innerHTML = '<div class="empty-logs-message">No security logs available</div>';
        return;
    }
    
    // Build the logs table
    const table = document.createElement('table');
    table.className = 'security-logs-table';
    
    // Add table header
    table.innerHTML = `
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>User ID</th>
                <th>Event</th>
                <th>Status</th>
                <th>Details</th>
            </tr>
        </thead>
        <tbody id="security-logs-body"></tbody>
    `;
    
    securityLogsContainer.appendChild(table);
    
    const logsBody = document.getElementById('security-logs-body');
    
    // Add the logs, most recent first
    securityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(log => {
        const row = document.createElement('tr');
        
        // Format the timestamp
        const date = new Date(log.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        // Event class based on success/failure
        const eventClass = log.isSuccess ? 'success' : 'failure';
        
        // Add the log data
        row.innerHTML = `
            <td class="log-timestamp">${formattedDate}</td>
            <td class="log-user">${log.userId || 'Unknown'}</td>
            <td class="log-event ${eventClass}">${formatEventName(log.event)}</td>
            <td class="log-status">${log.isSuccess ? 'Success' : 'Failure'}</td>
            <td class="log-details">
                <button class="view-details-btn" data-log-id="${securityLogs.indexOf(log)}">View</button>
            </td>
        `;
        
        logsBody.appendChild(row);
    });
    
    // Add event listeners for detail buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const logId = this.getAttribute('data-log-id');
            const log = securityLogs[logId];
            showLogDetails(log);
        });
    });
}

// Format event names for display
function formatEventName(eventName) {
    if (!eventName) return 'Unknown';
    
    // Replace underscores with spaces and capitalize each word
    return eventName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Show details for a log entry
function showLogDetails(log) {
    // Create modal for log details
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Format the timestamp
    const date = new Date(log.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    // Format details
    let detailsHtml = '';
    if (log.details) {
        detailsHtml = '<ul>';
        for (const [key, value] of Object.entries(log.details)) {
            detailsHtml += `<li><strong>${formatEventName(key)}:</strong> ${value}</li>`;
        }
        detailsHtml += '</ul>';
    }
    
    // Create the modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Security Event Details</h2>
            <div class="log-detail-item">
                <strong>Event:</strong> ${formatEventName(log.event)}
            </div>
            <div class="log-detail-item">
                <strong>User ID:</strong> ${log.userId || 'Unknown'}
            </div>
            <div class="log-detail-item">
                <strong>Timestamp:</strong> ${formattedDate}
            </div>
            <div class="log-detail-item">
                <strong>Status:</strong> ${log.isSuccess ? 'Success' : 'Failure'}
            </div>
            <div class="log-detail-item">
                <strong>User Agent:</strong> ${log.userAgent || 'Not available'}
            </div>
            <div class="log-detail-item">
                <strong>IP Address:</strong> ${log.ipAddress || 'Not available'}
            </div>
            ${detailsHtml ? `
            <div class="log-detail-item">
                <strong>Additional Details:</strong>
                ${detailsHtml}
            </div>` : ''}
        </div>
    `;
    
    // Add the modal to the page
    document.body.appendChild(modal);
    
    // Show the modal
    setTimeout(() => {
        modal.style.display = 'block';
    }, 10);
    
    // Add event listener to close button
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Close when clicking outside the modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// Load access logs
function loadAccessLogs() {
    const accessLogsContainer = document.getElementById('access-logs-container');
    if (!accessLogsContainer) return;
    
    // Get access logs from localStorage (in a real app, these would come from a server)
    const accessLogs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
    
    // Clear the container
    accessLogsContainer.innerHTML = '';
    
    // Display message if no logs
    if (accessLogs.length === 0) {
        accessLogsContainer.innerHTML = '<div class="empty-logs-message">No access logs available</div>';
        return;
    }
    
    // Build the logs table
    const table = document.createElement('table');
    table.className = 'access-logs-table';
    
    // Add table header
    table.innerHTML = `
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>User ID</th>
                <th>Page</th>
                <th>IP Address</th>
            </tr>
        </thead>
        <tbody id="access-logs-body"></tbody>
    `;
    
    accessLogsContainer.appendChild(table);
    
    const logsBody = document.getElementById('access-logs-body');
    
    // Add the logs, most recent first
    accessLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(log => {
        const row = document.createElement('tr');
        
        // Format the timestamp
        const date = new Date(log.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        // Add the log data
        row.innerHTML = `
            <td class="log-timestamp">${formattedDate}</td>
            <td class="log-user">${log.userId || 'Unknown'}</td>
            <td class="log-page">${log.page || 'Unknown'}</td>
            <td class="log-ip">${log.ipAddress || '127.0.0.1'}</td>
        `;
        
        logsBody.appendChild(row);
    });
}

// Setup log filters and search functionality
function setupLogFilters() {
    // Get filter elements
    const securityFilterInput = document.getElementById('security-log-filter');
    const accessFilterInput = document.getElementById('access-log-filter');
    const securityDateFilter = document.getElementById('security-date-filter');
    const accessDateFilter = document.getElementById('access-date-filter');
    
    // Add event listeners for security logs filter
    if (securityFilterInput) {
        securityFilterInput.addEventListener('input', function() {
            filterSecurityLogs(this.value, securityDateFilter ? securityDateFilter.value : null);
        });
    }
    
    // Add event listeners for access logs filter
    if (accessFilterInput) {
        accessFilterInput.addEventListener('input', function() {
            filterAccessLogs(this.value, accessDateFilter ? accessDateFilter.value : null);
        });
    }
    
    // Add event listeners for security date filter
    if (securityDateFilter) {
        securityDateFilter.addEventListener('change', function() {
            filterSecurityLogs(securityFilterInput ? securityFilterInput.value : '', this.value);
        });
    }
    
    // Add event listeners for access date filter
    if (accessDateFilter) {
        accessDateFilter.addEventListener('change', function() {
            filterAccessLogs(accessFilterInput ? accessFilterInput.value : '', this.value);
        });
    }
}

// Filter security logs based on search term and date
function filterSecurityLogs(searchTerm, dateFilter) {
    const securityLogsBody = document.getElementById('security-logs-body');
    if (!securityLogsBody) return;
    
    // Get all log rows
    const rows = securityLogsBody.querySelectorAll('tr');
    
    // Convert search term to lowercase for case-insensitive comparison
    searchTerm = searchTerm.toLowerCase();
    
    // Parse date filter
    let filterDate = null;
    if (dateFilter) {
        filterDate = new Date(dateFilter);
        filterDate.setHours(0, 0, 0, 0);
    }
    
    // Filter the rows
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const timestamp = row.querySelector('.log-timestamp').textContent;
        
        // Check if row matches search term
        const matchesSearch = searchTerm === '' || text.includes(searchTerm);
        
        // Check if row matches date filter
        let matchesDate = true;
        if (filterDate) {
            const rowDate = new Date(timestamp);
            rowDate.setHours(0, 0, 0, 0);
            matchesDate = rowDate.getTime() === filterDate.getTime();
        }
        
        // Show or hide row based on filters
        if (matchesSearch && matchesDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filter access logs based on search term and date
function filterAccessLogs(searchTerm, dateFilter) {
    const accessLogsBody = document.getElementById('access-logs-body');
    if (!accessLogsBody) return;
    
    // Get all log rows
    const rows = accessLogsBody.querySelectorAll('tr');
    
    // Convert search term to lowercase for case-insensitive comparison
    searchTerm = searchTerm.toLowerCase();
    
    // Parse date filter
    let filterDate = null;
    if (dateFilter) {
        filterDate = new Date(dateFilter);
        filterDate.setHours(0, 0, 0, 0);
    }
    
    // Filter the rows
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const timestamp = row.querySelector('.log-timestamp').textContent;
        
        // Check if row matches search term
        const matchesSearch = searchTerm === '' || text.includes(searchTerm);
        
        // Check if row matches date filter
        let matchesDate = true;
        if (filterDate) {
            const rowDate = new Date(timestamp);
            rowDate.setHours(0, 0, 0, 0);
            matchesDate = rowDate.getTime() === filterDate.getTime();
        }
        
        // Show or hide row based on filters
        if (matchesSearch && matchesDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Set up auto-refresh for logs
function setupAutoRefresh() {
    // Set interval to refresh logs
    setInterval(function() {
        loadSecurityLogs();
        loadAccessLogs();
    }, logViewerConfig.refreshInterval * 1000);
}

// Setup log export functionality
function setupExportLogs() {
    // Get export buttons
    const exportSecurityBtn = document.getElementById('export-security-logs');
    const exportAccessBtn = document.getElementById('export-access-logs');
    
    // Add event listeners for export buttons
    if (exportSecurityBtn) {
        exportSecurityBtn.addEventListener('click', function() {
            exportLogs('security');
        });
    }
    
    if (exportAccessBtn) {
        exportAccessBtn.addEventListener('click', function() {
            exportLogs('access');
        });
    }
}

// Export logs to CSV
function exportLogs(logType) {
    // Get the logs based on type
    let logs;
    let fileName;
    
    if (logType === 'security') {
        logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        fileName = 'security_logs_export.csv';
    } else {
        logs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
        fileName = 'access_logs_export.csv';
    }
    
    // Return if no logs
    if (logs.length === 0) {
        alert('No logs available to export');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add header row based on log type
    if (logType === 'security') {
        csvContent += 'Timestamp,User ID,Event,Status,User Agent,IP Address\n';
    } else {
        csvContent += 'Timestamp,User ID,Page,IP Address\n';
    }
    
    // Add log rows
    logs.forEach(log => {
        const formattedDate = new Date(log.timestamp).toISOString();
        
        if (logType === 'security') {
            csvContent += `${formattedDate},${log.userId || 'Unknown'},"${formatEventName(log.event)}",${log.isSuccess ? 'Success' : 'Failure'},"${log.userAgent || 'Not available'}",${log.ipAddress || '127.0.0.1'}\n`;
        } else {
            csvContent += `${formattedDate},${log.userId || 'Unknown'},${log.page || 'Unknown'},${log.ipAddress || '127.0.0.1'}\n`;
        }
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
}

// Generate log summary statistics
function generateLogSummary() {
    const summaryContainer = document.getElementById('log-summary-container');
    if (!summaryContainer) return;
    
    // Get logs
    const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    const accessLogs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
    
    // Calculate statistics
    const totalSecurityEvents = securityLogs.length;
    const failedSecurityEvents = securityLogs.filter(log => !log.isSuccess).length;
    const successfulSecurityEvents = totalSecurityEvents - failedSecurityEvents;
    
    const totalAccessEvents = accessLogs.length;
    
    // Count login attempts
    const loginAttempts = securityLogs.filter(log => log.event === 'login_attempt').length;
    const failedLogins = securityLogs.filter(log => log.event === 'login_attempt' && !log.isSuccess).length;
    
    // Get unique users
    const uniqueSecurityUsers = new Set(securityLogs.map(log => log.userId)).size;
    const uniqueAccessUsers = new Set(accessLogs.map(log => log.userId)).size;
    
    // Generate HTML for summary
    summaryContainer.innerHTML = `
        <div class="summary-card">
            <div class="summary-title">Security Events</div>
            <div class="summary-count">${totalSecurityEvents}</div>
            <div class="summary-detail">
                <span class="success">${successfulSecurityEvents} Successful</span> | 
                <span class="failure">${failedSecurityEvents} Failed</span>
            </div>
        </div>
        
        <div class="summary-card">
            <div class="summary-title">Login Attempts</div>
            <div class="summary-count">${loginAttempts}</div>
            <div class="summary-detail">
                <span class="success">${loginAttempts - failedLogins} Successful</span> | 
                <span class="failure">${failedLogins} Failed</span>
            </div>
        </div>
        
        <div class="summary-card">
            <div class="summary-title">Access Events</div>
            <div class="summary-count">${totalAccessEvents}</div>
            <div class="summary-detail">
                <span>${uniqueAccessUsers} Unique Users</span>
            </div>
        </div>
        
        <div class="summary-card">
            <div class="summary-title">Active Users</div>
            <div class="summary-count">${uniqueSecurityUsers}</div>
            <div class="summary-detail">
                <span>Across all security events</span>
            </div>
        </div>
    `;
}

// Export the security log viewer
window.SecurityLogViewer = {
    init: initSecurityLogViewer,
    loadSecurityLogs: loadSecurityLogs,
    loadAccessLogs: loadAccessLogs,
    generateLogSummary: generateLogSummary,
    exportLogs: exportLogs
};
