"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, ChevronLeft, ChevronRight, Download, Printer } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// Mock data for the selected courses
const selectedCourses = [
  {
    id: "cs301",
    code: "CS301",
    name: "Data Structures and Algorithms",
    credits: 3,
    instructor: "Dr. James Wilson",
    schedule: {
      days: ["Monday", "Wednesday"],
      startTime: "9:00 AM",
      endTime: "10:30 AM",
      location: "Room 301",
    },
  },
  {
    id: "cs315",
    code: "CS315",
    name: "Database Systems",
    credits: 3,
    instructor: "Dr. Sarah Chen",
    schedule: {
      days: ["Tuesday", "Thursday"],
      startTime: "10:30 AM",
      endTime: "12:00 PM",
      location: "Room 302",
    },
  },
  {
    id: "math240",
    code: "MATH240",
    name: "Discrete Mathematics",
    credits: 3,
    instructor: "Dr. Robert Taylor",
    schedule: {
      days: ["Monday", "Friday"],
      startTime: "1:00 PM",
      endTime: "2:30 PM",
      location: "Room 205",
    },
  },
]

export function ScheduleConfirmation() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0)
  const tuitionPerCredit = 350
  const totalTuition = totalCredits * tuitionPerCredit
  const fees = {
    registration: 250,
    technology: 150,
    library: 100,
    studentActivity: 75,
  }
  const totalFees = Object.values(fees).reduce((sum, fee) => sum + fee, 0)
  const totalAmount = totalTuition + totalFees

  const handleConfirmEnrollment = async () => {
    setIsSubmitting(true)

    try {
      // In a real application, you would call your API to confirm enrollment
      // const response = await confirmEnrollment(selectedCourses)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Enrollment Confirmed",
        description: "Your course schedule has been confirmed. Proceeding to payment.",
      })

      // Redirect to payment page
      router.push("/student/enrollment/payment")
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "There was an error confirming your enrollment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-poppins font-bold">Schedule Confirmation</h1>
            <p className="text-sm text-muted-foreground">Review and confirm your course schedule</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print Schedule
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Please review your course schedule carefully. Once confirmed, changes will require approval from your
            academic advisor.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Selected Courses</CardTitle>
                <CardDescription>Fall 2023 Semester</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          {course.code}: {course.name}
                        </TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell>
                          {course.schedule.days.join(", ")}
                          <br />
                          {course.schedule.startTime} - {course.schedule.endTime}
                        </TableCell>
                        <TableCell>{course.schedule.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Total Credits: <span className="font-medium">{totalCredits}</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Visual representation of your course schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 border-b">
                    <div className="p-2 text-center font-medium">Time</div>
                    <div className="p-2 text-center font-medium">Monday</div>
                    <div className="p-2 text-center font-medium">Tuesday</div>
                    <div className="p-2 text-center font-medium">Wednesday</div>
                    <div className="p-2 text-center font-medium">Thursday</div>
                    <div className="p-2 text-center font-medium">Friday</div>
                  </div>
                  {[
                    { time: "9:00 AM", classes: [1, 0, 1, 0, 0] },
                    { time: "10:30 AM", classes: [0, 2, 0, 2, 0] },
                    { time: "12:00 PM", classes: [0, 0, 0, 0, 0] },
                    { time: "1:00 PM", classes: [3, 0, 0, 0, 3] },
                    { time: "2:30 PM", classes: [0, 0, 0, 0, 0] },
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-6 border-b last:border-0">
                      <div className="border-r p-2 text-sm">{row.time}</div>
                      {row.classes.map((classId, dayIndex) => (
                        <div key={dayIndex} className="p-1">
                          {classId === 1 && (
                            <div className="rounded bg-primary/20 p-1 text-xs">
                              <div className="font-medium">CS301</div>
                              <div>Room 301</div>
                            </div>
                          )}
                          {classId === 2 && (
                            <div className="rounded bg-blue-100 p-1 text-xs dark:bg-blue-900/30">
                              <div className="font-medium">CS315</div>
                              <div>Room 302</div>
                            </div>
                          )}
                          {classId === 3 && (
                            <div className="rounded bg-purple-100 p-1 text-xs dark:bg-purple-900/30">
                              <div className="font-medium">MATH240</div>
                              <div>Room 205</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tuition & Fees</CardTitle>
                <CardDescription>Estimated costs for Fall 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Tuition</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Credits</span>
                        <span>{totalCredits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Rate per Credit</span>
                        <span>${tuitionPerCredit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Tuition</span>
                        <span>${totalTuition.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Fees</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Registration Fee</span>
                        <span>${fees.registration.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Technology Fee</span>
                        <span>${fees.technology.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Library Fee</span>
                        <span>${fees.library.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Student Activity Fee</span>
                        <span>${fees.studentActivity.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Fees</span>
                        <span>${totalFees.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Due by August 15, 2023. Payment plans are available.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleConfirmEnrollment}
                className="w-full bg-primary hover:bg-primary-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm & Proceed to Payment"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/student/enrollment/courses">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Course Selection
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
