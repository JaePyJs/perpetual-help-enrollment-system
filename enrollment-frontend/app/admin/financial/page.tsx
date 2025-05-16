import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function AdminFinancialPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <CreditCard className="h-6 w-6 text-primary" />
        <CardTitle>Financial Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          View and manage tuition payments, financial aid, and school billing
          here.
        </p>
      </CardContent>
    </Card>
  );
}
