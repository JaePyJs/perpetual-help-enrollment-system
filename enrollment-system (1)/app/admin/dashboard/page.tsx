import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Perpetual Help College of Manila",
  description: "Administrative dashboard for managing the enrollment system",
}

export default function AdminDashboardPage() {
  return <AdminDashboard />
}
