# Perpetual Help College of Manila - Enrollment System Scripts

This directory contains utility and deployment scripts for the Perpetual Help College of Manila Enrollment System.

## Directory Structure

- **deployment/** - Scripts for deploying and running the application
- **testing/** - Scripts for testing the application
- **utilities/** - Utility scripts for various tasks

## Deployment Scripts

### start-servers.bat

Starts all servers required for the application:

1. MongoDB database server
2. Backend API server
3. Frontend Next.js server

Usage:

```bash
./scripts/deployment/start-servers.bat
```

### seed-database.bat

Seeds the database with test accounts for development and testing:

- Student: `student@uphc.edu.ph` / student123
- Teacher: `teacher@uphc.edu.ph` / teacher123
- Admin: `admin@uphc.edu.ph` / admin123
- Global Admin: `global-admin@uphc.edu.ph` / admin123

Usage:

```bash
./scripts/deployment/seed-database.bat
```

### github-upload.bat

Uploads the project to GitHub:

1. Configures Git if not already configured
2. Initializes Git repository if not already initialized
3. Adds remote repository if not already added
4. Stages, commits, and pushes changes to GitHub

Usage:

```bash
./scripts/deployment/github-upload.bat
```

## Testing Scripts

The testing directory contains scripts for testing the system:

- **run-tests.bat** - Runs all tests for the application
- **test-\*.js** - Various test scripts for different components of the system

## Utility Scripts

### update-paths.js

Updates import paths in the codebase:

1. Finds all TypeScript, JavaScript, JSON, and config files
2. Updates import paths to match the new project structure

Usage:

```bash
node scripts/utilities/update-paths.js
```

### update-next-paths.js

Updates paths in the Next.js build directory:

1. Finds all files in the .next directory
2. Updates paths to match the new project structure

Usage:

```bash
node scripts/utilities/update-next-paths.js
```

### build.js

Builds the application for production:

1. Cleans the output directory
2. Builds the backend
3. Builds the frontend
4. Copies files to the output directory
5. Creates an asset manifest

### deploy.js

Deploys the application to the specified environment:

1. Runs pre-deployment checks
2. Builds the application
3. Deploys to the specified environment

## Adding New Scripts

When adding new scripts to this directory:

1. Place the script in the appropriate subdirectory (deployment, testing, or utilities)
2. Document the script in this README.md file
3. Make the script executable if necessary (chmod +x for Unix-based systems)
4. Use consistent naming conventions (kebab-case for script names)
5. Include proper error handling and logging in the script
