import type { Metadata } from "next"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StudentProfile } from "@/components/student/student-profile"

export const metadata: Metadata = {
  title: "Student Profile | Perpetual Help College of Manila",
  description: "View and update your student profile information",
}

export default function StudentProfilePage() {
  return (
    <DashboardLayout>
      <StudentProfile />
    </DashboardLayout>
  )
}
