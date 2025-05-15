/**
 * Monitoring Dashboard JavaScript
 * Handles real-time monitoring and metrics visualization
 */

// Global chart objects
let memoryChart, cpuChart, responseTimeChart, requestVolumeChart, studentAnalyticsChart;
let refreshInterval;
const API_BASE_URL = '/api';

// Configuration
const config = {
    refreshInterval: 30000, // 30 seconds
    chartTimespan: 60 * 60 * 1000, // 1 hour in milliseconds
    slowEndpointThreshold: 500, // ms
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
    
    // Set up event listeners
    document.getElementById('refreshHealthBtn').addEventListener('click', fetchHealthStatus);
    document.getElementById('yearlyBtn').addEventListener('click', () => updateStudentAnalytics('yearly'));
    document.getElementById('departmentBtn').addEventListener('click', () => updateStudentAnalytics('department'));
    document.getElementById('slowEndpointsOnly').addEventListener('change', filterEndpointsTable);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

/**
 * Initialize the dashboard components
 */
function initDashboard() {
    // Initialize charts
    initCharts();
    
    // Fetch initial data
    fetchHealthStatus();
    fetchMetricsData();
    fetchErrorLogs();
    fetchEndpointPerformance();
    fetchStudentAnalytics('department');
    
    // Set up automatic refresh
    refreshInterval = setInterval(() => {
        fetchHealthStatus();
        fetchMetricsData();
    }, config.refreshInterval);
    
    console.log('Monitoring dashboard initialized');
}

/**
 * Initialize chart components
 */
function initCharts() {
    // Memory usage chart
    const memoryCtx = document.getElementById('memoryChart').getContext('2d');
    memoryChart = new Chart(memoryCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Heap Used (MB)',
                    data: [],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Heap Total (MB)',
                    data: [],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Memory (MB)'
                    }
                }
            }
        }
    });
    
    // CPU load chart
    const cpuCtx = document.getElementById('cpuChart').getContext('2d');
    cpuChart = new Chart(cpuCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CPU Load Average',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Load Average'
                    }
                }
            }
        }
    });
    
    // Response time chart
    const responseTimeCtx = document.getElementById('responseTimeChart').getContext('2d');
    responseTimeChart = new Chart(responseTimeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Average Response Time (ms)',
                data: [],
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Response Time (ms)'
                    }
                }
            }
        }
    });
    
    // Request volume chart
    const requestVolumeCtx = document.getElementById('requestVolumeChart').getContext('2d');
    requestVolumeChart = new Chart(requestVolumeCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Successful Requests',
                    data: [],
                    backgroundColor: 'rgba(40, 167, 69, 0.5)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Error Requests',
                    data: [],
                    backgroundColor: 'rgba(220, 53, 69, 0.5)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Request Count'
                    }
                }
            }
        }
    });
    
    // Student analytics chart
    const studentAnalyticsCtx = document.getElementById('studentAnalyticsChart').getContext('2d');
    studentAnalyticsChart = new Chart(studentAnalyticsCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Students',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                }
            }
        }
    });
}

/**
 * Fetch health status from API
 */
function fetchHealthStatus() {
    showLoading('systemStatusBadge');
    
    fetch(`${API_BASE_URL}/monitoring/health`)
        .then(response => response.json())
        .then(data => {
            updateHealthStatus(data);
            document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        })
        .catch(error => {
            console.error('Error fetching health status:', error);
            setSystemStatusUnhealthy();
        });
}

/**
 * Update health status UI components
 * @param {Object} healthData - Health check data from API
 */
function updateHealthStatus(healthData) {
    // Update system status badge
    const statusBadge = document.getElementById('systemStatusBadge');
    statusBadge.textContent = healthData.status.charAt(0).toUpperCase() + healthData.status.slice(1);
    statusBadge.className = `badge badge-${healthData.status}`;
    
    // Update individual health check cards
    healthData.checks.forEach(check => {
        const cardElement = document.getElementById(`${check.name}Status`);
        if (!cardElement) return;
        
        // Clear the loading spinner
        cardElement.querySelector('.status-indicator').innerHTML = '';
        
        // Set the status class
        cardElement.className = 'health-check-card';
        cardElement.classList.add(`status-${check.status}`);
        
        // Add the status icon
        const statusIndicator = cardElement.querySelector('.status-indicator');
        let statusIcon = '';
        
        if (check.status === 'pass') {
            statusIcon = '<i class="fas fa-check-circle"></i>';
        } else if (check.status === 'warn') {
            statusIcon = '<i class="fas fa-exclamation-triangle"></i>';
        } else {
            statusIcon = '<i class="fas fa-times-circle"></i>';
        }
        
        statusIndicator.innerHTML = statusIcon;
        
        // Update details
        const detailsElement = cardElement.querySelector('.status-details');
        
        switch (check.name) {
            case 'memory':
                detailsElement.innerHTML = `
                    <div>Used: ${check.details.used} ${check.details.unit}</div>
                    <div>Total: ${check.details.total} ${check.details.unit}</div>
                `;
                break;
                
            case 'cpu':
                detailsElement.innerHTML = `
                    <div>Load Avg: ${check.details.loadAvg[0].toFixed(2)}</div>
                    <div>Cores: ${check.details.cores}</div>
                `;
                break;
                
            case 'responseTime':
                detailsElement.innerHTML = `
                    <div>Avg: ${check.details.avg} ${check.details.unit}</div>
                    <div>Max: ${check.details.max} ${check.details.unit}</div>
                `;
                break;
                
            case 'errorRate':
                detailsElement.innerHTML = `
                    <div>Rate: ${(check.details.rate * 100).toFixed(2)}%</div>
                    <div>Errors: ${check.details.errors}/${check.details.total}</div>
                `;
                break;
        }
    });
}

/**
 * Set system status to unhealthy (used when API is unreachable)
 */
function setSystemStatusUnhealthy() {
    const statusBadge = document.getElementById('systemStatusBadge');
    statusBadge.textContent = 'Unhealthy';
    statusBadge.className = 'badge badge-unhealthy';
    
    document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()} (Error)`;
    
    // Update health check cards to indicate failure
    const healthChecks = ['memory', 'cpu', 'responseTime', 'errorRate'];
    
    healthChecks.forEach(check => {
        const cardElement = document.getElementById(`${check}Status`);
        if (!cardElement) return;
        
        cardElement.className = 'health-check-card status-fail';
        cardElement.querySelector('.status-indicator').innerHTML = '<i class="fas fa-times-circle"></i>';
        cardElement.querySelector('.status-details').innerHTML = '<div>Unable to fetch data</div>';
    });
}

/**
 * Fetch metrics data for charts
 */
function fetchMetricsData() {
    fetch(`${API_BASE_URL}/monitoring/metrics`)
        .then(response => response.json())
        .then(data => {
            updateMetricsCharts(data);
        })
        .catch(error => {
            console.error('Error fetching metrics data:', error);
        });
}

/**
 * Update charts with metrics data
 * @param {Object} metricsData - Metrics data from API
 */
function updateMetricsCharts(metricsData) {
    // Update memory chart
    if (metricsData.performance.memory.history.length > 0) {
        const memoryLabels = metricsData.performance.memory.history.map(item => 
            new Date(item.timestamp).toLocaleTimeString()
        );
        const heapUsedData = metricsData.performance.memory.history.map(item => item.heapUsed);
        const heapTotalData = metricsData.performance.memory.history.map(item => item.heapTotal);
        
        memoryChart.data.labels = memoryLabels;
        memoryChart.data.datasets[0].data = heapUsedData;
        memoryChart.data.datasets[1].data = heapTotalData;
        memoryChart.update();
    }
    
    // Update CPU chart
    if (metricsData.performance.cpu.history.length > 0) {
        const cpuLabels = metricsData.performance.cpu.history.map(item => 
            new Date(item.timestamp).toLocaleTimeString()
        );
        const cpuData = metricsData.performance.cpu.history.map(item => item.loadAvg[0]);
        
        cpuChart.data.labels = cpuLabels;
        cpuChart.data.datasets[0].data = cpuData;
        cpuChart.update();
    }
    
    // Update response time chart
    if (metricsData.performance.responseTime.samples.length > 0) {
        // Create timestamps (we don't have actual timestamps for samples, so we'll create them)
        const now = Date.now();
        const sampleCount = metricsData.performance.responseTime.samples.length;
        const timeStep = config.chartTimespan / sampleCount;
        
        const responseTimeLabels = Array.from({ length: sampleCount }, (_, i) => 
            new Date(now - (sampleCount - i - 1) * timeStep).toLocaleTimeString()
        );
        
        responseTimeChart.data.labels = responseTimeLabels;
        responseTimeChart.data.datasets[0].data = metricsData.performance.responseTime.samples;
        responseTimeChart.update();
    }
    
    // Update request volume chart
    // For request volume, we'll create 6 time buckets over the last hour
    const timeLabels = [];
    const successData = [];
    const errorData = [];
    
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const time = new Date(now);
        time.setMinutes(now.getMinutes() - i * 10);
        timeLabels.push(time.toLocaleTimeString());
        
        // Simulate data - in a real app, this would come from the API
        successData.push(Math.floor(Math.random() * 100) + 50);
        errorData.push(Math.floor(Math.random() * 10));
    }
    
    requestVolumeChart.data.labels = timeLabels;
    requestVolumeChart.data.datasets[0].data = successData;
    requestVolumeChart.data.datasets[1].data = errorData;
    requestVolumeChart.update();
}

/**
 * Fetch error logs
 */
function fetchErrorLogs() {
    showElement('loadingErrors');
    hideElement('noErrorsMessage');
    
    // In a real app, this would call an API endpoint
    // Simulating error logs for demonstration
    setTimeout(() => {
        hideElement('loadingErrors');
        
        const errorLogs = [
            {
                time: '2025-05-09 12:45:23',
                type: 'ValidationError',
                message: 'Invalid student ID format',
                endpoint: '/api/students',
                status: 400
            },
            {
                time: '2025-05-09 12:32:10',
                type: 'AuthenticationError',
                message: 'Invalid token',
                endpoint: '/api/auth/me',
                status: 401
            },
            {
                time: '2025-05-09 11:55:38',
                type: 'DatabaseError',
                message: 'Connection timeout',
                endpoint: '/api/departments',
                status: 500
            }
        ];
        
        const tbody = document.querySelector('#errorsTable tbody');
        tbody.innerHTML = '';
        
        if (errorLogs.length === 0) {
            showElement('noErrorsMessage');
        } else {
            errorLogs.forEach(error => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${error.time}</td>
                    <td><span class="badge bg-danger">${error.type}</span></td>
                    <td>${error.message}</td>
                    <td><code>${error.endpoint}</code></td>
                    <td>${error.status}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }, 1000);
}

/**
 * Fetch endpoint performance data
 */
function fetchEndpointPerformance() {
    showElement('loadingEndpoints');
    
    // In a real app, this would call an API endpoint
    // Simulating endpoint performance data for demonstration
    setTimeout(() => {
        hideElement('loadingEndpoints');
        
        const endpoints = [
            {
                path: '/api/students',
                method: 'GET',
                hits: 1245,
                avgResponseTime: 120,
                successRate: 0.99
            },
            {
                path: '/api/students',
                method: 'POST',
                hits: 342,
                avgResponseTime: 350,
                successRate: 0.95
            },
            {
                path: '/api/courses',
                method: 'GET',
                hits: 890,
                avgResponseTime: 95,
                successRate: 0.995
            },
            {
                path: '/api/grades',
                method: 'GET',
                hits: 765,
                avgResponseTime: 210,
                successRate: 0.98
            },
            {
                path: '/api/departments',
                method: 'GET',
                hits: 432,
                avgResponseTime: 85,
                successRate: 1.0
            },
            {
                path: '/api/auth/login',
                method: 'POST',
                hits: 256,
                avgResponseTime: 180,
                successRate: 0.92
            },
            {
                path: '/api/reports/academic',
                method: 'GET',
                hits: 122,
                avgResponseTime: 850,
                successRate: 0.88
            }
        ];
        
        renderEndpointsTable(endpoints);
    }, 1000);
}

/**
 * Render endpoints table
 * @param {Array} endpoints - Endpoint performance data
 */
function renderEndpointsTable(endpoints) {
    const tbody = document.querySelector('#endpointsTable tbody');
    tbody.innerHTML = '';
    
    endpoints.forEach(endpoint => {
        const row = document.createElement('tr');
        
        // Add class for slow endpoints
        if (endpoint.avgResponseTime > config.slowEndpointThreshold) {
            row.classList.add('endpoint-slow');
        }
        
        // Add class for endpoints with low success rate
        if (endpoint.successRate < 0.9) {
            row.classList.add('endpoint-error');
        }
        
        // Determine status
        let status;
        if (endpoint.successRate >= 0.95 && endpoint.avgResponseTime <= config.slowEndpointThreshold) {
            status = '<span class="badge bg-success">Good</span>';
        } else if (endpoint.successRate >= 0.9 && endpoint.avgResponseTime <= config.slowEndpointThreshold * 1.5) {
            status = '<span class="badge bg-warning">Fair</span>';
        } else {
            status = '<span class="badge bg-danger">Poor</span>';
        }
        
        row.innerHTML = `
            <td><code>${endpoint.path}</code></td>
            <td>${endpoint.method}</td>
            <td>${endpoint.hits.toLocaleString()}</td>
            <td>${endpoint.avgResponseTime.toFixed(0)} ms</td>
            <td>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar ${getProgressBarClass(endpoint.successRate)}" 
                         role="progressbar" 
                         style="width: ${(endpoint.successRate * 100).toFixed(1)}%;" 
                         aria-valuenow="${(endpoint.successRate * 100).toFixed(1)}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
                <small>${(endpoint.successRate * 100).toFixed(1)}%</small>
            </td>
            <td>${status}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Apply slow endpoints filter if checked
    filterEndpointsTable();
}

/**
 * Get appropriate progress bar class based on success rate
 * @param {number} rate - Success rate (0-1)
 * @returns {string} - CSS class for progress bar
 */
function getProgressBarClass(rate) {
    if (rate >= 0.95) return 'progress-bar-success';
    if (rate >= 0.9) return 'progress-bar-warning';
    return 'progress-bar-danger';
}

/**
 * Filter endpoints table to show only slow endpoints if checkbox is checked
 */
function filterEndpointsTable() {
    const showOnlySlow = document.getElementById('slowEndpointsOnly').checked;
    const rows = document.querySelectorAll('#endpointsTable tbody tr');
    
    rows.forEach(row => {
        if (showOnlySlow && !row.classList.contains('endpoint-slow') && !row.classList.contains('endpoint-error')) {
            row.style.display = 'none';
        } else {
            row.style.display = '';
        }
    });
}

/**
 * Fetch and update student analytics
 * @param {string} type - Type of analytics ('yearly' or 'department')
 */
function updateStudentAnalytics(type) {
    // Update active button
    document.getElementById('yearlyBtn').classList.toggle('active', type === 'yearly');
    document.getElementById('departmentBtn').classList.toggle('active', type === 'department');
    
    // Simulated data for student analytics
    let labels, data;
    
    if (type === 'yearly') {
        // For yearly data, we show students by enrollment year
        // Based on the m[YY] format in student IDs
        labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
        data = [125, 143, 168, 192, 210, 178];
    } else {
        // For department data, we show students by department
        labels = ['Computer Science', 'Business Administration', 'Engineering', 'Education', 'Nursing', 'Fine Arts'];
        data = [320, 280, 245, 190, 160, 80];
    }
    
    // Update chart
    studentAnalyticsChart.data.labels = labels;
    studentAnalyticsChart.data.datasets[0].data = data;
    studentAnalyticsChart.options.scales.x.title.text = type === 'yearly' ? 'Enrollment Year' : 'Department';
    studentAnalyticsChart.update();
}

/**
 * Handle logout button click
 */
function handleLogout() {
    // In a real app, this would call the logout API endpoint
    window.location.href = 'login.html';
}

/**
 * Helper function to show loading state
 * @param {string} elementId - ID of element to update
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    }
}

/**
 * Helper function to show an element
 * @param {string} elementId - ID of element to show
 */
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('d-none');
    }
}

/**
 * Helper function to hide an element
 * @param {string} elementId - ID of element to hide
 */
function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('d-none');
    }
}

// Clean up when page is unloaded
window.addEventListener('beforeunload', function() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});
