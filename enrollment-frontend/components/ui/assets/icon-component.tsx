"use client"

import type React from "react"

import { forwardRef } from "react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

type IconSize = "xs" | "sm" | "md" | "lg" | "xl"
type IconVariant = "default" | "outline" | "solid" | "mini"

// Type for all available Lucide icons
type LucideIconName = keyof typeof LucideIcons

interface IconComponentProps {
  name: LucideIconName
  size?: IconSize
  variant?: IconVariant
  className?: string
  onClick?: () => void
}

const sizeMap: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
}

const variantClassMap: Record<IconVariant, string> = {
  default: "",
  outline: "stroke-[1.5px] fill-none",
  solid: "fill-current stroke-none",
  mini: "stroke-[2px]",
}

export const IconComponent = forwardRef<HTMLDivElement, IconComponentProps>(
  ({ name, size = "md", variant = "default", className, onClick }, ref) => {
    // Get the icon component from Lucide
    const IconComponent = LucideIcons[name] as React.ComponentType<{ size: number; className: string }>

    // If icon doesn't exist, return null or a fallback
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in Lucide icons`)
      return null
    }

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", onClick && "cursor-pointer", className)}
        onClick={onClick}
      >
        <IconComponent size={sizeMap[size]} className={cn(variantClassMap[variant])} />
      </div>
    )
  },
)

IconComponent.displayName = "IconComponent"
