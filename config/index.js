/**
 * Configuration Loader
 * Loads the appropriate environment configuration based on NODE_ENV
 */

const path = require("path");
const fs = require("fs");

// Determine which environment to use
const env = process.env.NODE_ENV || "development";
console.log(`Loading ${env} environment configuration`);

// Define path to environment config file
const configPath = path.join(__dirname, `${env}.js`);

// Check if the configuration file exists
if (!fs.existsSync(configPath)) {
  console.error(
    `Configuration file for environment "${env}" does not exist: ${configPath}`
  );
  console.error(
    "Please create the configuration file or set the NODE_ENV environment variable correctly."
  );
  console.error("Available environments:");

  // List available environment files
  fs.readdirSync(__dirname)
    .filter(
      (file) =>
        file.endsWith(".js") &&
        !file.startsWith("index") &&
        !file.startsWith("README")
    )
    .forEach((file) => {
      console.error(`  - ${file.substring(0, file.length - 3)}`);
    });

  process.exit(1);
}

// Load configuration
let config;
try {
  config = require(configPath);

  // Apply any overrides from environment variables for sensitive data
  applyEnvironmentOverrides(config);

  console.log(`Successfully loaded ${env} environment configuration`);
} catch (error) {
  console.error(`Error loading configuration: ${error.message}`);
  process.exit(1);
}

/**
 * Apply environment variable overrides to configuration
 * This allows for sensitive data to be passed via environment variables
 * rather than being hard-coded in config files
 *
 * @param {Object} config - Configuration object
 */
function applyEnvironmentOverrides(config) {
  // This is just a basic implementation
  // In a real-world scenario, you might want to use a more sophisticated
  // environment variable handler like dotenv-expand or similar

  // Server configuration
  if (process.env.PORT) {
    config.server.port = parseInt(process.env.PORT, 10);
  }

  if (process.env.HOST) {
    config.server.host = process.env.HOST;
  }

  // Frontend configuration
  if (process.env.FRONTEND_URL) {
    config.frontend.url = process.env.FRONTEND_URL;
  }

  // Database configuration
  if (process.env.MONGODB_URI) {
    config.database.url = process.env.MONGODB_URI;
  }

  // Authentication configuration
  if (process.env.JWT_SECRET) {
    config.auth.jwtSecret = process.env.JWT_SECRET;
  }

  if (process.env.JWT_EXPIRES_IN) {
    config.auth.jwtExpiresIn = process.env.JWT_EXPIRES_IN;
  }

  if (process.env.REFRESH_TOKEN_EXPIRES_IN) {
    config.auth.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;
  }

  // CORS configuration
  if (process.env.CORS_ORIGIN) {
    config.cors.origin = process.env.CORS_ORIGIN.split(",");
  }

  // Logging configuration
  if (process.env.LOG_LEVEL) {
    config.logging.level = process.env.LOG_LEVEL;
  }

  // Feature flags
  if (process.env.ENABLE_REGISTRATION) {
    config.features.enableRegistration =
      process.env.ENABLE_REGISTRATION === "true";
  }

  if (process.env.ENABLE_PASSWORD_RESET) {
    config.features.enablePasswordReset =
      process.env.ENABLE_PASSWORD_RESET === "true";
  }

  if (process.env.ENABLE_EMAIL_VERIFICATION) {
    config.features.enableEmailVerification =
      process.env.ENABLE_EMAIL_VERIFICATION === "true";
  }
}

// Export the loaded configuration
module.exports = config;
