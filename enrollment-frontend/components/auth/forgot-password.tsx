"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      if (step === 1) {
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code.",
        });
        setStep(2);
      } else if (step === 2) {
        toast({
          title: "Code Verified",
          description: "You can now reset your password.",
        });
        setStep(3);
      } else {
        toast({
          title: "Password Reset Successful",
          description: "You can now login with your new password.",
        });
        // Redirect to login page would happen here
      }
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
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins text-2xl">
                Reset Password
              </CardTitle>
              <CardDescription>
                {step === 1 &&
                  "Enter your ID number to receive a verification code"}
                {step === 2 && "Enter the verification code sent to your email"}
                {step === 3 && "Create a new password for your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <div className="space-y-2">
                    <Label htmlFor="id">ID Number</Label>
                    <Input
                      id="id"
                      placeholder="Enter your ID number"
                      required
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      placeholder="Enter 6-digit code"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Didn't receive a code?{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters with a number and
                        special character
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : step === 1
                    ? "Send Code"
                    : step === 2
                    ? "Verify Code"
                    : "Reset Password"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Link href="/" className="text-sm text-primary hover:underline">
                Back to Login
              </Link>
            </CardFooter>
          </Card>
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
