// src/types/student.ts

export interface StudentProfile {
  id: string;
  user_id: string;
  student_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birthdate: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  civil_status: "single" | "married" | "divorced" | "widowed";
  nationality: string;
  religion?: string;
  department: string;
  year_level: string;
  section: string;
  enrollment_status: "enrolled" | "not-enrolled" | "pending";
  enrollment_date?: string;
  adviser?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactInformation {
  id: string;
  student_id: string;
  personal_email?: string;
  mobile_number: string;
  present_address: string;
  permanent_address: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_number: string;
  created_at: string;
  updated_at: string;
}

export interface AcademicRecord {
  id: string;
  student_id: string;
  academic_year: string;
  semester: string;
  units: number;
  gpa?: number;
  status: "completed" | "in-progress" | "upcoming";
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  student_id: string;
  name: string;
  type: string;
  status: "verified" | "pending" | "missing";
  file_path?: string;
  uploaded_at?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}
