/**
 * Development environment configuration
 */

module.exports = {
  // Server configuration
  server: {
    port: 3001,
    host: 'localhost',
  },

  // Frontend configuration
  frontend: {
    url: 'http://localhost:3000',
  },

  // Database configuration
  database: {
    url: 'mongodb://localhost:27017/enrollment-system',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Authentication configuration
  auth: {
    jwtSecret: 'development-secret-key',
    jwtExpiresIn: '1d',
    refreshTokenExpiresIn: '7d',
  },

  // CORS configuration
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },

  // Logging configuration
  logging: {
    level: 'debug',
    format: 'dev',
  },

  // Feature flags
  features: {
    enableRegistration: true,
    enablePasswordReset: true,
    enableEmailVerification: false,
  },
};
