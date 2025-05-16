import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure system settings, user permissions, and school preferences
          here.
        </p>
      </CardContent>
    </Card>
  );
}
