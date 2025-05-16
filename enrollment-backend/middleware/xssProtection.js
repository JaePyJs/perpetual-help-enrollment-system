/**
 * XSS Protection Middleware
 * Provides multiple layers of protection against Cross-Site Scripting attacks
 */

const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

// Initialize DOMPurify (a more robust HTML sanitizer)
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Configure DOMPurify for stricter sanitization
const purifyConfig = {
  ALLOWED_TAGS: [
    "b",
    "i",
    "u",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "small",
    "sub",
    "sup",
  ],
  ALLOWED_ATTR: [], // No attributes allowed
  FORBID_TAGS: [
    "script",
    "style",
    "iframe",
    "frame",
    "object",
    "embed",
    "form",
  ],
  FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover"],
  FORBID_CONTENTS: ["script", "style"],
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
  WHOLE_DOCUMENT: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
};

/**
 * Applies advanced HTML sanitization to string content
 * @param {string} content - The string to sanitize
 * @returns {string} Sanitized string
 */
const purifyHTML = (content) => {
  if (typeof content !== "string") return content;
  return DOMPurify.sanitize(content, purifyConfig);
};

/**
 * Recursively apply HTML purification to all string values in an object
 * @param {Object} obj - The object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const result = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Handle nested objects/arrays
      if (value && typeof value === "object" && !(value instanceof Date)) {
        result[key] = sanitizeObject(value);
      }
      // Apply purification to strings
      else if (typeof value === "string" && value.trim() !== "") {
        // Only apply HTML purification to fields that might contain HTML
        const mightContainHTML = /[<>]/.test(value);
        result[key] = mightContainHTML ? purifyHTML(value) : value;
      }
      // Copy other values as is
      else {
        result[key] = value;
      }
    }
  }

  return result;
};

/**
 * XSS Protection middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const xssProtection = (req, res, next) => {
  // Skip for file uploads or non-text content types
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    return next();
  }

  // Sanitize request body
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize request query parameters
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize request parameters
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }

  // Add X-XSS-Protection header for older browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Override res.json to sanitize response data
  const originalJson = res.json;
  res.json = function (data) {
    // Skip sanitization for error responses or non-object data
    if (res.statusCode >= 400 || typeof data !== "object") {
      return originalJson.call(this, data);
    }

    // Sanitize data before sending
    const sanitizedData = sanitizeObject(data);
    return originalJson.call(this, sanitizedData);
  };

  next();
};

module.exports = {
  xssProtection,
  purifyHTML,
  sanitizeObject,
};
