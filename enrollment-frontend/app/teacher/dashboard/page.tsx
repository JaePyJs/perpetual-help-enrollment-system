import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";

export const metadata: Metadata = {
  title: "Teacher Dashboard | Perpetual Help College",
  description: "Teacher dashboard for Perpetual Help College enrollment system",
};

export default function TeacherDashboardPage() {
  return (
    <DashboardLayout role="teacher">
      <TeacherDashboard />
    </DashboardLayout>
  );
}
