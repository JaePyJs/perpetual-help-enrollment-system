import type { Metadata } from "next"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PaymentProcess } from "@/components/student/enrollment/payment-process"

export const metadata: Metadata = {
  title: "Payment | Perpetual Help College",
  description: "Process payment for your enrollment at Perpetual Help College",
}

export default function PaymentPage() {
  return (
    <DashboardLayout>
      <PaymentProcess />
    </DashboardLayout>
  )
}
