# Perpetual Help College of Manila - Enrollment System Configuration

This directory contains configuration files for the Perpetual Help College of Manila Enrollment System project.

## Configuration Structure

The configuration system uses a hierarchical approach:

1. Base configuration is defined in `env.example.js`
2. Environment-specific configurations override base settings
3. Environment variables can override file-based configuration

## Configuration Files

- **index.js** - Main configuration loader that determines which environment to use
- **env.example.js** - Template with all available configuration options
- **env.development.js** - Development environment settings
- **env.production.js** - Production environment settings
- **env.testing.js** - Testing environment settings
- **development.js** - Frontend development configuration
- **production.js** - Frontend production configuration
- **testing.js** - Frontend testing configuration

## Configuration Parameters

### Application Settings

```javascript
app: {
  name: 'School Enrollment System',
  version: '1.0.0',
  environment: 'development', // development, testing, production
  port: 5000,
  baseUrl: 'http://localhost:5000',
  publicPath: '/public',
  uploadDir: './uploads',
  timeZone: 'Asia/Manila',
  sessionSecret: 'your-session-secret',
  cookieSecret: 'your-cookie-secret'
}
```

### Database Settings

```javascript
database: {
  mongodb: {
    uri: 'mongodb://localhost:27017/enrollment_system',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    }
  }
}
```

### Authentication Settings

```javascript
auth: {
  jwtSecret: 'your-jwt-secret',
  jwtExpiresIn: '1d', // 1 day
  refreshTokenExpiresIn: '7d', // 7 days
  bcryptSaltRounds: 10,
  emailVerificationRequired: true,
  passwordResetExpiresIn: '1h' // 1 hour
}
```

### Email Settings

```javascript
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
  }
}
```

### Security Settings

```javascript
security: {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  helmet: {
    contentSecurityPolicy: true
  }
}
```

## Usage

The configuration is loaded automatically based on the `NODE_ENV` environment variable:

```javascript
// Set environment
process.env.NODE_ENV = "development";

// Load configuration
const config = require("./config");

// Use configuration
const port = config.app.port;
const mongoUri = config.database.mongodb.uri;
```

## Environment Variables

You can override any configuration setting using environment variables. For example:

```bash
PORT=8080
MONGODB_URI=mongodb://user:pass@host:port/db
JWT_SECRET=my-secret-key
```

These will override the corresponding settings in the configuration files.
