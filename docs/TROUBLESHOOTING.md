# Troubleshooting Guide

This document provides solutions for common issues you might encounter when working with the Perpetual Help College Enrollment System.

## Table of Contents

1. [Backend Connection Issues](#backend-connection-issues)
2. [Database Connection Issues](#database-connection-issues)
3. [Authentication Problems](#authentication-problems)
4. [Navigation Issues](#navigation-issues)
5. [Environment Setup Problems](#environment-setup-problems)
6. [Frontend Rendering Issues](#frontend-rendering-issues)
7. [API Error Handling](#api-error-handling)
8. [Getting Help](#getting-help)

## Backend Connection Issues

### Symptoms
- Frontend cannot connect to backend API
- API requests return connection errors
- Console shows CORS errors

### Solutions

1. **Verify Backend Server is Running**
   ```bash
   # Check if the backend server is running on port 5000
   curl http://localhost:5000/api/health
   ```

2. **Check CORS Configuration**
   - Ensure the CORS configuration in `enrollment-backend/app.js` includes your frontend origin:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
     credentials: true
   }));
   ```

3. **Disable WebSocket Server Temporarily**
   - If you're experiencing connection issues, try disabling the WebSocket server in `enrollment-backend/app.js`:
   ```javascript
   // Comment out WebSocket initialization
   // const server = http.createServer(app);
   // const io = socketIo(server);
   // io.on('connection', (socket) => {
   //   console.log('New client connected');
   //   socket.on('disconnect', () => {
   //     console.log('Client disconnected');
   //   });
   // });
   ```

4. **Check Network Configuration**
   - Ensure no firewall is blocking connections on port 5000
   - Verify that the backend URL in frontend environment variables is correct

## Database Connection Issues

### Symptoms
- Backend server starts but API calls fail
- Console shows MongoDB connection errors
- Server crashes with database-related errors

### Solutions

1. **Verify MongoDB is Running**
   ```bash
   # Start MongoDB if not running
   mongod
   ```

2. **Check Connection String**
   - Verify the MongoDB connection string in `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/school_enrollment
   ```

3. **Database Authentication**
   - If using authentication, ensure credentials are correct in the connection string:
   ```
   MONGODB_URI=mongodb://username:password@localhost:27017/school_enrollment
   ```

4. **Database Permissions**
   - Ensure the MongoDB user has appropriate permissions for the database

5. **Reset Database**
   - If database is corrupted, you can reset it:
   ```bash
   # Drop and recreate the database
   mongo
   > use school_enrollment
   > db.dropDatabase()
   > exit
   
   # Run the seeder to recreate test data
   cd enrollment-backend
   npm run seed
   ```

## Authentication Problems

### Symptoms
- Unable to log in with correct credentials
- JWT token errors in console
- "Unauthorized" errors when accessing protected routes

### Solutions

1. **Verify User Credentials**
   - Check if the user exists in the database with correct credentials
   - Use the test accounts provided in the README.md

2. **JWT Secret Configuration**
   - Ensure JWT secret is properly set in the `.env` file:
   ```
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Token Storage Issues**
   - Clear browser cookies and local storage
   - Ensure consistent token storage method (cookies or localStorage)

4. **Token Expiration**
   - Check token expiration settings in `enrollment-backend/config/auth.js`
   - Implement token refresh if tokens expire too quickly

5. **Reset Password**
   - Use the admin account to reset user passwords if needed

## Navigation Issues

### Symptoms
- Links between pages don't work correctly
- Clicking on navigation items has no effect
- Unexpected redirects or 404 errors

### Solutions

1. **Check JavaScript Console**
   - Look for errors in the browser console that might indicate navigation issues

2. **Verify Next.js Routes**
   - Ensure routes are properly configured in the Next.js application
   - Check for typos in route paths

3. **Link Format**
   - Use Next.js Link components for client-side navigation:
   ```jsx
   import Link from 'next/link';
   
   <Link href="/dashboard">Dashboard</Link>
   ```

4. **Middleware Issues**
   - Check if any middleware is affecting navigation
   - Verify authentication middleware is not blocking legitimate routes

5. **Clear Cache**
   - Clear browser cache and reload the application

## Environment Setup Problems

### Symptoms
- Application fails to start
- Missing dependencies errors
- Environment variable errors

### Solutions

1. **Node.js Version**
   - Ensure you're using Node.js v18.x or higher:
   ```bash
   node --version
   ```

2. **Install Dependencies**
   - Reinstall dependencies if needed:
   ```bash
   # Backend
   cd enrollment-backend
   npm ci
   
   # Frontend
   cd enrollment-frontend
   npm ci
   ```

3. **Environment Variables**
   - Verify all required environment variables are set:
   ```bash
   # Copy example env file and edit
   cp .env.example .env
   ```

4. **Port Conflicts**
   - Check if ports 3000 (frontend) and 5000 (backend) are available
   - Kill any processes using these ports:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -i :3000
   kill -9 <PID>
   ```

## Frontend Rendering Issues

### Symptoms
- Components don't render correctly
- Styling issues or missing CSS
- Dark mode not working properly

### Solutions

1. **Check Browser Compatibility**
   - Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

2. **CSS Loading**
   - Verify that CSS files are being loaded correctly
   - Check for CSS conflicts or overrides

3. **Theme Issues**
   - If dark mode isn't working, check the theme context implementation
   - Verify that theme preferences are being saved correctly

4. **Component Props**
   - Ensure components are receiving the correct props
   - Check for undefined or null values causing rendering issues

5. **Clear Cache and Hard Reload**
   - Use Ctrl+Shift+R (or Cmd+Shift+R on Mac) to perform a hard reload

## API Error Handling

### Symptoms
- API calls fail silently
- No error messages displayed to users
- Unexpected behavior after API operations

### Solutions

1. **Implement Proper Error Handling**
   - Ensure API calls have try/catch blocks
   - Display meaningful error messages to users

2. **Check Network Tab**
   - Use browser developer tools to inspect API requests and responses
   - Look for error status codes and response bodies

3. **Server Logs**
   - Check backend server logs for detailed error information
   - Enable verbose logging if needed

4. **API Response Format**
   - Ensure consistent error response format from the API:
   ```json
   {
     "success": false,
     "message": "Error description",
     "error": {
       "code": "ERROR_CODE",
       "details": {}
     }
   }
   ```

## Getting Help

If you encounter issues not covered in this troubleshooting guide:

1. Check the documentation in the `docs/` directory
2. Review the GitHub repository issues section
3. Contact the development team at [support@uphc.edu.ph](mailto:support@uphc.edu.ph)
