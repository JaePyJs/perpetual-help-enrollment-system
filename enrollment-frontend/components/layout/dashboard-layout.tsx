"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth-context";
import {
  ProtectedRoute,
  StudentRoute,
  TeacherRoute,
  AdminRoute,
  GlobalAdminRoute,
} from "@/components/auth/protected-route";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "student" | "teacher" | "admin" | "global-admin";
}

export function DashboardLayout({
  children,
  role: propRole,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine role from props or user context
  const role = propRole || user?.role || "student";

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // Render the appropriate protected route component based on role
  const renderProtectedRoute = () => {
    switch (role) {
      case "student":
        return <StudentRoute>{renderDashboard()}</StudentRoute>;
      case "teacher":
        return <TeacherRoute>{renderDashboard()}</TeacherRoute>;
      case "admin":
        return <AdminRoute>{renderDashboard()}</AdminRoute>;
      case "global-admin":
        return <GlobalAdminRoute>{renderDashboard()}</GlobalAdminRoute>;
      default:
        return <ProtectedRoute>{renderDashboard()}</ProtectedRoute>;
    }
  };

  // Render the dashboard content
  const renderDashboard = () => {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex items-center gap-2">
            <img
              src="/images/school-logo.png"
              alt="Perpetual Help College Logo"
              className="h-10 w-auto dark:filter dark:brightness-110"
            />
            <h1 className="text-lg font-poppins font-bold">
              Perpetual Help College
            </h1>
          </div>
          <div className="relative ml-auto flex-1 md:grow-0">
            {isSearchOpen || !isMobile ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                />
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close search</span>
                  </Button>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
          <Button variant="ghost" size="icon" className="ml-auto md:ml-0">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />
          <UserNav role={role} />
        </header>
        <div className="flex flex-1">
          <aside
            className={cn(
              "hidden w-[250px] flex-col border-r bg-background md:flex",
              isSidebarOpen && "fixed inset-y-0 z-50 flex w-[250px]"
            )}
          >
            <MainNav role={role} />
          </aside>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="w-[250px] p-0">
              <MainNav role={role} />
            </SheetContent>
          </Sheet>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    );
  };

  // Return the protected route with the dashboard content
  return renderProtectedRoute();
}
