import { Metadata } from "next";
import { StudentCalendar } from "@/components/student/student-calendar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export const metadata: Metadata = {
  title: "Academic Calendar",
  description: "View important academic dates and events",
};

export default function CalendarPage() {
  return (
    <DashboardLayout role="student">
      <StudentCalendar />
    </DashboardLayout>
  );
}
