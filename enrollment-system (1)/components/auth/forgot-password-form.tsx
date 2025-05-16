"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KeyRound, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Step 1: Request reset
const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Step 2: Verify code
const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Please enter the 6-digit verification code" }),
});

// Step 3: Reset password
const resetPasswordSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RequestResetValues = z.infer<typeof requestResetSchema>;
type VerifyCodeValues = z.infer<typeof verifyCodeSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const requestResetForm = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const verifyCodeForm = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleRequestReset = async (data: RequestResetValues) => {
    setIsLoading(true);

    try {
      // In a real application, you would call your API to send a reset code
      // const response = await sendResetCode(data.email)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmail(data.email);

      toast({
        title: "Verification code sent",
        description: `We've sent a verification code to ${data.email}. Please check your inbox.`,
      });

      setStep(2);
    } catch (error) {
      toast({
        title: "Failed to send verification code",
        description:
          "There was an error sending the verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (data: VerifyCodeValues) => {
    setIsLoading(true);

    try {
      // In a real application, you would call your API to verify the code
      // const response = await verifyResetCode(email, data.code)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Code verified",
        description:
          "Your verification code has been verified. You can now reset your password.",
      });

      setStep(3);
    } catch (error) {
      toast({
        title: "Invalid verification code",
        description:
          "The verification code you entered is invalid or has expired. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordValues) => {
    setIsLoading(true);

    try {
      // In a real application, you would call your API to reset the password
      // const response = await resetPassword(email, data.password)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Password reset successful",
        description:
          "Your password has been reset successfully. You can now log in with your new password.",
      });

      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      toast({
        title: "Failed to reset password",
        description:
          "There was an error resetting your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden rounded-lg">
      {/* Left side - Illustration */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#e77f33] p-10 md:flex">
        <div className="relative h-full w-full">
          <Image
            src="/images/students.png"
            alt="Forgot password illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Reset Your Password
        </h1>
      </div>

      {/* Right side - Forgot password form */}
      <div className="flex w-full flex-col justify-center bg-[#2d2d2a] p-8 md:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-[#e77f33] hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>

          <div className="flex items-center gap-2 text-white">
            <KeyRound className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Reset Password</h2>
          </div>

          <p className="mt-2 text-sm text-gray-300">
            {step === 1 &&
              "Enter your email address to receive a verification code."}
            {step === 2 && "Enter the verification code sent to your email."}
            {step === 3 && "Create a new password for your account."}
          </p>

          {/* Step 1: Request reset */}
          {step === 1 && (
            <form
              onSubmit={requestResetForm.handleSubmit(handleRequestReset)}
              className="mt-6 space-y-6"
            >
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
                  {...requestResetForm.register("email")}
                  className="bg-white"
                  disabled={isLoading}
                />
                {requestResetForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {requestResetForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          )}

          {/* Step 2: Verify code */}
          {step === 2 && (
            <form
              onSubmit={verifyCodeForm.handleSubmit(handleVerifyCode)}
              className="mt-6 space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="code"
                  className="text-sm font-medium text-white"
                >
                  Verification Code
                </label>
                <Input
                  id="code"
                  {...verifyCodeForm.register("code")}
                  className="bg-white"
                  disabled={isLoading}
                  placeholder="Enter 6-digit code"
                />
                {verifyCodeForm.formState.errors.code && (
                  <p className="text-sm text-red-500">
                    {verifyCodeForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-300">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    className="text-[#e77f33] hover:underline"
                    onClick={() => setStep(1)}
                  >
                    Resend
                  </button>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          )}

          {/* Step 3: Reset password */}
          {step === 3 && (
            <form
              onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
              className="mt-6 space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white"
                >
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  {...resetPasswordForm.register("password")}
                  className="bg-white"
                  disabled={isLoading}
                />
                {resetPasswordForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {resetPasswordForm.formState.errors.password.message}
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
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...resetPasswordForm.register("confirmPassword")}
                  className="bg-white"
                  disabled={isLoading}
                />
                {resetPasswordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {resetPasswordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
