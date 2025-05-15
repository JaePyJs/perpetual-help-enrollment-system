/**
 * Environment Configuration Example
 * Copy this file to env.development.js, env.testing.js, and env.production.js
 * and update the values accordingly for each environment.
 */

module.exports = {
  // Application settings
  app: {
    name: 'School Enrollment System',
    version: '1.0.0',
    environment: 'development', // development, testing, production
    port: 5000,
    baseUrl: 'http://localhost:5000',
    publicPath: '/public',
    uploadDir: './uploads',
    timeZone: 'Asia/Manila',
    sessionSecret: 'change-this-to-a-secure-random-string',
    cookieSecret: 'change-this-to-a-secure-random-string'
  },

  // Database settings
  database: {
    mongodb: {
      uri: 'mongodb://localhost:27017/enrollment_system',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      }
    }
  },

  // Authentication
  auth: {
    jwtSecret: 'change-this-to-a-secure-random-string',
    jwtExpiresIn: '1d', // 1 day
    refreshTokenExpiresIn: '7d', // 7 days
    bcryptSaltRounds: 10,
    emailVerificationRequired: true,
    passwordResetExpiresIn: '1h' // 1 hour
  },

  // Email settings
  email: {
    provider: 'smtp', // smtp, sendgrid, ses
    from: {
      name: 'School Enrollment System',
      email: 'noreply@manila.uphsl.edu.ph'
    },
    smtp: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'username',
        pass: 'password'
      }
    },
    sendgrid: {
      apiKey: 'your-sendgrid-api-key'
    },
    aws: {
      accessKeyId: 'your-aws-access-key',
      secretAccessKey: 'your-aws-secret-key',
      region: 'us-east-1'
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
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['X-Total-Count', 'X-Pagination'],
      credentials: true,
      maxAge: 86400 // 24 hours
    },
    rateLimiter: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false
    },
    csrf: {
      enabled: true,
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
      cookieOptions: {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        signed: true
      }
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
          fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'blob:'],
          connectSrc: ["'self'", 'ws://localhost:5000', 'http://localhost:5000']
        }
      }
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
    level: 'debug', // debug, info, warn, error
    format: 'combined', // combined, common, dev, short, tiny
    file: {
      enabled: true,
      path: './logs',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m', // 20 megabytes
      maxFiles: '14d' // keep logs for 14 days
    },
    console: {
      enabled: true,
      colorize: true
    },
    metrics: {
      enabled: true,
      interval: 60 // seconds
    }
  },

  // Monitoring settings
  monitoring: {
    enabled: false,
    serviceName: 'school-enrollment-system',
    sentry: {
      dsn: '',
      environment: 'development',
      tracesSampleRate: 0.2
    },
    prometheus: {
      enabled: false,
      port: 9090
    },
    healthCheck: {
      enabled: true,
      path: '/health',
      interval: 60 // seconds
    }
  },

  // Testing settings
  testing: {
    coverage: {
      enabled: true,
      reporters: ['text', 'lcov', 'html'],
      directory: './coverage'
    },
    mocha: {
      timeout: 5000
    }
  },

  // API documentation
  api: {
    swagger: {
      enabled: true,
      path: '/api-docs',
      title: 'School Enrollment System API',
      description: 'API documentation for the School Enrollment System',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@manila.uphsl.edu.ph',
        url: 'https://manila.uphsl.edu.ph/api-support'
      }
    }
  }
};
