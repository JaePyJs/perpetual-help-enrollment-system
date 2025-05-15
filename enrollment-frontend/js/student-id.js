/**
 * Student ID Management Module
 * Handles validation, generation, and parsing of student IDs
 * for Perpetual Help College of Manila enrollment system
 */

class StudentIdManager {
  constructor() {
    // Manila branch code
    this.branchCode = "m";
    this.currentYear = new Date().getFullYear();
    this.regex = /^([a-z])(\d{2})-(\d{4})-(\d{3})$/;
  }

  /**
   * Generate a new student ID
   * @param {Object} options - Configuration options
   * @param {number} options.enrollmentYear - Year student enrolled (defaults to current year)
   * @param {string} options.branchCode - Branch code (defaults to 'm' for Manila)
   * @returns {string} - Properly formatted student ID
   */
  generateStudentId(options = {}) {
    const enrollmentYear = options.enrollmentYear || this.currentYear;
    const branchCode = options.branchCode || this.branchCode;

    // Get last two digits of year
    const yearCode = (enrollmentYear % 100).toString().padStart(2, "0");

    // Generate random numbers for the unique identifier portions
    const firstPart = Math.floor(1000 + Math.random() * 9000);
    const secondPart = Math.floor(100 + Math.random() * 900);

    return `${branchCode}${yearCode}-${firstPart}-${secondPart}`;
  }

  /**
   * Validate a student ID format
   * @param {string} studentId - ID to validate
   * @returns {boolean} - Whether the ID is valid
   */
  validateStudentId(studentId) {
    if (!studentId) return false;
    return this.regex.test(studentId);
  }

  /**
   * Parse a student ID into its components
   * @param {string} studentId - ID to parse
   * @returns {Object|null} - Parsed components or null if invalid
   */
  parseStudentId(studentId) {
    if (!this.validateStudentId(studentId)) {
      return null;
    }

    const matches = studentId.match(this.regex);
    if (!matches || matches.length < 5) {
      return null;
    }

    // Calculate 4-digit year from the 2-digit year in ID
    const twoDigitYear = parseInt(matches[2]);
    const fullYear =
      twoDigitYear < 50 ? 2000 + twoDigitYear : 1900 + twoDigitYear;

    return {
      branchCode: matches[1],
      enrollmentYear: fullYear,
      yearCode: matches[2],
      idFirstPart: matches[3],
      idSecondPart: matches[4],
      isValid: true,
    };
  }

  /**
   * Format a student ID to ensure proper format
   * @param {string} studentId - ID to format
   * @returns {string} - Properly formatted ID or original if invalid
   */
  formatStudentId(studentId) {
    const parsed = this.parseStudentId(studentId);
    if (!parsed) return studentId;

    return `${parsed.branchCode}${parsed.yearCode}-${parsed.idFirstPart}-${parsed.idSecondPart}`;
  }
}

// Create global instance
const studentIdManager = new StudentIdManager();

// Export for module environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = studentIdManager;
}
