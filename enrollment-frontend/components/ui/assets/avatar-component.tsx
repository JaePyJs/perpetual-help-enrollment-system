"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

interface AvatarComponentProps {
  src?: string
  alt: string
  fallbackText?: string
  size?: AvatarSize
  role?: "student" | "teacher" | "admin"
  className?: string
  onClick?: () => void
}

const sizeMap: Record<AvatarSize, { dimensions: number; textSize: string }> = {
  xs: { dimensions: 24, textSize: "text-[10px]" },
  sm: { dimensions: 32, textSize: "text-xs" },
  md: { dimensions: 40, textSize: "text-sm" },
  lg: { dimensions: 56, textSize: "text-base" },
  xl: { dimensions: 80, textSize: "text-lg" },
}

const roleColorMap = {
  student: "bg-primary/10 text-primary",
  teacher: "bg-secondary/10 text-secondary",
  admin: "bg-accent/10 text-accent",
}

export function AvatarComponent({
  src,
  alt,
  fallbackText,
  size = "md",
  role = "student",
  className,
  onClick,
}: AvatarComponentProps) {
  const [imageError, setImageError] = useState(false)
  const { dimensions, textSize } = sizeMap[size]

  // Generate fallback text from name if not provided
  const initials =
    fallbackText ||
    alt
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

  // Determine default avatar based on role if src fails to load
  const defaultAvatarSrc = `/images/avatars/default-${role}.svg`
  const actualSrc = imageError ? defaultAvatarSrc : src

  return (
    <Avatar
      className={cn(`h-${dimensions / 4} w-${dimensions / 4}`, onClick && "cursor-pointer", className)}
      onClick={onClick}
    >
      {actualSrc && (
        <Image
          src={actualSrc || "/placeholder.svg"}
          alt={alt}
          width={dimensions}
          height={dimensions}
          className="object-cover"
          onError={() => setImageError(true)}
        />
      )}
      <AvatarFallback className={cn(roleColorMap[role], textSize)}>{initials}</AvatarFallback>
    </Avatar>
  )
}
