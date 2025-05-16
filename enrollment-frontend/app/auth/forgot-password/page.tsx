import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password | Perpetual Help College Enrollment System",
  description: "Reset your password for the Perpetual Help College Enrollment System",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
