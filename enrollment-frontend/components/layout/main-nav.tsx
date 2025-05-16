"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  BookOpenCheck,
  ClipboardList,
  School,
  Building2,
  BookCopy,
  UserCog,
  Bell,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: NavItem[];
}

interface MainNavProps {
  role: "student" | "teacher" | "admin" | "global-admin";
}

export function MainNav({ role }: MainNavProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const studentNav: NavItem[] = [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Enrollment",
      href: "/student/enrollment",
      icon: BookOpen,
      submenu: [
        {
          title: "Course Selection",
          href: "/student/enrollment/courses",
          icon: BookOpenCheck,
        },
        {
          title: "Schedule",
          href: "/student/enrollment/schedule",
          icon: Calendar,
        },
        {
          title: "Payment",
          href: "/student/enrollment/payment",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "My Courses",
      href: "/student/enrollment/courses",
      icon: GraduationCap,
    },
    {
      title: "Grades",
      href: "/student/grades",
      icon: FileText,
    },
    {
      title: "Calendar",
      href: "/student/calendar",
      icon: Calendar,
    },
    {
      title: "Financial",
      href: "/student/financial",
      icon: CreditCard,
    },
    {
      title: "Profile",
      href: "/student/profile",
      icon: Users,
    },
  ];

  const teacherNav: NavItem[] = [
    {
      title: "Dashboard",
      href: "/teacher/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Classes",
      href: "/teacher/classes",
      icon: BookOpen,
      submenu: [
        {
          title: "Class Roster",
          href: "/teacher/classes/roster",
          icon: ClipboardList,
        },
        {
          title: "Attendance",
          href: "/teacher/classes/attendance",
          icon: Users,
        },
        {
          title: "Materials",
          href: "/teacher/classes/materials",
          icon: BookCopy,
        },
      ],
    },
    {
      title: "Grading",
      href: "/teacher/grading",
      icon: FileText,
    },
    {
      title: "Schedule",
      href: "/teacher/schedule",
      icon: Calendar,
    },
    {
      title: "Profile",
      href: "/teacher/profile",
      icon: Users,
    },
  ];

  const adminNav: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      submenu: [
        {
          title: "Students",
          href: "/admin/users/students",
          icon: GraduationCap,
        },
        {
          title: "Teachers",
          href: "/admin/users/teachers",
          icon: School,
        },
        {
          title: "Administrators",
          href: "/admin/users/admins",
          icon: UserCog,
        },
      ],
    },
    {
      title: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "Enrollment",
      href: "/admin/enrollment",
      icon: ClipboardList,
    },
    {
      title: "Departments",
      href: "/admin/departments",
      icon: Building2,
    },
    {
      title: "Financial",
      href: "/admin/financial",
      icon: CreditCard,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  // Global Admin navigation - extends admin navigation with additional items
  const globalAdminNav: NavItem[] = [
    ...adminNav,
    {
      title: "System Administration",
      href: "/admin/system",
      icon: ShieldAlert,
      submenu: [
        {
          title: "Admin Management",
          href: "/admin/system/admins",
          icon: UserCog,
        },
        {
          title: "Audit Logs",
          href: "/admin/audit-logs",
          icon: FileText,
        },
        {
          title: "System Settings",
          href: "/admin/system/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const navItems = {
    student: studentNav,
    teacher: teacherNav,
    admin: adminNav,
    "global-admin": globalAdminNav, // Global admin uses extended navigation with additional items
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-poppins font-semibold tracking-tight flex items-center gap-2">
          {role === "admin" || role === "global-admin"
            ? "Admin Portal"
            : role === "teacher"
            ? "Teacher Portal"
            : "Student Portal"}
          {role === "global-admin" && (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Global Admin
            </span>
          )}
        </h2>
        <div className="space-y-1">
          {navItems[role].map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            if (item.submenu) {
              const isSubmenuOpen = openSubmenu === item.title;
              const isSubmenuActive = item.submenu.some(
                (subItem) =>
                  pathname === subItem.href ||
                  pathname.startsWith(subItem.href + "/")
              );

              return (
                <Collapsible
                  key={item.href}
                  open={isSubmenuOpen || isSubmenuActive}
                  onOpenChange={() => toggleSubmenu(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={
                        isActive || isSubmenuActive ? "secondary" : "ghost"
                      }
                      className={cn(
                        "w-full justify-start",
                        (isActive || isSubmenuActive) &&
                          "bg-secondary/10 text-secondary"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn(
                          "ml-auto h-4 w-4 transition-transform",
                          isSubmenuOpen && "rotate-180"
                        )}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive =
                        pathname === subItem.href ||
                        pathname.startsWith(subItem.href + "/");

                      return (
                        <Button
                          key={subItem.href}
                          variant="ghost"
                          asChild
                          className={cn(
                            "mb-1 w-full justify-start",
                            isSubActive && "bg-secondary/10 text-secondary"
                          )}
                        >
                          <Link href={subItem.href}>
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.title}
                          </Link>
                        </Button>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                asChild
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary/10 text-secondary"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
