import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary" />
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Generate and view school-wide reports, statistics, and analytics here.
        </p>
      </CardContent>
    </Card>
  );
}
