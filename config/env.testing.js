/**
 * Testing Environment Configuration
 */

module.exports = {
  // Application settings
  app: {
    name: "School Enrollment System",
    version: "1.0.0",
    environment: "testing",
    port: 5001,
    baseUrl: "http://localhost:5001",
    publicPath: "/public",
    uploadDir: "./uploads",
    timeZone: "Asia/Manila",
    sessionSecret: "test-session-secret",
    cookieSecret: "test-cookie-secret",
  },

  // Database settings - MongoDB will be replaced by in-memory MongoDB for tests
  database: {
    mongodb: {
      // This will be overridden by test setup
      uri: "mongodb://localhost:27017/enrollment_system_test",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      },
    },
  },

  // Authentication
  auth: {
    jwtSecret: "test-jwt-secret",
    jwtExpiresIn: "1h",
    refreshTokenExpiresIn: "1d",
    bcryptSaltRounds: 4, // Lower for faster tests
    emailVerificationRequired: false,
    passwordResetExpiresIn: "1h",
  },

  // Email configuration
  email: {
    provider: "test",
    from: "test@example.com",
    sendGridApiKey: "test-key",
    templates: {
      welcome: "welcome-template",
      passwordReset: "password-reset-template",
      verifyEmail: "verify-email-template",
    },
  },

  // Monitoring configuration
  monitoring: {
    enabled: true,
    healthCheck: {
      enabled: true,
      path: "/health",
      interval: 60,
    },
    metrics: {
      interval: 30,
    },
    prometheus: {
      enabled: false,
    },
    sentry: {
      enabled: false,
      dsn: "test-dsn",
      environment: "testing",
      tracesSampleRate: 1.0,
    },
  },

  // Feature flags
  features: {
    twoFactorAuth: true,
    passwordHistory: true,
    reCaptcha: false,
    auditLogs: true,
    studentIDGeneration: true,
    enrollmentAnalytics: true,
  },

  // Security
  security: {
    corsEnabled: true,
    corsOrigins: ["http://localhost:8080"],
    rateLimiting: {
      enabled: false,
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    csrfProtection: false, // Disabled for testing
    xssProtection: true,
    mongoSanitize: true,
    parameterPollution: true,
  },
};
