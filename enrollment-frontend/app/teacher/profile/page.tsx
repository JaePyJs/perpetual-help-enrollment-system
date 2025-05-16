import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function TeacherProfilePage() {
  // You can add a real profile component here later
  return (
    <DashboardLayout role="teacher">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Teacher Profile</h1>
        <p>This is a placeholder for the teacher's profile page.</p>
      </div>
    </DashboardLayout>
  );
}
