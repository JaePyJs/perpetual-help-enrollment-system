"use client";
import { useAuth } from "@/lib/AuthContext";
import { useSupabaseData } from "@/lib/useSupabaseData";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import Card from "@/app/components/Card";
import styles from "./student-grades.module.css";

interface AcademicRecord {
  id: string;
  academic_year: string;
  semester: string;
  course_name?: string;
  course_code?: string;
  units: number;
  gpa?: string;
  grade?: string;
  status: string;
}

export default function StudentGradesPage() {
  const { user } = useAuth();
  const {
    data: grades,
    loading,
    error,
  } = useSupabaseData<AcademicRecord>({
    table: "academic_records",
    match: { user_id: user?.id },
    order: { column: "academic_year", ascending: false },
  });

  if (loading) {
    return <Loading size="large" message="Loading grades..." />;
  }
  if (error) {
    return <ErrorMessage message={`Error loading grades: ${error}`} />;
  }
  if (!grades || grades.length === 0) {
    return <ErrorMessage message="No grades found." />;
  }

  return (
    <div className={styles["student-grades"]}>
      <h1>Student Grades</h1>
      <table className={styles["data-table"]}>
        <thead>
          <tr>
            <th>Academic Year</th>
            <th>Semester</th>
            <th>Course</th>
            <th>Units</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((record: AcademicRecord) => (
            <tr key={record.id}>
              <td data-label="Academic Year">{record.academic_year}</td>
              <td data-label="Semester">{record.semester}</td>
              <td data-label="Course">{record.course_name || record.course_code}</td>
              <td data-label="Units">{record.units}</td>
              <td data-label="Grade">{record.gpa || record.grade || '-'}</td>
              <td data-label="Status">{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Card title="Current GPA" className={styles["gpa-section"]}>
        <p>
          {(
            grades.reduce((sum: number, r: AcademicRecord) => sum + (parseFloat(r.gpa || "0") || 0), 0) /
            grades.length
          ).toFixed(2)}
        </p>
      </Card>
    </div>
  );
} 