/**
 * Mocha Configuration
 * This file configures Mocha test runner settings
 */

module.exports = {
  // Test files pattern
  spec: 'tests/**/*.test.js',
  
  // Timeout for tests in milliseconds
  timeout: 10000,
  
  // Exit after tests complete
  exit: true,
  
  // Show full stack traces
  fullTrace: true,
  
  // Retry failed tests
  retries: 0,
  
  // Bail after first test failure
  bail: false,
  
  // Reporter to use
  reporter: 'spec',
  
  // Require files before running tests
  require: ['./tests/setup.js'],
  
  // Colors in reporter output
  color: true,
  
  // Slow test threshold in milliseconds
  slow: 75,
  
  // Ignore global leaks
  ignoreLeaks: false,
  
  // Check for global variable leaks
  checkLeaks: false,
  
  // Diff output
  diff: true,
  
  // Inline diffs
  inlineDiffs: true,
  
  // Forbid pending tests
  forbidPending: false,
  
  // Forbid only tests
  forbidOnly: false
};
