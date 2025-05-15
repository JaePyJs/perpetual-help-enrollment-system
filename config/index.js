/**
 * Configuration Loader
 * Loads the appropriate environment configuration based on NODE_ENV
 */

const path = require('path');
const fs = require('fs');

// Determine which environment to use
const env = process.env.NODE_ENV || 'development';
console.log(`Loading ${env} environment configuration`);

// Define path to environment config file
const configPath = path.join(__dirname, `env.${env}.js`);

// Check if the configuration file exists
if (!fs.existsSync(configPath)) {
  console.error(`Configuration file for environment "${env}" does not exist: ${configPath}`);
  console.error('Please create the configuration file or set the NODE_ENV environment variable correctly.');
  console.error('Available environments:');
  
  // List available environment files
  fs.readdirSync(__dirname)
    .filter(file => file.startsWith('env.') && file.endsWith('.js') && file !== 'env.example.js')
    .forEach(file => {
      console.error(`  - ${file.substring(4, file.length - 3)}`);
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
  
  // Example overrides (expand as needed):
  if (process.env.PORT) {
    config.app.port = parseInt(process.env.PORT, 10);
  }
  
  if (process.env.MONGODB_URI) {
    config.database.mongodb.uri = process.env.MONGODB_URI;
  }
  
  if (process.env.JWT_SECRET) {
    config.auth.jwtSecret = process.env.JWT_SECRET;
  }
  
  // Add more overrides as needed
}

// Export the loaded configuration
module.exports = config;
