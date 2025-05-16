import { redirect } from "next/navigation";

export default function StudentFinancialRedirect() {
  redirect("/student/enrollment/payment");
  return null;
}
