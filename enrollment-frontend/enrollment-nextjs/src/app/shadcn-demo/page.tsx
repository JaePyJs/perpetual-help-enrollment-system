"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ShadcnDemo() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/school-logo.png"
              alt="Perpetual Help College of Manila"
              width={40}
              height={40}
            />
            <span className="text-lg font-bold">Perpetual Help College</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login-shadcn">
              <Button variant="outline">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Shadcn UI Demo Pages</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the redesigned enrollment system interface using Shadcn UI
              components.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Login Page</CardTitle>
                <CardDescription>
                  Multi-role login interface with role-specific dashboards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden border mb-4 bg-orange-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <i className="fas fa-user-circle text-4xl text-orange-500 mb-2"></i>
                    <p className="font-medium text-orange-800">Login Preview</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Separate login interfaces for students, teachers, and
                  administrators.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/login-shadcn" className="w-full">
                  <Button className="w-full">View Login Page</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive student portal with academic information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden border mb-4 bg-blue-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <i className="fas fa-user-graduate text-4xl text-blue-500 mb-2"></i>
                    <p className="font-medium text-blue-800">
                      Student Dashboard
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  View grades, courses, schedules, and upcoming deadlines.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/student-dashboard-shadcn" className="w-full">
                  <Button className="w-full">View Student Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teacher Dashboard</CardTitle>
                <CardDescription>
                  Faculty portal for managing classes and grades.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden border mb-4 bg-green-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <i className="fas fa-chalkboard-teacher text-4xl text-green-500 mb-2"></i>
                    <p className="font-medium text-green-800">
                      Teacher Dashboard
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage classes, schedules, and student grades.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/teacher-dashboard-shadcn" className="w-full">
                  <Button className="w-full">View Teacher Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Administrative control panel for system management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden border mb-4 bg-purple-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <i className="fas fa-user-shield text-4xl text-purple-500 mb-2"></i>
                    <p className="font-medium text-purple-800">
                      Admin Dashboard
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage enrollments, departments, and system settings.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin-dashboard-shadcn" className="w-full">
                  <Button className="w-full">View Admin Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Component Library</CardTitle>
                <CardDescription>
                  Explore all Shadcn UI components used in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden border mb-4 bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <i className="fas fa-puzzle-piece text-4xl text-gray-500 mb-2"></i>
                    <p className="font-medium text-gray-800">
                      Component Library
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  View all UI components with examples and documentation.
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href="https://ui.shadcn.com/docs/components/accordion"
                  target="_blank"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    View Component Library
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Original Dashboard</CardTitle>
                <CardDescription>
                  View the original dashboard implementation for comparison.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden border mb-4 bg-amber-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <i className="fas fa-columns text-4xl text-amber-500 mb-2"></i>
                    <p className="font-medium text-amber-800">
                      Original Dashboard
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compare the new Shadcn UI implementation with the original
                  design.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/student-dashboard" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Original Dashboard
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Perpetual Help College of Manila. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
