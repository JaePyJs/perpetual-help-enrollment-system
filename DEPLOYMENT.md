# School Enrollment System - Deployment Guide

## Overview

This document outlines the deployment infrastructure and processes for the School Enrollment System.

## Infrastructure Components

### 1. Environment Configuration

Environment-specific configuration files are located in the `config` directory:

- `env.development.js` - Development environment settings
- `env.production.js` - Production environment settings
- `env.example.js` - Template for new environments

The system dynamically loads configuration based on the `NODE_ENV` environment variable.

### 2. Application Monitoring

The monitoring system provides real-time insights into application health and performance:

- Health checks for memory, CPU, response time, and error rates
- Performance metrics tracking
- Error tracking and reporting
- Student enrollment analytics (tracking by enrollment year and department)
- Admin monitoring dashboard

#### Accessing the Monitoring Dashboard

Access the monitoring dashboard at `/monitoring-dashboard.html` with admin credentials.

### 3. Continuous Integration / Continuous Deployment (CI/CD)

Automated CI/CD is configured via GitHub Actions:

- Triggered on pushes to `main` (production) and `development` branches
- Automated testing (unit, integration, API)
- Build process for frontend and backend
- Deployment to development or production environments
- Database migrations
- Notification system via Slack

## Deployment Workflow

### Development Deployment

1. Push changes to the `development` branch
2. GitHub Actions automatically:
   - Runs linting checks
   - Executes all tests
   - Builds the application
   - Deploys to the development environment
   - Performs database migrations
   - Sends notification of completed deployment

### Production Deployment

1. Create a pull request from `development` to `main`
2. After review and approval, merge the PR
3. GitHub Actions automatically:
   - Runs linting checks
   - Executes all tests
   - Builds the application
   - Deploys to the production environment
   - Performs database migrations
   - Sends notification of completed deployment

## Required Secrets

For the GitHub Actions workflow to function correctly, the following secrets must be configured in the repository:

- `AWS_ACCESS_KEY_ID` - AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key for deployment
- `DEV_MONGODB_URI` - MongoDB connection string for development
- `PROD_MONGODB_URI` - MongoDB connection string for production
- `DEV_CLOUDFRONT_DISTRIBUTION` - CloudFront distribution ID for development
- `PROD_CLOUDFRONT_DISTRIBUTION` - CloudFront distribution ID for production
- `SLACK_WEBHOOK_URL` - Webhook URL for Slack notifications

## Manual Deployment

If necessary, manual deployment can be performed using the scripts in the `scripts` directory:

```bash
# Build the application
node scripts/build.js

# Deploy to development
node scripts/deploy.js --env=development

# Deploy to production
node scripts/deploy.js --env=production
```

## Student Identification System

The system uses a standardized format for student IDs:

- Format: `m[YY]-XXXX-XXX`
  - `m` is the prefix (for Manila campus)
  - `YY` is the year of enrollment (e.g., 23 for 2023)
  - `XXXX-XXX` is a unique identifier, with ranges assigned to specific departments

- Email addresses follow the pattern: `[student-id]@manila.uphsl.edu.ph`
  - Example: `m23-1470-578@manila.uphsl.edu.ph`

The monitoring system tracks student distribution by enrollment year (based on the YY component) and by department.

## Troubleshooting

### Common Deployment Issues

1. **Failed Tests**: Ensure all tests pass locally before pushing changes.
2. **Environment Configuration**: Verify that all required environment variables are set correctly.
3. **Database Connection**: Check MongoDB connection strings and network access.
4. **AWS Permissions**: Ensure the AWS IAM user has appropriate permissions for S3 and CloudFront.

### Monitoring Alerts

The monitoring system will send alerts when:
- Server memory usage exceeds 80%
- CPU utilization is consistently high
- Error rate exceeds 5%
- Response time is above acceptable thresholds

## Contact

For deployment issues, contact the system administrator at admin@uphsl.edu.ph.
