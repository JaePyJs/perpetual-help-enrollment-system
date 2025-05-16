"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function PaymentProcess() {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("creditCard")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentError, setPaymentError] = useState(false)

  // Mock data for the enrollment summary
  const enrollmentSummary = {
    semester: "Fall 2023",
    courses: [
      { code: "CS301", name: "Data Structures and Algorithms", credits: 3 },
      { code: "CS315", name: "Database Systems", credits: 3 },
      { code: "MATH240", name: "Discrete Mathematics", credits: 3 },
    ],
    totalCredits: 9,
    tuition: 3150,
    fees: 575,
    totalAmount: 3725,
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setPaymentError(false)

    try {
      // In a real application, you would call your payment API
      // const response = await processPayment(paymentData)

      // Simulate API call with 80% success rate
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Randomly simulate success or failure for demo purposes
      const isSuccess = Math.random() > 0.2

      if (!isSuccess) {
        throw new Error("Payment failed")
      }

      setPaymentComplete(true)
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      })
    } catch (error) {
      setPaymentError(true)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleViewSchedule = () => {
    router.push("/student/schedule")
  }

  if (paymentComplete) {
    return (
      <div className="flex flex-col">
        <div className="border-b">
          <div className="container flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-poppins font-bold">Payment Confirmation</h1>
              <p className="text-sm text-muted-foreground">Your enrollment is now complete</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Payment Successful</CardTitle>
              <CardDescription>Your enrollment for Fall 2023 is now complete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between font-medium">
                  <span>Transaction ID:</span>
                  <span>TRX-{Math.floor(Math.random() * 1000000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>${enrollmentSummary.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>Credit Card</span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                A receipt has been sent to your email address. You can also download a copy from your account.
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button onClick={handleViewSchedule} className="w-full bg-primary hover:bg-primary-600">
                View Your Schedule
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/student/dashboard">Return to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-poppins font-bold">Payment</h1>
            <p className="text-sm text-muted-foreground">Process payment for your enrollment</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/student/enrollment/schedule">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Schedule
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="creditCard">Credit Card</TabsTrigger>
                    <TabsTrigger value="bankTransfer">Bank Transfer</TabsTrigger>
                    <TabsTrigger value="paymentPlan">Payment Plan</TabsTrigger>
                  </TabsList>

                  <TabsContent value="creditCard" className="mt-4">
                    <form onSubmit={handlePayment} className="space-y-4">
                      {paymentError && (
                        <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            <p className="font-medium">Payment Error</p>
                          </div>
                          <p className="mt-1 text-sm">
                            Your payment could not be processed. Please check your card details and try again.
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                          <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="billingAddress">Billing Address</Label>
                        <Input id="billingAddress" placeholder="123 Main St" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="New York" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Zip Code</Label>
                          <Input id="zipCode" placeholder="10001" required />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={isProcessing}>
                        {isProcessing ? "Processing..." : `Pay $${enrollmentSummary.totalAmount.toFixed(2)}`}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="bankTransfer" className="mt-4">
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium">Bank Account Details</h3>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Bank Name:</span>
                            <span>First National Bank</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Account Name:</span>
                            <span>Perpetual Help College</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Account Number:</span>
                            <span>1234567890</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Routing Number:</span>
                            <span>987654321</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Reference:</span>
                            <span>STU-{Math.floor(Math.random() * 10000)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>
                          Please make your payment to the account details above. Include your student ID and reference
                          number in the payment description.
                        </p>
                        <p className="mt-2">
                          After making the payment, please upload the proof of payment below. Your enrollment will be
                          confirmed once the payment is verified.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="proofOfPayment">Upload Proof of Payment</Label>
                        <div className="rounded-lg border border-dashed p-4 text-center">
                          <p className="text-sm text-muted-foreground">
                            Drag and drop your proof of payment here, or click to browse
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Browse Files
                          </Button>
                        </div>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary-600" disabled={isProcessing}>
                        {isProcessing ? "Submitting..." : "Submit Proof of Payment"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="paymentPlan" className="mt-4">
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium">Available Payment Plans</h3>
                        <div className="mt-4 space-y-4">
                          <RadioGroup defaultValue="installment3">
                            <div className="flex items-start space-x-2 rounded-lg border p-3">
                              <RadioGroupItem value="installment3" id="installment3" className="mt-1" />
                              <Label htmlFor="installment3" className="flex-1 cursor-pointer">
                                <div className="font-medium">3 Installments</div>
                                <div className="text-sm text-muted-foreground">
                                  Pay in 3 equal installments of ${(enrollmentSummary.totalAmount / 3).toFixed(2)} each.
                                  First payment due now, remaining payments due on Sep 15 and Oct 15.
                                </div>
                              </Label>
                              <div className="text-right font-medium">
                                ${(enrollmentSummary.totalAmount / 3).toFixed(2)}
                                <span className="block text-xs text-muted-foreground">per installment</span>
                              </div>
                            </div>

                            <div className="flex items-start space-x-2 rounded-lg border p-3">
                              <RadioGroupItem value="installment4" id="installment4" className="mt-1" />
                              <Label htmlFor="installment4" className="flex-1 cursor-pointer">
                                <div className="font-medium">4 Installments</div>
                                <div className="text-sm text-muted-foreground">
                                  Pay in 4 equal installments of ${(enrollmentSummary.totalAmount / 4).toFixed(2)} each.
                                  First payment due now, remaining payments due monthly.
                                </div>
                              </Label>
                              <div className="text-right font-medium">
                                ${(enrollmentSummary.totalAmount / 4).toFixed(2)}
                                <span className="block text-xs text-muted-foreground">per installment</span>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method for First Installment</Label>
                        <Select defaultValue="creditCard">
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="creditCard">Credit Card</SelectItem>
                            <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary-600" disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Set Up Payment Plan"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Summary</CardTitle>
                <CardDescription>Fall 2023 Semester</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Selected Courses</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {enrollmentSummary.courses.map((course) => (
                      <li key={course.code} className="flex justify-between">
                        <span>
                          {course.code}: {course.name}
                        </span>
                        <span>{course.credits} cr</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex justify-between text-sm font-medium">
                    <span>Total Credits:</span>
                    <span>{enrollmentSummary.totalCredits}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium">Payment Details</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Tuition:</span>
                      <span>${enrollmentSummary.tuition.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fees:</span>
                      <span>${enrollmentSummary.fees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Amount:</span>
                      <span>${enrollmentSummary.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  By proceeding with payment, you agree to the terms and conditions of enrollment.
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>If you have questions about payment or need assistance, please contact:</p>
                  <p className="mt-2">
                    <span className="font-medium">Financial Aid Office</span>
                    <br />
                    Email: financial.aid@phcm.edu
                    <br />
                    Phone: (123) 456-7890
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
