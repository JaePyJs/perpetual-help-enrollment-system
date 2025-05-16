/**
 * API Service
 * 
 * This module provides service functions for API calls to the backend.
 * It uses the API client for consistent error handling and response parsing.
 */

import apiClient from '@/lib/api-client';

// Types
export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  program: string;
  yearLevel: string;
  semester: string;
  academicYear: string;
  enrollmentStatus: string;
  gpa: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  teacher: string;
  schedule: string;
  room: string;
  status: string;
}

export interface Grade {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: number | string;
  letterGrade: string;
  semester: string;
  academicYear: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: string;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  important: boolean;
}

export interface FinancialRecord {
  id: string;
  type: string;
  amount: number;
  date: string;
  description: string;
  status: string;
  dueDate?: string;
  balance?: number;
}

export interface AcademicTerm {
  id: string;
  name: string;
  academicYear: string;
  semester: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// Student API
export const studentApi = {
  // Get student profile
  getProfile: () => apiClient.get<Student>('/students/profile'),
  
  // Get student grades
  getGrades: (academicYear?: string, semester?: string) => {
    const query = [];
    if (academicYear) query.push(`academicYear=${academicYear}`);
    if (semester) query.push(`semester=${semester}`);
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';
    
    return apiClient.get<Grade[]>(`/students/grades${queryString}`);
  },
  
  // Get student courses
  getCourses: (academicYear?: string, semester?: string) => {
    const query = [];
    if (academicYear) query.push(`academicYear=${academicYear}`);
    if (semester) query.push(`semester=${semester}`);
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';
    
    return apiClient.get<Course[]>(`/students/courses${queryString}`);
  },
  
  // Get student assignments
  getAssignments: (courseId?: string) => {
    const queryString = courseId ? `?courseId=${courseId}` : '';
    return apiClient.get<Assignment[]>(`/students/assignments${queryString}`);
  },
  
  // Get student announcements
  getAnnouncements: () => apiClient.get<Announcement[]>('/students/announcements'),
  
  // Get student financial records
  getFinancialRecords: () => apiClient.get<FinancialRecord[]>('/students/financial-records'),
  
  // Get student GPA data
  getGpaData: () => apiClient.get<{ term: string; gpa: number }[]>('/students/gpa'),
  
  // Get academic terms
  getAcademicTerms: () => apiClient.get<AcademicTerm[]>('/academic/terms'),
  
  // Update student profile
  updateProfile: (profileData: Partial<Student>) => 
    apiClient.put<Student>('/students/profile', profileData),
};

// Teacher API
export const teacherApi = {
  // Get teacher's students
  getStudents: () => apiClient.get('/teachers/students'),
  
  // Submit grades
  submitGrades: (gradesData: any) => 
    apiClient.post('/teachers/grades', gradesData),
    
  // Get teacher's courses
  getCourses: () => apiClient.get('/teachers/courses'),
};

// Admin API
export const adminApi = {
  // Get all users
  getUsers: () => apiClient.get('/admin/users'),
  
  // Create a new user
  createUser: (userData: any) => 
    apiClient.post('/admin/users', userData),
    
  // Update a user
  updateUser: (userId: string, userData: any) => 
    apiClient.put(`/admin/users/${userId}`, userData),
    
  // Delete a user
  deleteUser: (userId: string) => 
    apiClient.delete(`/admin/users/${userId}`),
};

export default {
  studentApi,
  teacherApi,
  adminApi,
};
