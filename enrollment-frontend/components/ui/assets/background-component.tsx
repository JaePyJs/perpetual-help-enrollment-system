"use client"

import { cn } from "@/lib/utils"

type BackgroundPatternType = "dots" | "waves" | "grid" | "circles" | "diagonal" | "triangles" | "hexagons"

type BackgroundPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"

interface BackgroundComponentProps {
  pattern: BackgroundPatternType
  position?: BackgroundPosition
  color?: string
  opacity?: number
  className?: string
  rotate?: number
  scale?: number
}

const patternPaths: Record<BackgroundPatternType, string> = {
  dots: "/images/backgrounds/patterns/dots.svg",
  waves: "/images/backgrounds/patterns/waves.svg",
  grid: "/images/backgrounds/patterns/grid.svg",
  circles: "/images/backgrounds/patterns/circles.svg",
  diagonal: "/images/backgrounds/patterns/diagonal.svg",
  triangles: "/images/backgrounds/patterns/triangles.svg",
  hexagons: "/images/backgrounds/patterns/hexagons.svg",
}

const positionClasses: Record<BackgroundPosition, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
}

export function BackgroundComponent({
  pattern,
  position = "top-right",
  color,
  opacity = 0.1,
  className,
  rotate = 0,
  scale = 1,
}: BackgroundComponentProps) {
  const patternUrl = patternPaths[pattern]

  return (
    <div
      className={cn("absolute pointer-events-none z-0", positionClasses[position], className)}
      style={{
        backgroundImage: `url(${patternUrl})`,
        opacity,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        filter: color ? `drop-shadow(0 0 0 ${color})` : undefined,
      }}
    />
  )
}
