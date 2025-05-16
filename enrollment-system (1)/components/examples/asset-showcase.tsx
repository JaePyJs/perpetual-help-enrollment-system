"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AvatarComponent } from "@/components/ui/assets/avatar-component"
import { IconComponent } from "@/components/ui/assets/icon-component"
import { IllustrationComponent } from "@/components/ui/assets/illustration-component"
import { BackgroundComponent } from "@/components/ui/assets/background-component"
import { EmptyState } from "@/components/ui/empty-state"
import { SuccessState } from "@/components/ui/success-state"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export function AssetShowcase() {
  const [activeTab, setActiveTab] = useState("avatars")
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userName="John Doe"
        userRole="student"
        userAvatar="/images/avatars/student-1.jpg"
        notificationCount={3}
        onMenuToggle={() => console.log("Toggle menu")}
      />

      <main className="container py-8">
        <h1 className="text-3xl font-poppins font-bold mb-8">Asset Component Showcase</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="avatars">Avatars</TabsTrigger>
            <TabsTrigger value="icons">Icons</TabsTrigger>
            <TabsTrigger value="illustrations">Illustrations</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
          </TabsList>

          <TabsContent value="avatars" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avatar Components</CardTitle>
                <CardDescription>Different avatar sizes, roles, and fallbacks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <AvatarComponent
                      src="/images/avatars/student-1.jpg"
                      alt="Student Avatar"
                      role="student"
                      size="lg"
                    />
                    <span className="text-sm">Student</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <AvatarComponent
                      src="/images/avatars/teacher-1.jpg"
                      alt="Teacher Avatar"
                      role="teacher"
                      size="lg"
                    />
                    <span className="text-sm">Teacher</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <AvatarComponent src="/images/avatars/admin-1.jpg" alt="Admin Avatar" role="admin" size="lg" />
                    <span className="text-sm">Admin</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <AvatarComponent alt="Fallback Avatar" role="student" size="lg" />
                    <span className="text-sm">Fallback</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Avatar Sizes</h3>
                  <div className="flex items-end gap-4">
                    <AvatarComponent alt="Extra Small" size="xs" />
                    <AvatarComponent alt="Small" size="sm" />
                    <AvatarComponent alt="Medium" size="md" />
                    <AvatarComponent alt="Large" size="lg" />
                    <AvatarComponent alt="Extra Large" size="xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="icons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Icon Components</CardTitle>
                <CardDescription>Using Lucide icons with different sizes and variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <IconComponent name="BookOpen" size="lg" />
                    <span className="text-sm">BookOpen</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IconComponent name="GraduationCap" size="lg" />
                    <span className="text-sm">GraduationCap</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IconComponent name="Calendar" size="lg" />
                    <span className="text-sm">Calendar</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IconComponent name="FileText" size="lg" />
                    <span className="text-sm">FileText</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IconComponent name="Users" size="lg" />
                    <span className="text-sm">Users</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IconComponent name="CreditCard" size="lg" />
                    <span className="text-sm">CreditCard</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IconComponent name="Bell" size="lg" />
                    <span className="text-sm">Bell</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IconComponent name="Settings" size="lg" />
                    <span className="text-sm">Settings</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Icon Sizes</h3>
                  <div className="flex items-end gap-4">
                    <IconComponent name="BookOpen" size="xs" />
                    <IconComponent name="BookOpen" size="sm" />
                    <IconComponent name="BookOpen" size="md" />
                    <IconComponent name="BookOpen" size="lg" />
                    <IconComponent name="BookOpen" size="xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="illustrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Illustration Components</CardTitle>
                <CardDescription>Various illustrations for different states and screens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <IllustrationComponent category="empty" type="noCourses" width={200} height={150} />
                    <span className="text-sm">Empty State: No Courses</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IllustrationComponent category="success" type="enrollmentComplete" width={200} height={150} />
                    <span className="text-sm">Success: Enrollment Complete</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IllustrationComponent category="error" type="generalError" width={200} height={150} />
                    <span className="text-sm">Error: General Error</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IllustrationComponent category="onboarding" type="welcome" width={200} height={150} />
                    <span className="text-sm">Onboarding: Welcome</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backgrounds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Background Components</CardTitle>
                <CardDescription>Decorative background patterns and elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="relative h-40 border rounded-md flex items-center justify-center">
                    <BackgroundComponent pattern="dots" opacity={0.1} className="inset-0 absolute" />
                    <span className="relative z-10 text-sm">Dots Pattern</span>
                  </div>

                  <div className="relative h-40 border rounded-md flex items-center justify-center">
                    <BackgroundComponent pattern="waves" opacity={0.1} className="inset-0 absolute" />
                    <span className="relative z-10 text-sm">Waves Pattern</span>
                  </div>

                  <div className="relative h-40 border rounded-md flex items-center justify-center">
                    <BackgroundComponent pattern="grid" opacity={0.1} className="inset-0 absolute" />
                    <span className="relative z-10 text-sm">Grid Pattern</span>
                  </div>

                  <div className="relative h-40 border rounded-md flex items-center justify-center">
                    <BackgroundComponent pattern="circles" opacity={0.1} className="inset-0 absolute" />
                    <span className="relative z-10 text-sm">Circles Pattern</span>
                  </div>

                  <div className="relative h-40 border rounded-md flex items-center justify-center">
                    <BackgroundComponent pattern="diagonal" opacity={0.1} className="inset-0 absolute" />
                    <span className="relative z-10 text-sm">Diagonal Pattern</span>
                  </div>

                  <div className="relative h-40 border rounded-md flex items-center justify-center">
                    <BackgroundComponent pattern="triangles" opacity={0.1} className="inset-0 absolute" />
                    <span className="relative z-10 text-sm">Triangles Pattern</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="states" className="space-y-6">
            {showSuccess ? (
              <SuccessState
                title="Enrollment Complete!"
                description="You have successfully enrolled in all selected courses for the Fall 2023 semester. Your schedule is now available."
                illustrationType="enrollmentComplete"
                primaryActionLabel="View Schedule"
                primaryActionIcon="Calendar"
                onPrimaryAction={() => console.log("View schedule")}
                secondaryActionLabel="Back to Dashboard"
                secondaryActionIcon="Home"
                onSecondaryAction={() => setShowSuccess(false)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>State Components</CardTitle>
                  <CardDescription>Empty and success state components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <EmptyState
                      title="No Courses Found"
                      description="You haven't enrolled in any courses yet. Browse available courses to get started."
                      illustrationCategory="empty"
                      illustrationType="noCourses"
                      actionLabel="Browse Courses"
                      actionIcon="Search"
                      onAction={() => console.log("Browse courses")}
                      className="border rounded-md p-8"
                    />

                    <Button onClick={() => setShowSuccess(true)} className="bg-primary hover:bg-primary-600">
                      Show Success State
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
