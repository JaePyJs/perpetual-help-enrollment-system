import type { Metadata } from "next"
import { PaymentInterface } from "@/components/student/payment/payment-interface"

export const metadata: Metadata = {
  title: "Payment | Perpetual Help College of Manila",
  description: "Manage your tuition and fee payments",
}

export default function PaymentPage() {
  return <PaymentInterface />
}
