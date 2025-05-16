"use client";

import { AuditLogViewer } from "@/components/admin/audit-log-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, FileText, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuditLogsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Check if current user is a global admin or regular admin
  const isAdmin = user?.role === "admin" || user?.role === "global-admin";
  const isGlobalAdmin = user?.role === "global-admin";

  if (!isAdmin) {
    return (
      <DashboardLayout role="student">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
            <p className="text-muted-foreground">
              You do not have permission to view audit logs
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <Shield className="h-5 w-5" />
                Restricted Area
              </CardTitle>
              <CardDescription>
                This section is only accessible to administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Restricted Access</AlertTitle>
                <AlertDescription>
                  If you believe you should have access to this page, please
                  contact your system administrator.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button onClick={() => router.push("/student/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={isGlobalAdmin ? "global-admin" : "admin"}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            {isGlobalAdmin
              ? "Global Admin access: View and monitor all system activity and security events"
              : "View and monitor system activity and security events"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isGlobalAdmin ? (
                <>
                  <ShieldAlert className="h-5 w-5" />
                  Global Security Audit Trail
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  Security Audit Trail
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isGlobalAdmin
                ? "Complete record of all user actions and system events with advanced filtering"
                : "Record of user actions and system events"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {isGlobalAdmin
                ? "As a Global Administrator, you have access to the complete audit log, including all administrative actions, security events, and system changes. Use the advanced filters below to analyze specific activities."
                : "The audit log provides a record of actions performed in the system, including user creation, updates, password resets, and login attempts. Use the filters below to narrow down the results."}
            </p>
          </CardContent>
        </Card>

        <AuditLogViewer isGlobalAdmin={isGlobalAdmin} />
      </div>
    </DashboardLayout>
  );
}
