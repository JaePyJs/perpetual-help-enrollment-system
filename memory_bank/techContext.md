# techContext.md

This file provides the technical context for the project in the Memory Bank system.

## Project Structure

- **Backend**: `enrollment-backend/` - Express.js API server with MongoDB
- **Original Frontend**: `enrollment-frontend/` - HTML/CSS/JS with working API integration
- **New Frontend**: `enrollment-system (1)/` - Next.js with TypeScript and modern components

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, WebSocket
- **Original Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **New Frontend**: Next.js, React, TypeScript, CSS Modules, shadcn components
- **Authentication**: JWT-based with token refresh
- **Form Handling**: react-hook-form, zod validation
- **State Management**: React Context API
- **UI Components**: Custom components with CSS modules

## Key Integrations

- Backend API integration for authentication, student data, and user management
- JWT-based authentication with token refresh
- MongoDB database for data storage
- Express.js API server for backend functionality
- WebSocket server for real-time notifications
- CSRF protection middleware for security
- Role-based access control for authorization

## Technical Constraints

- Backend API must be running for frontend to function properly
- MongoDB database required for data storage
- JWT authentication requires proper token handling and refresh logic
- Environment variables must be properly configured in .env.local file
- Frontend and backend run on separate ports and must be started independently
- Form validation requires proper schema definitions with zod
- WebSocket server initialization may cause connectivity issues
- CSRF protection may block legitimate requests if not properly configured
- Token storage must be consistent between middleware and auth context
- Backend server has connectivity issues that need to be resolved
- Two frontend implementations with different architectures and designs

## Deployment/Hosting

- Development: Local Node.js server for backend, Next.js development server for frontend
- Production: Backend can be deployed to any Node.js hosting service (Heroku, AWS, etc.)
- Frontend can be deployed to Vercel or any Next.js-compatible hosting service
- MongoDB database can be hosted on MongoDB Atlas or similar service
- Environment variables must be properly configured in production environment
- CORS must be properly configured to allow frontend-backend communication

## Technologies Used

### Backend

- Node.js (runtime environment)
- Express.js (API server framework)
- MongoDB (database)
- Mongoose (ODM for MongoDB)
- JWT (JSON Web Tokens for authentication)
- bcrypt (password hashing)

### Frontend

- Next.js (React framework)
- React (UI library)
- TypeScript (type-safe JavaScript)
- CSS3 (styling with modular organization)
- Font Awesome (icon library)
- JWT handling for authentication
- Custom API client for backend integration

### Tools

- VS Code (primary development environment)
- npm (package management)
- Git (version control)
- Next.js development server

## Development Setup

- Node.js and npm required
- Environment variables managed via .env.local file and config directory
- Project structured into:
  - Backend (`enrollment-backend/`) - Express.js API server
  - Original Frontend (`enrollment-frontend/`) - HTML/CSS/JS
  - New Frontend (`enrollment-system (1)/`) - Next.js with TypeScript
- Next.js frontend with app directory structure
- JWT-based authentication with token refresh
- Backend runs on separate port (5000) with RESTful API endpoints
- MongoDB database for data storage
- WebSocket server for real-time notifications
- CSRF protection middleware for security
- Backend server has connectivity issues that need to be resolved

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
- @hookform/resolvers: Form validation library
- react-hook-form: Form state management
- zod: Schema validation library
- date-fns: Date utility library
- lucide-react: Icon library
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
- JWT-based authentication with token refresh for secure user sessions
- Custom API client for consistent backend communication
- Form validation with react-hook-form and zod
- Error handling with dedicated error components
- Loading state management for asynchronous operations
- WebSocket server for real-time notifications
- CSRF protection middleware for security
- Role-based access control for authorization
- Phased approach to migration from original to new frontend
- Testing scripts for API endpoint validation

### Security Middleware and Practices

- express-validator for input validation
- express-rate-limit for rate limiting
- helmet for HTTP headers
- xss-clean and custom XSS middleware
- express-mongo-sanitize for NoSQL injection
- Custom CSRF protection middleware (may be blocking legitimate requests)
- Centralized error handling middleware
- bcrypt for password hashing
- JWT-based authentication with token refresh
- Role-based access control middleware
- Secure cookie/session configuration
- Security event logging and monitoring
- Password strength validation
- Token-based authentication with expiration
- Proper error handling to prevent information leakage
- Input sanitization to prevent injection attacks
- WebSocket server for real-time notifications (may cause connectivity issues)
- Inconsistent token storage between middleware (cookies) and auth context (localStorage)
