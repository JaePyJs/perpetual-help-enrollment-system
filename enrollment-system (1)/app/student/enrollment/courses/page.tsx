import type { Metadata } from "next"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CourseSelection } from "@/components/student/enrollment/course-selection"

export const metadata: Metadata = {
  title: "Course Selection | Perpetual Help College",
  description: "Select courses for enrollment at Perpetual Help College",
}

export default function CourseSelectionPage() {
  return (
    <DashboardLayout>
      <CourseSelection />
    </DashboardLayout>
  )
}
