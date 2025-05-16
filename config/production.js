/**
 * Production environment configuration
 */

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || '0.0.0.0',
  },

  // Frontend configuration
  frontend: {
    url: process.env.FRONTEND_URL || 'https://enrollment.uphsl.edu.ph',
  },

  // Database configuration
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/enrollment-system',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'production-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },

  // CORS configuration
  cors: {
    origin: [process.env.FRONTEND_URL || 'https://enrollment.uphsl.edu.ph'],
    credentials: true,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
  },

  // Feature flags
  features: {
    enableRegistration: process.env.ENABLE_REGISTRATION === 'true',
    enablePasswordReset: process.env.ENABLE_PASSWORD_RESET === 'true',
    enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
  },
};
