import { redirect } from "next/navigation";

export default function TeacherClassRosterRedirect() {
  redirect("/teacher/dashboard");
  return null;
}
