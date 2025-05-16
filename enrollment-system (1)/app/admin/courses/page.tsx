import type { Metadata } from "next"
import { CourseManagement } from "@/components/admin/course-management"

export const metadata: Metadata = {
  title: "Course Management | Perpetual Help College of Manila",
  description: "Manage courses, schedules, and faculty assignments",
}

export default function CourseManagementPage() {
  return <CourseManagement />
}
