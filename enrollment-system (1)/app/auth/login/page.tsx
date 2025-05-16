import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Perpetual Help College Enrollment System",
  description: "Login to access the Perpetual Help College Enrollment System",
}

export default function LoginPage() {
  return <LoginForm />
}
