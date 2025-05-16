"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [role, setRole] = useState<
    "student" | "teacher" | "admin" | "global-admin"
  >("student");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    try {
      // For demonstration purposes, we'll show the test accounts
      const credentials = {
        student: { username: "student@uphc.edu.ph", password: "student123" },
        teacher: { username: "teacher@uphc.edu.ph", password: "teacher123" },
        admin: { username: "admin@uphc.edu.ph", password: "admin123" },
        "global-admin": {
          username: "global-admin@uphc.edu.ph",
          password: "admin123",
        },
      };

      // Try to login with the provided credentials
      try {
        await login(data.username, data.password, role);

        toast({
          title: "Login successful",
          description: `Welcome back! Redirecting to ${role} dashboard...`,
        });

        // The login function in auth context already handles redirection
      } catch (loginError) {
        // If login fails, show the test credentials as a hint
        const roleCredentials = credentials[role];

        toast({
          title: "Login failed",
          description: `Hint: Use ${roleCredentials.username} / ${roleCredentials.password} for ${role} login`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden rounded-lg">
      {/* Left side - Illustration */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#e77f33] p-10 md:flex">
        <div className="relative h-full w-full">
          <Image
            src={
              role === "student"
                ? "/images/students.png"
                : role === "teacher"
                ? "/images/teacher.png"
                : role === "admin"
                ? "/images/admin.png"
                : "/images/admin.png" // Use the same image for global-admin
            }
            alt={`${role} illustration`}
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Welcome to Perpetual!
        </h1>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col justify-center bg-[#2d2d2a] p-8 md:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <Tabs
            defaultValue="student"
            value={role}
            onValueChange={(value) => setRole(value as any)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-[#3a3a36]">
              <TabsTrigger
                value="student"
                className="data-[state=active]:bg-[#e77f33]"
              >
                Student
              </TabsTrigger>
              <TabsTrigger
                value="teacher"
                className="data-[state=active]:bg-[#e77f33]"
              >
                Teacher
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-[#e77f33]"
              >
                Admin
              </TabsTrigger>
              <TabsTrigger
                value="global-admin"
                className="data-[state=active]:bg-[#e77f33]"
              >
                Global Admin
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <div className="flex items-center gap-2 text-white">
                <Rocket className="h-5 w-5" />
                <h2 className="text-xl font-semibold">
                  {role.charAt(0).toUpperCase() + role.slice(1)} Log in
                </h2>
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-6"
              >
                <div className="space-y-2">
                  <Input
                    id="username"
                    placeholder="User"
                    {...form.register("username")}
                    className="bg-white text-black"
                    disabled={isLoading}
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...form.register("password")}
                      className="bg-white text-black pr-16"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#e77f33] hover:underline"
                  >
                    Forgot Username or Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Continue"}
                </Button>
              </form>

              {role === "student" && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-300">
                    New student?{" "}
                    <Link
                      href="/auth/register"
                      className="text-[#e77f33] hover:underline"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
