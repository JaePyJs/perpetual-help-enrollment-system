/**
 * Development Environment Configuration
 */

module.exports = {
  // Application settings
  app: {
    name: 'School Enrollment System',
    version: '1.0.0',
    environment: 'development',
    port: 5000,
    baseUrl: 'http://localhost:5000',
    publicPath: '/public',
    uploadDir: './uploads',
    timeZone: 'Asia/Manila',
    sessionSecret: 'dev-session-secret-change-this-in-production',
    cookieSecret: 'dev-cookie-secret-change-this-in-production'
  },

  // Database settings
  database: {
    mongodb: {
      uri: 'mongodb://localhost:27017/enrollment_system_dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      }
    }
  },

  // Authentication
  auth: {
    jwtSecret: 'dev-jwt-secret-change-this-in-production',
    jwtExpiresIn: '1d',
    refreshTokenExpiresIn: '7d',
    bcryptSaltRounds: 10,
    emailVerificationRequired: false,
    passwordResetExpiresIn: '1h'
  },

  // Email settings
  email: {
    provider: 'smtp',
    from: {
      name: 'School Enrollment System (DEV)',
      email: 'noreply@manila.uphsl.edu.ph'
    },
    smtp: {
      host: 'smtp.mailtrap.io', // Using Mailtrap for development
      port: 2525,
      secure: false,
      auth: {
        user: 'dev-smtp-user',
        pass: 'dev-smtp-password'
      }
    }
  },

  // Student ID configuration
  studentId: {
    prefix: 'm',  // Prefix for Manila campus
    separators: ['-', '-'], // Separators between components
    yearDigits: 2, // Number of digits for year part (e.g., '23' for 2023)
    idComponents: [4, 3], // Number of digits in each component after year
    emailDomain: 'manila.uphsl.edu.ph'
  },

  // Security settings
  security: {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:8080'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['X-Total-Count', 'X-Pagination'],
      credentials: true,
      maxAge: 86400
    },
    rateLimiter: {
      windowMs: 15 * 60 * 1000,
      max: 1000, // Higher limit for development
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true // Skip in development
    },
    csrf: {
      enabled: true,
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
      cookieOptions: {
        httpOnly: false,
        secure: false, // Not secure in development
        signed: true
      }
    },
    helmet: {
      contentSecurityPolicy: false // Disabled in development for easier debugging
    }
  },

  // Frontend build settings
  frontend: {
    buildPath: '../enrollment-frontend',
    outputPath: '../public',
    publicPath: '/'
  },

  // Logging settings
  logging: {
    level: 'debug',
    format: 'dev', // More readable format for development
    file: {
      enabled: true,
      path: './logs',
      filename: 'dev-app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '50m',
      maxFiles: '7d'
    },
    console: {
      enabled: true,
      colorize: true
    },
    metrics: {
      enabled: false
    }
  },

  // Monitoring settings
  monitoring: {
    enabled: false,
    serviceName: 'school-enrollment-system-dev'
  },

  // Testing settings
  testing: {
    coverage: {
      enabled: true,
      reporters: ['text', 'lcov', 'html'],
      directory: './coverage'
    },
    mocha: {
      timeout: 10000 // Longer timeout for dev
    }
  },

  // API documentation
  api: {
    swagger: {
      enabled: true,
      path: '/api-docs',
      title: 'School Enrollment System API (Development)',
      description: 'API documentation for the School Enrollment System',
      version: '1.0.0'
    }
  }
};
