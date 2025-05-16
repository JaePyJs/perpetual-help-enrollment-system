"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProfileForm } from "@/components/profile/profile-form"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
        </div>
        <div className="grid gap-4">
          <ProfileForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
