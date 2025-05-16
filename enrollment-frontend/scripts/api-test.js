/**
 * API Testing Utility
 * 
 * This script tests the backend API endpoints to ensure they are working correctly.
 * Run with: node scripts/api-test.js
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const TEST_CREDENTIALS = {
  username: 'student@uphc.edu.ph',
  password: 'student123',
  role: 'student'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0
};

// Store auth token for authenticated requests
let authToken = null;

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add auth token if available
  if (authToken && !options.headers) {
    options.headers = {
      'Authorization': `Bearer ${authToken}`
    };
  } else if (authToken && options.headers) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${authToken}`
    };
  }
  
  // Add default headers
  if (!options.headers) {
    options.headers = {
      'Content-Type': 'application/json'
    };
  } else if (!options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }
  
  // Convert body to JSON string if it's an object
  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    
    // Parse response based on content type
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: response.headers
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

/**
 * Run a test case
 * @param {string} name - Test name
 * @param {Function} testFn - Test function
 */
async function runTest(name, testFn) {
  results.total++;
  
  console.log(`\n${colors.bright}Running test: ${colors.cyan}${name}${colors.reset}`);
  
  try {
    const startTime = Date.now();
    await testFn();
    const duration = Date.now() - startTime;
    
    console.log(`${colors.green}✓ Passed${colors.reset} (${duration}ms)`);
    results.passed++;
  } catch (error) {
    console.log(`${colors.red}✗ Failed: ${error.message}${colors.reset}`);
    console.error(`${colors.dim}${error.stack}${colors.reset}`);
    results.failed++;
  }
}

/**
 * Skip a test case
 * @param {string} name - Test name
 * @param {string} reason - Reason for skipping
 */
function skipTest(name, reason) {
  results.total++;
  results.skipped++;
  console.log(`\n${colors.bright}Skipping test: ${colors.cyan}${name}${colors.reset}`);
  console.log(`${colors.yellow}⚠ Skipped: ${reason}${colors.reset}`);
}

/**
 * Assert that a condition is true
 * @param {boolean} condition - Condition to check
 * @param {string} message - Error message if condition is false
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test cases
async function testServerConnection() {
  const response = await apiRequest('/health');
  assert(response.ok, `Server connection failed: ${response.error || 'Unknown error'}`);
  assert(response.data && response.data.status === 'ok', 'Health check failed');
}

async function testAuthentication() {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: TEST_CREDENTIALS
  });
  
  assert(response.ok, `Authentication failed: ${JSON.stringify(response.data || response.error)}`);
  assert(response.data && response.data.token, 'No token returned from authentication');
  
  // Store token for subsequent tests
  authToken = response.data.token;
  console.log(`${colors.dim}Token: ${authToken.substring(0, 15)}...${colors.reset}`);
}

async function testStudentProfile() {
  // Skip if not authenticated
  if (!authToken) {
    skipTest('Student Profile', 'Not authenticated');
    return;
  }
  
  const response = await apiRequest('/students/profile');
  assert(response.ok, `Failed to fetch student profile: ${JSON.stringify(response.data || response.error)}`);
  assert(response.data, 'No profile data returned');
  
  console.log(`${colors.dim}Profile: ${JSON.stringify(response.data).substring(0, 100)}...${colors.reset}`);
}

async function testStudentCourses() {
  // Skip if not authenticated
  if (!authToken) {
    skipTest('Student Courses', 'Not authenticated');
    return;
  }
  
  const response = await apiRequest('/students/courses');
  assert(response.ok, `Failed to fetch student courses: ${JSON.stringify(response.data || response.error)}`);
  assert(Array.isArray(response.data), 'Courses data is not an array');
  
  console.log(`${colors.dim}Courses: ${response.data.length} found${colors.reset}`);
}

// Main function to run all tests
async function runAllTests() {
  console.log(`${colors.bright}${colors.magenta}API Testing Utility${colors.reset}`);
  console.log(`${colors.dim}Testing API at: ${API_BASE_URL}${colors.reset}`);
  
  const startTime = Date.now();
  
  // Run tests
  await runTest('Server Connection', testServerConnection);
  await runTest('Authentication', testAuthentication);
  await runTest('Student Profile', testStudentProfile);
  await runTest('Student Courses', testStudentCourses);
  
  const duration = Date.now() - startTime;
  
  // Print summary
  console.log(`\n${colors.bright}${colors.magenta}Test Summary${colors.reset}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${results.skipped}${colors.reset}`);
  console.log(`${colors.blue}Total: ${results.total}${colors.reset}`);
  console.log(`${colors.dim}Duration: ${duration}ms${colors.reset}`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  console.error(`${colors.dim}${error.stack}${colors.reset}`);
  process.exit(1);
});
