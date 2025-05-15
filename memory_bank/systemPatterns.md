# System Patterns

This file documents system patterns and best practices for the project in the Memory Bank system.

> npm is the standard package manager for both frontend and backend. PowerShell is recommended as the default terminal for Windows development.

## Architectural Patterns

- Modular Next.js app structure with src/app for pages and components
- Supabase integration for authentication and data storage
- Separation of concerns between data hooks, UI components, and pages

## Design Patterns

- Reusable component pattern (Button, Card)
- Optimistic UI updates for form submissions
- Responsive design using CSS modules and mobile-first breakpoints
- Animation/transition pattern for interactive elements
- Automated testing with Jest and React Testing Library
- Accessibility linting with eslint-plugin-jsx-a11y

## Process Patterns

- Memory Bank workflow: VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT/ARCHIVE
- Systematic, documented task execution and progress tracking
- Not marking tasks as complete until user confirmation
- CI/CD pipeline for automated testing and deployment

## Security and Validation Patterns

- All backend routes use centralized validation middleware (express-validator) for input validation.
- XSS, CSRF, HTTP parameter pollution, and NoSQL injection protections are enforced globally via middleware.
- Passwords are validated for strength and hashed using bcrypt before storage.
- Role-based access control is implemented via middleware (checkRole) for all protected endpoints.
- Error handling middleware ensures no sensitive error details are leaked in production.
- Rate limiting is applied to authentication and API routes to prevent brute force attacks.
- Secure cookie/session handling with httpOnly, secure, and sameSite flags.
- Security event logging and monitoring are in place for auditability.
- All API endpoints are being reviewed for consistent validation and least-privilege access.

## Notable Implementations

- Student Finances and Grades pages with responsive tables and cards
- Sidebar navigation with clear links to all student features
- Button and Card components used across multiple pages
- Data-label attributes for mobile-friendly tables
- Jest/RTL sample test for Button component
- Accessibility linting and manual audit checklist
- Analytics integration instructions (Plausible)
- Deployment pipeline with Vercel/Netlify and GitHub Actions
