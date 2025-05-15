# activeContext.md

## Current Work Focus

- ✅ Connected components to Supabase for dynamic data
- ✅ Implemented proper data fetching and state management
- ✅ Set up authentication flows with proper redirects
- ✅ Migrated student profile page with Supabase integration
- ✅ Cleaned up unnecessary documentation files in memory_bank (see migration_cleanup_list.md)
- Continuing to migrate remaining pages (finances, grades)
- Adding comprehensive error handling throughout application

## Recent Changes

- Implemented student profile page with complete Supabase integration
- Added dynamic data fetching for student information, contacts, and documents
- Implemented form validation and state management for profile updates
- Created file upload UI for student documents with Supabase storage integration
- Enhanced Supabase client with improved error handling
- Created data fetching hooks for consistent Supabase integration
- Implemented AuthContext for centralized authentication state management
- Created Loading component for better user experience
- Created ErrorMessage component for consistent error handling
- Improved login page with better error handling and validation
- Fixed ARIA attributes for better accessibility
- Enhanced authentication flow with role-based checks
- Updated all components to TypeScript best practices
- Created reusable data fetching patterns for Supabase
- **Deleted unnecessary files from memory_bank for clarity and maintainability**
- User registration page is now migrated to Next.js as `user-registration.tsx` with modular CSS and Supabase integration.
- Legacy `user-registration.html` is pending removal after verification.
- User registration page now enforces strict role-based registration:
  - Only global admin can create admins
  - Only admin can create teachers/students
  - Teachers can only register students
  - Students cannot register anyone
- Registration UI and logic updated to only show allowed user types
- ID formats for student, teacher, and admin are validated and auto-generated if not provided

## Next Steps

- Connect remaining dashboard components to Supabase for dynamic data display
- Implement API endpoints for dashboard statistics
- ✅ Add form submission handling with data validation
- Connect enrollment system to Supabase tables
- ✅ Add student profile data management
- Create protected routes with authentication guards
- Implement student grade visualization components
- Add financial dashboard with payment processing
- Create finance page with transaction history and payment options
- **Continue to maintain Memory Bank as the single source of project truth**

## Active Decisions and Considerations

- Using custom hooks for Supabase data fetching instead of React Query/SWR for simplicity
- Implementing centralized authentication with React context
- Using TypeScript for all components and hooks for better maintainability
- Creating reusable component patterns for consistent UI/UX
- Following accessibility best practices with proper ARIA attributes
- Separating business logic from UI components for better testability

## Important Patterns and Preferences

- React context for global state management (theme, auth)
- Custom hooks for Supabase data fetching
- Consistent error handling with dedicated components
- Loading state components for async operations
- CSS modules for component-specific styles
- Next.js Link components for client-side navigation
- TypeScript interfaces for component props and API responses
- Reusable authentication patterns with role-based access

## Learnings and Project Insights

- React context is effective for managing global app state
- Custom hooks provide cleaner data fetching patterns
- TypeScript improves code reliability and developer experience
- CSS modules offer better component isolation than global styles
- Next.js layout system improves code organization
- Supabase offers a powerful but simple alternative to building a custom backend
- Centralized error handling components improve user experience
- Proper TypeScript typing reduces runtime errors
- Component-based architecture increases code reuse
- Authentication flows benefit from context-based state management
