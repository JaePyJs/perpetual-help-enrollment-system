import { redirect } from "next/navigation";

export default function TeacherFinancialRedirect() {
  redirect("/teacher/dashboard");
  return null;
}
