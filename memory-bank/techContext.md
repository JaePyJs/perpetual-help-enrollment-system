# Technical Context

## Technology Stack

### Frontend

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript/JavaScript
- **Styling**: CSS Modules, custom design system with CSS variables
- **Animation**: CSS animations, transitions, and keyframes
- **Color System**: Primary (orange), Secondary (blue-teal), Accent (purple)
- **Typography**: Inter for body text, Poppins for headings
- **State Management**: React Context API, SWR for data fetching
- **UI Components**: Custom component library with consistent styling
- **Build Tools**: Turbopack (Next.js built-in)

### Backend

- **Framework**: Node.js with Express
- **Language**: JavaScript
- **API**: RESTful endpoints
- **Authentication**: JWT-based auth with refresh tokens
- **Validation**: Express-validator
- **Middleware**: Custom middleware for auth, validation, error handling

### Database

- **Primary Database**: MongoDB
- **ODM**: Mongoose for schema definition and validation
- **Indexes**: Optimized for common queries
- **Data Structure**: Document-based with references

### Infrastructure

- **Deployment**: Local development environment
- **Version Control**: Git with GitHub
- **CI/CD**: Not yet implemented
- **Monitoring**: Console logging (development)

## Development Environment

### Setup Requirements

- Node.js (v18+)
- npm or yarn
- MongoDB (local or remote instance)
- Git

### Directory Structure

```ascii
school-enrollment-system/
├── enrollment-backend/         # Backend API server
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Express middleware
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── utils/                  # Helper functions
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
│
├── enrollment-frontend/        # Frontend applications
│   ├── enrollment-nextjs/      # Next.js application
│   │   ├── public/             # Static assets
│   │   │   └── images/         # Public images
│   │   ├── src/                # Source code
│   │   │   ├── app/            # Next.js App Router
│   │   │   ├── components/     # React components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utility functions
│   │   │   ├── styles/         # CSS styles
│   │   │   │   ├── animations.css  # Animation definitions
│   │   │   │   ├── design-system.css # Design system variables
│   │   │   │   ├── dashboard.css  # Dashboard styles
│   │   │   │   └── login.css      # Login page styles
│   │   │   └── types/          # TypeScript types
│   │   ├── next.config.js      # Next.js configuration
│   │   └── package.json        # Dependencies
│   └── images/                 # Shared images
│
└── memory-bank/               # Project documentation
    ├── projectbrief.md        # Project overview
    ├── productContext.md      # Product requirements
    ├── systemPatterns.md      # Architecture patterns
    ├── techContext.md         # Technical details
    ├── activeContext.md       # Current development focus
    └── progress.md            # Project progress
```

## Running the Application

### Backend Server

```bash
cd enrollment-backend
npm install
npm run dev
```

- Runs on port 5000 by default
- Connects to MongoDB at mongodb://localhost:27017/school_enrollment
- Provides RESTful API endpoints

### Frontend Application

```bash
cd enrollment-frontend/enrollment-nextjs
npm install
npm run dev
```

- Runs on port 3000 by default
- Connects to backend API at `http://localhost:5000/api`

### Navigation Page

```bash
cd enrollment-frontend
npx http-server -p 8080
```

- Runs on port 8080
- Provides links to both frontend and backend

## API Structure

### Authentication Endpoints

- `POST /api/auth/register`: Create new user account
- `POST /api/auth/login`: Authenticate user
- `POST /api/auth/refresh`: Refresh access token
- `POST /api/auth/logout`: Invalidate tokens

### User Endpoints

- `GET /api/users`: List users (admin only)
- `GET /api/users/:id`: Get user details
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user (admin only)

### Student Endpoints

- `GET /api/students`: List students
- `GET /api/students/:id`: Get student details
- `POST /api/students`: Create student
- `PUT /api/students/:id`: Update student
- `DELETE /api/students/:id`: Delete student

### Teacher Endpoints

- `GET /api/teacher`: List teachers
- `GET /api/teacher/:id`: Get teacher details
- `POST /api/teacher`: Create teacher
- `PUT /api/teacher/:id`: Update teacher
- `DELETE /api/teacher/:id`: Delete teacher

### Enrollment Endpoints

- `GET /api/enrollment`: List enrollments
- `GET /api/enrollment/:id`: Get enrollment details
- `POST /api/enrollment`: Create enrollment
- `PUT /api/enrollment/:id`: Update enrollment
- `DELETE /api/enrollment/:id`: Cancel enrollment

## Database Schema

### User Collection

- `_id`: ObjectId (Primary Key)
- `username`: String (Unique)
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: String (enum: 'student', 'teacher', 'admin')
- `isActive`: Boolean
- `lastLogin`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Student Collection

- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Reference to User)
- `studentId`: String (School ID)
- `firstName`: String
- `lastName`: String
- `email`: String
- `contactNumber`: String
- `address`: Object
- `dateOfBirth`: Date
- `gender`: String
- `department`: ObjectId (Reference to Department)
- `enrollmentStatus`: String
- `academicStatus`: String
- `createdAt`: Date
- `updatedAt`: Date

### Teacher Collection

- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Reference to User)
- `employeeId`: String
- `firstName`: String
- `lastName`: String
- `email`: String
- `contactNumber`: String
- `department`: ObjectId (Reference to Department)
- `subjects`: Array of ObjectId (References to Subject)
- `createdAt`: Date
- `updatedAt`: Date

## Testing Strategy

### Unit Testing

- Backend: Jest for controller and service testing
- Frontend: React Testing Library for component testing

### Integration Testing

- API endpoint testing with Supertest
- Database operations testing

### End-to-End Testing

- Not yet implemented

## Deployment Considerations

### Environment Variables

- Database connection strings
- JWT secrets
- API keys
- Environment-specific configuration

### Security Measures

- HTTPS for production
- Secure cookie settings
- CORS configuration
- Rate limiting
- Input validation and sanitization

This technical context provides a comprehensive overview of the technology stack, development environment, and technical considerations for the School Enrollment System.
