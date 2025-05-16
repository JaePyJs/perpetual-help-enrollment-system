# TypeScript Type Definitions

This directory contains TypeScript type definitions used throughout the Perpetual Help College Enrollment System frontend application.

## Overview

The type definitions in this directory provide a centralized location for all shared types used across the application. This ensures consistency, improves code quality, and enhances developer experience through better autocompletion and type checking.

## Main Type Categories

### User Types

Types related to users in the system, including:

- `User`: Base user type with common properties
- `Student`: Extended user type with student-specific properties
- `Teacher`: Extended user type with teacher-specific properties
- `Admin`: Extended user type with admin-specific properties
- `UserRole`: Union type of all possible user roles
- `UserStatus`: Union type of all possible user statuses

### Academic Types

Types related to academic structures, including:

- `AcademicYear`: Academic year information
- `Semester`: Semester information
- `Department`: Department information
- `Program`: Program information
- `Course`: Course information
- `Section`: Section information

### Enrollment Types

Types related to student enrollment, including:

- `Enrollment`: Enrollment record information
- `EnrollmentStatus`: Union type of all possible enrollment statuses

### Grade Types

Types related to student grades, including:

- `Grade`: Grade record information
- `GradeStatus`: Union type of all possible grade statuses

### Schedule Types

Types related to class schedules, including:

- `Schedule`: Schedule record information
- `WeekDay`: Union type of all possible days of the week

### API Types

Types related to API interactions, including:

- `ApiResponse<T>`: Generic API response type
- `LoginCredentials`: Login request payload
- `AuthTokens`: Authentication tokens response
- `AuthState`: Authentication state for context

### UI Types

Types related to UI components, including:

- `ThemeMode`: Union type of all possible theme modes
- `Toast`: Toast notification information
- `ToastType`: Union type of all possible toast types
- `Breadcrumb`: Breadcrumb navigation item
- `MenuItem`: Navigation menu item

### Form Types

Types related to form handling, including:

- `FormField`: Form field configuration

## Usage

Import types from this directory as needed in your components, hooks, and utilities:

```typescript
import { User, UserRole, ApiResponse } from '@/types';

// Use the types in your code
const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'student',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Use with generics
const fetchUser = async (id: string): Promise<ApiResponse<User>> => {
  // Implementation
};
```

## Adding New Types

When adding new types:

1. Determine if the type belongs in an existing file or requires a new file
2. Follow the naming conventions established in existing types
3. Add proper JSDoc comments to document the type
4. Update this README.md if adding a new category of types

## Type Naming Conventions

- Use PascalCase for type names (e.g., `User`, `ApiResponse`)
- Use camelCase for properties (e.g., `firstName`, `isActive`)
- Use descriptive names that clearly indicate the purpose of the type
- Prefix interface names with `I` only when necessary to avoid naming conflicts
- Use union types for enumeration-like values (e.g., `'student' | 'teacher' | 'admin'`)

## Best Practices

- Avoid using `any` type whenever possible
- Use more specific types instead of generic object types
- Use union types instead of enums for simple cases
- Use intersection types (`&`) to combine types
- Use generics for reusable type patterns
- Document complex types with JSDoc comments
