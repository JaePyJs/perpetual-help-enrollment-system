/**
 * Build Script
 * Prepares the application for deployment
 */

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const config = require('../config');

// Start build process
console.log(`Starting build process for ${config.app.name} v${config.app.version} (${config.app.environment})`);
console.log('---------------------------------------------------------------');

try {
  // Create necessary directories
  const outputPath = path.resolve(__dirname, '..', config.frontend.outputPath);
  
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(`Created output directory: ${outputPath}`);
  }
  
  // Create logs directory if it doesn't exist
  const logsPath = path.resolve(__dirname, '..', config.logging.file.path);
  
  if (!fs.existsSync(logsPath)) {
    fs.mkdirSync(logsPath, { recursive: true });
    console.log(`Created logs directory: ${logsPath}`);
  }
  
  // Create uploads directory if it doesn't exist
  const uploadsPath = path.resolve(__dirname, '..', config.app.uploadDir);
  
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log(`Created uploads directory: ${uploadsPath}`);
  }
  
  // Install backend dependencies
  console.log('\nInstalling backend dependencies...');
  execCommand('npm ci --production', { cwd: path.resolve(__dirname, '..', 'enrollment-backend') });
  
  // Install frontend dependencies
  console.log('\nInstalling frontend dependencies...');
  execCommand('npm ci --production', { cwd: path.resolve(__dirname, '..', 'enrollment-frontend') });
  
  // Build frontend
  console.log('\nBuilding frontend...');
  // In a real application, you would have a build process for the frontend (e.g., webpack)
  // This is just a placeholder - in our case, we're directly using HTML, CSS, and JS files
  
  // Copy frontend files to the output directory
  console.log('\nCopying frontend files to output directory...');
  copyDirectory(
    path.resolve(__dirname, '..', 'enrollment-frontend'),
    outputPath,
    // Skip node_modules folder when copying
    (src) => !src.includes('node_modules')
  );
  
  // Remove any unnecessary files from the output directory
  console.log('\nCleaning up output directory...');
  // This would remove development and source files not needed in production
  
  console.log('\nCreating asset manifest...');
  const manifest = {
    name: config.app.name,
    version: config.app.version,
    environment: config.app.environment,
    buildTime: new Date().toISOString(),
    assets: []
  };
  
  // Create an asset manifest for cache busting
  fs.writeFileSync(
    path.join(outputPath, 'asset-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('\nBuild completed successfully!');
  console.log(`Output directory: ${outputPath}`);
  
} catch (error) {
  console.error('\nBuild failed!');
  console.error(error);
  process.exit(1);
}

/**
 * Execute a command and log output
 * @param {string} command - Command to execute
 * @param {object} options - Options for child_process.execSync
 * @returns {Buffer} - Command output
 */
function execCommand(command, options = {}) {
  try {
    const output = child_process.execSync(command, {
      stdio: 'inherit',
      ...options
    });
    return output;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

/**
 * Copy a directory recursively
 * @param {string} source - Source directory
 * @param {string} destination - Destination directory
 * @param {Function} filter - Filter function to determine which files to copy
 */
function copyDirectory(source, destination, filter = () => true) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  // Get all files in source directory
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    // Skip if file doesn't pass filter
    if (!filter(sourcePath)) {
      continue;
    }
    
    // Check if it's a directory or a file
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Recursively copy directory
      copyDirectory(sourcePath, destPath, filter);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}
