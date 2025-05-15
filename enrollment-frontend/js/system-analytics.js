/**
 * System Analytics Module
 * Provides comprehensive analytics and reporting functionality
 */

class SystemAnalytics {
  constructor() {
    this.chartColors = [
      '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', 
      '#5a5c69', '#6610f2', '#fd7e14', '#20c9a6', '#858796'
    ];
    
    this.initialized = false;
    this.chartsInitialized = false;
    this.data = {};
  }

  /**
   * Initialize the analytics module
   * @returns {Promise} - A promise that resolves when initialized
   */
  async init() {
    if (this.initialized) return Promise.resolve();
    
    try {
      // Load required libraries if not already loaded
      await this.loadDependencies();
      
      // Initialize data
      await this.loadData();
      
      this.initialized = true;
      console.log('System Analytics module initialized');
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to initialize System Analytics module:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Load required dependencies
   * @returns {Promise} - A promise that resolves when dependencies are loaded
   */
  async loadDependencies() {
    // Load Chart.js if not already loaded
    if (!window.Chart) {
      await this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js');
    }
    
    return Promise.resolve();
  }

  /**
   * Load a script dynamically
   * @param {string} src - Script source URL
   * @returns {Promise} - A promise that resolves when the script is loaded
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if the script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Load analytics data from the API
   * @returns {Promise} - A promise that resolves when data is loaded
   */
  async loadData() {
    try {
      // In a real application, these would be API calls
      if (window.api) {
        // Try to get data from API
        const [
          enrollmentData,
          academicData,
          userActivityData,
          financialData,
          systemPerformanceData
        ] = await Promise.all([
          this.fetchEnrollmentData(),
          this.fetchAcademicData(),
          this.fetchUserActivityData(),
          this.fetchFinancialData(),
          this.fetchSystemPerformanceData()
        ]);
        
        this.data = {
          enrollment: enrollmentData,
          academic: academicData,
          userActivity: userActivityData,
          financial: financialData,
          systemPerformance: systemPerformanceData
        };
      } else {
        // In development, use mock data
        this.data = this.getMockData();
      }
      
      console.log('Analytics data loaded');
      return Promise.resolve();
    } catch (error) {
      console.error('Error loading analytics data:', error);
      this.data = this.getMockData();
      return Promise.reject(error);
    }
  }

  /**
   * Fetch enrollment data from API
   * @returns {Promise} - A promise that resolves with enrollment data
   */
  async fetchEnrollmentData() {
    // In a real app, this would be an API call
    if (window.api && window.api.getEnrollmentAnalytics) {
      return await window.api.getEnrollmentAnalytics();
    }
    return this.getMockData().enrollment;
  }

  /**
   * Fetch academic data from API
   * @returns {Promise} - A promise that resolves with academic data
   */
  async fetchAcademicData() {
    // In a real app, this would be an API call
    if (window.api && window.api.getAcademicAnalytics) {
      return await window.api.getAcademicAnalytics();
    }
    return this.getMockData().academic;
  }

  /**
   * Fetch user activity data from API
   * @returns {Promise} - A promise that resolves with user activity data
   */
  async fetchUserActivityData() {
    // In a real app, this would be an API call
    if (window.api && window.api.getUserActivityAnalytics) {
      return await window.api.getUserActivityAnalytics();
    }
    return this.getMockData().userActivity;
  }

  /**
   * Fetch financial data from API
   * @returns {Promise} - A promise that resolves with financial data
   */
  async fetchFinancialData() {
    // In a real app, this would be an API call
    if (window.api && window.api.getFinancialAnalytics) {
      return await window.api.getFinancialAnalytics();
    }
    return this.getMockData().financial;
  }

  /**
   * Fetch system performance data from API
   * @returns {Promise} - A promise that resolves with system performance data
   */
  async fetchSystemPerformanceData() {
    // In a real app, this would be an API call
    if (window.api && window.api.getSystemPerformanceAnalytics) {
      return await window.api.getSystemPerformanceAnalytics();
    }
    return this.getMockData().systemPerformance;
  }

  /**
   * Generate mock data for development
   * @returns {Object} - Mock analytics data
   */
  getMockData() {
    const currentYear = new Date().getFullYear();
    const years = [currentYear-2, currentYear-1, currentYear];
    
    const departments = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Medicine'];
    const programs = ['Bachelor', 'Master', 'Doctorate'];
    
    // Generate enrollment data
    const enrollmentData = {
      totalStudents: 5827,
      newEnrollments: 1235,
      trends: years.map(year => ({
        year,
        count: Math.floor(Math.random() * 1500) + 1000
      })),
      byDepartment: departments.map(dept => ({
        name: dept,
        count: Math.floor(Math.random() * 1000) + 500
      })),
      byProgram: programs.map(program => ({
        name: program,
        count: Math.floor(Math.random() * 2000) + 500
      })),
      retention: {
        rate: 88.7,
        byYear: years.map(year => ({
          year,
          rate: Math.floor(Math.random() * 15) + 80
        }))
      },
      demographics: {
        gender: [
          { name: 'Male', count: 3152 },
          { name: 'Female', count: 2660 },
          { name: 'Other', count: 15 }
        ],
        age: [
          { range: '16-20', count: 2341 },
          { range: '21-25', count: 1987 },
          { range: '26-30', count: 825 },
          { range: '31-40', count: 507 },
          { range: '41+', count: 167 }
        ]
      }
    };
    
    // Generate academic data
    const academicData = {
      averageGPA: 3.2,
      gradeTrends: years.map(year => ({
        year,
        gpa: (Math.random() * 1) + 2.5
      })),
      byDepartment: departments.map(dept => ({
        name: dept,
        gpa: (Math.random() * 1) + 2.5
      })),
      courseSuccess: {
        high: [
          { course: 'Introduction to Programming', rate: 92.3 },
          { course: 'Business Ethics', rate: 90.1 },
          { course: 'Art History', rate: 89.7 }
        ],
        low: [
          { course: 'Advanced Calculus', rate: 68.5 },
          { course: 'Quantum Physics', rate: 72.1 },
          { course: 'Organic Chemistry', rate: 74.8 }
        ]
      },
      attendance: {
        overall: 87.5,
        byDepartment: departments.map(dept => ({
          name: dept,
          rate: Math.floor(Math.random() * 20) + 75
        }))
      }
    };
    
    // Generate user activity data
    const userActivityData = {
      activeUsers: {
        daily: 3456,
        weekly: 4832,
        monthly: 5691
      },
      loginTrends: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        count: Math.floor(Math.random() * 3000) + 2000
      })),
      peakHours: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: Math.floor(Math.random() * (i > 8 && i < 20 ? 1000 : 300)) + (i > 8 && i < 20 ? 500 : 50)
      })),
      userTypes: [
        { type: 'Students', count: 4832 },
        { type: 'Teachers', count: 387 },
        { type: 'Admins', count: 25 },
        { type: 'Staff', count: 168 }
      ],
      pageViews: [
        { page: 'Dashboard', views: 42587 },
        { page: 'Grades', views: 38942 },
        { page: 'Schedule', views: 35267 },
        { page: 'Enrollment', views: 21543 },
        { page: 'Financial', views: 19872 }
      ]
    };
    
    // Generate financial data
    const financialData = {
      totalRevenue: 15762354,
      revenueByYear: years.map(year => ({
        year,
        amount: Math.floor(Math.random() * 5000000) + 10000000
      })),
      feeCollection: {
        paid: 12453678,
        pending: 3308676,
        rate: 79
      },
      byDepartment: departments.map(dept => ({
        name: dept,
        revenue: Math.floor(Math.random() * 3000000) + 1000000,
        expenses: Math.floor(Math.random() * 2000000) + 500000
      })),
      scholarships: {
        total: 2543000,
        recipients: 342,
        byType: [
          { type: 'Merit', amount: 1250000 },
          { type: 'Need-based', amount: 854000 },
          { type: 'Sports', amount: 439000 }
        ]
      },
      expenses: [
        { category: 'Salaries', amount: 8765432 },
        { category: 'Infrastructure', amount: 1543000 },
        { category: 'Utilities', amount: 876000 },
        { category: 'Technology', amount: 1235000 },
        { category: 'Miscellaneous', amount: 543000 }
      ]
    };
    
    // Generate system performance data
    const systemPerformanceData = {
      responseTime: {
        avg: 284, // ms
        trends: Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          time: Math.floor(Math.random() * 200) + 200
        }))
      },
      errors: {
        total: 287,
        byType: [
          { type: 'Authentication', count: 98 },
          { type: 'Database', count: 65 },
          { type: 'Validation', count: 86 },
          { type: 'Server', count: 38 }
        ]
      },
      uptime: 99.87,
      apiUsage: {
        total: 8745323,
        byEndpoint: [
          { endpoint: '/api/students', count: 2345678 },
          { endpoint: '/api/grades', count: 1876543 },
          { endpoint: '/api/enrollment', count: 987654 },
          { endpoint: '/api/auth', count: 3456789 },
          { endpoint: '/api/finance', count: 765432 }
        ]
      },
      serverLoad: {
        current: 37, // percent
        trends: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          load: Math.floor(Math.random() * (i > 8 && i < 20 ? 50 : 20)) + (i > 8 && i < 20 ? 30 : 10)
        }))
      }
    };
    
    return {
      enrollment: enrollmentData,
      academic: academicData,
      userActivity: userActivityData,
      financial: financialData,
      systemPerformance: systemPerformanceData
    };
  }

  /**
   * Generate analytics dashboard content
   * @param {string} containerId - ID of the container element 
   * @returns {HTMLElement} - The dashboard element
   */
  generateDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container #${containerId} not found`);
      return null;
    }
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create dashboard layout
    this.createDashboardUI(container);
    
    // Initialize charts
    setTimeout(() => {
      this.initCharts();
    }, 100);
    
    return container;
  }

  /**
   * Create dashboard UI elements
   * @param {HTMLElement} container - Container element
   */
  createDashboardUI(container) {
    // Create dashboard structure
    const dashboard = document.createElement('div');
    dashboard.className = 'analytics-dashboard';
    
    // Create sections for each analytics category
    dashboard.innerHTML = `
      <div class="dashboard-section">
        <h2>System Overview</h2>
        <div class="dashboard-row">
          <div class="dashboard-card">
            <h3>Total Students</h3>
            <div class="dashboard-value">${this.formatNumber(this.data.enrollment.totalStudents)}</div>
            <div class="dashboard-subvalue">
              <span class="dashboard-up">↑</span> ${this.formatNumber(this.data.enrollment.newEnrollments)} new enrollments
            </div>
          </div>
          <div class="dashboard-card">
            <h3>Average GPA</h3>
            <div class="dashboard-value">${this.data.academic.averageGPA.toFixed(1)}</div>
            <div class="dashboard-subvalue">Across all departments</div>
          </div>
          <div class="dashboard-card">
            <h3>Fee Collection Rate</h3>
            <div class="dashboard-value">${this.data.financial.feeCollection.rate}%</div>
            <div class="dashboard-subvalue">
              ${this.formatCurrency(this.data.financial.feeCollection.pending)} pending
            </div>
          </div>
          <div class="dashboard-card">
            <h3>System Uptime</h3>
            <div class="dashboard-value">${this.data.systemPerformance.uptime}%</div>
            <div class="dashboard-subvalue">
              ${this.data.systemPerformance.errors.total} errors this month
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <h2>Enrollment Analytics</h2>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Enrollment Trends</h3>
            <canvas id="enrollment-trends-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Department Distribution</h3>
            <canvas id="department-distribution-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Program Distribution</h3>
            <canvas id="program-distribution-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Retention Rate Trends</h3>
            <canvas id="retention-trend-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Gender Demographics</h3>
            <canvas id="gender-demographics-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Age Distribution</h3>
            <canvas id="age-distribution-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <h2>Academic Performance</h2>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>GPA Trends by Year</h3>
            <canvas id="gpa-trends-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>GPA by Department</h3>
            <canvas id="gpa-department-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Top Performing Courses</h3>
            <canvas id="top-courses-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Attendance Rate by Department</h3>
            <canvas id="attendance-department-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <h2>User Activity Analytics</h2>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Weekly Login Trends</h3>
            <canvas id="weekly-login-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Daily Peak Hours</h3>
            <canvas id="peak-hours-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>User Type Distribution</h3>
            <canvas id="user-type-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Top Pages</h3>
            <canvas id="top-pages-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <h2>Financial Analytics</h2>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Revenue Trends</h3>
            <canvas id="revenue-trends-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Fee Collection Status</h3>
            <canvas id="fee-collection-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Department Revenue & Expenses</h3>
            <canvas id="department-finance-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Expense Distribution</h3>
            <canvas id="expense-distribution-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Scholarship Distribution</h3>
            <canvas id="scholarship-distribution-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <h2>System Performance</h2>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>Response Time Trends</h3>
            <canvas id="response-time-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Error Distribution</h3>
            <canvas id="error-distribution-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-row">
          <div class="dashboard-chart-container half">
            <h3>API Usage</h3>
            <canvas id="api-usage-chart"></canvas>
          </div>
          <div class="dashboard-chart-container half">
            <h3>Server Load</h3>
            <canvas id="server-load-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <h2>Export Options</h2>
        <div class="dashboard-actions">
          <button id="export-pdf" class="dashboard-btn">Export as PDF</button>
          <button id="export-csv" class="dashboard-btn">Export Data as CSV</button>
          <button id="print-dashboard" class="dashboard-btn">Print Dashboard</button>
          <button id="refresh-data" class="dashboard-btn">Refresh Data</button>
        </div>
      </div>
    `;
    
    container.appendChild(dashboard);
    
    // Add event listeners to buttons
    document.getElementById('export-pdf')?.addEventListener('click', () => this.exportToPDF());
    document.getElementById('export-csv')?.addEventListener('click', () => this.exportToCSV());
    document.getElementById('print-dashboard')?.addEventListener('click', () => this.printDashboard());
    document.getElementById('refresh-data')?.addEventListener('click', () => this.refreshData());
  }

  /**
   * Initialize all charts
   */
  initCharts() {
    if (this.chartsInitialized) return;
    
    // Enrollment charts
    this.createEnrollmentTrendsChart();
    this.createDepartmentDistributionChart();
    this.createProgramDistributionChart();
    this.createRetentionTrendChart();
    this.createGenderDemographicsChart();
    this.createAgeDistributionChart();
    
    // Academic charts
    this.createGPATrendsChart();
    this.createGPADepartmentChart();
    this.createTopCoursesChart();
    this.createAttendanceDepartmentChart();
    
    // User activity charts
    this.createWeeklyLoginChart();
    this.createPeakHoursChart();
    this.createUserTypeChart();
    this.createTopPagesChart();
    
    // Financial charts
    this.createRevenueTrendsChart();
    this.createFeeCollectionChart();
    this.createDepartmentFinanceChart();
    this.createExpenseDistributionChart();
    this.createScholarshipDistributionChart();
    
    // System performance charts
    this.createResponseTimeChart();
    this.createErrorDistributionChart();
    this.createApiUsageChart();
    this.createServerLoadChart();
    
    this.chartsInitialized = true;
  }

  /**
   * Create enrollment trends chart
   */
  createEnrollmentTrendsChart() {
    const ctx = document.getElementById('enrollment-trends-chart');
    if (!ctx) return;
    
    const data = this.data.enrollment.trends;
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.year),
        datasets: [{
          label: 'Enrollments',
          data: data.map(item => item.count),
          backgroundColor: this.chartColors[0],
          borderColor: this.chartColors[0],
          tension: 0.2,
          fill: false
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
            callbacks: {
              label: (context) => `Enrollments: ${this.formatNumber(context.raw)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Students'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          }
        }
      }
    });
  }

  /**
   * Format number with thousands separator
   * @param {number} num - Number to format
   * @returns {string} - Formatted number
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * Format currency value
   * @param {number} amount - Amount to format
   * @returns {string} - Formatted currency
   */
  formatCurrency(amount) {
    return '$' + this.formatNumber(amount);
  }

  /**
   * Export dashboard to PDF
   */
  exportToPDF() {
    alert('Exporting to PDF... This feature would generate a PDF file of the dashboard.');
    // In a real application, this would use a library like jsPDF
  }

  /**
   * Export data to CSV
   */
  exportToCSV() {
    alert('Exporting to CSV... This feature would generate CSV files of the dashboard data.');
    // In a real application, this would generate CSV content
  }

  /**
   * Print dashboard
   */
  printDashboard() {
    window.print();
  }

  /**
   * Refresh dashboard data
   */
  async refreshData() {
    this.chartsInitialized = false;
    await this.loadData();
    this.generateDashboard('reports-container');
    alert('Data refreshed successfully!');
  }
}

// Create global instance
window.systemAnalytics = new SystemAnalytics();

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add to admin dashboard if available
  const reportsContainer = document.getElementById('reports-container');
  if (reportsContainer) {
    window.systemAnalytics.init()
      .then(() => {
        window.systemAnalytics.generateDashboard('reports-container');
      })
      .catch(error => {
        console.error('Error initializing analytics dashboard:', error);
      });
  }
});
