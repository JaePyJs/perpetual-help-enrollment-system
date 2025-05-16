import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Table of Contents | Perpetual Help College Enrollment System",
  description:
    "Navigation hub for the Perpetual Help College Enrollment System",
};

export default function TableOfContentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/school-logo.png"
              alt="Perpetual Help College Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <h1 className="text-xl font-poppins font-bold">
              Perpetual Help College
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Image
              src="/images/school-logo.png"
              alt="School Logo"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold font-poppins text-primary mb-2">
              School Enrollment System
            </h1>
            <p className="text-muted-foreground">
              Welcome to the Perpetual Help College Enrollment System. Use the
              links below to navigate to different sections of the application.
            </p>
          </div>

          <Alert className="mb-6 border-primary/50 bg-primary/10">
            <InfoIcon className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary font-medium">
              Navigation Hub
            </AlertTitle>
            <AlertDescription>
              This Table of Contents page serves as the central navigation hub.
              You can access all pages from here for demonstration purposes,
              even without logging in. Click any link to explore that section of
              the application.
            </AlertDescription>
          </Alert>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test Accounts</CardTitle>
              <CardDescription>
                Use these accounts to test the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="border rounded-md p-3">
                  <div className="font-medium">Student Account</div>
                  <div className="text-sm text-muted-foreground">
                    Username: student@uphc.edu.ph
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Password: student123
                  </div>
                  <Badge className="mt-2" variant="outline">
                    Student Role
                  </Badge>
                </div>
                <div className="border rounded-md p-3">
                  <div className="font-medium">Teacher Account</div>
                  <div className="text-sm text-muted-foreground">
                    Username: teacher@uphc.edu.ph
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Password: teacher123
                  </div>
                  <Badge className="mt-2" variant="outline">
                    Teacher Role
                  </Badge>
                </div>
                <div className="border rounded-md p-3">
                  <div className="font-medium">Admin Account</div>
                  <div className="text-sm text-muted-foreground">
                    Username: admin@uphc.edu.ph
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Password: admin123
                  </div>
                  <Badge className="mt-2" variant="outline">
                    Admin Role
                  </Badge>
                </div>
                <div className="border rounded-md p-3">
                  <div className="font-medium">Global Admin Account</div>
                  <div className="text-sm text-muted-foreground">
                    Username: global-admin@uphc.edu.ph
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Password: admin123
                  </div>
                  <Badge className="mt-2" variant="outline">
                    Global Admin Role
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Login and registration pages</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/auth/login">Login</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/auth/register">Register</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/auth/forgot-password">Forgot Password</Link>
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Portal</CardTitle>
                <CardDescription>Student-specific pages</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/student/dashboard">Dashboard</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/student/profile">Profile</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/student/grades">Grades</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/student/enrollment/courses">
                        Course Selection
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/student/enrollment/payment">Payment</Link>
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teacher Portal</CardTitle>
                <CardDescription>Teacher-specific pages</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/teacher/dashboard">Dashboard</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/teacher/classes">Classes</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/teacher/grades">Grade Management</Link>
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>Admin-specific pages</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/admin/dashboard">Dashboard</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/admin/user-management">
                        Enhanced User Management
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/admin/user-management?tab=students">
                        Register Students
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/admin/user-management?tab=teachers">
                        Register Teachers
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/admin/user-management?tab=admins">
                        Register Admins
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/admin/audit-logs">Audit Logs</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/admin/courses">Course Management</Link>
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Backend API Endpoints</CardTitle>
              <CardDescription>API documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <a
                      href="http://localhost:5000/api/auth"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Authentication API
                    </a>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <a
                      href="http://localhost:5000/api/students"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Students API
                    </a>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <a
                      href="http://localhost:5000/api/teacher"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Teachers API
                    </a>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <a
                      href="http://localhost:5000/api/subjects"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Subjects API
                    </a>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <a
                      href="http://localhost:5000/api/enrollment"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enrollment API
                    </a>
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t py-4 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Perpetual Help College of Manila.
          All rights reserved.
        </div>
      </footer>
    </div>
  );
}
