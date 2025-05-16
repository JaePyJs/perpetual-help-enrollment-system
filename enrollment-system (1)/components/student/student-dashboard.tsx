"use client"

import { useState } from "react"
import Link from "next/link"
import { GraduationCap, CreditCard, BookOpen, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AcademicProgressChart } from "@/components/student/academic-progress-chart"
import { UpcomingDeadlines } from "@/components/student/upcoming-deadlines"
import { RecentAnnouncements } from "@/components/student/recent-announcements"

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-poppins font-bold">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, John! Here's what's happening with your academics.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-600" asChild>
            <Link href="/student/enrollment/courses">
              Enroll in Courses
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.75</div>
              <p className="text-xs text-muted-foreground">+0.25 from last semester</p>
              <div className="mt-3">
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">15 credit hours total</p>
              <div className="mt-3">
                <Progress value={100} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Due</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,250.00</div>
              <p className="text-xs text-muted-foreground">Due by August 15, 2023</p>
              <div className="mt-3">
                <Progress value={40} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Academic Progress</CardTitle>
                  <CardDescription>Your GPA and credits over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AcademicProgressChart />
                </CardContent>
              </Card>

              <Card className="md:row-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Important dates and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingDeadlines />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>Latest updates from your college</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentAnnouncements />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Announcements
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Current Courses</CardTitle>
                <CardDescription>Fall 2023 Semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      code: "CS301",
                      name: "Data Structures and Algorithms",
                      instructor: "Dr. James Wilson",
                      credits: 3,
                      grade: "A-",
                    },
                    {
                      code: "MATH240",
                      name: "Discrete Mathematics",
                      instructor: "Dr. Robert Taylor",
                      credits: 3,
                      grade: "B+",
                    },
                    {
                      code: "ENG210",
                      name: "Technical Writing",
                      instructor: "Prof. Emily Johnson",
                      credits: 3,
                      grade: "A",
                    },
                    {
                      code: "CS315",
                      name: "Database Systems",
                      instructor: "Dr. Sarah Chen",
                      credits: 3,
                      grade: "In Progress",
                    },
                    {
                      code: "CS320",
                      name: "Software Engineering",
                      instructor: "Prof. Michael Brown",
                      credits: 3,
                      grade: "In Progress",
                    },
                  ].map((course) => (
                    <div key={course.code} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">
                          {course.code}: {course.name}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {course.instructor} • {course.credits} Credits
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          course.grade === "In Progress"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        }
                      >
                        {course.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/student/courses">View Course Details</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Fall 2023 Semester</CardDescription>
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
                    { time: "9:00 AM", classes: [0, 2, 0, 2, 0] },
                    { time: "10:30 AM", classes: [0, 0, 0, 0, 0] },
                    { time: "12:00 PM", classes: [0, 1, 0, 1, 0] },
                    { time: "1:30 PM", classes: [3, 0, 3, 0, 3] },
                    { time: "3:00 PM", classes: [0, 4, 0, 4, 0] },
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-6 border-b last:border-0">
                      <div className="border-r p-2 text-sm">{row.time}</div>
                      {row.classes.map((classId, dayIndex) => (
                        <div key={dayIndex} className="p-1">
                          {classId === 1 && (
                            <div className="rounded bg-blue-100 p-1 text-xs dark:bg-blue-900/30">
                              <div className="font-medium">CS315</div>
                              <div>Room 302</div>
                            </div>
                          )}
                          {classId === 2 && (
                            <div className="rounded bg-green-100 p-1 text-xs dark:bg-green-900/30">
                              <div className="font-medium">CS301</div>
                              <div>Room 301</div>
                            </div>
                          )}
                          {classId === 3 && (
                            <div className="rounded bg-purple-100 p-1 text-xs dark:bg-purple-900/30">
                              <div className="font-medium">MATH240</div>
                              <div>Room 205</div>
                            </div>
                          )}
                          {classId === 4 && (
                            <div className="rounded bg-amber-100 p-1 text-xs dark:bg-amber-900/30">
                              <div className="font-medium">CS320</div>
                              <div>Room 303</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/student/schedule">View Full Schedule</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Current Grades</CardTitle>
                <CardDescription>Fall 2023 Semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left font-medium">Course</th>
                        <th className="p-2 text-left font-medium">Assignment</th>
                        <th className="p-2 text-left font-medium">Grade</th>
                        <th className="p-2 text-left font-medium">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { course: "CS301", assignment: "Homework 1", grade: "92/100", weight: "10%" },
                        { course: "CS301", assignment: "Midterm Exam", grade: "88/100", weight: "25%" },
                        { course: "MATH240", assignment: "Quiz 1", grade: "45/50", weight: "5%" },
                        { course: "MATH240", assignment: "Homework 1", grade: "85/100", weight: "10%" },
                        { course: "ENG210", assignment: "Essay 1", grade: "92/100", weight: "15%" },
                        { course: "ENG210", assignment: "Presentation", grade: "95/100", weight: "20%" },
                        { course: "CS315", assignment: "Project Proposal", grade: "Pending", weight: "5%" },
                        { course: "CS320", assignment: "Team Assignment 1", grade: "Pending", weight: "10%" },
                      ].map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="p-2 text-sm">{item.course}</td>
                          <td className="p-2 text-sm">{item.assignment}</td>
                          <td className="p-2 text-sm">
                            {item.grade === "Pending" ? (
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                              >
                                Pending
                              </Badge>
                            ) : (
                              item.grade
                            )}
                          </td>
                          <td className="p-2 text-sm">{item.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/student/grades">View All Grades</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
