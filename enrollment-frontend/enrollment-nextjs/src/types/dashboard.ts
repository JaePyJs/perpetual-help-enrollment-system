// src/types/dashboard.ts

export interface StudentInfo {
  id: string;
  user_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  department: string;
  year_level: string;
  section: string;
  avatar_url?: string;
}

export interface StudentStat {
  id: string;
  student_id: string;
  title: string;
  icon: string;
  value: number | string;
  change: string;
  change_label: string;
  change_icon: string;
  change_color: string;
  footer_icon: string;
  stat_type: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  course_code: string;
  progress: number;
  grade?: string;
  credits: number;
  student_id: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  title: string;
  course_id: string;
  course_code: string;
  due_date: string;
  status: "urgent" | "upcoming" | "in-progress" | "completed";
  student_id: string;
  created_at: string;
  updated_at: string;
}
