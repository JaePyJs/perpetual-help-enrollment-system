// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    loadAdminData();
    loadDashboardStats();
    loadRecentActivity();
    showContent('home');

    // Set up event listeners
    document.getElementById('add-user-form')?.addEventListener('submit', addUser);
    document.getElementById('remove-user-form')?.addEventListener('submit', removeUser);
    document.getElementById('modify-user-form')?.addEventListener('submit', modifyUser);
    
    // Load department and subject data for dropdowns
    loadDepartmentsToDropdowns();
    loadSubjectsToDropdowns();
    
    // Initialize security modules
    if (window.SecurityModule) {
        SecurityModule.init();
    }
    
    if (window.SessionManager) {
        SessionManager.init();
    }
    
    if (window.SecurityLogViewer) {
        SecurityLogViewer.init();
    }
    
    // Load security settings
    loadSecuritySettings();
});

// Load admin data
function loadAdminData() {
    // In a real application, this would come from an API or localStorage
    document.getElementById('admin-name').textContent = adminData.name;
    document.getElementById('admin-role').textContent = adminData.role;
    document.getElementById('last-login').textContent = formatDate(adminData.lastLogin);
}

// Load dashboard statistics
function loadDashboardStats() {
    // In a real application, this would fetch from an API
    const stats = adminData.stats;
    
    // Update stats in the dashboard
    document.getElementById('total-students').textContent = stats.totalStudents;
    document.getElementById('total-teachers').textContent = stats.totalTeachers;
    document.getElementById('total-departments').textContent = stats.totalDepartments;
    document.getElementById('total-subjects').textContent = stats.totalSubjects;
    document.getElementById('active-enrollments').textContent = stats.activeEnrollments;
    document.getElementById('pending-enrollments').textContent = stats.pendingEnrollments;
    document.getElementById('pending-payments').textContent = stats.pendingPayments;
    
    // Load enrollment statistics if the element exists
    if (document.getElementById('enrollment-stats')) {
        loadEnrollmentStats();
    }
}

// Load recent activity
function loadRecentActivity() {
    // In a real application, this would fetch from an API
    const activities = adminData.recentActivity;
    const activityFeed = document.getElementById('activity-feed');
    
    activityFeed.innerHTML = activities.map(activity => `
        <div class="activity-item ${activity.category}">
            <div class="activity-content">${activity.description}</div>
            <div class="activity-time">${formatDate(activity.timestamp)}</div>
        </div>
    `).join('');
}

// Load departments to dropdowns
function loadDepartmentsToDropdowns() {
    const departments = adminData.departments;
    const departmentDropdowns = document.querySelectorAll('.department-dropdown');
    
    departmentDropdowns.forEach(dropdown => {
        // Clear existing options
        dropdown.innerHTML = '<option value="">Select Department</option>';
        
        // Add department options
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.code;
            option.textContent = `${dept.code} - ${dept.name}`;
            dropdown.appendChild(option);
        });
    });
}

// Load subjects to dropdowns
function loadSubjectsToDropdowns() {
    const subjects = adminData.subjects;
    const subjectDropdowns = document.querySelectorAll('.subject-dropdown');
    
    subjectDropdowns.forEach(dropdown => {
        // Clear existing options
        dropdown.innerHTML = '<option value="">Select Subject</option>';
        
        // Add subject options
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.code;
            option.textContent = `${subject.code} - ${subject.title}`;
            dropdown.appendChild(option);
        });
    });
}

// Load enrollment statistics
function loadEnrollmentStats() {
    const stats = adminData.enrollmentStats;
    const container = document.getElementById('enrollment-stats');
    
    // Display current semester and academic year
    container.innerHTML = `
        <h2>Enrollment Statistics</h2>
        <p>Academic Year: ${stats.academicYear}, ${stats.currentSemester}</p>
        <p>Total Enrollments: ${stats.totalEnrollments}</p>
        
        <div class="stats-grid">
            <div class="stats-card">
                <h3>By Department</h3>
                <div class="stats-chart">
                    ${generateBarChart(stats.byDepartment, 'department', 'count')}
                </div>
            </div>
            
            <div class="stats-card">
                <h3>By Year Level</h3>
                <div class="stats-chart">
                    ${generateBarChart(stats.byYearLevel, 'yearLevel', 'count')}
                </div>
            </div>
            
            <div class="stats-card">
                <h3>By Status</h3>
                <div class="stats-chart">
                    ${generatePieChart(stats.byStatus, 'status', 'count')}
                </div>
            </div>
            
            <div class="stats-card">
                <h3>By Payment Status</h3>
                <div class="stats-chart">
                    ${generatePieChart(stats.byPaymentStatus, 'status', 'count')}
                </div>
            </div>
        </div>
    `;
}

// Generate a simple bar chart using DIVs
function generateBarChart(data, labelKey, valueKey) {
    const maxValue = Math.max(...data.map(item => item[valueKey]));
    
    return `
        <div class="bar-chart">
            ${data.map(item => `
                <div class="chart-row">
                    <div class="chart-label">${item[labelKey]}</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar" style="width: ${(item[valueKey] / maxValue * 100)}%"></div>
                    </div>
                    <div class="chart-value">${item[valueKey]}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Generate a simple pie chart representation
function generatePieChart(data, labelKey, valueKey) {
    const total = data.reduce((sum, item) => sum + item[valueKey], 0);
    
    return `
        <div class="pie-chart-container">
            <div class="pie-chart-placeholder">Pie Chart Placeholder</div>
            <div class="pie-chart-legend">
                ${data.map((item, index) => `
                    <div class="legend-item">
                        <div class="legend-color color-${index + 1}"></div>
                        <div class="legend-label">${item[labelKey]}</div>
                        <div class="legend-value">${item[valueKey]} (${Math.round(item[valueKey] / total * 100)}%)</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Show/hide content sections
function showContent(section) {
    document.querySelectorAll('.content-section').forEach(div => {
        div.style.display = 'none';
    });
    document.getElementById(`${section}-content`).style.display = 'block';
    
    // Reset any open panels
    document.querySelectorAll('.user-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    
    document.querySelectorAll('.security-panel').forEach(panel => {
        if (panel.id !== 'security-summary') {
            panel.style.display = 'none';
        }
    });
    
    // Load specific content if needed
    if (section === 'users') {
        loadUsers();
    } else if (section === 'reports') {
        loadReports();
    } else if (section === 'security') {
        // Show security summary by default
        document.getElementById('security-summary').style.display = 'block';
        // Generate log summary stats
        if (window.SecurityLogViewer) {
            SecurityLogViewer.generateLogSummary();
        }
    }
}

// Load users for the user management panel
function loadUsers() {
    const users = adminData.users;
    const usersList = document.getElementById('users-list');
    
    usersList.innerHTML = users.map(user => `
        <div class="user-item" data-id="${user.id}" data-role="${user.role}" data-dept="${user.department}">
            <div class="user-info">
                <h3>${user.name}</h3>
                <p>ID: ${user.id}</p>
                <p>Email: ${user.email}</p>
                <p>Role: ${user.role} | Department: ${user.department}</p>
                <p>Status: <span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></p>
            </div>
            <div class="user-actions">
                <button onclick="editUser('${user.id}')">Edit</button>
                <button onclick="toggleUserStatus('${user.id}')">
                    ${user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onclick="resetPassword('${user.id}')">Reset Password</button>
            </div>
        </div>
    `).join('');
}

// Show user management panel
function showUserPanel(panel) {
    document.querySelectorAll('.user-panel').forEach(p => {
        p.style.display = 'none';
    });
    
    document.getElementById(`${panel}-panel`).style.display = 'block';
}

// Search users
function searchUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const roleFilter = document.getElementById('role-filter').value;
    const departmentFilter = document.getElementById('department-filter').value;
    
    const userItems = document.querySelectorAll('.user-item');
    
    userItems.forEach(item => {
        const userContent = item.textContent.toLowerCase();
        const userRole = item.dataset.role;
        const userDept = item.dataset.dept;
        
        const searchMatch = !searchTerm || userContent.includes(searchTerm);
        const roleMatch = !roleFilter || userRole === roleFilter;
        const deptMatch = !departmentFilter || userDept === departmentFilter;
        
        item.style.display = searchMatch && roleMatch && deptMatch ? 'flex' : 'none';
    });
}

// Search users for editing
function searchUsersForEdit() {
    const searchTerm = document.getElementById('modify-search').value.toLowerCase();
    
    if (searchTerm.length < 3) {
        document.getElementById('modify-user-results').innerHTML = 'Type at least 3 characters to search';
        return;
    }
    
    const matchedUsers = adminData.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)
    );
    
    const resultContainer = document.getElementById('modify-user-results');
    
    if (matchedUsers.length === 0) {
        resultContainer.innerHTML = 'No users found';
        return;
    }
    
    resultContainer.innerHTML = matchedUsers.map(user => `
        <div class="search-result-item">
            <div class="user-info-mini">
                <p><strong>${user.name}</strong> (${user.id})</p>
                <p>${user.email} | ${user.role}</p>
            </div>
            <button onclick="loadUserForEdit('${user.id}')">Select</button>
        </div>
    `).join('');
}

// Load user data for editing
function loadUserForEdit(userId) {
    const user = adminData.users.find(u => u.id === userId);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    // Fill the form with user data
    document.getElementById('modify-user-id').value = user.id;
    document.getElementById('modify-user-name').value = user.name;
    document.getElementById('modify-user-email').value = user.email;
    document.getElementById('modify-user-role').value = user.role;
    document.getElementById('modify-user-department').value = user.department;
    document.getElementById('modify-user-status').value = user.status;
    
    // Show the edit form
    document.getElementById('modify-form-container').style.display = 'block';
}

// Add user form submission
function addUser(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById('add-user-name').value;
    const email = document.getElementById('add-user-email').value;
    const role = document.getElementById('add-user-role').value;
    const department = document.getElementById('add-user-department').value;
    
    // Validation
    if (!name || !email || !role || !department) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real app, this would send data to an API
    alert(`User ${name} would be added with role ${role} in ${department} department.`);
    
    // Reset form
    document.getElementById('add-user-form').reset();
}

// Remove user form submission
function removeUser(event) {
    event.preventDefault();
    
    // Get form data
    const userId = document.getElementById('remove-user-id').value;
    const confirmUserId = document.getElementById('confirm-user-id').value;
    
    // Validation
    if (!userId || !confirmUserId) {
        alert('Please fill in all fields');
        return;
    }
    
    if (userId !== confirmUserId) {
        alert('User IDs do not match');
        return;
    }
    
    // In a real app, this would send data to an API
    alert(`User with ID ${userId} would be removed.`);
    
    // Reset form
    document.getElementById('remove-user-form').reset();
}

// Modify user form submission
function modifyUser(event) {
    event.preventDefault();
    
    // Get form data
    const userId = document.getElementById('modify-user-id').value;
    const name = document.getElementById('modify-user-name').value;
    const email = document.getElementById('modify-user-email').value;
    const role = document.getElementById('modify-user-role').value;
    const department = document.getElementById('modify-user-department').value;
    const status = document.getElementById('modify-user-status').value;
    
    // Validation
    if (!userId || !name || !email || !role || !department || !status) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real app, this would send data to an API
    alert(`User ${name} (${userId}) would be updated.`);
    
    // Reset form and hide it
    document.getElementById('modify-user-form').reset();
    document.getElementById('modify-form-container').style.display = 'none';
}

// Toggle user status (activate/deactivate)
function toggleUserStatus(userId) {
    const user = adminData.users.find(u => u.id === userId);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    const action = newStatus === 'Active' ? 'activate' : 'deactivate';
    
    // In a real app, this would send data to an API
    alert(`User ${user.name} (${userId}) would be ${action}d.`);
    
    // Reload user list to reflect changes (in a real app, this would update the UI directly)
    loadUsers();
}

// Reset user password
function resetPassword(userId) {
    const user = adminData.users.find(u => u.id === userId);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    // In a real app, this would send data to an API
    alert(`Password reset link would be sent to ${user.email}.`);
}

// Edit user details
function editUser(userId) {
    showUserPanel('modify-user');
    loadUserForEdit(userId);
}

// Load reports
function loadReports() {
    // First initialize the system analytics if available
    if (window.systemAnalytics) {
        window.systemAnalytics.init()
            .then(() => {
                // By default, show the analytics dashboard
                showAnalyticsDashboard();
            })
            .catch(error => {
                console.error('Error initializing analytics:', error);
                showLegacyReports();
            });
    } else {
        // Fall back to legacy reports if analytics not available
        showLegacyReports();
    }
}

// Show legacy report selection UI
function showLegacyReports() {
    const reportsContainer = document.getElementById('reports-container');
    
    reportsContainer.innerHTML = `
        <div class="reports-grid">
            <div class="report-card">
                <h3>Enrollment Report</h3>
                <p>Overview of current enrollment statistics</p>
                <button onclick="generateReport('enrollment')">Generate</button>
            </div>
            <div class="report-card">
                <h3>Department Summary</h3>
                <p>Overview of departments and their statistics</p>
                <button onclick="generateReport('department')">Generate</button>
            </div>
            <div class="report-card">
                <h3>User Activity Report</h3>
                <p>Summary of user activity and logins</p>
                <button onclick="generateReport('user-activity')">Generate</button>
            </div>
            <div class="report-card">
                <h3>Financial Report</h3>
                <p>Summary of financial status and payments</p>
                <button onclick="generateReport('financial')">Generate</button>
            </div>
        </div>
        <div id="report-preview"></div>
    `;
}

// Show analytics dashboard
function showAnalyticsDashboard() {
    // Update the report type dropdown if it exists
    const reportTypeSelect = document.getElementById('report-type');
    if (reportTypeSelect) {
        reportTypeSelect.value = 'analytics-dashboard';
    }
    
    // Render the analytics dashboard
    if (window.systemAnalytics) {
        window.systemAnalytics.generateDashboard('reports-container');
    } else {
        const reportsContainer = document.getElementById('reports-container');
        reportsContainer.innerHTML = '<div class="error-message">Analytics module is not available</div>';
    }
}

// Switch between different report types
function switchReportType() {
    const reportType = document.getElementById('report-type').value;
    
    // Clear the container
    const reportsContainer = document.getElementById('reports-container');
    reportsContainer.innerHTML = '<div class="loading">Loading report...</div>';
    
    // Show the selected report type
    switch (reportType) {
        case 'analytics-dashboard':
            showAnalyticsDashboard();
            break;
        case 'enrollment-report':
            generateReport('enrollment');
            break;
        case 'financial-report':
            generateReport('financial');
            break;
        case 'academic-report':
            generateReport('department');
            break;
        case 'user-report':
            generateReport('user-activity');
            break;
        default:
            reportsContainer.innerHTML = '<div class="error-message">Unknown report type</div>';
    }
}

// Generate selected report based on filters
function generateSelectedReport() {
    const reportType = document.getElementById('report-type').value;
    const dateRange = document.getElementById('date-range').value;
    
    // For analytics dashboard, refresh data
    if (reportType === 'analytics-dashboard' && window.systemAnalytics) {
        window.systemAnalytics.refreshData();
        return;
    }
    
    // For other reports, generate with selected date range
    const reportTypeMapping = {
        'enrollment-report': 'enrollment',
        'financial-report': 'financial',
        'academic-report': 'department',
        'user-report': 'user-activity'
    };
    
    // Generate report with date range
    generateReport(reportTypeMapping[reportType], dateRange);
}

// Export current report
function exportCurrentReport() {
    const reportType = document.getElementById('report-type').value;
    
    if (reportType === 'analytics-dashboard' && window.systemAnalytics) {
        // Use analytics export function
        window.systemAnalytics.exportToPDF();
    } else {
        // Use legacy export function
        const reportTypeMapping = {
            'enrollment-report': 'enrollment',
            'financial-report': 'financial',
            'academic-report': 'department',
            'user-report': 'user-activity'
        };
        downloadReport(reportTypeMapping[reportType]);
    }
}

// Generate report
function generateReport(type, dateRange = 'current') {
    const reportPreview = document.getElementById('reports-container');
    
    // Show loading indicator
    reportPreview.innerHTML = '<div class="loading">Generating report...</div>';
    
    // Simulate report generation delay
    setTimeout(() => {
        let reportContent = '';
        
        // Generate different reports based on type
        switch (type) {
            case 'enrollment':
                reportContent = generateEnrollmentReport(dateRange);
                break;
            case 'department':
                reportContent = generateDepartmentReport(dateRange);
                break;
            case 'user-activity':
                reportContent = generateUserActivityReport(dateRange);
                break;
            case 'financial':
                reportContent = generateFinancialReport(dateRange);
                break;
            default:
                reportContent = '<p>Unknown report type</p>';
        }
        
        // Display report
        reportPreview.innerHTML = `
            <div class="report-header">
                <h2>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h2>
                <p>Time Period: ${getDateRangeLabel(dateRange)}</p>
                <div class="report-actions">
                    <button onclick="printReport()">Print</button>
                    <button onclick="downloadReport('${type}')">Download</button>
                </div>
            </div>
            <div class="report-content">
                ${reportContent}
            </div>
        `;
    }, 1000);
}

// Get human-readable date range label
function getDateRangeLabel(dateRange) {
    switch (dateRange) {
        case 'current':
            return 'Current Semester';
        case 'previous':
            return 'Previous Semester';
        case 'year':
            return 'Current Academic Year';
        case 'custom':
            return 'Custom Range';
        default:
            return dateRange;
    }
}

// Generate enrollment report content
function generateEnrollmentReport(dateRange) {
    const stats = adminData.enrollmentStats;
    
    return `
        <div class="enrollment-report">
            <h3>Academic Year: ${stats.academicYear}, ${stats.currentSemester}</h3>
            <p>Total Enrollments: ${stats.totalEnrollments}</p>
            
            <h4>Enrollment by Department</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Enrolled Students</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.byDepartment.map(item => `
                        <tr>
                            <td>${item.department}</td>
                            <td>${item.count}</td>
                            <td>${(item.count / stats.totalEnrollments * 100).toFixed(2)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h4>Enrollment by Year Level</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Year Level</th>
                        <th>Enrolled Students</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.byYearLevel.map(item => `
                        <tr>
                            <td>Year ${item.yearLevel}</td>
                            <td>${item.count}</td>
                            <td>${(item.count / stats.totalEnrollments * 100).toFixed(2)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h4>Enrollment Status</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.byStatus.map(item => `
                        <tr>
                            <td>${item.status}</td>
                            <td>${item.count}</td>
                            <td>${(item.count / stats.totalEnrollments * 100).toFixed(2)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h4>Payment Status</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.byPaymentStatus.map(item => `
                        <tr>
                            <td>${item.status}</td>
                            <td>${item.count}</td>
                            <td>${(item.count / stats.totalEnrollments * 100).toFixed(2)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generate department report content
function generateDepartmentReport(dateRange) {
    const departments = adminData.departments;
    
    return `
        <div class="department-report">
            <h3>Department Summary</h3>
            <p>Total Departments: ${departments.length}</p>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Department Head</th>
                        <th>Students</th>
                        <th>Teachers</th>
                        <th>Subjects</th>
                    </tr>
                </thead>
                <tbody>
                    ${departments.map(dept => `
                        <tr>
                            <td>${dept.code}</td>
                            <td>${dept.name}</td>
                            <td>${dept.head}</td>
                            <td>${dept.students}</td>
                            <td>${dept.teachers}</td>
                            <td>${dept.subjects}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generate user activity report content
function generateUserActivityReport(dateRange) {
    // This is a placeholder, in a real app this would fetch from an API
    return `
        <div class="user-activity-report">
            <h3>User Activity Summary</h3>
            <p>This report shows user activity statistics.</p>
            <p>This is a placeholder. In a production environment, this would display real user activity data.</p>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>User Type</th>
                        <th>Total Users</th>
                        <th>Active Users</th>
                        <th>Logged in Last 24h</th>
                        <th>Logged in Last Week</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Administrators</td>
                        <td>5</td>
                        <td>5</td>
                        <td>3</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>Teachers</td>
                        <td>125</td>
                        <td>120</td>
                        <td>85</td>
                        <td>110</td>
                    </tr>
                    <tr>
                        <td>Students</td>
                        <td>2450</td>
                        <td>2400</td>
                        <td>1800</td>
                        <td>2200</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Generate financial report content
function generateFinancialReport(dateRange) {
    // This is a placeholder, in a real app this would fetch from an API
    return `
        <div class="financial-report">
            <h3>Financial Summary</h3>
            <p>This report shows financial statistics for the current academic year.</p>
            <p>This is a placeholder. In a production environment, this would display real financial data.</p>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Expected</th>
                        <th>Received</th>
                        <th>Outstanding</th>
                        <th>Percentage Collected</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tuition Fees</td>
                        <td>₱50,000,000</td>
                        <td>₱40,000,000</td>
                        <td>₱10,000,000</td>
                        <td>80%</td>
                    </tr>
                    <tr>
                        <td>Miscellaneous Fees</td>
                        <td>₱15,000,000</td>
                        <td>₱12,000,000</td>
                        <td>₱3,000,000</td>
                        <td>80%</td>
                    </tr>
                    <tr>
                        <td>Laboratory Fees</td>
                        <td>₱8,000,000</td>
                        <td>₱6,400,000</td>
                        <td>₱1,600,000</td>
                        <td>80%</td>
                    </tr>
                    <tr>
                        <td>Other Fees</td>
                        <td>₱5,000,000</td>
                        <td>₱4,000,000</td>
                        <td>₱1,000,000</td>
                        <td>80%</td>
                    </tr>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>₱78,000,000</strong></td>
                        <td><strong>₱62,400,000</strong></td>
                        <td><strong>₱15,600,000</strong></td>
                        <td><strong>80%</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Print report
function printReport() {
    window.print();
}

// Download report
function downloadReport(type) {
    alert(`Downloading ${type} report... This feature will be fully implemented in the next version.`);
}

// Format date helper
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Logout function
function logout() {
    // Use the session manager to log out if available
    if (window.SessionManager) {
        SessionManager.logoutUser('You have been logged out successfully.');
        return false; // Prevent default link behavior since we're handling the redirect
    }
    
    // Fallback if session manager is not available
    console.log('Logging out...');
    return true; // Allow the link to proceed to login page
}

// Show security panel
function showSecurityPanel(panel) {
    // Hide all security panels
    document.querySelectorAll('.security-panel').forEach(div => {
        div.style.display = 'none';
    });
    
    // Show the selected panel
    document.getElementById(`${panel}-panel`).style.display = 'block';
    
    // Load data based on the panel
    if (panel === 'security-logs') {
        if (window.SecurityLogViewer) {
            SecurityLogViewer.loadSecurityLogs();
        }
    } else if (panel === 'access-logs') {
        if (window.SecurityLogViewer) {
            SecurityLogViewer.loadAccessLogs();
        }
    } else if (panel === 'security-summary') {
        if (window.SecurityLogViewer) {
            SecurityLogViewer.generateLogSummary();
        }
    }
}

// Load security settings
function loadSecuritySettings() {
    // Get security settings from localStorage or use defaults
    const securitySettings = JSON.parse(localStorage.getItem('securitySettings')) || {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordRequirements: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecial: true
        },
        require2FA: false
    };
    
    // Fill the form with current settings
    const securityForm = document.getElementById('security-settings-form');
    if (securityForm) {
        // Update form values if elements exist
        const sessionTimeout = document.getElementById('session-timeout');
        if (sessionTimeout) sessionTimeout.value = securitySettings.sessionTimeout;
        
        const maxLoginAttempts = document.getElementById('max-login-attempts');
        if (maxLoginAttempts) maxLoginAttempts.value = securitySettings.maxLoginAttempts;
        
        const minPasswordLength = document.getElementById('min-password-length');
        if (minPasswordLength) minPasswordLength.value = securitySettings.passwordRequirements.minLength;
        
        const requireUppercase = document.getElementById('require-uppercase');
        if (requireUppercase) requireUppercase.checked = securitySettings.passwordRequirements.requireUppercase;
        
        const requireLowercase = document.getElementById('require-lowercase');
        if (requireLowercase) requireLowercase.checked = securitySettings.passwordRequirements.requireLowercase;
        
        const requireNumbers = document.getElementById('require-numbers');
        if (requireNumbers) requireNumbers.checked = securitySettings.passwordRequirements.requireNumbers;
        
        const requireSpecial = document.getElementById('require-special');
        if (requireSpecial) requireSpecial.checked = securitySettings.passwordRequirements.requireSpecial;
        
        const require2FA = document.getElementById('require-2fa');
        if (require2FA) require2FA.checked = securitySettings.require2FA;
    }
}

// Save security settings
function saveSecuritySettings(event) {
    if (event) event.preventDefault();
    
    // Gather settings from the form
    const securitySettings = {
        sessionTimeout: parseInt(document.getElementById('session-timeout').value) || 30,
        maxLoginAttempts: parseInt(document.getElementById('max-login-attempts').value) || 5,
        passwordRequirements: {
            minLength: parseInt(document.getElementById('min-password-length').value) || 8,
            requireUppercase: document.getElementById('require-uppercase').checked,
            requireLowercase: document.getElementById('require-lowercase').checked,
            requireNumbers: document.getElementById('require-numbers').checked,
            requireSpecial: document.getElementById('require-special').checked
        },
        require2FA: document.getElementById('require-2fa').checked
    };
    
    // Save settings to localStorage
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    
    // Update security module config if available
    if (window.SecurityModule) {
        // Use securitySettings to update the module's configuration
        // This would normally update server-side settings as well
        console.log('Security settings updated:', securitySettings);
    }
    
    // Show confirmation message
    alert('Security settings have been saved.');
    
    // Log this action
    if (window.SecurityModule) {
        SecurityModule.logSecurityEvent('admin-001', 'security_settings_updated', securitySettings, true);
    }
    
    // Return to summary view
    showSecurityPanel('security-summary');
}
