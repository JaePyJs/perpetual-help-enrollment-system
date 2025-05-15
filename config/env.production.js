/**
 * Production Environment Configuration
 */

module.exports = {
  // Application settings
  app: {
    name: 'School Enrollment System',
    version: '1.0.0',
    environment: 'production',
    port: process.env.PORT || 5000,
    baseUrl: process.env.BASE_URL || 'https://enrollment.manila.uphsl.edu.ph',
    publicPath: '/public',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    timeZone: 'Asia/Manila',
    sessionSecret: process.env.SESSION_SECRET,
    cookieSecret: process.env.COOKIE_SECRET
  },

  // Database settings
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000
      }
    }
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    bcryptSaltRounds: 12,
    emailVerificationRequired: true,
    passwordResetExpiresIn: '1h'
  },

  // Email settings
  email: {
    provider: process.env.EMAIL_PROVIDER || 'smtp',
    from: {
      name: 'School Enrollment System',
      email: process.env.EMAIL_FROM || 'noreply@manila.uphsl.edu.ph'
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
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
      origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['https://enrollment.manila.uphsl.edu.ph'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['X-Total-Count', 'X-Pagination'],
      credentials: true,
      maxAge: 86400
    },
    rateLimiter: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
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
        secure: true,
        signed: true,
        sameSite: 'strict'
      }
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "*.googleapis.com", "*.cloudflare.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "*.googleapis.com", "*.cloudflare.com"],
          fontSrc: ["'self'", "fonts.gstatic.com", "data:"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'", "wss://*.uphsl.edu.ph", "https://*.uphsl.edu.ph"]
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
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
    file: {
      enabled: true,
      path: process.env.LOG_PATH || './logs',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    },
    console: {
      enabled: true,
      colorize: false
    },
    metrics: {
      enabled: true,
      interval: 60
    }
  },

  // Monitoring settings
  monitoring: {
    enabled: true,
    serviceName: 'school-enrollment-system',
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: 'production',
      tracesSampleRate: 0.2
    },
    prometheus: {
      enabled: process.env.PROMETHEUS_ENABLED === 'true',
      port: parseInt(process.env.PROMETHEUS_PORT || '9090', 10)
    },
    healthCheck: {
      enabled: true,
      path: '/health',
      interval: 60
    }
  },

  // Testing settings
  testing: {
    coverage: {
      enabled: false
    },
    mocha: {
      timeout: 5000
    }
  },

  // API documentation
  api: {
    swagger: {
      enabled: process.env.API_DOCS_ENABLED === 'true',
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
