import { redirect } from "next/navigation";

export default function TeacherMaterialsRedirect() {
  redirect("/teacher/dashboard");
  return null;
}
