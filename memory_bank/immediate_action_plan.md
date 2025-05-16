# Immediate Action Plan for Enrollment System Integration

This document outlines all the steps needed to fix the backend connectivity issues and integrate the new frontend with the backend in a single focused work session.

## Phase 1: Fix Backend Issues (1-2 hours)

### 1. Disable WebSocket Server Temporarily
```javascript
// In enrollment-backend/app.js
// Find the WebSocket server initialization and comment it out
// Example:
// const server = http.createServer(app);
// const io = socketIo(server);
// io.on('connection', (socket) => {
//   console.log('New client connected');
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });
```

### 2. Simplify CORS Configuration
```javascript
// In enrollment-backend/app.js
// Replace the current CORS configuration with a simpler one for development
app.use(
  cors({
    origin: "*", // Allow all origins for development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
```

### 3. Disable CSRF Protection Temporarily
```javascript
// In enrollment-backend/app.js
// Comment out the CSRF protection middleware
// app.use("/api", verifyCsrfToken);
```

### 4. Add Detailed Logging
```javascript
// In enrollment-backend/app.js
// Add request logging middleware before routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Add response logging middleware after routes
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${new Date().toISOString()}] Response: ${res.statusCode}`);
    return originalSend.call(this, data);
  };
  next();
});
```

### 5. Create API Test Script
```javascript
// Create a file named api-test.js in the project root
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const tests = [];

// Test login
tests.push(async () => {
  console.log('\n=== Testing Login ===');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'student1',
      password: 'password123'
    });
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return { success: false, error };
  }
});

// Test student profile
tests.push(async (token) => {
  console.log('\n=== Testing Student Profile ===');
  try {
    const response = await axios.get(`${API_URL}/students/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return { success: false, error };
  }
});

// Run all tests
async function runTests() {
  let token;
  
  // Run login test
  const loginResult = await tests[0]();
  if (loginResult.success && loginResult.data.token) {
    token = loginResult.data.token;
    console.log('Token obtained:', token.substring(0, 20) + '...');
    
    // Run tests that require authentication
    await tests[1](token);
  }
}

runTests();
```

## Phase 2: Integrate New Frontend with Backend (2-3 hours)

### 1. Update Auth Context
```typescript
// In enrollment-system (1)/contexts/auth-context.tsx
// Update the login function to call the real API
const login = async (username: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setUser(data.user);
    setIsAuthenticated(true);
    setIsLoading(false);
    return true;
  } catch (error) {
    setError(error.message);
    setIsLoading(false);
    return false;
  }
};
```

### 2. Update Middleware for Consistent Token Storage
```typescript
// In enrollment-system (1)/middleware.ts
// Update to use localStorage instead of cookies
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // If accessing a protected route without a token, redirect to login
  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Update this function in your auth-context.tsx
// to set cookies instead of localStorage if you prefer that approach
const login = async (username: string, password: string) => {
  // ... existing code
  
  // Set token in cookie instead of localStorage
  document.cookie = `token=${data.token}; path=/; max-age=86400; samesite=strict`;
  
  // ... rest of the function
};
```

### 3. Create API Service Layer
```typescript
// Create a new file: enrollment-system (1)/services/api.ts
const API_URL = 'http://localhost:5000/api';

// Helper function to get the auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Generic fetch function with authentication
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  return response.json();
}

// Auth API
export const authApi = {
  login: (username: string, password: string) => 
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  register: (userData: any) => 
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// Student API
export const studentApi = {
  getProfile: () => fetchWithAuth('/students/profile'),
  
  getGrades: (academicYear: string, semester: string) => 
    fetchWithAuth(`/students/grades?academicYear=${academicYear}&semester=${semester}`),
  
  updateProfile: (profileData: any) => 
    fetchWithAuth('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

// Teacher API
export const teacherApi = {
  getStudents: () => fetchWithAuth('/teachers/students'),
  
  submitGrades: (gradesData: any) => 
    fetchWithAuth('/teachers/grades', {
      method: 'POST',
      body: JSON.stringify(gradesData),
    }),
};

// Admin API
export const adminApi = {
  getUsers: () => fetchWithAuth('/admin/users'),
  
  createUser: (userData: any) => 
    fetchWithAuth('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};
```

### 4. Update Student Dashboard Component
```typescript
// In enrollment-system (1)/components/student/student-dashboard.tsx
// Replace mock data with real API calls
import { useEffect, useState } from 'react';
import { studentApi } from '@/services/api';

export function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [grades, setGrades] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch profile and grades in parallel
        const [profileData, gradesData] = await Promise.all([
          studentApi.getProfile(),
          studentApi.getGrades('2023-2024', '1'),
        ]);
        
        setProfile(profileData);
        setGrades(gradesData);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  // Render dashboard with real data
  return (
    <div>
      {/* Use profile and grades data to render the dashboard */}
    </div>
  );
}
```

## Phase 3: Test and Debug (1-2 hours)

### 1. Start Backend Server
```bash
cd enrollment-backend
npm start
```

### 2. Test API Endpoints
```bash
node api-test.js
```

### 3. Start Frontend Development Server
```bash
cd "enrollment-system (1)"
npm run dev
```

### 4. Test Frontend Integration
1. Open browser to http://localhost:3000
2. Test login functionality
3. Test student dashboard
4. Test navigation between pages

### 5. Debug Common Issues

#### Backend Not Responding
- Check for errors in the backend console
- Verify the server is running on port 5000
- Check for middleware issues (CORS, CSRF)

#### Authentication Issues
- Check token storage consistency (localStorage vs cookies)
- Verify token format and expiration
- Check authorization headers in API requests

#### Frontend Integration Issues
- Check for CORS errors in browser console
- Verify API URL is correct
- Check for proper error handling

## Phase 4: Complete Implementation (Ongoing)

### 1. Implement Remaining Student Features
- Course enrollment
- Schedule management
- Financial information

### 2. Implement Teacher Features
- Student management
- Grade submission
- Course management

### 3. Implement Admin Features
- User management
- System configuration
- Reports and analytics

## Execution Checklist

- [ ] Disable WebSocket server in backend
- [ ] Simplify CORS configuration
- [ ] Disable CSRF protection temporarily
- [ ] Add detailed logging to backend
- [ ] Create and run API test script
- [ ] Update auth context in frontend
- [ ] Update middleware for consistent token storage
- [ ] Create API service layer
- [ ] Update student dashboard component
- [ ] Start backend server and test API endpoints
- [ ] Start frontend server and test integration
- [ ] Debug and fix any issues
- [ ] Document changes and update memory bank
