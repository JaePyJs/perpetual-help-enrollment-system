/**
 * Direct Test Script for School Enrollment System Monitoring
 * This script tests the monitoring functionality directly
 */

const fs = require('fs');
const path = require('path');

// Create a simplified monitoring module for testing
const monitoring = {
  // System state
  isMonitoringEnabled: true,
  
  // Metrics storage
  metrics: {
    students: {
      byGradYear: {},
      byDepartment: {}
    },
    errors: {
      total: 0,
      byType: {}
    },
    users: {
      active: 0,
      sessions: 0
    }
  },
  
  // Track student registration
  trackStudentRegistration: function(studentId, departmentCode) {
    if (!this.isMonitoringEnabled) return;
    
    try {
      // Extract enrollment year from student ID (format: m[YY]-XXXX-XXX)
      const match = studentId.match(/^m(\d{2})-\d{4}-\d{3}$/);
      if (match) {
        const enrollmentYear = `20${match[1]}`; // Convert YY to full year
        
        // Update enrollment year metrics
        this.metrics.students.byGradYear[enrollmentYear] = 
          (this.metrics.students.byGradYear[enrollmentYear] || 0) + 1;
        
        // Update department metrics
        if (departmentCode) {
          this.metrics.students.byDepartment[departmentCode] = 
            (this.metrics.students.byDepartment[departmentCode] || 0) + 1;
        }
        
        console.log(`[Monitoring] Student registered: ${studentId} (Year: ${enrollmentYear}, Dept: ${departmentCode || 'Unknown'})`);
      } else {
        console.warn(`[Monitoring] Invalid student ID format: ${studentId}`);
      }
    } catch (err) {
      console.error('Error in trackStudentRegistration:', err);
    }
  },
  
  // Track error
  trackError: function(error, type = 'unknown') {
    if (!this.isMonitoringEnabled) return;
    
    try {
      this.metrics.errors.total++;
      this.metrics.errors.byType[type] = (this.metrics.errors.byType[type] || 0) + 1;
      
      console.log(`[Monitoring] Error tracked: ${type}`, error.message);
    } catch (err) {
      console.error('Error in trackError:', err);
    }
  },
  
  // Update active users
  updateActiveUsers: function(count) {
    if (!this.isMonitoringEnabled) return;
    
    this.metrics.users.active = count;
  },
  
  // Update active sessions
  updateActiveSessions: function(count) {
    if (!this.isMonitoringEnabled) return;
    
    this.metrics.users.sessions = count;
  },
  
  // Get metrics
  getMetrics: function() {
    return { ...this.metrics };
  }
};

console.log('Starting direct monitoring test...');

// Simulated student registration data
const students = [
  { id: 'm23-1470-578', department: 'CS', name: 'John Doe' },
  { id: 'm22-2213-347', department: 'BUS', name: 'Jane Smith' },
  { id: 'm24-1587-921', department: 'ENG', name: 'Robert Johnson' },
  { id: 'm21-3452-111', department: 'MED', name: 'Emily Williams' },
  { id: 'm23-2789-456', department: 'CS', name: 'Michael Brown' },
  { id: 'm25-1290-789', department: 'ARTS', name: 'Sarah Miller' },
  // Add an invalid format to test validation
  { id: 'invalid-format', department: 'CS', name: 'Invalid Format' }
];

// Simulate student registrations
console.log('\nSimulating student registrations...');
students.forEach(student => {
  monitoring.trackStudentRegistration(student.id, student.department);
});

// Simulate errors
console.log('\nSimulating errors...');
const errorTypes = ['ValidationError', 'DatabaseError', 'AuthError', 'APIError'];
for (let i = 0; i < 10; i++) {
  const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
  const error = new Error(`Simulated ${errorType}`);
  monitoring.trackError(error, errorType);
}

// Update user metrics
monitoring.updateActiveUsers(42);
monitoring.updateActiveSessions(37);

// Get metrics and display
console.log('\nRetrieving monitoring metrics...');
const metrics = monitoring.getMetrics();

console.log('\n=== MONITORING TEST RESULTS ===');
console.log('\nStudent Metrics:');
console.log('By Enrollment Year:', JSON.stringify(metrics.students.byGradYear, null, 2));
console.log('By Department:', JSON.stringify(metrics.students.byDepartment, null, 2));

console.log('\nUser Metrics:');
console.log(`Active Users: ${metrics.users.active}`);
console.log(`Active Sessions: ${metrics.users.sessions}`);

console.log('\nError Metrics:');
console.log(`Total Errors: ${metrics.errors.total}`);
console.log('By Type:', JSON.stringify(metrics.errors.byType, null, 2));

// Save test results to file
const testOutput = {
  timestamp: new Date().toISOString(),
  students: metrics.students,
  users: metrics.users,
  errors: metrics.errors
};

const outputPath = path.join(__dirname, 'monitoring-direct-test-results.json');
fs.writeFileSync(outputPath, JSON.stringify(testOutput, null, 2));
console.log(`\nTest results saved to: ${outputPath}`);
