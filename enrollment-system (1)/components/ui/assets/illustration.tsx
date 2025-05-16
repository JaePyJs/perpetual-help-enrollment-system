import type React from "react"
import { illustrations } from "./asset-paths"
import { AssetImage } from "./asset-image"
import { cn } from "@/lib/utils"

type IllustrationType =
  | "noResults"
  | "noCourses"
  | "noGrades"
  | "noSchedule"
  | "enrollmentComplete"
  | "paymentSuccess"
  | "registrationComplete"
  | "generalError"
  | "paymentError"
  | "serverError"
  | "welcome"
  | "studentGuide"
  | "teacherGuide"
  | "adminGuide"

interface IllustrationProps {
  type: IllustrationType
  className?: string
  width?: number
  height?: number
}

export function Illustration({
  type,
  className,
  width = 300,
  height = 200,
  ...props
}: IllustrationProps &
  Omit<React.ComponentProps<typeof AssetImage>, "src" | "alt" | "width" | "height" | "className">) {
  // Map the type to the correct path
  let src = ""
  let alt = ""

  if (type === "noResults") {
    src = illustrations.emptyStates.noResults
    alt = "No results found"
  } else if (type === "noCourses") {
    src = illustrations.emptyStates.noCourses
    alt = "No courses available"
  } else if (type === "noGrades") {
    src = illustrations.emptyStates.noGrades
    alt = "No grades available"
  } else if (type === "noSchedule") {
    src = illustrations.emptyStates.noSchedule
    alt = "No schedule available"
  } else if (type === "enrollmentComplete") {
    src = illustrations.success.enrollmentComplete
    alt = "Enrollment complete"
  } else if (type === "paymentSuccess") {
    src = illustrations.success.paymentSuccess
    alt = "Payment successful"
  } else if (type === "registrationComplete") {
    src = illustrations.success.registrationComplete
    alt = "Registration complete"
  } else if (type === "generalError") {
    src = illustrations.error.generalError
    alt = "An error occurred"
  } else if (type === "paymentError") {
    src = illustrations.error.paymentError
    alt = "Payment error"
  } else if (type === "serverError") {
    src = illustrations.error.serverError
    alt = "Server error"
  } else if (type === "welcome") {
    src = illustrations.onboarding.welcome
    alt = "Welcome"
  } else if (type === "studentGuide") {
    src = illustrations.onboarding.studentGuide
    alt = "Student guide"
  } else if (type === "teacherGuide") {
    src = illustrations.onboarding.teacherGuide
    alt = "Teacher guide"
  } else if (type === "adminGuide") {
    src = illustrations.onboarding.adminGuide
    alt = "Admin guide"
  }

  return (
    <AssetImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-contain", className)}
      {...props}
    />
  )
}
