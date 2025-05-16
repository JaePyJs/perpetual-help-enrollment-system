"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EnhancedUserManagement } from "@/components/admin/enhanced-user-management";
import {
  StudentRegistrationForm,
  UserManagementContext,
} from "@/components/admin/student-registration-form";
import { TeacherRegistrationForm } from "@/components/admin/teacher-registration-form";
import { AdminRegistrationForm } from "@/components/admin/admin-registration-form";
import { UserPlus, Users, ShieldAlert, School, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("users");
  const { user } = useAuth();
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
      setActiveTab("users");
    }
  };

  return (
    <DashboardLayout role={isGlobalAdmin ? "global-admin" : "admin"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions in the system
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Manage Users</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Register Student</span>
              <span className="sm:hidden">Students</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              <span className="hidden sm:inline">Register Teacher</span>
              <span className="sm:hidden">Teachers</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Register Admin</span>
              <span className="sm:hidden">Admins</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <EnhancedUserManagement ref={enhancedUserManagementRef} />
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Student Registration
                    </CardTitle>
                    <CardDescription>
                      Register new students in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Use this form to register new students. All students will
                      be required to change their password on first login.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <UserManagementContext.Provider value={{ addUser }}>
                  <StudentRegistrationForm />
                </UserManagementContext.Provider>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5" />
                      Teacher Registration
                    </CardTitle>
                    <CardDescription>
                      Register new teachers in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Use this form to register new teachers. All teachers will
                      be required to change their password on first login.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <UserManagementContext.Provider value={{ addUser }}>
                  <TeacherRegistrationForm />
                </UserManagementContext.Provider>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admins" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5" />
                      Administrator Registration
                    </CardTitle>
                    <CardDescription>
                      Register new administrators in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      {isGlobalAdmin
                        ? "As a Global Administrator, you can create both regular Admin accounts and Global Admin accounts. Use this power responsibly."
                        : "Only Global Administrators can register new admin accounts. If you need to create a new admin account, please contact a Global Administrator."}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <UserManagementContext.Provider value={{ addUser }}>
                  <AdminRegistrationForm />
                </UserManagementContext.Provider>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
