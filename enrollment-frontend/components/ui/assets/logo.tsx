import type React from "react"
import { brandingAssets } from "./asset-paths"
import { AssetImage } from "./asset-image"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "white" | "simplified"
  className?: string
  width?: number
  height?: number
}

export function Logo({
  variant = "full",
  className,
  width = 150,
  height = 40,
  ...props
}: LogoProps & Omit<React.ComponentProps<typeof AssetImage>, "src" | "alt" | "width" | "height" | "className">) {
  const logoSrc = brandingAssets.logo[variant]

  return (
    <AssetImage
      src={logoSrc}
      alt="Perpetual Help College of Manila"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      {...props}
    />
  )
}
