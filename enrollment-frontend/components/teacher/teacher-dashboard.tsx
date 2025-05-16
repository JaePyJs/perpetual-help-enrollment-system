"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClassAttendanceChart } from "@/components/teacher/class-attendance-chart";
import { GradeDistributionChart } from "@/components/teacher/grade-distribution-chart";

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-poppins font-bold">
              Teacher Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, Prof. Smith! Here's an overview of your classes.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-600" asChild>
            <Link href="/teacher/grading">
              Grade Assignments
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">Across 4 classes</p>
              <div className="mt-3">
                <Progress value={87} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                Fall 2023 Semester
              </p>
              <div className="mt-3">
                <Progress value={100} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">5 pending grading</p>
              <div className="mt-3">
                <Progress value={58} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Office Hours
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Hours per week</p>
              <div className="mt-3">
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Class Attendance</CardTitle>
                  <CardDescription>
                    Average attendance rate by class
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ClassAttendanceChart />
                </CardContent>
              </Card>

              <Card className="md:row-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Classes</CardTitle>
                  <CardDescription>Your schedule for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        course: "CS301: Data Structures",
                        time: "10:00 AM - 11:30 AM",
                        location: "Room 301",
                        status: "upcoming",
                      },
                      {
                        id: 2,
                        course: "CS315: Database Systems",
                        time: "1:00 PM - 2:30 PM",
                        location: "Room 302",
                        status: "upcoming",
                      },
                      {
                        id: 3,
                        course: "CS101: Intro to Programming",
                        time: "3:00 PM - 4:30 PM",
                        location: "Room 303",
                        status: "upcoming",
                      },
                    ].map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex items-start gap-3"
                      >
                        <div className="rounded-full p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {classItem.course}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {classItem.time}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {classItem.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/teacher/schedule">View Full Schedule</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Average grades by class</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <GradeDistributionChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classes">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  id: 1,
                  code: "CS301",
                  name: "Data Structures and Algorithms",
                  schedule: "Mon, Wed 10:00 AM - 11:30 AM",
                  location: "Room 301",
                  students: 25,
                  attendance: 92,
                },
                {
                  id: 2,
                  code: "CS315",
                  name: "Database Systems",
                  schedule: "Tue, Thu 1:00 PM - 2:30 PM",
                  location: "Room 302",
                  students: 22,
                  attendance: 88,
                },
                {
                  id: 3,
                  code: "CS101",
                  name: "Introduction to Programming",
                  schedule: "Mon, Wed 3:00 PM - 4:30 PM",
                  location: "Room 303",
                  students: 30,
                  attendance: 85,
                },
                {
                  id: 4,
                  code: "CS401",
                  name: "Advanced Software Engineering",
                  schedule: "Tue, Thu 10:00 AM - 11:30 AM",
                  location: "Room 304",
                  students: 18,
                  attendance: 94,
                },
              ].map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {course.code}: {course.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      >
                        Active
                      </Badge>
                    </div>
                    <CardDescription>{course.schedule}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Location:</span>
                        <span>{course.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Students:</span>
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Attendance:</span>
                        <span>{course.attendance}%</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Attendance Rate</span>
                          <span className="font-medium">
                            {course.attendance}%
                          </span>
                        </div>
                        <Progress
                          value={course.attendance}
                          className="h-2 mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/classes/roster?id=${course.id}`}>
                        Class Roster
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary-600"
                      asChild
                    >
                      <Link href={`/teacher/grading?class=${course.id}`}>
                        Grade Assignments
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>
                  Manage and grade student assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: "Homework 1: Algorithm Analysis",
                      course: "CS301: Data Structures",
                      dueDate: "Sep 15, 2023",
                      status: "graded",
                      submissions: 25,
                      graded: 25,
                    },
                    {
                      id: 2,
                      title: "Midterm Project: Database Design",
                      course: "CS315: Database Systems",
                      dueDate: "Oct 10, 2023",
                      status: "pending",
                      submissions: 22,
                      graded: 0,
                    },
                    {
                      id: 3,
                      title: "Lab 3: Sorting Algorithms",
                      course: "CS301: Data Structures",
                      dueDate: "Sep 22, 2023",
                      status: "grading",
                      submissions: 25,
                      graded: 12,
                    },
                    {
                      id: 4,
                      title: "Quiz 2: SQL Queries",
                      course: "CS315: Database Systems",
                      dueDate: "Sep 20, 2023",
                      status: "grading",
                      submissions: 20,
                      graded: 15,
                    },
                    {
                      id: 5,
                      title: "Programming Assignment 1",
                      course: "CS101: Intro to Programming",
                      dueDate: "Sep 18, 2023",
                      status: "pending",
                      submissions: 28,
                      graded: 0,
                    },
                  ].map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{assignment.title}</h3>
                          {assignment.status === "graded" && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            >
                              Graded
                            </Badge>
                          )}
                          {assignment.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                            >
                              Pending
                            </Badge>
                          )}
                          {assignment.status === "grading" && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            >
                              In Progress
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {assignment.course}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Due: {assignment.dueDate}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Progress
                            value={
                              (assignment.graded / assignment.submissions) * 100
                            }
                            className="h-2 w-32"
                          />
                          <span className="text-xs text-muted-foreground">
                            {assignment.graded}/{assignment.submissions} graded
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary-600"
                        asChild
                      >
                        <Link
                          href={`/teacher/grading?assignment=${assignment.id}`}
                        >
                          Grade Submissions
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/teacher/assignments/create">
                    Create New Assignment
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>
                  Your teaching schedule for the current semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      day: "Monday",
                      classes: [
                        {
                          id: 1,
                          course: "CS301: Data Structures",
                          time: "10:00 AM - 11:30 AM",
                          location: "Room 301",
                        },
                        {
                          id: 3,
                          course: "CS101: Intro to Programming",
                          time: "3:00 PM - 4:30 PM",
                          location: "Room 303",
                        },
                      ],
                    },
                    {
                      day: "Tuesday",
                      classes: [
                        {
                          id: 4,
                          course: "CS401: Advanced Software Engineering",
                          time: "10:00 AM - 11:30 AM",
                          location: "Room 304",
                        },
                        {
                          id: 2,
                          course: "CS315: Database Systems",
                          time: "1:00 PM - 2:30 PM",
                          location: "Room 302",
                        },
                      ],
                    },
                    {
                      day: "Wednesday",
                      classes: [
                        {
                          id: 1,
                          course: "CS301: Data Structures",
                          time: "10:00 AM - 11:30 AM",
                          location: "Room 301",
                        },
                        {
                          id: 3,
                          course: "CS101: Intro to Programming",
                          time: "3:00 PM - 4:30 PM",
                          location: "Room 303",
                        },
                      ],
                    },
                    {
                      day: "Thursday",
                      classes: [
                        {
                          id: 4,
                          course: "CS401: Advanced Software Engineering",
                          time: "10:00 AM - 11:30 AM",
                          location: "Room 304",
                        },
                        {
                          id: 2,
                          course: "CS315: Database Systems",
                          time: "1:00 PM - 2:30 PM",
                          location: "Room 302",
                        },
                      ],
                    },
                    {
                      day: "Friday",
                      classes: [
                        {
                          id: 5,
                          course: "Office Hours",
                          time: "9:00 AM - 12:00 PM",
                          location: "Faculty Office 105",
                        },
                        {
                          id: 6,
                          course: "Department Meeting",
                          time: "2:00 PM - 3:30 PM",
                          location: "Conference Room B",
                        },
                      ],
                    },
                  ].map((day) => (
                    <div key={day.day}>
                      <h3 className="font-medium mb-2">{day.day}</h3>
                      <div className="space-y-2">
                        {day.classes.map((classItem) => (
                          <div
                            key={classItem.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div>
                              <div className="font-medium">
                                {classItem.course}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {classItem.time}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {classItem.location}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/teacher/classes/details?id=${classItem.id}`}
                              >
                                Details
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
