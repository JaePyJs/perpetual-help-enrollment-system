"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Step 1: Personal Information
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
});

// Step 2: Academic Information
const academicInfoSchema = z.object({
  program: z.string().min(1, { message: "Program is required" }),
  yearLevel: z.string().min(1, { message: "Year level is required" }),
  previousSchool: z.string().min(1, { message: "Previous school is required" }),
  studentType: z.enum(["new", "transferee", "returning"], {
    required_error: "Student type is required",
  }),
});

// Step 3: Account Setup
const accountSetupSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" }),
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
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type AcademicInfoValues = z.infer<typeof academicInfoSchema>;
type AccountSetupValues = z.infer<typeof accountSetupSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    program: "",
    yearLevel: "",
    previousSchool: "",
    studentType: "new",
    username: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
    },
  });

  const academicInfoForm = useForm<AcademicInfoValues>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: {
      program: formData.program,
      yearLevel: formData.yearLevel,
      previousSchool: formData.previousSchool,
      studentType: formData.studentType as "new" | "transferee" | "returning",
    },
  });

  const accountSetupForm = useForm<AccountSetupValues>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      termsAccepted: formData.termsAccepted,
    },
  });

  const handlePersonalInfoSubmit = (data: PersonalInfoValues) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const handleAcademicInfoSubmit = (data: AcademicInfoValues) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const handleAccountSetupSubmit = async (data: AccountSetupValues) => {
    setIsLoading(true);

    try {
      // Show a message that only admins can register students
      toast({
        title: "Registration not available",
        description:
          "Only administrators can register new students. Please contact the admin office.",
        variant: "destructive",
      });

      // Redirect to login page after a delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden rounded-lg">
      {/* Left side - Illustration */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#e77f33] p-10 md:flex">
        <div className="relative h-full w-full">
          <Image
            src="/images/students.png"
            alt="Student registration illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Join Perpetual Help College!
        </h1>
      </div>

      {/* Right side - Registration form */}
      <div className="flex w-full flex-col justify-center bg-[#2d2d2a] p-8 md:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-white">
              <UserPlus className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Student Registration</h2>
            </div>

            {/* Admin-only registration notice */}
            <div className="mt-2 rounded-md bg-red-500 bg-opacity-20 p-3 text-red-300 border border-red-500">
              <p className="text-sm">
                <strong>Important Notice:</strong> Only administrators can
                register new students. This form is for demonstration purposes
                only. Please contact the admin office for registration.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mt-6">
              <div className="flex justify-between">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      step === i
                        ? "bg-[#e77f33] text-white"
                        : step > i
                        ? "bg-green-500 text-white"
                        : "bg-gray-600 text-gray-300"
                    )}
                  >
                    {step > i ? "✓" : i}
                  </div>
                ))}
              </div>
              <div className="relative mt-2 h-1 w-full bg-gray-600">
                <div
                  className="absolute h-1 bg-[#e77f33] transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Personal Info</span>
                <span>Academic Info</span>
                <span>Account Setup</span>
              </div>
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <form
              onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-white"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    {...personalInfoForm.register("firstName")}
                    className="bg-white"
                  />
                  {personalInfoForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500">
                      {personalInfoForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-white"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    {...personalInfoForm.register("lastName")}
                    className="bg-white"
                  />
                  {personalInfoForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500">
                      {personalInfoForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  {...personalInfoForm.register("email")}
                  className="bg-white"
                />
                {personalInfoForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {personalInfoForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-white"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  {...personalInfoForm.register("phone")}
                  className="bg-white"
                />
                {personalInfoForm.formState.errors.phone && (
                  <p className="text-sm text-red-500">
                    {personalInfoForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dateOfBirth"
                  className="text-sm font-medium text-white"
                >
                  Date of Birth
                </label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...personalInfoForm.register("dateOfBirth")}
                  className="bg-white"
                />
                {personalInfoForm.formState.errors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {personalInfoForm.formState.errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Link href="/auth/login">
                  <Button variant="outline" type="button">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-[#e77f33] hover:bg-[#d06b25]"
                >
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Academic Information */}
          {step === 2 && (
            <form
              onSubmit={academicInfoForm.handleSubmit(handleAcademicInfoSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="program"
                  className="text-sm font-medium text-white"
                >
                  Program
                </label>
                <Select
                  onValueChange={(value) =>
                    academicInfoForm.setValue("program", value)
                  }
                  defaultValue={formData.program}
                >
                  <SelectTrigger id="program" className="bg-white">
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bscs">BS Computer Science</SelectItem>
                    <SelectItem value="bsit">
                      BS Information Technology
                    </SelectItem>
                    <SelectItem value="bsba">
                      BS Business Administration
                    </SelectItem>
                    <SelectItem value="bsn">BS Nursing</SelectItem>
                    <SelectItem value="bsed">BS Education</SelectItem>
                  </SelectContent>
                </Select>
                {academicInfoForm.formState.errors.program && (
                  <p className="text-sm text-red-500">
                    {academicInfoForm.formState.errors.program.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="yearLevel"
                  className="text-sm font-medium text-white"
                >
                  Year Level
                </label>
                <Select
                  onValueChange={(value) =>
                    academicInfoForm.setValue("yearLevel", value)
                  }
                  defaultValue={formData.yearLevel}
                >
                  <SelectTrigger id="yearLevel" className="bg-white">
                    <SelectValue placeholder="Select year level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">First Year</SelectItem>
                    <SelectItem value="2">Second Year</SelectItem>
                    <SelectItem value="3">Third Year</SelectItem>
                    <SelectItem value="4">Fourth Year</SelectItem>
                  </SelectContent>
                </Select>
                {academicInfoForm.formState.errors.yearLevel && (
                  <p className="text-sm text-red-500">
                    {academicInfoForm.formState.errors.yearLevel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="previousSchool"
                  className="text-sm font-medium text-white"
                >
                  Previous School
                </label>
                <Input
                  id="previousSchool"
                  {...academicInfoForm.register("previousSchool")}
                  className="bg-white"
                />
                {academicInfoForm.formState.errors.previousSchool && (
                  <p className="text-sm text-red-500">
                    {academicInfoForm.formState.errors.previousSchool.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Student Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="new"
                      value="new"
                      {...academicInfoForm.register("studentType")}
                      defaultChecked={formData.studentType === "new"}
                      className="h-4 w-4 text-[#e77f33]"
                    />
                    <label htmlFor="new" className="text-sm text-white">
                      New Student
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="transferee"
                      value="transferee"
                      {...academicInfoForm.register("studentType")}
                      defaultChecked={formData.studentType === "transferee"}
                      className="h-4 w-4 text-[#e77f33]"
                    />
                    <label htmlFor="transferee" className="text-sm text-white">
                      Transferee
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="returning"
                      value="returning"
                      {...academicInfoForm.register("studentType")}
                      defaultChecked={formData.studentType === "returning"}
                      className="h-4 w-4 text-[#e77f33]"
                    />
                    <label htmlFor="returning" className="text-sm text-white">
                      Returning
                    </label>
                  </div>
                </div>
                {academicInfoForm.formState.errors.studentType && (
                  <p className="text-sm text-red-500">
                    {academicInfoForm.formState.errors.studentType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Document Upload
                </label>
                <div className="rounded-md border border-dashed border-gray-500 p-6 text-center">
                  <p className="mb-2 text-sm text-gray-300">
                    Upload your high school transcript or previous school
                    records
                  </p>
                  <Button variant="outline" size="sm" type="button">
                    Choose File
                  </Button>
                  <p className="mt-2 text-xs text-gray-400">
                    Supported formats: PDF, JPG, PNG (Max: 5MB)
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={goToPreviousStep}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="bg-[#e77f33] hover:bg-[#d06b25]"
                >
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Account Setup */}
          {step === 3 && (
            <form
              onSubmit={accountSetupForm.handleSubmit(handleAccountSetupSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-white"
                >
                  Username
                </label>
                <Input
                  id="username"
                  {...accountSetupForm.register("username")}
                  className="bg-white"
                />
                {accountSetupForm.formState.errors.username && (
                  <p className="text-sm text-red-500">
                    {accountSetupForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  {...accountSetupForm.register("password")}
                  className="bg-white"
                />
                {accountSetupForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {accountSetupForm.formState.errors.password.message}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Password must be at least 8 characters with uppercase,
                  lowercase, number, and special character.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-white"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...accountSetupForm.register("confirmPassword")}
                  className="bg-white"
                />
                {accountSetupForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {accountSetupForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="termsAccepted"
                  onCheckedChange={(checked) => {
                    accountSetupForm.setValue(
                      "termsAccepted",
                      checked === true
                    );
                  }}
                  className="mt-1"
                />
                <label
                  htmlFor="termsAccepted"
                  className="text-sm text-gray-300"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#e77f33] hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#e77f33] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {accountSetupForm.formState.errors.termsAccepted && (
                <p className="text-sm text-red-500">
                  {accountSetupForm.formState.errors.termsAccepted.message}
                </p>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={goToPreviousStep}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="bg-[#e77f33] hover:bg-[#d06b25]"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Complete Registration"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
