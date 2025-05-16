import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function AdminDepartmentsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <CardTitle>Department Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Manage academic departments, assign department heads, and organize
          courses by department here.
        </p>
      </CardContent>
    </Card>
  );
}
