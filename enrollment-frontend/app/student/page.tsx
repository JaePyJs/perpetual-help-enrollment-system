import type { Metadata } from "next"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StudentDashboard } from "@/components/student/student-dashboard"

export const metadata: Metadata = {
  title: "Student Dashboard | Perpetual Help College",
  description: "Student dashboard for Perpetual Help College enrollment system",
}

export default function StudentDashboardPage() {
  return (
    <DashboardLayout role="student">
      <StudentDashboard />
    </DashboardLayout>
  )
}
