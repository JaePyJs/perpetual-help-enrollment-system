# techContext.md

This file provides the technical context for the project in the Memory Bank system.

## Tech Stack

- List the main technologies used (languages, frameworks, platforms).

## Key Integrations

- Describe important integrations (APIs, services, etc).

## Technical Constraints

- List any technical constraints or limitations.

## Deployment/Hosting

- Describe deployment or hosting setup.

## Technologies Used

### Backend

- Node.js (runtime environment)
- Express.js (API server framework)
- MongoDB (database)
- Mongoose (ODM for MongoDB)
- Supabase (authentication and data storage)

### Frontend

- Next.js (React framework)
- React (UI library)
- TypeScript (type-safe JavaScript)
- CSS3 (styling with modular organization)
- Font Awesome (icon library)

### Tools

- VS Code (primary development environment)
- npm (package management)
- Git (version control)
- Next.js development server

## Development Setup

- Node.js and npm required
- Environment variables managed via configuration files in config directory
- Project structured into backend (enrollment-backend) and frontend (enrollment-frontend) directories
- Next.js frontend with src/app directory structure
- Supabase integration for authentication and data storage
- Backend runs on separate port with API endpoints

## Dependencies

### Backend Dependencies

- express: Web application framework
- mongoose: MongoDB object modeling
- dotenv: Environment variable management
- cors: Cross-origin resource sharing
- jsonwebtoken: Authentication via JWT
- bcrypt: Password hashing
- morgan: HTTP request logging

### Frontend Dependencies

- next: React framework (version 15.3.2)
- react: UI library (version 19.0.0)
- react-dom: React DOM renderer (version 19.0.0)
- typescript: Type-safe JavaScript
- @supabase/auth-helpers-nextjs: Supabase authentication for Next.js (version 0.9.0)
- @supabase/supabase-js: Supabase JavaScript client (version 2.39.3)
- @types/node: TypeScript types for Node.js
- @types/react: TypeScript types for React
- @types/react-dom: TypeScript types for React DOM

## Tool Usage Patterns

- Next.js development server for frontend development
- Environment-specific configuration files for different deployment scenarios
- Memory bank for project documentation and context maintenance
- Modular CSS approach with shared base styles and page-specific extensions
- Theme system using React context for light/dark mode support
- TypeScript interfaces for type safety and better code quality

### Security Middleware and Practices

- express-validator for input validation
- express-rate-limit for rate limiting
- helmet for HTTP headers
- xss-clean and custom XSS middleware
- express-mongo-sanitize for NoSQL injection
- Custom CSRF protection middleware
- Centralized error handling middleware
- bcrypt for password hashing
- Role-based access control middleware
- Secure cookie/session configuration
- Security event logging and monitoring
