"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TeacherDashboardShadcn() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data - in a real app, this would come from an API
  const teacherInfo = {
    name: "Dr. Jane Smith",
    id: "T-2023-0042",
    department: "Information Technology",
    position: "Associate Professor",
    email: "jane.smith@uphsl.edu.ph",
    phone: "(123) 456-7890",
    office: "Faculty Building, Room 205",
    officeHours: "MWF 1:00-3:00 PM",
  };
  
  const classesTaught = [
    { code: "IT201", name: "Web Development", section: "A", schedule: "MWF 9:00-10:30 AM", room: "Room 301", students: 35 },
    { code: "IT301", name: "Advanced Web Development", section: "B", schedule: "TTh 1:00-2:30 PM", room: "Room 302", students: 28 },
    { code: "IT401", name: "Web Application Security", section: "A", schedule: "MWF 1:00-2:30 PM", room: "Room 303", students: 22 },
    { code: "IT101", name: "Introduction to Programming", section: "C", schedule: "TTh 9:00-10:30 AM", room: "Room 304", students: 40 },
  ];
  
  const upcomingSchedule = [
    { day: "Monday", classes: [
      { time: "9:00-10:30 AM", course: "IT201", room: "Room 301" },
      { time: "1:00-2:30 PM", course: "IT401", room: "Room 303" },
    ]},
    { day: "Tuesday", classes: [
      { time: "9:00-10:30 AM", course: "IT101", room: "Room 304" },
      { time: "1:00-2:30 PM", course: "IT301", room: "Room 302" },
    ]},
    { day: "Wednesday", classes: [
      { time: "9:00-10:30 AM", course: "IT201", room: "Room 301" },
      { time: "1:00-2:30 PM", course: "IT401", room: "Room 303" },
    ]},
    { day: "Thursday", classes: [
      { time: "9:00-10:30 AM", course: "IT101", room: "Room 304" },
      { time: "1:00-2:30 PM", course: "IT301", room: "Room 302" },
    ]},
    { day: "Friday", classes: [
      { time: "9:00-10:30 AM", course: "IT201", room: "Room 301" },
      { time: "1:00-2:30 PM", course: "IT401", room: "Room 303" },
    ]},
  ];
  
  const pendingTasks = [
    { id: 1, task: "Grade IT201 Assignment 3", deadline: "2023-10-18", priority: "High" },
    { id: 2, task: "Prepare midterm exam for IT301", deadline: "2023-10-20", priority: "High" },
    { id: 3, task: "Submit course syllabus updates", deadline: "2023-10-25", priority: "Medium" },
    { id: 4, task: "Faculty meeting", deadline: "2023-10-15", priority: "Medium" },
    { id: 5, task: "Research paper review", deadline: "2023-10-30", priority: "Low" },
  ];
  
  const announcements = [
    { id: 1, title: "Faculty Development Week", date: "2023-10-15", content: "Faculty development week will be held from October 20-25. Please check your schedule." },
    { id: 2, title: "Grade Submission Deadline", date: "2023-10-10", content: "Midterm grades must be submitted by October 30." },
    { id: 3, title: "Department Meeting", date: "2023-10-05", content: "IT Department meeting will be held on October 15 at 2:00 PM in the conference room." },
  ];

  return (
    <DashboardLayout userRole="teacher" userName={teacherInfo.name}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty ID</CardTitle>
              <i className="fas fa-id-badge text-muted-foreground"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacherInfo.id}</div>
              <p className="text-xs text-muted-foreground">
                {teacherInfo.department}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <i className="fas fa-chalkboard-teacher text-muted-foreground"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classesTaught.length}</div>
              <p className="text-xs text-muted-foreground">
                {classesTaught.reduce((total, course) => total + course.students, 0)} Total Students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Office Hours</CardTitle>
              <i className="fas fa-clock text-muted-foreground"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacherInfo.officeHours}</div>
              <p className="text-xs text-muted-foreground">
                {teacherInfo.office}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <i className="fas fa-tasks text-muted-foreground"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingTasks.filter(task => task.priority === "High").length} High Priority
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your classes for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSchedule[0].classes.map((classItem, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{classItem.course}</p>
                          <p className="text-sm text-muted-foreground">{classItem.time}</p>
                        </div>
                        <Badge variant="outline">{classItem.room}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Tasks requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingTasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{task.task}</p>
                          <p className="text-sm text-muted-foreground">Due: {task.deadline}</p>
                        </div>
                        <Badge 
                          variant={
                            task.priority === "High" 
                              ? "destructive" 
                              : task.priority === "Medium" 
                                ? "default" 
                                : "outline"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Latest faculty announcements</CardDescription>
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
          
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Classes Taught</CardTitle>
                <CardDescription>Current semester courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classesTaught.map((course, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{course.code}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.section}</TableCell>
                        <TableCell>{course.schedule}</TableCell>
                        <TableCell>{course.room}</TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Your teaching schedule for the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingSchedule.map((day, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-lg mb-2">{day.day}</h3>
                      <div className="space-y-2">
                        {day.classes.map((classItem, classIndex) => (
                          <Card key={classIndex} className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{classItem.time}</p>
                                <p className="text-sm text-muted-foreground">{classItem.course}</p>
                              </div>
                              <Badge variant="outline">{classItem.room}</Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.task}</TableCell>
                        <TableCell>{task.deadline}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              task.priority === "High" 
                                ? "destructive" 
                                : task.priority === "Medium" 
                                  ? "default" 
                                  : "outline"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Complete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
