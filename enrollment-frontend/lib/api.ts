/**
 * API Utilities for the School Enrollment System
 *
 * This file contains functions for interacting with the backend API.
 */

import {
  ApiResponse,
  Grade,
  AcademicYear,
  Semester,
  Enrollment,
} from "@/types";

// Base URL for API requests
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

// Generic fetch function with authentication
export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem("accessToken");

    // Set up headers with authentication
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    // Parse and return the data
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("API request failed:", error);
    return { data: null, error: handleApiError(error) };
  }
}

// Student API functions

/**
 * Fetch student grades for a specific academic term
 */
export async function fetchStudentGrades(
  academicYear: string,
  semester: string
): Promise<ApiResponse<Grade[]>> {
  return fetchWithAuth<Grade[]>(
    `/students/grades?academicYear=${academicYear}&semester=${semester}`
  );
}

/**
 * Fetch all academic terms available for the student
 */
export async function fetchAcademicTerms(): Promise<
  ApiResponse<AcademicTerm[]>
> {
  return fetchWithAuth<AcademicTerm[]>("/academic/terms");
}

/**
 * Fetch student enrollment history
 */
export async function fetchEnrollmentHistory(): Promise<
  ApiResponse<Enrollment[]>
> {
  return fetchWithAuth<Enrollment[]>("/students/enrollments");
}

/**
 * Fetch student GPA data
 */
export async function fetchGpaData(): Promise<
  ApiResponse<{ term: string; gpa: number }[]>
> {
  return fetchWithAuth<{ term: string; gpa: number }[]>("/students/gpa");
}

/**
 * Fetch student profile
 */
export async function fetchStudentProfile(): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/students/profile");
}

/**
 * Update student profile
 */
export async function updateStudentProfile(
  profileData: any
): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/students/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

/**
 * Enroll in courses
 */
export async function enrollInCourses(enrollmentData: {
  academicYear: string;
  semester: string;
  subjects: string[];
}): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/students/enroll", {
    method: "POST",
    body: JSON.stringify(enrollmentData),
  });
}

/**
 * Fetch available courses for enrollment
 */
export async function fetchAvailableCourses(
  academicYear: string,
  semester: string
): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>(
    `/subjects/available?academicYear=${academicYear}&semester=${semester}`
  );
}

/**
 * Fetch student payment history
 */
export async function fetchPaymentHistory(): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/finance/payments");
}

/**
 * Make a payment
 */
export async function makePayment(paymentData: {
  amount: number;
  method: string;
  description: string;
}): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/finance/payments", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}

// Teacher API functions

/**
 * Fetch teacher's classes
 */
export async function fetchTeacherClasses(): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/teacher/courses");
}

/**
 * Fetch students in a class
 */
export async function fetchClassStudents(
  classId: string
): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>(`/teacher/courses/${classId}/students`);
}

/**
 * Update student grades
 */
export async function updateStudentGrades(
  classId: string,
  studentId: string,
  grades: any
): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>(`/teacher/grades/${classId}/${studentId}`, {
    method: "POST",
    body: JSON.stringify(grades),
  });
}

/**
 * Fetch teacher stats
 */
export async function fetchTeacherStats(): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/teacher/stats");
}

/**
 * Record attendance
 */
export async function recordAttendance(
  classId: string,
  date: string,
  attendanceData: any[]
): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/attendance", {
    method: "POST",
    body: JSON.stringify({
      course: classId,
      date,
      records: attendanceData,
    }),
  });
}

// Admin API functions

/**
 * Fetch all students
 */
export async function fetchAllStudents(
  page: number = 1,
  limit: number = 10,
  filters: any = {}
): Promise<ApiResponse<any>> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });

  return fetchWithAuth<any>(`/students?${queryParams.toString()}`);
}

/**
 * Fetch all teachers
 */
export async function fetchAllTeachers(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>(`/users?role=teacher&page=${page}&limit=${limit}`);
}

/**
 * Create a new student
 */
export async function createStudent(
  studentData: any
): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/students", {
    method: "POST",
    body: JSON.stringify(studentData),
  });
}

/**
 * Create a new teacher
 */
export async function createTeacher(
  teacherData: any
): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/users", {
    method: "POST",
    body: JSON.stringify({ ...teacherData, role: "teacher" }),
  });
}

/**
 * Create a new course
 */
export async function createCourse(courseData: any): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/subjects", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
}

/**
 * Fetch system statistics
 */
export async function fetchSystemStats(): Promise<ApiResponse<any>> {
  return fetchWithAuth<any>("/admin/stats");
}
