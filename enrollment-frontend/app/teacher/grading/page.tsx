import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GradeManagement } from "@/components/teacher/grade-management";

export const metadata: Metadata = {
  title: "Grade Management | Perpetual Help College of Manila",
  description: "Manage and submit student grades",
};

export default function GradingPage() {
  return (
    <DashboardLayout role="teacher">
      <GradeManagement />
    </DashboardLayout>
  );
}
