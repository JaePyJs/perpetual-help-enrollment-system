import { redirect } from "next/navigation";

export default function TeacherAttendanceRedirect() {
  redirect("/teacher/dashboard");
  return null;
}
