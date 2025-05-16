"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AssetImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  priority?: boolean
}

export function AssetImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/images/placeholders/image-placeholder.png",
  priority = false,
  ...props
}: AssetImageProps &
  Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "width" | "height" | "className" | "priority">) {
  const [error, setError] = useState(false)

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      className={cn("transition-opacity", className)}
      onError={() => setError(true)}
      priority={priority}
      {...props}
    />
  )
}
