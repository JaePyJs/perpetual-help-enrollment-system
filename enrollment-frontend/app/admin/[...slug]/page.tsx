"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function CatchAllAdminPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  // Check if current user is a global admin
  const isGlobalAdmin = user?.role === "global-admin";
  
  // Get the current path from the slug
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const currentPath = `/admin/${slug.join("/")}`;
  
  // Redirect to user-management for specific user types
  useEffect(() => {
    if (slug[0] === "users" && slug.length > 1) {
      const userType = slug[1]; // students, teachers, admins
      if (userType === "students" || userType === "teachers" || userType === "admins") {
        router.push(`/admin/user-management?tab=${userType}`);
      }
    }
  }, [slug, router]);

  return (
    <DashboardLayout role={isGlobalAdmin ? "global-admin" : "admin"}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Page Under Construction</h1>
          <p className="text-muted-foreground">
            This section of the admin portal is currently being developed
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <CardTitle>This page is not yet available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The page you are trying to access (<code>{currentPath}</code>) is currently under development. 
              Our team is working to implement this feature soon.
            </p>
            
            <p className="text-muted-foreground">
              In the meantime, you can use the available features in the admin dashboard or try one of the following options:
            </p>
            
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button 
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Dashboard
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push("/admin/user-management")}
              >
                Go to User Management
              </Button>
              
              {isGlobalAdmin && (
                <Button 
                  variant="outline"
                  onClick={() => router.push("/admin/user-management?tab=admins")}
                >
                  Manage Administrators
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
