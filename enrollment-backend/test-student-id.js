/**
 * Simple standalone test for student ID validation
 * Tests the format: m[YY]-XXXX-XXX where:
 * - m is the prefix for "Manila"
 * - YY is the year of enrollment (e.g., 23 for 2023)
 * - XXXX-XXX is the course-dependent portion
 */

// Sample validation function similar to what would be in the Student model
function validateStudentId(studentId) {
  const studentIdRegex = /^m\d{2}-\d{4}-\d{3}$/;
  return studentIdRegex.test(studentId);
}

// Sample validation function for the student email format
function validateStudentEmail(studentId, email) {
  const expectedEmail = `${studentId}@manila.uphsl.edu.ph`;
  return email === expectedEmail;
}

// Test valid and invalid student IDs
console.log("Testing Student ID Validation:");
console.log("-------------------------------------------------");

const validIds = [
  'm23-1470-578', // Valid format
  'm24-1234-567', // Valid format, different year
  'm25-9876-543'  // Valid format, different numbers
];

const invalidIds = [
  'x23-1470-578', // Wrong prefix
  'm234-1470-578', // Year too long
  'm2-1470-578',  // Year too short
  'm23-170-578',  // First segment too short
  'm23-14701-578', // First segment too long
  'm23-1470-58',  // Second segment too short
  'm23-1470-5789', // Second segment too long
  'm23_1470_578',  // Wrong separator
  '231470578'      // No separators
];

console.log("Valid IDs (should all pass):");
validIds.forEach(id => {
  const result = validateStudentId(id);
  console.log(`  ${id}: ${result ? 'PASS ✅' : 'FAIL ❌'}`);
  
  // Also test email validation
  const email = `${id}@manila.uphsl.edu.ph`;
  const emailResult = validateStudentEmail(id, email);
  console.log(`    Email ${email}: ${emailResult ? 'PASS ✅' : 'FAIL ❌'}`);
});

console.log("\nInvalid IDs (should all fail):");
invalidIds.forEach(id => {
  const result = validateStudentId(id);
  console.log(`  ${id}: ${!result ? 'PASS ✅' : 'FAIL ❌'}`);
});

console.log("\nTest completed!");
