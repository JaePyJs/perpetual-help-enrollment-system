"use client";

import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UserManagement } from "@/components/admin/user-management";
import { useAuth } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "User Management | Perpetual Help College of Manila",
  description: "Manage users, roles, and permissions",
};

export default function UsersPage() {
  const { user } = useAuth();

  // Check if current user is a global admin
  const isGlobalAdmin = user?.role === "global-admin";

  return (
    <DashboardLayout role={isGlobalAdmin ? "global-admin" : "admin"}>
      <UserManagement />
    </DashboardLayout>
  );
}
