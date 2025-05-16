/**
 * Testing environment configuration
 */

module.exports = {
  // Server configuration
  server: {
    port: 3002,
    host: 'localhost',
  },

  // Frontend configuration
  frontend: {
    url: 'http://localhost:3000',
  },

  // Database configuration
  database: {
    url: 'mongodb://localhost:27017/enrollment-system-test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Authentication configuration
  auth: {
    jwtSecret: 'testing-secret-key',
    jwtExpiresIn: '1h',
    refreshTokenExpiresIn: '1d',
  },

  // CORS configuration
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },

  // Logging configuration
  logging: {
    level: 'error',
    format: 'dev',
  },

  // Feature flags
  features: {
    enableRegistration: true,
    enablePasswordReset: true,
    enableEmailVerification: true,
  },

  // Test accounts
  testAccounts: {
    student: {
      email: 'm23-1470-578@manila.uphsl.edu.ph',
      password: 'Test@123',
    },
    teacher: {
      email: 'teacher@manila.uphsl.edu.ph',
      password: 'Test@123',
    },
    admin: {
      email: 'admin@manila.uphsl.edu.ph',
      password: 'Test@123',
    },
    globalAdmin: {
      email: 'global-admin@manila.uphsl.edu.ph',
      password: 'Test@123',
    },
  },
};
