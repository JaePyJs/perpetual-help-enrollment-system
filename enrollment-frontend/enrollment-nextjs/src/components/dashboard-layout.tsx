"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "student" | "teacher" | "admin";
  userName?: string;
}

export function DashboardLayout({
  children,
  userRole = "student",
  userName = "John Doe",
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigationItems = {
    student: [
      { name: "Dashboard", href: "/student-dashboard", icon: "fas fa-home" },
      { name: "Enrollment", href: "/student-dashboard/enrollment", icon: "fas fa-user-plus" },
      { name: "Grades", href: "/student-dashboard/grades", icon: "fas fa-graduation-cap" },
      { name: "Schedule", href: "/student-dashboard/schedule", icon: "fas fa-calendar-alt" },
      { name: "Payments", href: "/student-dashboard/payments", icon: "fas fa-credit-card" },
      { name: "Documents", href: "/student-dashboard/documents", icon: "fas fa-file-alt" },
    ],
    teacher: [
      { name: "Dashboard", href: "/teacher-dashboard", icon: "fas fa-home" },
      { name: "Classes", href: "/teacher-dashboard/classes", icon: "fas fa-chalkboard-teacher" },
      { name: "Students", href: "/teacher-dashboard/students", icon: "fas fa-user-graduate" },
      { name: "Grades", href: "/teacher-dashboard/grades", icon: "fas fa-chart-line" },
      { name: "Schedule", href: "/teacher-dashboard/schedule", icon: "fas fa-calendar-alt" },
      { name: "Resources", href: "/teacher-dashboard/resources", icon: "fas fa-book" },
    ],
    admin: [
      { name: "Dashboard", href: "/admin-dashboard", icon: "fas fa-home" },
      { name: "Students", href: "/admin-dashboard/students", icon: "fas fa-user-graduate" },
      { name: "Teachers", href: "/admin-dashboard/teachers", icon: "fas fa-chalkboard-teacher" },
      { name: "Courses", href: "/admin-dashboard/courses", icon: "fas fa-book" },
      { name: "Enrollments", href: "/admin-dashboard/enrollments", icon: "fas fa-user-plus" },
      { name: "Payments", href: "/admin-dashboard/payments", icon: "fas fa-money-bill-wave" },
      { name: "Reports", href: "/admin-dashboard/reports", icon: "fas fa-chart-bar" },
      { name: "Settings", href: "/admin-dashboard/settings", icon: "fas fa-cog" },
    ],
  };

  const currentNavItems = navigationItems[userRole];
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        className="border-r"
        defaultCollapsed={false}
        collapsed={!isSidebarOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link 
              href={`/${userRole}-dashboard`} 
              className="flex items-center gap-2 font-semibold"
            >
              <Image 
                src="/images/school-logo.png" 
                alt="School Logo" 
                width={32} 
                height={32} 
              />
              {isSidebarOpen && (
                <span className="text-lg font-bold">Perpetual Help</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className={`fas fa-${isSidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {currentNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <i className={cn(item.icon, "h-4 w-4")}></i>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto w-auto">
                    <Avatar>
                      <AvatarImage src={`/images/${userRole}-avatar.png`} alt={userName} />
                      <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/${userRole}-dashboard/profile`} className="flex w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/${userRole}-dashboard/settings`} className="flex w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/logout" className="flex w-full">
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isSidebarOpen && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    <Badge variant="outline" className="capitalize">
                      {userRole}
                    </Badge>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Sidebar>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {currentNavItems.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <i className="fas fa-bell"></i>
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <i className="fas fa-envelope"></i>
              <span className="sr-only">Messages</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
