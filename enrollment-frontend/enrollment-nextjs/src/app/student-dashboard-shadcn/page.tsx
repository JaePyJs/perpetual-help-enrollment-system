"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentDashboardShadcn() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data - in a real app, this would come from an API
  const studentInfo = {
    name: "John Doe",
    id: "M23-1470-578",
    program: "Bachelor of Science in Information Technology",
    yearLevel: "2nd Year",
    semester: "1st Semester",
    academicYear: "2023-2024",
    enrollmentStatus: "Enrolled",
    gpa: 3.75,
  };
  
  const enrolledCourses = [
    { code: "IT201", name: "Web Development", units: 3, schedule: "MWF 9:00-10:30 AM", room: "Room 301", teacher: "Dr. Smith" },
    { code: "IT202", name: "Database Management", units: 3, schedule: "TTh 1:00-2:30 PM", room: "Room 205", teacher: "Prof. Johnson" },
    { code: "IT203", name: "Object-Oriented Programming", units: 3, schedule: "MWF 1:00-2:30 PM", room: "Room 302", teacher: "Dr. Williams" },
    { code: "GE101", name: "Communication Arts", units: 3, schedule: "TTh 9:00-10:30 AM", room: "Room 101", teacher: "Prof. Davis" },
  ];
  
  const announcements = [
    { id: 1, title: "Midterm Exam Schedule", date: "2023-10-15", content: "Midterm exams will be held from October 20-25. Please check your schedule." },
    { id: 2, title: "Campus Maintenance", date: "2023-10-10", content: "The library will be closed for maintenance on October 15-16." },
    { id: 3, title: "Enrollment for Next Semester", date: "2023-10-05", content: "Enrollment for the next semester will begin on November 1." },
  ];
  
  const upcomingDeadlines = [
    { id: 1, title: "IT201 Project Submission", date: "2023-10-18", course: "IT201" },
    { id: 2, title: "IT202 Quiz", date: "2023-10-20", course: "IT202" },
    { id: 3, title: "GE101 Essay", date: "2023-10-22", course: "GE101" },
  ];
  
  const recentGrades = [
    { id: 1, course: "IT201", assignment: "Assignment 1", score: 90, total: 100, date: "2023-10-05" },
    { id: 2, course: "IT202", assignment: "Quiz 1", score: 85, total: 100, date: "2023-10-08" },
    { id: 3, course: "IT203", assignment: "Lab Exercise", score: 95, total: 100, date: "2023-10-10" },
  ];

  return (
    <DashboardLayout userRole="student" userName={studentInfo.name}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Student ID</CardTitle>
              <i className="fas fa-id-card text-muted-foreground"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentInfo.id}</div>
              <p className="text-xs text-muted-foreground">
                {studentInfo.program}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
              <i className="fas fa-chart-line text-muted-foreground"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentInfo.gpa}</div>
              <p className="text-xs text-muted-foreground">
                {studentInfo.yearLevel} • {studentInfo.semester}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
              <i className="fas fa-calendar-alt text-muted-foreground"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentInfo.academicYear}</div>
              <p className="text-xs text-muted-foreground">
                {studentInfo.semester}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <i className="fas fa-user-check text-muted-foreground"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge className="text-sm" variant={studentInfo.enrollmentStatus === "Enrolled" ? "default" : "outline"}>
                  {studentInfo.enrollmentStatus}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {studentInfo.yearLevel}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Tasks and assignments due soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-sm text-muted-foreground">Due: {deadline.date}</p>
                        </div>
                        <Badge>{deadline.course}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Grades</CardTitle>
                  <CardDescription>Your latest assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentGrades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{grade.course}: {grade.assignment}</p>
                          <p className="text-sm text-muted-foreground">Date: {grade.date}</p>
                        </div>
                        <Badge variant={grade.score >= 90 ? "default" : grade.score >= 80 ? "secondary" : "outline"}>
                          {grade.score}/{grade.total}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
                <CardDescription>Current semester courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-bold">{course.code}: {course.name}</h3>
                          <p className="text-sm text-muted-foreground">{course.teacher}</p>
                        </div>
                        <div className="mt-2 md:mt-0 text-sm">
                          <p>{course.schedule}</p>
                          <p>{course.room}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <Badge>{course.units} units</Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Summary</CardTitle>
                <CardDescription>Current semester grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{course.code}: {course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.teacher}</p>
                      </div>
                      <Badge variant="outline">
                        {Math.floor(Math.random() * 11) + 90}/100
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>School Announcements</CardTitle>
                <CardDescription>Latest updates and news</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="p-4">
                      <h3 className="font-bold">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">Posted: {announcement.date}</p>
                      <p className="mt-2">{announcement.content}</p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
