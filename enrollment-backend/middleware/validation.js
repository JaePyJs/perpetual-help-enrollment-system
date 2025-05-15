/**
 * Input Validation Middleware
 * This middleware validates request data to prevent security vulnerabilities
 * and ensure data integrity.
 */

const { validationResult } = require('express-validator');

/**
 * Validate request using express-validator rules
 * @param {Array} validations - Array of express-validator validation rules
 * @returns {Function} Middleware function
 */
const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Log validation errors
      console.log(`Validation error: ${req.method} ${req.originalUrl}`, errors.array());
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    next();
  };
};

/**
 * Sanitize and normalize user input
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const sanitizeInput = (req, res, next) => {
  // Get request body
  const body = req.body;

  // If body exists and is an object
  if (body && typeof body === 'object') {
    // Recursively sanitize each property
    sanitizeObject(body);
  }

  // Process query parameters
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }

  next();
};

/**
 * Recursively sanitize object properties
 * @param {Object} obj - Object to sanitize
 */
function sanitizeObject(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // If property is an object, recursively sanitize
      if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof Date) && !Array.isArray(obj[key])) {
        sanitizeObject(obj[key]);
      }
      // If property is a string, sanitize
      else if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      }
      // If property is an array, sanitize each item
      else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map(item => {
          if (typeof item === 'string') {
            return sanitizeString(item);
          } else if (typeof item === 'object' && item !== null) {
            sanitizeObject(item);
            return item;
          }
          return item;
        });
      }
    }
  }
}

/**
 * Sanitize a string to prevent XSS and command injection
 * @param {String} str - String to sanitize 
 * @returns {String} Sanitized string
 */
function sanitizeString(str) {
  // Basic XSS protection by escaping HTML entities
  str = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  // Prevent command injection
  str = str
    .replace(/;\s*$/, '') // Remove trailing semicolons
    .replace(/\s*\|\s*/, ' ') // Replace pipes with spaces
    .replace(/\s*`\s*/, ' '); // Replace backticks with spaces
  
  return str;
}

module.exports = {
  validateRequest,
  sanitizeInput
};
