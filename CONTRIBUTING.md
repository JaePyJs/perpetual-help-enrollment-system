# Contributing to Perpetual Help College Enrollment System

Thank you for considering contributing to the Perpetual Help College Enrollment System! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code. Please report unacceptable behavior to [support@uphc.edu.ph](mailto:support@uphc.edu.ph).

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB (local or cloud instance)
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/perpetual-help-enrollment-system.git
   cd perpetual-help-enrollment-system
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/JaePyJs/perpetual-help-enrollment-system.git
   ```
4. Install dependencies:
   ```bash
   # Backend dependencies
   cd enrollment-backend
   npm install
   
   # Frontend dependencies
   cd ../enrollment-frontend
   npm install
   ```
5. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make sure your branch is up to date with the main repository:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. Make your changes, following the coding standards
3. Run tests to ensure your changes don't break existing functionality
4. Commit your changes following the commit guidelines
5. Push your changes to your fork
6. Submit a pull request

## Coding Standards

### General

- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Keep functions small and focused on a single task
- Add comments for complex logic
- Follow the principle of DRY (Don't Repeat Yourself)

### JavaScript/TypeScript

- Follow the ESLint configuration provided in the project
- Use ES6+ features when appropriate
- Use TypeScript types and interfaces for better type safety
- Avoid using `any` type in TypeScript
- Use async/await for asynchronous code

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types or TypeScript interfaces
- Follow the component structure established in the project
- Use the provided UI components from the component library

### CSS/Styling

- Follow the established design system
- Use the provided CSS variables for colors, spacing, etc.
- Use responsive design principles
- Ensure accessibility (WCAG compliance)

## Commit Guidelines

- Use clear, descriptive commit messages
- Start with a verb in the present tense (e.g., "Add", "Fix", "Update")
- Reference issue numbers when applicable
- Keep commits focused on a single change
- Example: `Fix: Resolve login authentication issue (#123)`

## Pull Request Process

1. Update the README.md or documentation with details of changes if appropriate
2. Make sure all tests pass
3. Ensure your code follows the established coding standards
4. Fill out the pull request template completely
5. Request a review from at least one maintainer
6. Address any feedback from reviewers
7. Once approved, a maintainer will merge your pull request

## Testing

- Write tests for new features and bug fixes
- Ensure all tests pass before submitting a pull request
- Backend tests use Jest
- Frontend tests use React Testing Library
- Run tests with:
  ```bash
  # Backend tests
  cd enrollment-backend
  npm test
  
  # Frontend tests
  cd enrollment-frontend
  npm test
  ```

## Documentation

- Update documentation for any changes to APIs, features, or behavior
- Document new features thoroughly
- Use JSDoc comments for functions and methods
- Keep README files up to date
- Follow the established documentation structure

## Issue Reporting

- Use the issue tracker to report bugs or request features
- Check if the issue already exists before creating a new one
- For bugs, include:
  - Clear description of the issue
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots if applicable
  - Environment details (browser, OS, etc.)
- For feature requests, include:
  - Clear description of the feature
  - Rationale for adding the feature
  - Any relevant examples or mockups

Thank you for contributing to the Perpetual Help College Enrollment System!
