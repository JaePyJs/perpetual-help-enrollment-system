# Testing Strategy

This document outlines the testing approach for the School Enrollment System.

## Current Testing Status

As of May 2025, the project has minimal testing infrastructure:

- A Button.test.tsx file exists, using React Testing Library and Jest
- @types/jest is included as a devDependency
- No test scripts are configured in package.json
- Testing is listed as a low-priority task in migration_tasks.md

## Why Testing Was Deprioritized

Testing was intentionally deprioritized during the initial migration phase to focus on:

1. Migrating from vanilla HTML/CSS/JS to Next.js React components
2. Implementing Supabase integration for authentication and data storage
3. Creating core UI components and pages
4. Setting up proper project structure and TypeScript support

This approach allowed for faster initial development but now requires a comprehensive testing strategy to ensure reliability and maintainability.

## Testing Framework Setup

### Required Packages

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Configuration Files

#### package.json Scripts

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

#### jest.config.js

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### jest.setup.js

```javascript
import '@testing-library/jest-dom';
```

## Testing Strategy

### Unit Tests

Focus on testing individual components, hooks, and utility functions in isolation:

#### Components to Test

- UI Components:
  - Button
  - Input
  - Form
  - Card
  - Modal
  - Dropdown
  - ThemeSwitcher
  - Loading
  - ErrorMessage
  - Toast

- Layout Components:
  - Header
  - Footer
  - Sidebar
  - Navigation

- Feature Components:
  - LoginForm
  - RegistrationForm
  - StudentProfile
  - GradesVisualization
  - FinancialDashboard

#### Custom Hooks to Test

- useAuth
- useSupabase
- useTheme
- useForm
- useToast

#### Utility Functions to Test

- Form validation functions
- Data formatting utilities
- Date/time utilities
- Authentication helpers

### Integration Tests

Test how components work together:

#### Authentication Flows

- Login process
- Registration process
- Password reset flow
- Protected routes

#### Form Submissions

- Student enrollment form
- Profile update form
- Grade submission form
- Payment processing form

#### Data Fetching

- Dashboard data loading
- Student profile data loading
- Financial transaction history loading
- Grade data loading

### End-to-End Tests (Optional)

Consider adding Cypress or Playwright for critical user flows:

- Complete student enrollment process
- Teacher grade submission workflow
- Financial payment processing
- Administrative user management

## Mocking Strategy

### Supabase Mocking

Create a `__mocks__/@supabase/supabase-js.js` file:

```javascript
const supabaseMock = {
  auth: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn(),
    getPublicUrl: jest.fn(),
    list: jest.fn(),
    remove: jest.fn(),
  },
};

export const createClient = jest.fn(() => supabaseMock);
```

### Context Mocking

Create test wrappers for React contexts:

```javascript
// Example for AuthContext
export const AuthContextWrapper = ({ children }) => {
  const mockAuthValue = {
    user: { id: '123', email: 'test@example.com', role: 'student' },
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    loading: false,
    error: null,
  };
  
  return (
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Test Implementation Plan

1. **Phase 1: Core Components and Utilities**
   - Set up testing infrastructure
   - Test Button, Input, and other basic UI components
   - Test utility functions and helpers

2. **Phase 2: Authentication and Forms**
   - Test authentication hooks and components
   - Test form validation and submission
   - Test protected routes

3. **Phase 3: Data Visualization and Dashboard**
   - Test dashboard components
   - Test data fetching and loading states
   - Test error handling

4. **Phase 4: Accessibility and Edge Cases**
   - Test keyboard navigation
   - Test screen reader compatibility
   - Test error scenarios and edge cases

5. **Phase 5: End-to-End Testing (Optional)**
   - Set up Cypress or Playwright
   - Test critical user flows
   - Test cross-browser compatibility

## Test Coverage Goals

- **Phase 1:** 70% coverage of core components and utilities
- **Phase 2:** 80% coverage of authentication and forms
- **Phase 3:** 75% coverage of data visualization and dashboard
- **Phase 4:** 85% coverage of accessibility and edge cases
- **Final Goal:** 80% overall test coverage

## Continuous Integration

- Set up GitHub Actions for automated testing
- Run tests on pull requests
- Generate and track test coverage reports
- Block merges if tests fail or coverage drops significantly

## Best Practices

- Write tests before or alongside new features
- Focus on behavior, not implementation details
- Use descriptive test names
- Keep tests independent and isolated
- Mock external dependencies
- Test both success and error scenarios
- Regularly review and update tests

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Next.js Applications](https://nextjs.org/docs/testing)
- [Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)
