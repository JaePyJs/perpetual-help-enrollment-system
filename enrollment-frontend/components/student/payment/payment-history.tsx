"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function PaymentHistory() {
  const paymentHistory = [
    {
      id: "PAY-001",
      date: "May 15, 2023",
      amount: 1000,
      method: "Credit Card",
      status: "Completed",
      reference: "REF123456",
    },
    {
      id: "PAY-002",
      date: "April 15, 2023",
      amount: 5000,
      method: "Bank Transfer",
      status: "Completed",
      reference: "REF789012",
    },
    {
      id: "PAY-003",
      date: "March 15, 2023",
      amount: 10000,
      method: "E-Wallet",
      status: "Completed",
      reference: "REF345678",
    },
    {
      id: "PAY-004",
      date: "February 15, 2023",
      amount: 5000,
      method: "Credit Card",
      status: "Completed",
      reference: "REF901234",
    },
    {
      id: "PAY-005",
      date: "January 15, 2023",
      amount: 5000,
      method: "Bank Transfer",
      status: "Completed",
      reference: "REF567890",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "Failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Record of all your previous payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentHistory.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>{payment.reference}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download receipt</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
