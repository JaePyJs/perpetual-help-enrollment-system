import { avatars } from "./asset-paths"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage as UIAvatarImage } from "@/components/ui/avatar"

interface AvatarImageProps {
  src?: string
  alt: string
  fallbackType?: "student" | "teacher" | "admin" | "course"
  fallbackText?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function AvatarImage({
  src,
  alt,
  fallbackType = "student",
  fallbackText,
  className,
  size = "md",
  ...props
}: AvatarImageProps) {
  // Determine fallback image based on type
  let fallbackSrc = ""

  if (fallbackType === "student") {
    fallbackSrc = avatars.defaults.student
  } else if (fallbackType === "teacher") {
    fallbackSrc = avatars.defaults.teacher
  } else if (fallbackType === "admin") {
    fallbackSrc = avatars.defaults.admin
  } else if (fallbackType === "course") {
    fallbackSrc = avatars.courses.default
  }

  // Determine size class
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }[size]

  return (
    <Avatar className={cn(sizeClass, className)} {...props}>
      <UIAvatarImage src={src || fallbackSrc} alt={alt} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {fallbackText || alt.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
