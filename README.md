# Perpetual Help College of Manila - Enrollment System

A modern web-based enrollment system for Perpetual Help College of Manila, featuring separate interfaces for students, teachers, and administrators. This system follows ISO 25010 standards and aims to be a best-in-class enrollment solution.

![Perpetual Help College Logo](<enrollment-system%20(1)/public/images/school-logo.png>)

## Project Structure

This project consists of two main components:

1. **Frontend** (`enrollment-system/`): The main implementation with modern design and full functionality.
2. **Backend API** (`enrollment-backend/`): A Node.js/Express server that provides RESTful API endpoints.

## Features

- **Multi-user Interface**: Separate dashboards for students, teachers, and administrators
- **Theme Support**: Light, dark, and system preference themes with consistent styling
- **Responsive Design**: Works on desktops, tablets, and mobile devices
- **Student Management**: Registration, course enrollment, grade viewing, and academic tracking
- **Teacher Portal**: Class management, grade submission, and student performance tracking
- **Admin Dashboard**: System-wide management, user registration, and analytics
- **Global Admin Role**: Super admin capabilities for system configuration
- **Profile Management**: Users can update their information and change passwords
- **Secure Authentication**: Role-based access control with JWT authentication
- **Real-time Updates**: Immediate display of newly registered users
- **Dark Mode Support**: All components including charts and graphs support dark mode

## Technology Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API architecture
- Secure password hashing
- Role-based access control

### Frontend

- Next.js 14
- React with Hooks
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Hook Form with Zod validation
- Recharts for data visualization
- Dark mode support

## User Roles

### Students

- View enrolled courses and academic progress
- Check grades and performance metrics
- View class schedules and announcements
- Access financial information
- Update personal profile and change password

### Teachers

- Manage classes and course materials
- Submit and update grades
- Track attendance and student performance
- View teaching schedules
- Update personal profile and change password

### Administrators

- Register new students and teachers
- Manage user accounts and permissions
- Create and manage courses
- Assign teachers to courses
- System configuration and oversight
- Update personal profile and change password

### Global Administrators

- All administrator capabilities
- Create and manage admin accounts
- System-wide configuration
- Access to all system features and data

## Installation

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB (local or cloud instance)
- Git (for version control)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/JaePyJs/perpetual-help-enrollment-system.git
   cd perpetual-help-enrollment-system
   ```

2. Install backend dependencies:

   ```bash
   cd enrollment-backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd "../enrollment-system (1)"
   npm install
   ```

4. Configure environment variables:

   ```bash
   # In the backend directory
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

### Running the Application

You can start all servers with a single command:

```bash
start-servers.bat
```

This will start:

1. MongoDB database server
2. Backend API server
3. Frontend Next.js server
4. Open the Table of Contents page in your browser

Or start them individually:

1. Start MongoDB:

   ```bash
   mongod
   ```

2. Start the backend server:

   ```bash
   cd enrollment-backend
   npm start
   ```

3. Start the frontend development server:

   ```bash
   cd "enrollment-system (1)"
   npm run dev
   ```

4. Open your browser and navigate to:
   - Table of Contents: `http://localhost:3000/table-of-contents`
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

### Test Accounts

The system comes with pre-configured test accounts for all user roles:

| Role         | Username                   | Password   |
| ------------ | -------------------------- | ---------- |
| Student      | `student@uphc.edu.ph`      | student123 |
| Teacher      | `teacher@uphc.edu.ph`      | teacher123 |
| Admin        | `admin@uphc.edu.ph`        | admin123   |
| Global Admin | `global-admin@uphc.edu.ph` | admin123   |

### Portability

To run this application on another computer:

1. Clone or copy the entire project directory
2. Install Node.js, npm, and MongoDB
3. Follow the setup instructions above
4. Run the database seeder to create test accounts:

   ```bash
   cd enrollment-backend
   npm run seed
   ```

5. Start the application using the startup script

## ID Formats

### Student ID Format

Student IDs follow the format: m[YY]-XXXX-XXX where:

- m is a prefix for Manila branch
- YY is the year of enrollment (e.g., 23 for 2023)
- XXXX-XXX is a unique identifier specific to the student

Example: `m23-1470-578`

### Teacher ID Format

Teacher IDs follow the format: T-[YYYY]-XXXX where:

- T is a prefix for Teacher
- YYYY is the full year (e.g., 2023)
- XXXX is a unique identifier specific to the teacher

Example: `T-2023-1234`

### Admin ID Format

Admin IDs follow the format: A-[YYYY]-XXXX or GA-[YYYY]-XXXX where:

- A is a prefix for Admin, GA for Global Admin
- YYYY is the full year (e.g., 2023)
- XXXX is a unique identifier specific to the admin

Examples: `A-2023-5678` or `GA-2023-9012`

## GitHub Instructions

### Pushing Changes to GitHub

1. Make sure you have Git installed and configured:

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. Initialize Git in the project directory (if not already done):

   ```bash
   git init
   ```

3. Add all files to staging:

   ```bash
   git add .
   ```

4. Commit your changes:

   ```bash
   git commit -m "Initial commit of Perpetual Help Enrollment System"
   ```

5. Add the remote repository:

   ```bash
   git remote add origin https://github.com/JaePyJs/perpetual-help-enrollment-system.git
   ```

6. Push to GitHub:

   ```bash
   git push -u origin main
   ```

### Making Future Updates

1. Pull the latest changes:

   ```bash
   git pull origin main
   ```

2. Make your changes to the code

3. Stage and commit your changes:

   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

4. Push to GitHub:

   ```bash
   git push origin main
   ```

## License

[MIT License](LICENSE)

## Credits

Developed for Perpetual Help College of Manila
