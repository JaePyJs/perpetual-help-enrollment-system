"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { useAuth } from "@/contexts/auth-context";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Check if current user is a global admin
  const isGlobalAdmin = user?.role === "global-admin";

  return (
    <DashboardLayout role={isGlobalAdmin ? "global-admin" : "admin"}>
      <AdminDashboard />
    </DashboardLayout>
  );
}
