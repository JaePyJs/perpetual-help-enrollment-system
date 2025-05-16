"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginShadcn() {
  const [activeTab, setActiveTab] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Redirect based on role
      if (activeTab === "student") {
        router.push("/student-dashboard-shadcn");
      } else if (activeTab === "teacher") {
        router.push("/teacher-dashboard-shadcn");
      } else if (activeTab === "admin") {
        router.push("/admin-dashboard-shadcn");
      }
    }, 1500);
  };

  const getActiveImage = () => {
    switch (activeTab) {
      case "student":
        return "/images/student-avatar.png";
      case "teacher":
        return "/images/teacher-avatar.png";
      case "admin":
        return "/images/admin-avatar.png";
      default:
        return "/images/student-avatar.png";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/school-logo.png"
            alt="Perpetual Help College of Manila"
            width={100}
            height={100}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold">Perpetual Help</h1>
          <p className="text-muted-foreground">College of Manila</p>
        </div>

        <Tabs 
          defaultValue="student" 
          className="w-full" 
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setError("");
          }}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 bg-background p-1 shadow-lg transition-all duration-300">
              <Image
                src={getActiveImage()}
                alt={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Avatar`}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>
                  Enter your student ID and password to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="student-id">Student ID</Label>
                      <Input
                        id="student-id"
                        placeholder="M23-1470-578"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="student-password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {error && (
                      <div className="text-sm text-destructive">{error}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/contact-registrar"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Contact the registrar
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="teacher">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Login</CardTitle>
                <CardDescription>
                  Enter your faculty ID and password to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="faculty-id">Faculty ID</Label>
                      <Input
                        id="faculty-id"
                        placeholder="T-2023-0042"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="faculty-password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="faculty-password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {error && (
                      <div className="text-sm text-destructive">{error}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Having trouble?{" "}
                  <Link
                    href="/contact-it"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Contact IT support
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Enter your admin credentials to access the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="admin-id">Admin ID</Label>
                      <Input
                        id="admin-id"
                        placeholder="A-2023-0001"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {error && (
                      <div className="text-sm text-destructive">{error}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Security notice: Admin access is monitored and logged.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Perpetual Help College of Manila. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
