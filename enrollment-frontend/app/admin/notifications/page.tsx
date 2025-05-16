import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function AdminNotificationsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Bell className="h-6 w-6 text-primary" />
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Send announcements and manage system notifications for all users here.
        </p>
      </CardContent>
    </Card>
  );
}
