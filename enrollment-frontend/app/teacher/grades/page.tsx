import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TeacherGrades } from "@/components/teacher/teacher-grades";

export const metadata: Metadata = {
  title: "Grade Management | Perpetual Help College of Manila",
  description: "Manage and submit student grades",
};

export default function GradesPage() {
  return (
    <DashboardLayout role="teacher">
      <TeacherGrades />
    </DashboardLayout>
  );
}
