"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Define all illustration categories and types
type IllustrationCategory = "empty" | "success" | "error" | "onboarding" | "process"

interface IllustrationMap {
  empty: "noResults" | "noCourses" | "noGrades" | "noSchedule" | "noData" | "noMessages"
  success: "enrollmentComplete" | "paymentSuccess" | "registrationComplete" | "gradeSubmitted" | "courseAdded"
  error: "generalError" | "paymentError" | "serverError" | "connectionError" | "accessDenied"
  onboarding: "welcome" | "studentGuide" | "teacherGuide" | "adminGuide" | "features"
  process: "enrollment" | "grading" | "scheduling" | "payment" | "reporting"
}

type IllustrationType<T extends IllustrationCategory> = IllustrationMap[T]

interface IllustrationComponentProps<T extends IllustrationCategory> {
  category: T
  type: IllustrationMap[T]
  width?: number
  height?: number
  className?: string
  alt?: string
  priority?: boolean
}

export function IllustrationComponent<T extends IllustrationCategory>({
  category,
  type,
  width = 300,
  height = 200,
  className,
  alt,
  priority = false,
}: IllustrationComponentProps<T>) {
  const [imageError, setImageError] = useState(false)

  // Generate the image path based on category and type
  const illustrationPath = `/images/illustrations/${category}/${type}.svg`

  // Generate a descriptive alt text if not provided
  const generatedAlt = alt || `${type.replace(/([A-Z])/g, " $1").trim()} illustration`

  // Fallback illustration path for errors
  const fallbackPath = "/images/illustrations/fallback.svg"

  return (
    <div className={cn("relative", className)}>
      <Image
        src={imageError ? fallbackPath : illustrationPath}
        alt={generatedAlt}
        width={width}
        height={height}
        className="object-contain"
        priority={priority}
        onError={() => setImageError(true)}
      />
    </div>
  )
}
