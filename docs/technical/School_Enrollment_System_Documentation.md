# Perpetual Help College of Manila - Enrollment System

![Perpetual Help College Logo](../../enrollment-frontend/public/images/school-logo.png)

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Introduction](#introduction)
3. [System Overview](#system-overview)
4. [User Roles and Capabilities](#user-roles-and-capabilities)
5. [Technical Architecture](#technical-architecture)
6. [Key Features](#key-features)
7. [Security and Compliance](#security-and-compliance)
8. [System Requirements](#system-requirements)
9. [Installation and Setup](#installation-and-setup)
10. [Contact Information](#contact-information)
11. [References](#references)

**Documentation Last Updated: May 17, 2025**

## Executive Summary

The Perpetual Help College of Manila Enrollment System is a comprehensive web-based platform designed to streamline and digitize the academic administration process. This modern solution replaces traditional paper-based enrollment procedures with an efficient, user-friendly digital platform that serves students, teachers, and administrative staff.

The system follows ISO 25010 standards and aims to be a best-in-class enrollment solution, featuring separate interfaces for students, teachers, and administrators. It provides a complete suite of tools for managing the entire academic lifecycle, from student registration and course enrollment to grade management and administrative oversight.

This document provides a detailed overview of the system's purpose, features, technical architecture, and implementation details for stakeholders, administrators, and technical team members.

## Introduction

### Purpose

The School Enrollment System was developed to address the challenges associated with traditional enrollment processes, including:

- Manual paperwork and data entry
- Inefficient course registration
- Limited access to academic information
- Difficulty tracking student progress
- Administrative overhead in managing records

By digitizing these processes, the system aims to improve efficiency, reduce errors, enhance the user experience, and provide better data for decision-making.

### Scope

The system encompasses the entire academic management workflow, including:

- Student registration and profile management
- Course catalog and enrollment
- Grade recording and reporting
- Financial management
- Academic calendar and scheduling
- Administrative oversight and reporting

## System Overview

The School Enrollment System is a modern web application built with a responsive design that works across desktop, tablet, and mobile devices. It features:

- **Multi-user Interface**: Separate dashboards for students, teachers, and administrators
- **Theme Support**: Light, dark, and system preference themes with consistent styling
- **Responsive Design**: Works on desktops, tablets, and mobile devices
- **Role-based Access**: Different capabilities based on user roles
- **Real-time Updates**: Immediate display of newly registered users and changes
- **Comprehensive Reporting**: Analytics and reporting for all user types

## User Roles and Capabilities

### Students

Students can access the following features through their dedicated dashboard:

- View enrolled courses and academic progress
- Check grades and performance metrics
- View class schedules and announcements
- Access financial information
- Update personal profile and change password

### Teachers

Teachers have access to tools for managing their classes and student performance:

- Manage classes and course materials
- Submit and update grades
- Track attendance and student performance
- View teaching schedules
- Update personal profile and change password

### Administrators

Administrators have system-wide management capabilities:

- Register new students and teachers
- Manage user accounts and permissions
- Create and manage courses
- Assign teachers to courses
- System configuration and oversight
- Update personal profile and change password

### Global Administrators

Global Administrators have super-admin capabilities:

- All administrator capabilities
- Create and manage admin accounts
- System-wide configuration
- Access to all system features and data

## Technical Architecture

### High-Level Architecture

The system follows a modern web application architecture with clear separation of concerns:

```ascii
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client Layer   │◄───►│  Server Layer   │◄───►│  Database Layer │
│  (Next.js)      │     │  (Node.js/      │     │  (MongoDB)      │
│                 │     │   Express)      │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Technology Stack

#### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API architecture
- Secure password hashing
- Role-based access control

#### Frontend

- Next.js 14
- React with Hooks
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Hook Form with Zod validation
- Recharts for data visualization
- Dark mode support

## Key Features

### Student Management

- Comprehensive student profiles
- Academic record tracking
- Course registration with prerequisite checking
- Schedule conflict detection
- Grade viewing and GPA calculation
- Financial information and payment processing

### Teacher Tools

- Class management interface
- Grade input functionality with component weighting
- Student performance tracking and analytics
- Attendance recording
- Report generation

### Administrative Functions

- User management interface
- Department and subject management
- Comprehensive reporting system
- System configuration options
- Academic calendar management

### Design System

The system implements a cohesive design system based on:

- Primary brand color (#e77f33) with complementary colors
- Consistent typography and component styling
- Responsive design principles
- WCAG-compliant accessibility considerations
- Modern design with microanimations

## Security and Compliance

### Security Features

The system implements comprehensive security measures:

- **Authentication**: Secure JWT-based authentication with token refresh
- **Authorization**: Role-based access control for all system functions
- **Data Protection**: Encryption for sensitive data and hashed passwords
- **Input Validation**: Client and server-side validation to prevent injection attacks
- **HTTP Security**: Secure headers, HTTPS enforcement, and XSS protection
- **Rate Limiting**: Protection against brute force attacks
- **Session Security**: Secure cookie settings and CSRF protection
- **Monitoring**: Security event logging and monitoring

### Compliance

The system is designed to comply with:

- **ISO 25010**: Quality standards for software systems
- **WCAG 2.1 AA**: Web Content Accessibility Guidelines
- **Data Privacy**: Best practices for handling student information
- **Educational Standards**: Alignment with academic record-keeping requirements

## System Requirements

### Server Requirements

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB (local or cloud instance)
- 2GB RAM minimum (4GB recommended)
- 10GB storage minimum

### Client Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection
- Responsive design supports desktop, tablet, and mobile devices

## Installation and Setup

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB (local or cloud instance)
- Git (for version control)

### Setup Steps

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
   cd enrollment-frontend
   npm install
   ```

4. Configure environment variables:

   ```bash
   # In the backend directory
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

5. Start the application using the startup script

## Contact Information

For questions, support, or feedback regarding the School Enrollment System, please contact:

**Technical Support**
Email: [support@manila.uphsl.edu.ph](mailto:support@manila.uphsl.edu.ph)
Phone: +63 (2) 8123-4567

**System Administrator**
Email: [sysadmin@manila.uphsl.edu.ph](mailto:sysadmin@manila.uphsl.edu.ph)
Phone: +63 (2) 8123-4568

**Perpetual Help College of Manila**
Address: 123 College Avenue, Manila, Philippines
Website: [https://manila.uphsl.edu.ph](https://manila.uphsl.edu.ph)

## User Interfaces

### Student Dashboard

The student dashboard provides a comprehensive overview of the student's academic information and quick access to key features:

- Academic progress charts showing GPA and credits over time
- Financial summary with current balance and payment history
- Upcoming deadlines and important dates
- Course schedule and attendance records
- Quick links to enrollment, grades, and profile management

### Teacher Dashboard

The teacher dashboard offers tools for managing classes and student performance:

- Overview of assigned classes and student counts
- Grade distribution charts and performance analytics
- Attendance tracking and reporting
- Assignment and exam management
- Communication tools for student interaction

### Administrator Dashboard

The administrator dashboard provides system-wide management capabilities:

- User registration and management
- Department and course configuration
- System analytics and reporting
- Academic calendar management
- Financial system oversight

## ID Format Standards

The system implements standardized ID formats for different user types:

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

Example: `A-2023-5678` or `GA-2023-1234`

## References

- ISO 25010 Software Quality Standards
- Web Content Accessibility Guidelines (WCAG) 2.1
- MongoDB Documentation
- Node.js Documentation
- Next.js Documentation
- React Documentation
