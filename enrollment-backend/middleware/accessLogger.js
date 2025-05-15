/**
 * Access Logging Middleware
 * This middleware handles logging of API access and security events.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Define access log configuration
const accessLogConfig = {
  logToConsole: true,
  logToFile: true,
  logToDatabase: true,
  logFilePath: path.join(__dirname, '../logs/access.log'),
  sensitiveParams: ['password', 'token', 'secret', 'apiKey', 'creditCard']
};

// Create logs directory if it doesn't exist
if (accessLogConfig.logToFile) {
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

// Create AccessLog model if it doesn't exist
let AccessLog;
if (accessLogConfig.logToDatabase && mongoose.connection.readyState === 1) {
  const accessLogSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true, default: Date.now },
    method: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: Number },
    responseTime: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userRole: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    referer: { type: String },
    requestBody: { type: Object },
    responseBody: { type: Object },
    isError: { type: Boolean, default: false },
    errorMessage: { type: String }
  });
  
  // Create model if it doesn't exist
  if (!mongoose.models.AccessLog) {
    AccessLog = mongoose.model('AccessLog', accessLogSchema);
  } else {
    AccessLog = mongoose.models.AccessLog;
  }
}

/**
 * Access logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const accessLogger = (req, res, next) => {
  // Start time for response time calculation
  const startTime = Date.now();
  
  // Clone the request body while sanitizing sensitive data
  const requestBody = sanitizeObject(req.body);
  
  // Get IP address, user agent, and referrer
  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers['referer'] || '';
  
  // Get user information if available
  const userId = req.user ? req.user._id : null;
  const userRole = req.user ? req.user.role : null;
  
  // Capture the original end function
  const originalEnd = res.end;
  let responseBody = '';
  
  // Override the write method to capture response body
  const originalWrite = res.write;
  res.write = function(chunk) {
    // Capture the response body
    responseBody += chunk.toString('utf8');
    originalWrite.apply(res, arguments);
  };
  
  // Override the end method to log the request
  res.end = function(chunk) {
    // If there's a chunk, add it to the response body
    if (chunk) {
      responseBody += chunk.toString('utf8');
    }
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Check if the response is JSON
    let parsedResponseBody = {};
    if (res.getHeader('content-type') && res.getHeader('content-type').includes('application/json') && responseBody) {
      try {
        parsedResponseBody = JSON.parse(responseBody);
      } catch (error) {
        // Not valid JSON, leave it as is
      }
    }
    
    // Create the log entry
    const logEntry = {
      timestamp: new Date(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: responseTime,
      userId: userId,
      userRole: userRole,
      ipAddress: ipAddress,
      userAgent: userAgent,
      referer: referer,
      requestBody: requestBody,
      responseBody: parsedResponseBody,
      isError: res.statusCode >= 400,
      errorMessage: res.statusCode >= 400 ? (parsedResponseBody.message || '') : ''
    };
    
    // Log to console
    if (accessLogConfig.logToConsole) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms - ${userId || 'anonymous'}`);
      if (res.statusCode >= 400) {
        console.error(`[ERROR] ${logEntry.errorMessage}`);
      }
    }
    
    // Log to file
    if (accessLogConfig.logToFile) {
      fs.appendFile(
        accessLogConfig.logFilePath,
        JSON.stringify(logEntry) + '\n',
        (err) => {
          if (err) {
            console.error('Error writing to access log file:', err);
          }
        }
      );
    }
    
    // Log to database
    if (accessLogConfig.logToDatabase && AccessLog) {
      const accessLog = new AccessLog(logEntry);
      accessLog.save().catch(err => {
        console.error('Error saving access log to database:', err);
      });
    }
    
    // Call the original end method
    originalEnd.apply(res, arguments);
  };
  
  next();
};

/**
 * Sanitize an object by removing sensitive parameters
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Clone the object
  const sanitized = JSON.parse(JSON.stringify(obj));
  
  // Recursively sanitize each property
  for (let key in sanitized) {
    if (sanitized.hasOwnProperty(key)) {
      // If the key is sensitive, replace the value with [REDACTED]
      if (accessLogConfig.sensitiveParams.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      }
      // If the value is an object, recursively sanitize
      else if (sanitized[key] && typeof sanitized[key] === 'object') {
        sanitized[key] = sanitizeObject(sanitized[key]);
      }
    }
  }
  
  return sanitized;
}

/**
 * Get the client IP address
 * @param {Object} req - Express request object
 * @returns {String} Client IP address
 */
function getClientIp(req) {
  // Get IP from headers (for proxied requests)
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const forwardedIps = xForwardedFor.split(',').map(ip => ip.trim());
    return forwardedIps[0];
  }
  
  // Get IP from request object
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

/**
 * Log a security event
 * @param {String} eventType - Type of security event
 * @param {Object} details - Details about the event
 * @param {Boolean} isViolation - Whether this is a security violation
 * @param {Object} req - Express request object (optional)
 */
function logSecurityEvent(eventType, details = {}, isViolation = false, req = null) {
  // Create the security event log entry
  const logEntry = {
    timestamp: new Date(),
    eventType: eventType,
    details: details,
    isViolation: isViolation
  };
  
  // Add request information if available
  if (req) {
    logEntry.method = req.method;
    logEntry.url = req.originalUrl;
    logEntry.userId = req.user ? req.user._id : null;
    logEntry.userRole = req.user ? req.user.role : null;
    logEntry.ipAddress = getClientIp(req);
    logEntry.userAgent = req.headers['user-agent'] || '';
  }
  
  // Log to console
  if (accessLogConfig.logToConsole) {
    console.log(`[SECURITY EVENT] ${eventType}`, logEntry);
    if (isViolation) {
      console.error(`[SECURITY VIOLATION] ${eventType}`);
    }
  }
  
  // Log to file
  if (accessLogConfig.logToFile) {
    fs.appendFile(
      accessLogConfig.logFilePath.replace('access.log', 'security.log'),
      JSON.stringify(logEntry) + '\n',
      (err) => {
        if (err) {
          console.error('Error writing to security log file:', err);
        }
      }
    );
  }
  
  // In a real implementation, we would also log to the database
  // and potentially trigger alerts for security violations
}

module.exports = {
  accessLogger,
  logSecurityEvent
};
