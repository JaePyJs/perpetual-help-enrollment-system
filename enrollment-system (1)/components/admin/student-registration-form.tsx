"use client";

import { useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserPlus, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  generateStudentEmail,
  generateStudentId,
  generateUserId,
  generateRandomPassword,
} from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

// Create a context for user management functions
import { createContext } from "react";

export const UserManagementContext = createContext<{
  addUser?: (user: any) => void;
}>({});

// Form schema
const studentSchema = z
  .object({
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
    confirmPassword: z.string(),
    department: z.string().min(1, { message: "Department is required" }),
    yearLevel: z.string().min(1, { message: "Year level is required" }),
    section: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentRegistrationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { addUser } = useContext(UserManagementContext);
  const { login } = useAuth();
  const [registeredUser, setRegisteredUser] = useState<{
    id: string;
    email: string;
    password: string;
    role: "student";
  } | null>(null);
  const [showLoginOption, setShowLoginOption] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      yearLevel: "",
      section: "",
      contactNumber: "",
      address: "",
    },
  });

  async function onSubmit(data: StudentFormValues) {
    setIsLoading(true);

    try {
      // Generate a student email if not provided
      const studentEmail =
        data.email || generateStudentEmail(data.name, data.department);

      // Use the password from the form
      const password = data.password;

      // Generate a unique ID for the student
      const studentId = generateStudentId();

      // Create the student user object
      const newStudent = {
        id: studentId,
        name: data.name,
        email: studentEmail,
        role: "student",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        department: data.department,
        yearLevel: parseInt(data.yearLevel),
        section: data.section || undefined,
        contactNumber: data.contactNumber || undefined,
        address: data.address || undefined,
      };

      // In a real app, you would call your API here
      // const response = await fetch('/api/users/students', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(newStudent)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add the new student to the user management component
      if (addUser) {
        addUser(newStudent);
      }

      // Store the registered user credentials for login option
      setRegisteredUser({
        id: studentId,
        email: studentEmail,
        password: password,
        role: "student",
      });

      // Show login option
      setShowLoginOption(true);

      toast({
        title: "Student registered successfully",
        description: `${data.name} has been registered as a student.`,
      });

      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          "There was an error registering the student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to log in as the newly registered student
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
        description: "You are now logged in as the newly registered student.",
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
          <UserPlus className="h-5 w-5" />
          Register New Student
        </CardTitle>
        <CardDescription>
          Create a new student account with all required information
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
                placeholder="Enter student's full name"
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
                placeholder="Enter student's email address"
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                placeholder="Create a secure password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
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
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...form.register("confirmPassword")}
                placeholder="Confirm your password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                onValueChange={(value) => {
                  form.setValue("department", value);
                  setSelectedDepartment(value);
                  // Reset year level when department changes
                  form.setValue("yearLevel", "");
                }}
                defaultValue={form.getValues("department")}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BSIT">
                    BS Information Technology
                  </SelectItem>
                  <SelectItem value="BSCS">BS Computer Science</SelectItem>
                  <SelectItem value="BSN">BS Nursing</SelectItem>
                  <SelectItem value="BS RADTECH">
                    BS Radiologic Technology
                  </SelectItem>
                  <SelectItem value="SHS">Senior High School</SelectItem>
                  <SelectItem value="JHS">Junior High School</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.department && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.department.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearLevel">Year Level</Label>
              <Select
                onValueChange={(value) => form.setValue("yearLevel", value)}
                defaultValue={form.getValues("yearLevel")}
              >
                <SelectTrigger id="yearLevel">
                  <SelectValue placeholder="Select year level" />
                </SelectTrigger>
                <SelectContent>
                  {/* College departments have 4 years */}
                  {(selectedDepartment === "BSIT" ||
                    selectedDepartment === "BSCS" ||
                    selectedDepartment === "BSN" ||
                    selectedDepartment === "BS RADTECH") && (
                    <>
                      <SelectItem value="1">First Year</SelectItem>
                      <SelectItem value="2">Second Year</SelectItem>
                      <SelectItem value="3">Third Year</SelectItem>
                      <SelectItem value="4">Fourth Year</SelectItem>
                    </>
                  )}

                  {/* Senior High School has 2 years */}
                  {selectedDepartment === "SHS" && (
                    <>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </>
                  )}

                  {/* Junior High School has 4 years */}
                  {selectedDepartment === "JHS" && (
                    <>
                      <SelectItem value="7">Grade 7</SelectItem>
                      <SelectItem value="8">Grade 8</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                    </>
                  )}

                  {/* Show all options if no department is selected */}
                  {!selectedDepartment && (
                    <>
                      <SelectItem value="1">First Year</SelectItem>
                      <SelectItem value="2">Second Year</SelectItem>
                      <SelectItem value="3">Third Year</SelectItem>
                      <SelectItem value="4">Fourth Year</SelectItem>
                      <SelectItem value="7">Grade 7</SelectItem>
                      <SelectItem value="8">Grade 8</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.yearLevel && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.yearLevel.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Section (Optional)</Label>
            <Input
              id="section"
              {...form.register("section")}
              placeholder="Enter section (e.g., A, B, C)"
            />
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
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register Student"}
            </Button>
          </CardFooter>
        </form>

        {/* Login option after successful registration */}
        {showLoginOption && registeredUser && (
          <div className="mt-4 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
            <h3 className="font-medium mb-2">
              Student Registered Successfully
            </h3>
            <p className="text-sm mb-2">
              The student has been registered with the following credentials:
            </p>
            <div className="space-y-1 mb-3">
              <div className="text-sm">
                <span className="font-medium">Student ID:</span>{" "}
                {registeredUser.id}
              </div>
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
              {isLoading ? "Logging in..." : "Log in as this student"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
