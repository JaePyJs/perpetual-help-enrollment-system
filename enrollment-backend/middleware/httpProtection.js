/**
 * HTTP Protection Middleware
 * This middleware provides protection against HTTP parameter pollution and other HTTP-based attacks
 */

const hpp = require('hpp');
const xssClean = require('xss-clean');

/**
 * HTTP parameter pollution protection middleware
 * Prevents attackers from polluting the HTTP parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const httpParameterProtection = hpp({
  // White-listed parameters that can be duplicated in the query string
  whitelist: [
    'sort', 'fields', 'search', 'tags', 'categories', 'ids'
  ]
});

/**
 * HTTP security headers middleware
 * Adds additional security headers beyond what helmet provides
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const additionalSecurityHeaders = (req, res, next) => {
  // Content-Security-Policy: Enhanced control over which resources can be loaded
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'"
  );
  
  // Referrer-Policy: Control how much referrer information is sent
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy (formerly Feature-Policy): Control browser features
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()'
  );
  
  // Clear-Site-Data: Clear browsing data on logout
  if (req.path === '/api/auth/logout') {
    res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
  }
  
  next();
};

/**
 * Session security middleware
 * Enhances session security by setting secure flags on cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const sessionSecurity = (req, res, next) => {
  // Override the cookie setting method to enforce secure flags
  const originalCookie = res.cookie;
  res.cookie = function(name, value, options = {}) {
    // Default options for security
    const secureOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      ...options
    };
    
    // Call the original cookie method with secure options
    return originalCookie.call(this, name, value, secureOptions);
  };
  
  next();
};

module.exports = {
  httpParameterProtection,
  additionalSecurityHeaders,
  sessionSecurity,
  xssCleanMiddleware: xssClean()
};
