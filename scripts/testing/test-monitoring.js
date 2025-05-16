/**
 * Test Script for School Enrollment System Monitoring
 * This script simulates activities to test the monitoring system
 */

// Import modules
const fs = require("fs");
const path = require("path");

// Set up global config before requiring monitoring module
global.config = {
  monitoring: {
    enabled: true,
    healthCheck: {
      enabled: true,
      path: "/health",
      interval: 60,
    },
    metrics: {
      interval: 30,
    },
  },
  app: {
    environment: "testing",
    version: "1.0.0",
  },
};

// Import monitoring module after config is set up
const monitoring = require("./enrollment-backend/monitoring");

// Create mock Express app for testing
const mockApp = {
  use: (middleware) => console.log("Middleware registered"),
  get: (path, handler) => console.log(`Route registered: ${path}`),
};

// Initialize monitoring
console.log("Initializing monitoring system...");
monitoring.init(mockApp);

// Simulated student registration data based on the required format (m[YY]-XXXX-XXX)
const students = [
  { id: "m23-1470-578", department: "CS", name: "John Doe" },
  { id: "m22-2213-347", department: "BUS", name: "Jane Smith" },
  { id: "m24-1587-921", department: "ENG", name: "Robert Johnson" },
  { id: "m21-3452-111", department: "MED", name: "Emily Williams" },
  { id: "m23-2789-456", department: "CS", name: "Michael Brown" },
  { id: "m25-1290-789", department: "ARTS", name: "Sarah Miller" },
];

// Simulate student registrations
console.log("\nSimulating student registrations...");
students.forEach((student) => {
  monitoring.trackStudentRegistration(student.id, student.department);
  console.log(
    `Registered: ${student.name} (${student.id}) in ${student.department}`
  );
});

// Simulate API endpoint hits
console.log("\nSimulating API requests...");
const endpoints = [
  "/api/students",
  "/api/courses",
  "/api/grades",
  "/api/auth/login",
];

// Generate random number of hits for each endpoint
for (let i = 0; i < 50; i++) {
  const randomEndpoint =
    endpoints[Math.floor(Math.random() * endpoints.length)];
  // Simulate a successful or failed request
  if (Math.random() > 0.1) {
    console.log(`Request to ${randomEndpoint} - Success`);
  } else {
    const error = new Error("Simulated error");
    monitoring.trackError(error, "API");
    console.log(`Request to ${randomEndpoint} - Error`);
  }
}

// Simulate user activity
console.log("\nSimulating user activity...");
monitoring.trackUserActivity("admin1", "Login");
monitoring.trackUserActivity("teacher23", "Grade update");
monitoring.trackUserActivity("student-m23-1470-578", "View courses");

// Update active users
monitoring.updateActiveUsers(25);
monitoring.updateActiveSessions(35);

// Get metrics and display
console.log("\nRetrieving monitoring metrics...");
const metrics = monitoring.getMetrics();

// Output in readable format
console.log("\n=== MONITORING TEST RESULTS ===");
console.log("\nStudent Metrics:");
console.log(
  "By Enrollment Year:",
  JSON.stringify(metrics.students.byGradYear, null, 2)
);
console.log(
  "By Department:",
  JSON.stringify(metrics.students.byDepartment, null, 2)
);

console.log("\nUser Metrics:");
console.log(`Active Users: ${metrics.users.active}`);
console.log(`Active Sessions: ${metrics.users.sessions}`);

console.log("\nError Metrics:");
console.log(`Total Errors: ${metrics.errors.total}`);
console.log("By Type:", JSON.stringify(metrics.errors.byType, null, 2));

// Save test results to file
const testOutput = {
  timestamp: new Date().toISOString(),
  students: metrics.students,
  users: metrics.users,
  errors: metrics.errors,
};

const outputPath = path.join(__dirname, "monitoring-test-results.json");
fs.writeFileSync(outputPath, JSON.stringify(testOutput, null, 2));
console.log(`\nTest results saved to: ${outputPath}`);

// Shutdown monitoring
monitoring.shutdown();
console.log("\nMonitoring system shut down");
