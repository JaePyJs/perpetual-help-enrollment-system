# Perpetual Help College - Enrollment System Backend

This is the backend API server for the Perpetual Help College Enrollment System. It provides RESTful API endpoints for user authentication, student management, course enrollment, grade management, and administrative functions.

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

## Directory Structure

```bash
enrollment-backend/
├── controllers/            # Request handlers
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # API routes
├── services/               # Business logic
├── utils/                  # Helper functions
├── app.js                  # Express app setup
└── server.js               # Server entry point
```

## Setup and Installation

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB (local or cloud instance)

### Installation Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your specific configuration:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/school_enrollment
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRATION=7d
   ```

3. Start the server:

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Students

- `GET /api/students` - Get all students (admin/teacher only)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Register new student (admin only)
- `PUT /api/students/:id` - Update student information
- `DELETE /api/students/:id` - Delete student (admin only)

### Teachers

- `GET /api/teachers` - Get all teachers (admin only)
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Register new teacher (admin only)
- `PUT /api/teachers/:id` - Update teacher information
- `DELETE /api/teachers/:id` - Delete teacher (admin only)

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Enrollment

- `GET /api/enrollment` - Get all enrollments (admin only)
- `GET /api/enrollment/student/:id` - Get enrollments by student ID
- `POST /api/enrollment` - Create new enrollment
- `PUT /api/enrollment/:id` - Update enrollment status
- `DELETE /api/enrollment/:id` - Delete enrollment (admin only)

### Grades

- `GET /api/grades/student/:id` - Get grades by student ID
- `POST /api/grades` - Submit grades (teacher only)
- `PUT /api/grades/:id` - Update grades (teacher only)

## Database Models

### User Model

```javascript
{
  username: String,
  email: String,
  password: String,
  role: String, // "student", "teacher", "admin", "global-admin"
  firstName: String,
  lastName: String,
  profileImage: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Student Profile Model

```javascript
{
  user: ObjectId (ref: User),
  studentId: String, // Format: m23-1470-578
  department: String,
  program: String,
  yearLevel: Number,
  section: String,
  contactNumber: String,
  address: String,
  guardianName: String,
  guardianContact: String,
  enrollmentStatus: String
}
```

### Teacher Profile Model

```javascript
{
  user: ObjectId (ref: User),
  teacherId: String, // Format: T-2023-1234
  department: String,
  specialization: String,
  contactNumber: String,
  address: String,
  employmentStatus: String,
  subjects: [ObjectId (ref: Subject)]
}
```

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error message description",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Authentication and Authorization

The API uses JWT for authentication:

1. Client sends credentials to `/api/auth/login`
2. Server validates and returns access token and refresh token
3. Client includes access token in Authorization header for subsequent requests
4. When access token expires, client uses refresh token to get a new access token

## Testing

Run tests with:

```bash
npm test
```

## License

[MIT License](LICENSE)
