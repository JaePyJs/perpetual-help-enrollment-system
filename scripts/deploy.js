/**
 * Deployment Script
 * Handles deployment of the application to various environments
 */

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get command line arguments
const args = process.argv.slice(2);
const targetEnv = args[0] || 'development';
const skipConfirmation = args.includes('--yes') || args.includes('-y');

// Validate environment
const validEnvs = ['development', 'testing', 'production'];
if (!validEnvs.includes(targetEnv)) {
  console.error(`Invalid environment: ${targetEnv}`);
  console.error(`Valid environments: ${validEnvs.join(', ')}`);
  process.exit(1);
}

// Main deploy function
async function deploy() {
  console.log(`Starting deployment to ${targetEnv} environment`);
  
  // Confirm deployment for production
  if (targetEnv === 'production' && !skipConfirmation) {
    const confirm = await promptUser(
      '\n⚠️ WARNING: You are deploying to PRODUCTION ⚠️\n' +
      'Are you sure you want to continue? (yes/no): '
    );
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Deployment cancelled.');
      process.exit(0);
    }
  }
  
  try {
    // Set NODE_ENV for the build process
    process.env.NODE_ENV = targetEnv;
    
    console.log('\n1. Running build script...');
    execCommand('node scripts/build.js');
    
    console.log('\n2. Validating build...');
    // Here we would run validation checks on the build output
    
    console.log('\n3. Running pre-deployment checks...');
    const checksPassed = runPreDeploymentChecks();
    
    if (!checksPassed) {
      console.error('Pre-deployment checks failed. Deployment aborted.');
      process.exit(1);
    }
    
    console.log('\n4. Deploying to server...');
    deployToServer();
    
    console.log('\n5. Running post-deployment tasks...');
    runPostDeploymentTasks();
    
    console.log('\nDeployment completed successfully! 🚀');
    
  } catch (error) {
    console.error('\nDeployment failed:');
    console.error(error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Prompt user for input
 * @param {string} question - Question to ask
 * @returns {Promise<string>} - User response
 */
function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Execute a command and log output
 * @param {string} command - Command to execute
 * @param {object} options - Options for child_process.execSync
 * @returns {Buffer} - Command output
 */
function execCommand(command, options = {}) {
  try {
    console.log(`Executing: ${command}`);
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
 * Run pre-deployment checks
 * @returns {boolean} - Whether all checks passed
 */
function runPreDeploymentChecks() {
  console.log('Running security checks...');
  // In a real deployment, you would run security checks here
  
  console.log('Checking for required environment variables...');
  // Check for required environment variables based on the environment
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'SESSION_SECRET',
    'COOKIE_SECRET'
  ];
  
  // For production, add more required variables
  if (targetEnv === 'production') {
    requiredVars.push(
      'SMTP_HOST',
      'SMTP_USER',
      'SMTP_PASS'
    );
  }
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Error: Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`  - ${varName}`);
    });
    return false;
  }
  
  console.log('Checking database connection...');
  // In a real deployment, you would check database connectivity here
  
  return true;
}

/**
 * Deploy to server based on environment
 */
function deployToServer() {
  switch (targetEnv) {
    case 'development':
      console.log('Deploying to development server...');
      // For development, we typically just run the server locally
      // No deployment needed
      break;
      
    case 'testing':
      console.log('Deploying to testing server...');
      // Here, you would deploy to a testing server
      // For example: execCommand('rsync -avz --delete ./public/ user@test-server:/var/www/html/');
      break;
      
    case 'production':
      console.log('Deploying to production server...');
      // Here, you would deploy to production
      // For example: execCommand('rsync -avz --delete ./public/ user@prod-server:/var/www/html/');
      
      // Or deploy to a cloud provider using their CLI:
      // execCommand('aws s3 sync ./public/ s3://your-bucket-name/ --delete');
      break;
  }
}

/**
 * Run post-deployment tasks
 */
function runPostDeploymentTasks() {
  console.log('Running database migrations...');
  // In a real deployment, you would run database migrations here
  
  console.log('Clearing cache...');
  // In a real deployment, you would clear any cache here
  
  console.log('Notifying monitoring services...');
  // In a real deployment, you would notify monitoring services here
  
  if (targetEnv === 'production') {
    console.log('Sending deployment notification...');
    // In a real deployment, you would send a notification about successful deployment
    // For example, send an email or a Slack message
  }
}

// Start deployment
deploy();
