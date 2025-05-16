"use client";

import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminRegistrationForm } from "@/components/admin/admin-registration-form";
import { EnhancedUserManagement } from "@/components/admin/enhanced-user-management";
import { UserManagementContext } from "@/components/admin/student-registration-form";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, UserCog, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState("admins");
  const { user } = useAuth();
  const router = useRouter();
  const enhancedUserManagementRef = useRef<{
    addUser: (user: any) => void;
  } | null>(null);

  // Check if current user is a global admin
  const isGlobalAdmin = user?.role === "global-admin";

  // Function to add a user to the EnhancedUserManagement component
  const addUser = (user: any) => {
    if (enhancedUserManagementRef.current?.addUser) {
      enhancedUserManagementRef.current.addUser(user);

      // Switch to the users tab to show the newly added user
      setActiveTab("admins");
    }
  };

  // If not a global admin, redirect to dashboard
  if (!isGlobalAdmin) {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
            <p className="text-muted-foreground">
              You do not have permission to access this page
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <ShieldAlert className="h-5 w-5" />
                Global Admin Access Required
              </CardTitle>
              <CardDescription>
                This section is restricted to Global Administrators only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Restricted Access</AlertTitle>
                <AlertDescription>
                  You need Global Administrator privileges to access the Admin Management section.
                  Please contact a Global Administrator if you need access to this feature.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button onClick={() => router.push("/admin/dashboard")}>
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
    <DashboardLayout role="global-admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Administrator Management</h1>
          <p className="text-muted-foreground">
            Manage system administrators and their permissions
          </p>
        </div>

        <UserManagementContext.Provider value={{ addUser }}>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="admins">
                <Users className="mr-2 h-4 w-4" />
                Administrators
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserCog className="mr-2 h-4 w-4" />
                Register New Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admins" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5" />
                    System Administrators
                  </CardTitle>
                  <CardDescription>
                    Manage all administrator accounts in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnhancedUserManagement ref={enhancedUserManagementRef} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <AdminRegistrationForm />
            </TabsContent>
          </Tabs>
        </UserManagementContext.Provider>
      </div>
    </DashboardLayout>
  );
}
