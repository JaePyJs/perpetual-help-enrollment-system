/**
 * Common Types for the Enrollment System
 * 
 * This file contains TypeScript type definitions used throughout the application.
 */

// User Types
export type UserRole = 'student' | 'teacher' | 'admin' | 'global-admin';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  status: UserStatus;
  contactNumber?: string;
  address?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Student = User & {
  studentId: string;
  department?: string;
  program?: string;
  yearLevel?: number;
  section?: string;
  guardianName?: string;
  guardianContact?: string;
  enrollmentStatus?: 'enrolled' | 'not-enrolled' | 'on-leave';
};

export type Teacher = User & {
  teacherId: string;
  department?: string;
  specialization?: string;
  employmentStatus?: 'full-time' | 'part-time' | 'contract';
  subjects?: string[];
};

export type Admin = User & {
  adminId: string;
  department?: string;
  permissions?: string[];
  isGlobalAdmin?: boolean;
};

// Academic Types
export type AcademicYear = {
  id: string;
  year: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
};

export type Semester = {
  id: string;
  name: string;
  academicYearId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
};

export type Department = {
  id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string; // Teacher ID of department head
};

export type Program = {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  description?: string;
  durationYears: number;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  description?: string;
  units: number;
  departmentId: string;
  prerequisites?: string[]; // Array of course IDs
};

export type Section = {
  id: string;
  name: string;
  programId: string;
  yearLevel: number;
  academicYearId: string;
  semesterId: string;
  maxStudents: number;
  adviserId?: string; // Teacher ID of section adviser
};

// Enrollment Types
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type Enrollment = {
  id: string;
  studentId: string;
  academicYearId: string;
  semesterId: string;
  programId: string;
  yearLevel: number;
  sectionId: string;
  status: EnrollmentStatus;
  enrollmentDate: Date;
  approvedBy?: string; // Admin ID
  approvedDate?: Date;
  courses: string[]; // Array of course IDs
};

// Grade Types
export type GradeStatus = 'passed' | 'failed' | 'incomplete' | 'ongoing';

export type Grade = {
  id: string;
  studentId: string;
  courseId: string;
  teacherId: string;
  academicYearId: string;
  semesterId: string;
  midterm?: number;
  finals?: number;
  finalGrade?: number;
  letterGrade?: string;
  status: GradeStatus;
  comments?: string;
  submittedDate?: Date;
  lastUpdated?: Date;
};

// Schedule Types
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type Schedule = {
  id: string;
  courseId: string;
  sectionId: string;
  teacherId: string;
  academicYearId: string;
  semesterId: string;
  day: WeekDay;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  room: string;
};

// API Response Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

// Authentication Types
export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type AuthState = {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

// UI Types
export type ThemeMode = 'light' | 'dark' | 'system';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
};

export type Breadcrumb = {
  label: string;
  href: string;
  active?: boolean;
};

export type MenuItem = {
  label: string;
  href: string;
  icon?: string;
  children?: MenuItem[];
  roles?: UserRole[];
};

// Form Types
export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    required?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: {
      value: RegExp;
      message: string;
    };
  };
};
