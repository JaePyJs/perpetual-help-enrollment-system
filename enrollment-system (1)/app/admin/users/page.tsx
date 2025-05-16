import type { Metadata } from "next"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserManagement } from "@/components/admin/user-management"

export const metadata: Metadata = {
  title: "User Management | Perpetual Help College of Manila",
  description: "Manage users, roles, and permissions",
}

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  )
}
