"use client";

import { useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { School, X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { generateUserId, generateRandomPassword } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { UserManagementContext } from "./student-registration-form";

// Form schema
const teacherSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  employeeId: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

export function TeacherRegistrationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const { addUser } = useContext(UserManagementContext);
  const { login } = useAuth();
  const [registeredUser, setRegisteredUser] = useState<{
    email: string;
    password: string;
    role: "teacher";
  } | null>(null);
  const [showLoginOption, setShowLoginOption] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      employeeId: "",
      contactNumber: "",
      address: "",
    },
  });

  const addSpecialization = () => {
    if (newSpecialization.trim() === "") return;

    if (!specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
    }

    setNewSpecialization("");
  };

  const removeSpecialization = (specialization: string) => {
    setSpecializations(specializations.filter((s) => s !== specialization));
  };

  async function onSubmit(data: TeacherFormValues) {
    setIsLoading(true);

    try {
      // Generate a random password if not provided or use the one from the form
      const password = data.password || generateRandomPassword();

      // Generate a unique ID for the teacher
      const teacherId = generateUserId("teacher");

      // Create the teacher user object
      const newTeacher = {
        id: teacherId,
        name: data.name,
        email: data.email,
        role: "teacher",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        employeeId: data.employeeId || undefined,
        specializations: specializations,
        contactNumber: data.contactNumber || undefined,
        address: data.address || undefined,
      };

      // In a real app, you would call your API here
      // const response = await fetch('/api/users/teachers', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     ...data,
      //     specialization: specializations
      //   })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add the new teacher to the user management component
      if (addUser) {
        addUser(newTeacher);
      }

      // Store the registered user credentials for login option
      setRegisteredUser({
        email: data.email,
        password: password,
        role: "teacher",
      });

      // Show login option
      setShowLoginOption(true);

      toast({
        title: "Teacher registered successfully",
        description: `${data.name} has been registered as a teacher.`,
      });

      // Reset form
      form.reset();
      setSpecializations([]);
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          "There was an error registering the teacher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to log in as the newly registered teacher
  const handleLogin = async () => {
    if (!registeredUser) return;

    try {
      setIsLoading(true);
      await login(
        registeredUser.email,
        registeredUser.password,
        registeredUser.role
      );

      toast({
        title: "Login successful",
        description: "You are now logged in as the newly registered teacher.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowLoginOption(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5" />
          Register New Teacher
        </CardTitle>
        <CardDescription>
          Create a new teacher account with all required information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter teacher's full name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="Enter teacher's email address"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              placeholder="Create a secure password"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters with uppercase, lowercase,
              number, and special character.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID (Optional)</Label>
            <Input
              id="employeeId"
              {...form.register("employeeId")}
              placeholder="Enter employee ID"
            />
          </div>

          <div className="space-y-2">
            <Label>Specializations</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {specializations.map((specialization) => (
                <Badge
                  key={specialization}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {specialization}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeSpecialization(specialization)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Add specialization"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSpecialization();
                  }
                }}
              />
              <Button type="button" size="sm" onClick={addSpecialization}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
              <Input
                id="contactNumber"
                {...form.register("contactNumber")}
                placeholder="Enter contact number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                {...form.register("address")}
                placeholder="Enter address"
              />
            </div>
          </div>

          <CardFooter className="px-0 pt-4">
            <Button
              type="submit"
              className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
              disabled={isLoading || specializations.length === 0}
            >
              {isLoading ? "Registering..." : "Register Teacher"}
            </Button>
          </CardFooter>
        </form>

        {/* Login option after successful registration */}
        {showLoginOption && registeredUser && (
          <div className="mt-4 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
            <h3 className="font-medium mb-2">
              Teacher Registered Successfully
            </h3>
            <p className="text-sm mb-2">
              The teacher has been registered with the following credentials:
            </p>
            <div className="space-y-1 mb-3">
              <div className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                {registeredUser.email}
              </div>
              <div className="text-sm">
                <span className="font-medium">Password:</span>{" "}
                {registeredUser.password}
              </div>
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in as this teacher"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
