# Perpetual Help College of Manila - Enrollment System

A modern web-based enrollment system for Perpetual Help College of Manila, featuring separate interfaces for students, teachers, and administrators.

## Features

- **Multi-user Interface**: Separate dashboards for students, teachers, and administrators
- **Theme Support**: Light, dark, and system preference themes
- **Responsive Design**: Works on desktops, tablets, and mobile devices
- **Student Management**: Registration, course enrollment, and academic tracking
- **Teacher Portal**: Course management, grade submission, and student performance tracking
- **Admin Dashboard**: System-wide management, user registration, and analytics

## Technology Stack

- HTML5/CSS3
- Tailwind CSS for styling
- JavaScript (Vanilla)
- LocalStorage for data persistence

## User Roles

### Students
- View enrolled courses
- Check grades and academic progress
- View class schedules
- Access financial information

### Teachers
- Enroll students in their assigned courses
- Manage grades for their courses
- Track attendance
- View student performance

### Administrators
- Register new students and teachers
- Create and manage courses
- Assign teachers to courses
- Full system control and oversight

## Installation

1. Clone the repository
2. Open the project folder
3. Start a local server (e.g., `python -m http.server 8080`)
4. Navigate to `http://localhost:8080/loginpage.html` in your browser

## Student ID Format

Student IDs follow the format: m[YY]-XXXX-XXX where:
- m is a prefix
- YY is the year of enrollment (e.g., 23 for 2023)
- XXXX-XXX is an identifier specific to the student

Example: m23-1470-578

## License

[MIT License](LICENSE)

## Credits

Developed for Perpetual Help College of Manila
