import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register | Perpetual Help College Enrollment System",
  description: "Register for the Perpetual Help College Enrollment System",
}

export default function RegisterPage() {
  return <RegisterForm />
}
