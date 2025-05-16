import { cn } from "@/lib/utils"

interface PlaceholderProps {
  width?: number | string
  height?: number | string
  className?: string
  text?: string
  rounded?: boolean
}

export function Placeholder({ width = "100%", height = "100%", className, text, rounded = false }: PlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted animate-pulse",
        rounded && "rounded-full",
        !rounded && "rounded-md",
        className,
      )}
      style={{ width, height }}
    >
      {text && <span className="text-xs text-muted-foreground">{text}</span>}
    </div>
  )
}
