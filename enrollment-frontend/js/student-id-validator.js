/**
 * Student ID Validator Module for Perpetual Help College of Manila
 * Format: m[YY]-XXXX-XXX
 * Where:
 * - m is a prefix
 * - YY is the year of enrollment (e.g., 23 for 2023)
 * - XXXX-XXX is an identifier specific to the student
 */

// Regular expression for validating student ID format
const STUDENT_ID_REGEX = /^m(\d{2})-(\d{4})-(\d{3})$/;

/**
 * Generate a new student ID based on the college's format
 * @param {number} enrollmentYear - Year of enrollment (e.g., 2023)
 * @param {number} uniqueId - Optional unique identifier (will be randomly generated if not provided)
 * @returns {string} - A properly formatted student ID
 */
function generateStudentId(enrollmentYear, uniqueId) {
  // Extract last two digits of enrollment year
  const yearSuffix = (enrollmentYear % 100).toString().padStart(2, "0");

  // Generate random 7-digit ID if not provided
  if (!uniqueId) {
    const randomId = Math.floor(Math.random() * 9000000) + 1000000;
    const firstPart = Math.floor(randomId / 1000);
    const secondPart = randomId % 1000;
    uniqueId = `${firstPart}-${secondPart.toString().padStart(3, "0")}`;
  } else if (typeof uniqueId === "number") {
    const firstPart = Math.floor(uniqueId / 1000);
    const secondPart = uniqueId % 1000;
    uniqueId = `${firstPart.toString().padStart(4, "0")}-${secondPart
      .toString()
      .padStart(3, "0")}`;
  }

  return `m${yearSuffix}-${uniqueId}`;
}

/**
 * Validate if a student ID follows the correct format
 * @param {string} studentId - The student ID to validate
 * @returns {boolean} - True if the format is valid
 */
function validateStudentId(studentId) {
  return STUDENT_ID_REGEX.test(studentId);
}

/**
 * Parse a student ID and extract its components
 * @param {string} studentId - The student ID to parse
 * @returns {Object|null} - An object with the ID components or null if invalid
 */
function parseStudentId(studentId) {
  if (!validateStudentId(studentId)) {
    return null;
  }

  const matches = studentId.match(STUDENT_ID_REGEX);

  return {
    prefix: "m",
    enrollmentYear: 2000 + parseInt(matches[1]),
    identifier: `${matches[2]}-${matches[3]}`,
    isValid: true,
  };
}

/**
 * Format enrollment year to get the proper student ID prefix
 * @param {number} year - 4-digit year (e.g., 2023)
 * @returns {string} - 2-digit year suffix (e.g., '23')
 */
function formatEnrollmentYear(year) {
  return (year % 100).toString().padStart(2, "0");
}

// Export functions for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateStudentId,
    validateStudentId,
    parseStudentId,
    formatEnrollmentYear,
  };
}
