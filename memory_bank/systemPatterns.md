# System Patterns

This file documents system patterns and best practices for the project in the Memory Bank system.

> npm is the standard package manager for both frontend and backend. PowerShell is recommended as the default terminal for Windows development.

## Project Structure

- **Backend (`enrollment-backend/`)**: Express.js API server with MongoDB
- **Original Frontend (`enrollment-frontend/`)**: HTML/CSS/JS with working API integration
- **New Frontend (`enrollment-system (1)/`)**: Next.js with TypeScript and modern components

## Architectural Patterns

- Modular Next.js app structure with app directory for pages and components
- MongoDB integration for data storage
- JWT-based authentication with token refresh
- Separation of concerns between data hooks, UI components, and pages
- Express.js middleware for security and validation

## Design Patterns

- Reusable component pattern (Button, Card, Avatar, Icon)
- Optimistic UI updates for form submissions
- Responsive design using CSS modules and mobile-first breakpoints
- Animation/transition pattern for interactive elements
- Automated testing with Jest and React Testing Library
- Accessibility linting with eslint-plugin-jsx-a11y
- Theme system using React context for light/dark mode
- Form validation with react-hook-form and zod
- Error handling with dedicated error components
- Loading state management for asynchronous operations
- API service layer for consistent backend communication
- Role-based access control for authorization
- Protected routes with authentication guards

## Process Patterns

- Memory Bank workflow: VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT/ARCHIVE
- Systematic, documented task execution and progress tracking
- Not marking tasks as complete until user confirmation
- CI/CD pipeline for automated testing and deployment

## Security and Validation Patterns

- All backend routes use centralized validation middleware (express-validator) for input validation
- XSS, CSRF, HTTP parameter pollution, and NoSQL injection protections are enforced globally via middleware
- Passwords are validated for strength and hashed using bcrypt before storage
- Role-based access control is implemented via middleware (checkRole) for all protected endpoints
- Error handling middleware ensures no sensitive error details are leaked in production
- Rate limiting is applied to authentication and API routes to prevent brute force attacks
- Secure cookie/session handling with httpOnly, secure, and sameSite flags
- Security event logging and monitoring are in place for auditability
- All API endpoints are being reviewed for consistent validation and least-privilege access
- JWT-based authentication with token refresh for secure user sessions
- WebSocket server for real-time notifications (may cause connectivity issues)
- CSRF protection middleware may be blocking legitimate requests
- Inconsistent token storage between middleware (cookies) and auth context (localStorage)

## Notable Implementations

- Student Finances and Grades pages with responsive tables and cards
- Sidebar navigation with clear links to all student features
- Button and Card components used across multiple pages
- Data-label attributes for mobile-friendly tables
- Jest/RTL sample test for Button component
- Accessibility linting and manual audit checklist
- Analytics integration instructions (Plausible)
- Deployment pipeline with Vercel/Netlify and GitHub Actions
- Comprehensive graphics system with gender-specific avatars and consistent icons
- Reusable Avatar component with support for male/female student and teacher avatars
- Icon component for dashboard and status icons with consistent styling
- EmptyState component for better user experience when no data is available
- Alert component for consistent status messages and notifications
- Chart components (GpaChart, SubjectChart, AttendanceChart) for data visualization

## Migration Strategy

- Phase 1: Fix Backend Issues

  - Fix backend connectivity issues by disabling WebSocket server temporarily
  - Simplify CORS and CSRF configuration for development
  - Add detailed logging to identify bottlenecks
  - Create comprehensive API testing suite for all endpoints

- Phase 2: Integrate New Frontend with Backend

  - Update auth-context.tsx to properly handle API responses and errors
  - Ensure token storage is consistent (either cookies or localStorage)
  - Update middleware.ts to match the token storage method
  - Replace mock data with real API calls in student dashboard

- Phase 3: Complete Feature Implementation

  - Implement student features (course enrollment, grade viewing, schedule management)
  - Implement teacher features (student management, grade submission)
  - Implement admin features (user management, system configuration)

- Phase 4: Testing and Refinement
  - Implement end-to-end testing for complete user flows
  - Improve responsive design and accessibility
  - Optimize performance with caching strategies
