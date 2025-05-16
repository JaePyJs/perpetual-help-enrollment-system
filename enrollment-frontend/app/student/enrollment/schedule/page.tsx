import type { Metadata } from "next"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ScheduleConfirmation } from "@/components/student/enrollment/schedule-confirmation"

export const metadata: Metadata = {
  title: "Schedule Confirmation | Perpetual Help College",
  description: "Confirm your course schedule at Perpetual Help College",
}

export default function ScheduleConfirmationPage() {
  return (
    <DashboardLayout>
      <ScheduleConfirmation />
    </DashboardLayout>
  )
}
