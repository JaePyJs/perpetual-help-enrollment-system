import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function AdminEnrollmentPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <ClipboardList className="h-6 w-6 text-primary" />
        <CardTitle>Enrollment Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Manage student enrollments, review applications, and process
          registration here.
        </p>
      </CardContent>
    </Card>
  );
}
