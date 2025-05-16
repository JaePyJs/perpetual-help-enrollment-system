import { redirect } from "next/navigation";

export default function TeacherScheduleRedirect() {
  redirect("/teacher/dashboard");
  return null;
}
