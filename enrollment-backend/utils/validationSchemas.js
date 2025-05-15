/**
 * Validation Schemas
 * Centralized validation schemas for use with express-validator
 */

const { body, param, query } = require("express-validator");

// Custom validator for student ID format based on school requirements
const isValidStudentId = (value) => {
  const regex = /^m[0-9]{2}-[0-9]{4}-[0-9]{3}$/;
  if (!regex.test(value)) {
    throw new Error(
      "Student ID must follow the format: mYY-XXXX-XXX (e.g., m23-1470-578)"
    );
  }
  return true;
};

// Common validation schemas
const commonValidations = {
  // Name validations
  name: (field) =>
    body(field)
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage(`${field} must be between 2 and 50 characters`)
      .matches(/^[a-zA-Z\s\-'.]+$/)
      .withMessage(
        `${field} must contain only letters, spaces, hyphens, apostrophes, and periods`
      ),

  // Email validation
  email: body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  // Password validation with strength requirements
  password: body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  // Date validation
  date: (field) =>
    body(field)
      .isISO8601()
      .withMessage(`${field} must be a valid date in ISO format (YYYY-MM-DD)`),

  // ID validation
  id: (field) => param(field).isMongoId().withMessage("Invalid ID format"),

  // Phone number validation
  phone: body("phone")
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone number must be between 10 and 15 digits"),

  // Text field validation with HTML sanitization
  textField: (field, { required = true, min = 1, max = 1000 } = {}) => {
    const validator = body(field)
      .trim()
      .isLength({ min, max })
      .withMessage(`${field} must be between ${min} and ${max} characters`)
      .escape(); // Sanitize HTML

    return required ? validator : validator.optional();
  },

  // URL validation
  url: (field) =>
    body(field).optional().isURL().withMessage(`${field} must be a valid URL`),

  // Enumeration validation
  enum: (field, values) =>
    body(field)
      .isIn(values)
      .withMessage(`${field} must be one of: ${values.join(", ")}`),

  // Number validation
  number: (field, { min, max } = {}) => {
    let validator = body(field)
      .isNumeric()
      .withMessage(`${field} must be a number`);

    if (min !== undefined) {
      validator = validator
        .isFloat({ min })
        .withMessage(`${field} must be at least ${min}`);
    }

    if (max !== undefined) {
      validator = validator
        .isFloat({ max })
        .withMessage(`${field} must not exceed ${max}`);
    }

    return validator;
  },

  // Boolean validation
  boolean: (field) =>
    body(field).isBoolean().withMessage(`${field} must be a boolean value`),

  // Array validation
  array: (field) =>
    body(field).isArray().withMessage(`${field} must be an array`),

  // JSON object validation
  object: (field) =>
    body(field).custom((value) => {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error(`${field} must be a JSON object`);
      }
      return true;
    }),

  // Student ID validation based on school format
  studentId: body("studentId").custom(isValidStudentId),

  // Search query validation
  searchQuery: query("q")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters")
    .escape(),

  // Pagination parameters
  pagination: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt(),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100")
      .toInt(),
  ],
};

// Authentication validation schemas
const authValidations = {
  login: [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  register: [
    commonValidations.name("firstName"),
    body("middleName").optional().trim().escape(),
    commonValidations.name("lastName"),
    commonValidations.email,
    commonValidations.password,
    body("role")
      .isIn(["student", "teacher", "admin"])
      .withMessage("Role must be either student, teacher, or admin"),
  ],

  changePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    commonValidations.password,
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],

  resetPassword: [
    body("token").notEmpty().withMessage("Token is required"),
    commonValidations.password,
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
};

// User validation schemas
const userValidations = {
  createUser: [
    commonValidations.name("firstName"),
    body("middleName").optional().trim().escape(),
    commonValidations.name("lastName"),
    commonValidations.email,
    commonValidations.password,
    body("role")
      .isIn(["student", "teacher", "admin"])
      .withMessage("Role must be either student, teacher, or admin"),
    commonValidations.date("dateOfBirth"),
    body("gender")
      .isIn(["male", "female", "other", "prefer-not-to-say"])
      .withMessage(
        "Gender must be one of: male, female, other, prefer-not-to-say"
      ),
    commonValidations.phone,
    body("address").optional().trim().escape(),
    body("nationality").optional().trim().escape(),
  ],

  updateUser: [
    commonValidations.name("firstName"),
    body("middleName").optional().trim().escape(),
    commonValidations.name("lastName"),
    commonValidations.email,
    commonValidations.date("dateOfBirth"),
    body("gender")
      .isIn(["male", "female", "other", "prefer-not-to-say"])
      .withMessage(
        "Gender must be one of: male, female, other, prefer-not-to-say"
      ),
    commonValidations.phone,
    body("address").optional().trim().escape(),
    body("nationality").optional().trim().escape(),
  ],

  updateStudentProfile: [
    body("program")
      .notEmpty()
      .withMessage("Program is required")
      .trim()
      .escape(),
    body("yearLevel")
      .isIn(["1", "2", "3", "4", "5"])
      .withMessage("Year level must be between 1 and 5"),
    body("section").optional().trim().escape(),
    body("guardianName").optional().trim().escape(),
    body("guardianContact")
      .optional()
      .matches(/^[0-9]{10,15}$/)
      .withMessage("Guardian contact must be between 10 and 15 digits"),
  ],

  updateTeacherProfile: [
    body("department")
      .notEmpty()
      .withMessage("Department is required")
      .trim()
      .escape(),
    body("position").optional().trim().escape(),
    body("employmentType")
      .isIn(["full-time", "part-time", "contract", "adjunct"])
      .withMessage(
        "Employment type must be one of: full-time, part-time, contract, adjunct"
      ),
    body("specialization").optional().trim().escape(),
  ],

  updateAdminProfile: [
    body("adminRole")
      .isIn(["system-admin", "registrar", "finance", "academic", "admission"])
      .withMessage(
        "Admin role must be one of: system-admin, registrar, finance, academic, admission"
      ),
    body("accessLevel")
      .isIn(["1", "2", "3", "4"])
      .withMessage("Access level must be between 1 and 4"),
    body("departmentAssignment").optional().trim().escape(),
  ],
};

// Student validation schemas
const studentValidations = {
  createStudent: [
    commonValidations.studentId,
    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .custom((value, { req }) => {
        // Check if email matches the expected format based on student ID
        const expectedEmail = `${req.body.studentId}@manila.uphsl.edu.ph`;
        if (value !== expectedEmail) {
          throw new Error(
            "Email must match studentId format: [studentId]@manila.uphsl.edu.ph"
          );
        }
        return true;
      }),
    commonValidations.name("firstName"),
    body("middleName").optional().trim().escape(),
    commonValidations.name("lastName"),
    body("department").isMongoId().withMessage("Invalid department ID"),
    body("enrollmentYear")
      .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
      .withMessage("Enrollment year must be valid")
      .custom((value, { req }) => {
        // Check if enrollment year matches the year in the student ID
        if (req.body.studentId) {
          const yearFromId = req.body.studentId.substr(1, 2);
          const yearFromEnrollment = value.toString().substr(2, 2);
          if (yearFromId !== yearFromEnrollment) {
            throw new Error("Enrollment year must match year in student ID");
          }
        }
        return true;
      }),
    body("program")
      .notEmpty()
      .withMessage("Program is required")
      .trim()
      .escape(),
    body("yearLevel")
      .optional()
      .isInt({ min: 1, max: 6 })
      .withMessage("Year level must be between 1 and 6"),
  ],

  updateStudent: [
    commonValidations.name("firstName").optional(),
    body("middleName").optional().trim().escape(),
    commonValidations.name("lastName").optional(),
    body("program")
      .optional()
      .notEmpty()
      .withMessage("Program cannot be empty")
      .trim()
      .escape(),
    body("yearLevel")
      .optional()
      .isInt({ min: 1, max: 6 })
      .withMessage("Year level must be between 1 and 6"),
    body("status")
      .optional()
      .isIn([
        "active",
        "inactive",
        "graduated",
        "leave of absence",
        "dismissed",
      ])
      .withMessage("Invalid status value"),
  ],
};

// Message validation schemas
const messageValidations = {
  createMessage: [
    body("recipients")
      .isArray()
      .withMessage("Recipients must be an array")
      .notEmpty()
      .withMessage("At least one recipient is required"),
    body("recipients.*").isMongoId().withMessage("Invalid recipient ID"),
    body("subject")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Subject must be between 1 and 200 characters")
      .escape(),
    body("content")
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage("Content must be between 1 and 5000 characters")
      .escape(),
    body("attachments")
      .optional()
      .isArray()
      .withMessage("Attachments must be an array"),
    body("attachments.*.filename")
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Filename must be between 1 and 200 characters")
      .escape(),
    body("attachments.*.fileUrl")
      .optional()
      .isURL()
      .withMessage("File URL must be a valid URL"),
    body("parentMessage")
      .optional()
      .isMongoId()
      .withMessage("Invalid parent message ID"),
  ],

  replyToMessage: [
    body("content")
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage("Content must be between 1 and 5000 characters")
      .escape(),
    body("attachments")
      .optional()
      .isArray()
      .withMessage("Attachments must be an array"),
  ],
};

// Notification validation schemas
const notificationValidations = {
  createNotification: [
    body("recipients")
      .isArray()
      .withMessage("Recipients must be an array")
      .notEmpty()
      .withMessage("At least one recipient is required"),
    body("recipients.*").isMongoId().withMessage("Invalid recipient ID"),
    body("type")
      .isIn([
        "info",
        "warning",
        "success",
        "error",
        "academic",
        "financial",
        "system",
      ])
      .withMessage("Invalid notification type"),
    body("title")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters")
      .escape(),
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Content must be between 1 and 1000 characters")
      .escape(),
    body("link").optional().isURL().withMessage("Link must be a valid URL"),
    body("priority")
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Priority must be one of: low, medium, high, urgent"),
  ],
};

module.exports = {
  commonValidations,
  authValidations,
  userValidations,
  messageValidations,
  notificationValidations,
  studentValidations,
};
