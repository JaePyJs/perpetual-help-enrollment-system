"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AvatarComponent } from "@/components/ui/assets/avatar-component"
import { IconComponent } from "@/components/ui/assets/icon-component"
import { BackgroundComponent } from "@/components/ui/assets/background-component"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  userName: string
  userRole: "student" | "teacher" | "admin"
  userAvatar?: string
  notificationCount?: number
  onMenuToggle: () => void
  className?: string
}

export function DashboardHeader({
  userName,
  userRole,
  userAvatar,
  notificationCount = 0,
  onMenuToggle,
  className,
}: DashboardHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const roleLabel = {
    student: "Student Portal",
    teacher: "Teacher Portal",
    admin: "Admin Portal",
  }[userRole]

  return (
    <header className={cn("sticky top-0 z-30 w-full border-b bg-background", className)}>
      {/* Decorative background pattern */}
      <BackgroundComponent pattern="dots" position="top-right" opacity={0.05} className="h-32 w-32" />

      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
            <IconComponent name="Menu" size="md" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Link href={`/${userRole}/dashboard`} className="flex items-center gap-2">
                {/* College logo would go here */}
                <div className="h-8 w-8 rounded-md bg-primary"></div>
                <span className="text-lg font-poppins font-bold">PHCM</span>
              </Link>
            </div>
            <div className="md:hidden">
              <Link href={`/${userRole}/dashboard`}>
                <div className="h-8 w-8 rounded-md bg-primary"></div>
              </Link>
            </div>

            <div className="hidden md:block h-6 w-px bg-border mx-2"></div>

            <span className="text-sm font-medium text-muted-foreground hidden md:block">{roleLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            {isSearchOpen ? (
              <div className="absolute right-0 top-0 w-full md:w-[300px] flex items-center">
                <Input type="search" placeholder="Search..." className="pr-8" autoFocus />
                <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close search</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </div>

          <AvatarComponent src={userAvatar} alt={userName} role={userRole} size="sm" className="cursor-pointer" />
        </div>
      </div>

      {/* Mobile menu sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[250px] p-0">
          {/* Mobile navigation would go here */}
          <div className="p-4">
            <h2 className="text-lg font-poppins font-semibold">{roleLabel}</h2>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
