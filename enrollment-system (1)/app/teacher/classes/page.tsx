import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ClassManagement } from "@/components/teacher/class-management";

export const metadata: Metadata = {
  title: "Class Management | Perpetual Help College of Manila",
  description: "Manage your classes, attendance, and grades",
};

export default function ClassManagementPage() {
  return (
    <DashboardLayout role="teacher">
      <ClassManagement />
    </DashboardLayout>
  );
}
