"use client";

import { useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShieldAlert, AlertTriangle } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { generateUserId, generateRandomPassword } from "@/lib/utils";
import { UserManagementContext } from "./student-registration-form";

// Form schema
const adminSchema = z.object({
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
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  isGlobalAdmin: z.boolean().default(false),
});

type AdminFormValues = z.infer<typeof adminSchema>;

export function AdminRegistrationForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addUser } = useContext(UserManagementContext);
  const { login } = useAuth();
  const [registeredUser, setRegisteredUser] = useState<{
    email: string;
    password: string;
    role: "admin" | "global-admin";
  } | null>(null);
  const [showLoginOption, setShowLoginOption] = useState(false);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
      isGlobalAdmin: false,
    },
  });

  // Check if current user is a global admin
  const isGlobalAdmin = user?.role === "global-admin";

  const handleSubmit = (data: AdminFormValues) => {
    // If creating a global admin, show confirmation first
    if (data.isGlobalAdmin && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    // Otherwise proceed with submission
    onSubmit(data);
  };

  async function onSubmit(data: AdminFormValues) {
    setIsLoading(true);

    try {
      // Generate a random password if not provided or use the one from the form
      const password = data.password || generateRandomPassword();

      // Generate a unique ID for the admin
      const adminId = generateUserId(
        data.isGlobalAdmin ? "global-admin" : "admin"
      );

      // Create the admin user object
      const newAdmin = {
        id: adminId,
        name: data.name,
        email: data.email,
        role: data.isGlobalAdmin ? "global-admin" : "admin",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        contactNumber: data.contactNumber || undefined,
        address: data.address || undefined,
      };

      // In a real app, you would call your API here
      // const response = await fetch('/api/users/admins', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(data)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add the new admin to the user management component
      if (addUser) {
        addUser(newAdmin);
      }

      // Store the registered user credentials for login option
      setRegisteredUser({
        email: data.email,
        password: password,
        role: data.isGlobalAdmin ? "global-admin" : "admin",
      });

      // Show login option
      setShowLoginOption(true);

      toast({
        title: "Admin registered successfully",
        description: `${data.name} has been registered as an ${
          data.isGlobalAdmin ? "global admin" : "admin"
        }.`,
      });

      // Reset form and confirmation
      form.reset();
      setShowConfirmation(false);
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          "There was an error registering the admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to log in as the newly registered admin
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
        description: `You are now logged in as the newly registered ${
          registeredUser.role === "global-admin" ? "global admin" : "admin"
        }.`,
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

  // If not a global admin, show access denied message
  if (!isGlobalAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <ShieldAlert className="h-5 w-5" />
            Access Denied
          </CardTitle>
          <CardDescription>
            Only Global Administrators can register new admin accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Restricted Access</AlertTitle>
            <AlertDescription>
              You do not have permission to access this section. Please contact
              a Global Administrator if you need to register a new admin
              account.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          Register New Administrator
        </CardTitle>
        <CardDescription>
          Create a new administrator account with appropriate permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Security Notice</AlertTitle>
              <AlertDescription>
                You are about to create a Global Administrator account. Global
                Administrators have complete control over the entire system,
                including the ability to create other admin accounts.
                <br />
                <br />
                Are you sure you want to proceed?
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => onSubmit(form.getValues())}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Confirm Creation"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter admin's full name"
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
                  placeholder="Enter admin's email address"
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
                Password must be at least 8 characters with uppercase,
                lowercase, number, and special character.
              </p>
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isGlobalAdmin"
                checked={form.watch("isGlobalAdmin")}
                onCheckedChange={(checked) => {
                  form.setValue("isGlobalAdmin", checked === true);
                }}
              />
              <Label
                htmlFor="isGlobalAdmin"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make this user a Global Administrator
              </Label>
            </div>

            {form.watch("isGlobalAdmin") && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Global Administrators have complete control over the entire
                  system, including the ability to create other admin accounts.
                </AlertDescription>
              </Alert>
            )}

            <CardFooter className="px-0 pt-4">
              <Button
                type="submit"
                className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register Administrator"}
              </Button>
            </CardFooter>
          </form>
        )}

        {/* Login option after successful registration */}
        {showLoginOption && registeredUser && (
          <div className="mt-4 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
            <h3 className="font-medium mb-2">
              Administrator Registered Successfully
            </h3>
            <p className="text-sm mb-2">
              The{" "}
              {registeredUser.role === "global-admin"
                ? "global admin"
                : "admin"}{" "}
              has been registered with the following credentials:
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
              {isLoading
                ? "Logging in..."
                : `Log in as this ${
                    registeredUser.role === "global-admin"
                      ? "global admin"
                      : "admin"
                  }`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
