"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Profile schema
const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }).optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
})

// Password schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z
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
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export function ProfileForm() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      contactNumber: "",
      address: "",
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onProfileSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      // In a real app, you would call your API here
      // const response = await fetch('/api/users/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(data)
      // });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been updated.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    setIsLoading(true)

    try {
      // In a real app, you would call your API here
      // const response = await fetch('/api/users/password', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     currentPassword: data.currentPassword,
      //     newPassword: data.newPassword
      //   })
      // });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password updated successfully",
        description: "Your password has been updated. You'll use your new password the next time you log in.",
      })

      // Reset form
      passwordForm.reset()
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.role === "student" ? "/images/student.png" : 
                            user?.role === "teacher" ? "/images/teacher.png" : 
                            "/images/admin.png"} 
                         alt={user?.username || "User"} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>
              Update your personal information and password
            </CardDescription>
            <p className="text-sm mt-1">
              <span className="font-medium">User ID:</span> {user?.id}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...profileForm.register("firstName")}
                    placeholder="Enter your first name"
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...profileForm.register("lastName")}
                    placeholder="Enter your last name"
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register("email")}
                  placeholder="Enter your email address"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed. Contact an administrator if you need to update your email.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  {...profileForm.register("contactNumber")}
                  placeholder="Enter your contact number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...profileForm.register("address")}
                  placeholder="Enter your address"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="mr-2">Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    <span>Save Changes</span>
                  </div>
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="password">
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    {...passwordForm.register("currentPassword")}
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showCurrentPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...passwordForm.register("newPassword")}
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showNewPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters with uppercase, lowercase,
                  number, and special character.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...passwordForm.register("confirmPassword")}
                    placeholder="Confirm your new password"
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
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#e77f33] hover:bg-[#d06b25]"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
