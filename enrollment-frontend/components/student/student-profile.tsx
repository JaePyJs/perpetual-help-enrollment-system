"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAuth } from "@/contexts/auth-context";
import { fetchStudentProfile, updateStudentProfile } from "@/lib/api";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email("This is not a valid email"),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  username: "johndoe123",
  email: "john.doe@example.com",
  bio: "I am a Computer Science student at Perpetual Help College of Manila.",
  urls: [{ value: "https://example.com" }],
  dob: new Date("2000-01-01"),
};

export function StudentProfile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<any>(defaultValues);

  // Fetch profile data when component mounts
  useEffect(() => {
    const getProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchStudentProfile();
        if (response.data) {
          // Transform API data to match form structure
          const formattedData = {
            username: response.data.username || defaultValues.username,
            email: response.data.email || defaultValues.email,
            bio: response.data.bio || defaultValues.bio,
            urls: response.data.urls || defaultValues.urls,
            dob: response.data.dob
              ? new Date(response.data.dob)
              : defaultValues.dob,
          };
          setProfileData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Using default values.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getProfileData();
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profileData,
    mode: "onChange",
  });

  // Update form values when profileData changes
  useEffect(() => {
    form.reset(profileData);
  }, [form, profileData]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      const response = await updateStudentProfile(data);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user?.profileImage || "/images/student.png"}
                alt={user?.username || "Student"}
              />
              <AvatarFallback>
                {user?.firstName?.charAt(0) || ""}
                {user?.lastName?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Student ID: {user?.id || "Loading..."}
              </p>
              <Button variant="outline" className="h-8 px-3 text-xs">
                Change Avatar
              </Button>
            </div>
          </div>
          <Form value={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe123" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your email address is used for notifications and login.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your date of birth is used for age verification.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can <span>@mention</span> other users and
                      organizations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const currentPassword = formData.get(
                    "currentPassword"
                  ) as string;
                  const newPassword = formData.get("newPassword") as string;
                  const confirmPassword = formData.get(
                    "confirmPassword"
                  ) as string;

                  if (!currentPassword || !newPassword || !confirmPassword) {
                    toast({
                      title: "Error",
                      description: "All fields are required",
                      variant: "destructive",
                    });
                    return;
                  }

                  if (newPassword !== confirmPassword) {
                    toast({
                      title: "Error",
                      description: "New password and confirmation do not match",
                      variant: "destructive",
                    });
                    return;
                  }

                  setIsLoading(true);

                  // Call API to change password
                  fetch(
                    `${
                      process.env.NEXT_PUBLIC_API_URL ||
                      "http://localhost:5000/api"
                    }/auth/change-password`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                      body: JSON.stringify({
                        currentPassword,
                        newPassword,
                      }),
                    }
                  )
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error("Failed to change password");
                      }
                      return response.json();
                    })
                    .then(() => {
                      toast({
                        title: "Success",
                        description:
                          "Password changed successfully. You will be logged out.",
                      });

                      // Log out after password change
                      setTimeout(() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        window.location.href = "/login";
                      }, 2000);
                    })
                    .catch((error) => {
                      toast({
                        title: "Error",
                        description:
                          error instanceof Error
                            ? error.message
                            : "Failed to change password",
                        variant: "destructive",
                      });
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <FormLabel htmlFor="currentPassword">
                    Current password
                  </FormLabel>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="newPassword">New password</FormLabel>
                  <Input id="newPassword" name="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="confirmPassword">
                    Confirm password
                  </FormLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the site looks for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const theme = formData.get("theme") as string;

                  setIsLoading(true);

                  // Call API to save theme preference
                  fetch(
                    `${
                      process.env.NEXT_PUBLIC_API_URL ||
                      "http://localhost:5000/api"
                    }/users/preferences`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                      body: JSON.stringify({
                        theme,
                      }),
                    }
                  )
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error("Failed to save preferences");
                      }
                      return response.json();
                    })
                    .then(() => {
                      // Save theme to localStorage for immediate effect
                      localStorage.setItem("theme", theme);

                      // Apply theme
                      if (theme === "dark") {
                        document.documentElement.classList.add("dark");
                      } else if (theme === "light") {
                        document.documentElement.classList.remove("dark");
                      } else if (theme === "system") {
                        const systemTheme = window.matchMedia(
                          "(prefers-color-scheme: dark)"
                        ).matches
                          ? "dark"
                          : "light";
                        if (systemTheme === "dark") {
                          document.documentElement.classList.add("dark");
                        } else {
                          document.documentElement.classList.remove("dark");
                        }
                      }

                      toast({
                        title: "Success",
                        description: "Preferences saved successfully.",
                      });
                    })
                    .catch((error) => {
                      toast({
                        title: "Error",
                        description:
                          error instanceof Error
                            ? error.message
                            : "Failed to save preferences",
                        variant: "destructive",
                      });
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <FormLabel htmlFor="theme">Theme</FormLabel>
                  <Select defaultValue="system" name="theme">
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the theme for the dashboard.
                  </FormDescription>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save preferences"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
