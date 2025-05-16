"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CreditCard,
  BookOpen,
  ChevronRight,
  AlertCircle,
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
import { AcademicProgressChart } from "@/components/student/academic-progress-chart";
import { UpcomingDeadlines } from "@/components/student/upcoming-deadlines";
import { RecentAnnouncements } from "@/components/student/recent-announcements";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage, ApiErrorMessage } from "@/components/ui/error-message";
import { useApi } from "@/hooks/use-api";
import { Student, Course, Grade } from "@/services/api";
// Remove unused import
// import { useAuth } from "@/contexts/auth-context";

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for testing when API is not available
  const mockStudentProfile = {
    id: "student-123",
    name: "John Doe",
    studentId: "M23-1470-578",
    email: "john.doe@uphc.edu.ph",
    program: "Bachelor of Science in Information Technology",
    yearLevel: "2nd Year",
    semester: "1st Semester",
    academicYear: "2023-2024",
    enrollmentStatus: "Enrolled",
    gpa: 3.75,
  };

  const mockCourses = [
    {
      id: "course-1",
      code: "CS101",
      name: "Introduction to Computer Science",
      credits: 3,
      teacher: "Dr. Smith",
      schedule: "MWF 9:00 AM - 10:30 AM",
      room: "Room 101",
      status: "Enrolled",
    },
    {
      id: "course-2",
      code: "MATH201",
      name: "Calculus II",
      credits: 4,
      teacher: "Prof. Johnson",
      schedule: "TTh 1:00 PM - 2:30 PM",
      room: "Room 203",
      status: "Enrolled",
    },
    {
      id: "course-3",
      code: "ENG101",
      name: "English Composition",
      credits: 3,
      teacher: "Prof. Williams",
      schedule: "MWF 11:00 AM - 12:30 PM",
      room: "Room 105",
      status: "Enrolled",
    },
  ];

  const mockGpaData = [
    { term: "2022-2023 1st Semester", gpa: 3.5 },
    { term: "2022-2023 2nd Semester", gpa: 3.6 },
    { term: "2023-2024 1st Semester", gpa: 3.75 },
  ];

  // Fetch student profile with fallback to mock data
  const {
    data: studentProfile,
    loading: profileLoading,
    error: profileError,
  } = useApi<Student>("/students/profile", {
    initialData: mockStudentProfile,
    skipInitialFetch: true, // Skip initial fetch until API is ready
  });

  // Fetch student courses with fallback to mock data
  const {
    data: courses,
    loading: coursesLoading,
    error: coursesError,
  } = useApi<Course[]>("/students/courses", {
    initialData: mockCourses,
    skipInitialFetch: true, // Skip initial fetch until API is ready
  });

  // Fetch student GPA data with fallback to mock data
  const {
    data: gpaData,
    loading: gpaLoading,
    error: gpaError,
  } = useApi<{ term: string; gpa: number }[]>("/students/gpa", {
    initialData: mockGpaData,
    skipInitialFetch: true, // Skip initial fetch until API is ready
  });

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-poppins font-bold">
              Student Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {studentProfile?.name || "Student"}! Here's what's
              happening with your academics.
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
        {/* Show loading state */}
        {(profileLoading || coursesLoading || gpaLoading) && (
          <div className="flex justify-center my-8">
            <Loading text="Loading dashboard data..." />
          </div>
        )}

        {/* Show error state */}
        {(profileError || coursesError || gpaError) && (
          <div className="my-4">
            <ApiErrorMessage
              error={profileError || coursesError || gpaError}
              onRetry={() => window.location.reload()}
              dismissible
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentProfile?.gpa || "N/A"}
              </div>
              {gpaData && gpaData.length > 1 && (
                <p className="text-xs text-muted-foreground">
                  {gpaData[gpaData.length - 1].gpa -
                    gpaData[gpaData.length - 2].gpa >
                  0
                    ? "+"
                    : ""}
                  {(
                    gpaData[gpaData.length - 1].gpa -
                    gpaData[gpaData.length - 2].gpa
                  ).toFixed(2)}{" "}
                  from last semester
                </p>
              )}
              <div className="mt-3">
                <Progress
                  value={(studentProfile?.gpa || 0) * 20}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Enrolled Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {courses?.reduce(
                  (total, course) => total + (course.credits || 0),
                  0
                ) || 0}{" "}
                credit hours total
              </p>
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
              <p className="text-xs text-muted-foreground">
                Due by August 15, 2023
              </p>
              <div className="mt-3">
                <Progress value={40} className="h-2" />
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
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Academic Progress</CardTitle>
                  <CardDescription>
                    Your GPA and credits over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AcademicProgressChart />
                </CardContent>
              </Card>

              <Card className="md:row-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>
                    Important dates and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingDeadlines />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>
                    Latest updates from your college
                  </CardDescription>
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
                  {(courses || mockCourses).map((course) => (
                    <div
                      key={course.code}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <div className="font-medium">
                          {course.code}: {course.name}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {course.teacher || "Instructor"} • {course.credits}{" "}
                          Credits
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          course.status === "Enrolled"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        }
                      >
                        {course.status || "Enrolled"}
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
                    <div
                      key={index}
                      className="grid grid-cols-6 border-b last:border-0"
                    >
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
                        <th className="p-2 text-left font-medium">
                          Assignment
                        </th>
                        <th className="p-2 text-left font-medium">Grade</th>
                        <th className="p-2 text-left font-medium">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          course: "CS301",
                          assignment: "Homework 1",
                          grade: "92/100",
                          weight: "10%",
                        },
                        {
                          course: "CS301",
                          assignment: "Midterm Exam",
                          grade: "88/100",
                          weight: "25%",
                        },
                        {
                          course: "MATH240",
                          assignment: "Quiz 1",
                          grade: "45/50",
                          weight: "5%",
                        },
                        {
                          course: "MATH240",
                          assignment: "Homework 1",
                          grade: "85/100",
                          weight: "10%",
                        },
                        {
                          course: "ENG210",
                          assignment: "Essay 1",
                          grade: "92/100",
                          weight: "15%",
                        },
                        {
                          course: "ENG210",
                          assignment: "Presentation",
                          grade: "95/100",
                          weight: "20%",
                        },
                        {
                          course: "CS315",
                          assignment: "Project Proposal",
                          grade: "Pending",
                          weight: "5%",
                        },
                        {
                          course: "CS320",
                          assignment: "Team Assignment 1",
                          grade: "Pending",
                          weight: "10%",
                        },
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
  );
}
