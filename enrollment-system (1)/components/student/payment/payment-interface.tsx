"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Download, Receipt } from "lucide-react"
import { PaymentHistory } from "@/components/student/payment/payment-history"
import { PaymentSummary } from "@/components/student/payment/payment-summary"

export function PaymentInterface() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  const currentBalance = 25000
  const dueDate = "June 15, 2023"

  const feeBreakdown = [
    { description: "Tuition Fee", amount: 20000 },
    { description: "Laboratory Fee", amount: 3000 },
    { description: "Library Fee", amount: 1000 },
    { description: "Technology Fee", amount: 1500 },
    { description: "Student Activities Fee", amount: 500 },
    { description: "Total", amount: 26000 },
    { description: "Previous Payment", amount: -1000 },
    { description: "Current Balance", amount: 25000 },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Payment Center</h1>
          <p className="text-muted-foreground">Manage your tuition and fee payments</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{currentBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Due on {dueDate}</p>
            </CardContent>
            <CardFooter>
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make a Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Make a Payment</DialogTitle>
                    <DialogDescription>Enter your payment details below.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paymentAmount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="paymentAmount"
                        placeholder="Enter amount"
                        className="col-span-3"
                        defaultValue={currentBalance.toString()}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paymentMethod" className="text-right">
                        Payment Method
                      </Label>
                      <RadioGroup defaultValue="card" className="col-span-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Credit/Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank">Bank Transfer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ewallet" id="ewallet" />
                          <Label htmlFor="ewallet">E-Wallet</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cardNumber" className="text-right">
                        Card Number
                      </Label>
                      <Input id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cardName" className="text-right">
                        Name on Card
                      </Label>
                      <Input id="cardName" placeholder="Enter name as shown on card" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <Label htmlFor="expiry" className="text-right">
                        Expiry Date
                      </Label>
                      <div className="col-span-3 flex gap-2">
                        <Select>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                                {month.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input id="cvv" placeholder="CVV" className="w-[80px]" maxLength={3} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={() => setIsPaymentDialogOpen(false)}>
                      Process Payment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800">Partial Payment</Badge>
                <span className="text-sm text-muted-foreground">4% paid</span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-[4%] rounded-full bg-yellow-500"></div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Statement
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Semestral</div>
              <p className="text-xs text-muted-foreground">Next installment due on {dueDate}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Change Payment Plan
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Fee Summary</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Fee Breakdown</CardTitle>
                <CardDescription>Detailed breakdown of your current semester fees</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeBreakdown.map((fee, index) => (
                      <TableRow key={index} className={fee.description === "Current Balance" ? "font-bold" : ""}>
                        <TableCell>{fee.description}</TableCell>
                        <TableCell className="text-right">₱{fee.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <PaymentHistory />
          </TabsContent>
        </Tabs>

        <PaymentSummary />
      </div>
    </DashboardLayout>
  )
}
