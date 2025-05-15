/**
 * Main Test Runner
 * This file is the entry point for running all tests
 */

// Configure environment for tests
process.env.NODE_ENV = 'testing';

// Require Mocha programmatically
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

// Setup logging
console.log('Starting School Enrollment System Tests');
console.log('======================================');

// Create new Mocha instance
const mocha = new Mocha({
  timeout: 10000,
  reporter: 'spec'
});

// Helper function to recursively find test files
function findTestFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories
      findTestFiles(filePath);
    } else if (file.endsWith('.test.js')) {
      // Add test files to Mocha instance
      mocha.addFile(filePath);
      console.log(`Added test file: ${filePath}`);
    }
  });
}

// Find and add all test files
const testDir = path.join(__dirname);
findTestFiles(testDir);

// Run the tests
mocha.run(failures => {
  // Exit with non-zero status if there were failures
  process.exitCode = failures ? 1 : 0;
  
  // Report test completion
  console.log('======================================');
  console.log(`Tests completed with ${failures} failures`);
});
