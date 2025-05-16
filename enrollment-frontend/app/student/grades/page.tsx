import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StudentGrades } from "@/components/student/student-grades";

export const metadata: Metadata = {
  title: "Grades | Perpetual Help College of Manila",
  description: "View your academic grades and performance",
};

export default function GradesPage() {
  return (
    <DashboardLayout role="student">
      <StudentGrades />
    </DashboardLayout>
  );
}
