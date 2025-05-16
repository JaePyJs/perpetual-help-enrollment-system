import { backgrounds } from "./asset-paths"
import { cn } from "@/lib/utils"

interface BackgroundElementProps {
  type: "dots" | "waves" | "grid"
  className?: string
}

export function BackgroundElement({ type, className }: BackgroundElementProps) {
  // Map the type to the correct path
  let backgroundImage = ""

  if (type === "dots") {
    backgroundImage = `url(${backgrounds.decorative.dots})`
  } else if (type === "waves") {
    backgroundImage = `url(${backgrounds.decorative.waves})`
  } else if (type === "grid") {
    backgroundImage = `url(${backgrounds.decorative.grid})`
  }

  return <div className={cn("absolute pointer-events-none", className)} style={{ backgroundImage }} />
}
