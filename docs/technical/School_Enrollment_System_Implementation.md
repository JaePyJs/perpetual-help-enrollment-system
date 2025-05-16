# School Enrollment System - Implementation Details

![Perpetual Help College Logo](../../enrollment-frontend/public/images/school-logo.png)

## Table of Contents

1. [Project Structure](#project-structure)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Authentication Flow](#authentication-flow)
5. [Frontend Components](#frontend-components)
6. [Security Implementation](#security-implementation)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Process](#deployment-process)

_Documentation Last Updated: June 15, 2024_

## Project Structure

The project consists of two main components:

### Backend (`enrollment-backend/`)

```bash
enrollment-backend/
├── controllers/            # Request handlers
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # API routes
├── services/               # Business logic
├── utils/                  # Helper functions
├── app.js                  # Express app setup
├── server.js               # Server entry point
└── package.json            # Dependencies
```

### Frontend (`enrollment-frontend/`)

```bash
enrollment-frontend/
├── app/                    # Next.js app directory
│   ├── admin/              # Admin pages
│   ├── student/            # Student pages
│   ├── teacher/            # Teacher pages
│   └── table-of-contents/  # Navigation hub
├── components/             # React components
│   ├── admin/              # Admin components
│   ├── student/            # Student components
│   ├── teacher/            # Teacher components
│   └── ui/                 # Shared UI components
├── contexts/               # React contexts
├── lib/                    # Utility functions
├── public/                 # Static assets
└── package.json            # Dependencies
```

## Database Schema

The system uses MongoDB with the following main collections:

### User Model

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  studentId: String (optional),
  role: String (student, teacher, admin, global-admin),
  profileImage: String,
  status: String (active, inactive, suspended),
  contactNumber: String,
  address: String,
  lastLogin: Date,
  passwordResetRequired: Boolean
}
```

### Student Model

```javascript
{
  studentId: String,
  user: ObjectId (ref: User),
  email: String,
  department: String,
  program: String,
  yearLevel: Number,
  enrollmentDate: Date,
  graduationDate: Date,
  status: String,
  coursesEnrolled: [ObjectId (ref: Enrollment)]
}
```

### Enrollment Model

```javascript
{
  student: ObjectId (ref: User),
  studentProfile: ObjectId (ref: StudentProfile),
  academicYear: String,
  semester: String,
  yearLevel: Number,
  department: String,
  program: String,
  subjects: [{
    subject: ObjectId (ref: Subject),
    section: String,
    teacher: ObjectId (ref: User),
    schedule: [{
      day: String,
      startTime: String,
      endTime: String,
      room: String
    }],
    grades: {
      attendance: Number,
      quizzes: Number,
      assignments: Number,
      projects: Number,
      midterm: Number,
      finals: Number
    },
    finalGrade: Number
  }]
}
```

### Subject Model

```javascript
{
  code: String,
  title: String,
  description: String,
  units: {
    lecture: Number,
    laboratory: Number,
    total: Number
  },
  department: String,
  yearLevel: Number,
  semester: String,
  prerequisites: [ObjectId (ref: Subject)],
  corequisites: [ObjectId (ref: Subject)]
}
```

### Department Model

```javascript
{
  code: String,
  name: String,
  description: String,
  dean: ObjectId (ref: TeacherProfile),
  chairperson: ObjectId (ref: TeacherProfile),
  programs: [{
    code: String,
    name: String,
    description: String,
    years: Number,
    coordinator: ObjectId (ref: TeacherProfile)
  }],
  contactInfo: {
    email: String,
    phone: String,
    location: String,
    officeHours: String
  }
}
```

## API Endpoints

The system provides the following main API endpoints:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh authentication token
- `POST /api/auth/change-password` - Change user password

### User Management

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Student Management

- `GET /api/students` - Get all students (admin/teacher only)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Register new student (admin only)
- `PUT /api/students/:id` - Update student information
- `GET /api/students/:id/grades` - Get student grades
- `GET /api/students/:id/schedule` - Get student schedule

### Teacher Management

- `GET /api/teacher` - Get all teachers (admin only)
- `GET /api/teacher/:id` - Get teacher by ID
- `POST /api/teacher` - Register new teacher (admin only)
- `PUT /api/teacher/:id` - Update teacher information
- `GET /api/teacher/:id/classes` - Get teacher's classes
- `POST /api/teacher/grades` - Submit grades for a class

### Course Management

- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create new subject (admin only)
- `PUT /api/subjects/:id` - Update subject (admin only)
- `DELETE /api/subjects/:id` - Delete subject (admin only)

### Enrollment Management

- `GET /api/enrollment` - Get all enrollments (admin only)
- `GET /api/enrollment/:id` - Get enrollment by ID
- `POST /api/enrollment` - Create new enrollment
- `PUT /api/enrollment/:id` - Update enrollment
- `DELETE /api/enrollment/:id` - Delete enrollment (admin only)

## Authentication Flow

The system uses JWT (JSON Web Tokens) for authentication:

1. User submits credentials (username/password)
2. Server validates credentials and generates JWT token
3. Token is returned to client and stored (localStorage/cookies)
4. Token is included in Authorization header for subsequent requests
5. Server validates token for protected routes
6. Refresh token mechanism extends session without re-login

## Frontend Components

### Key Shared Components

- `DashboardLayout` - Common layout for all dashboards
- `Sidebar` - Navigation sidebar with role-specific links
- `Header` - Top navigation bar with user info and actions
- `DataTable` - Reusable table component with sorting and filtering
- `Form` components - Standardized form inputs with validation
- `Chart` components - Data visualization components
- `Modal` components - Reusable modal dialogs
- `Toast` notifications - System feedback messages

### Student-specific Components

- `StudentDashboard` - Main student dashboard
- `AcademicProgressChart` - Visual representation of GPA over time
- `EnrollmentForm` - Course registration interface
- `GradesView` - Academic performance display
- `ScheduleView` - Weekly class schedule

### Teacher-specific Components

- `TeacherDashboard` - Main teacher dashboard
- `ClassManagement` - Interface for managing classes
- `GradeInput` - Grade submission interface
- `AttendanceTracker` - Student attendance recording
- `PerformanceAnalytics` - Student performance visualization

### Admin-specific Components

- `AdminDashboard` - Main admin dashboard
- `UserManagement` - Interface for managing users
- `CourseManagement` - Interface for managing courses
- `EnrollmentManagement` - Interface for managing enrollments
- `SystemConfiguration` - System settings interface

## Security Implementation

The system implements multiple layers of security:

### Authentication Security

- Secure password hashing with bcrypt
- JWT token-based authentication
- Token expiration and refresh mechanism
- Role-based access control
- Session timeout for inactivity

### API Security

- Input validation and sanitization
- CSRF protection
- Rate limiting to prevent brute force attacks
- Secure HTTP headers (Helmet.js)
- CORS configuration

### Data Security

- MongoDB injection prevention
- XSS protection
- Secure cookie settings
- HTTPS enforcement in production
- Data validation at multiple levels

## Testing Strategy

The system employs a comprehensive testing approach:

### Unit Testing

- Component-level tests for React components
- Function-level tests for utility functions
- Model validation tests for database models

### Integration Testing

- API endpoint testing
- Authentication flow testing
- Database interaction testing

### End-to-End Testing

- User journey testing
- Cross-browser compatibility testing
- Responsive design testing

### Security Testing

- Authentication bypass testing
- Input validation testing
- CSRF/XSS vulnerability testing
- Rate limiting effectiveness testing

## Deployment Process

The system can be deployed using the following process:

### Development Environment

- Local Node.js server
- Local MongoDB instance
- Development-specific configuration

### Staging Environment

- Cloud-hosted Node.js server
- MongoDB Atlas cluster
- Staging-specific configuration
- Automated testing before promotion

### Production Environment

- Load-balanced Node.js servers
- MongoDB Atlas cluster with replication
- Production-specific security configuration
- Continuous monitoring and logging
- Automated backup procedures
