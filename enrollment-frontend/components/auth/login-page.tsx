"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";

export function LoginPage() {
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: `Redirecting to ${role} dashboard...`,
      });

      // Redirect based on role would happen here
    }, 1500);
  };

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

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="student" value={role} onValueChange={setRole}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-poppins text-2xl">
                  Welcome Back
                </CardTitle>
                <CardDescription>
                  Sign in to access the {role} portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">ID Number</Label>
                    <Input
                      id="id"
                      placeholder={`Enter your ${role} ID`}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                {role === "student" && (
                  <div className="text-center text-sm">
                    New student?{" "}
                    <Link
                      href="/register"
                      className="text-primary hover:underline"
                    >
                      Register here
                    </Link>
                  </div>
                )}
                <div className="text-center text-xs text-muted-foreground">
                  By signing in, you agree to our Terms of Service and Privacy
                  Policy
                </div>
              </CardFooter>
            </Card>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-4 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Perpetual Help College of Manila. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
