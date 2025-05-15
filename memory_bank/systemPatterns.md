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

## Notable Implementations
- Student Finances and Grades pages with responsive tables and cards
- Sidebar navigation with clear links to all student features
- Button and Card components used across multiple pages
- Data-label attributes for mobile-friendly tables
- Jest/RTL sample test for Button component
- Accessibility linting and manual audit checklist
- Analytics integration instructions (Plausible)
- Deployment pipeline with Vercel/Netlify and GitHub Actions
