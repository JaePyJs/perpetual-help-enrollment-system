"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminDashboardShadcn() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data - in a real app, this would come from an API
  const adminInfo = {
    name: "Admin User",
    id: "A-2023-0001",
    role: "System Administrator",
    department: "Information Technology",
    email: "admin@uphsl.edu.ph",
    phone: "(123) 456-7890",
  };
  
  const systemStats = [
    { title: "Total Students", value: 1250, change: "+50", period: "from last semester" },
    { title: "Total Faculty", value: 85, change: "+5", period: "from last semester" },
    { title: "Active Courses", value: 120, change: "+10", period: "from last semester" },
    { title: "Enrollment Rate", value: "95%", change: "+2%", period: "from last semester" },
  ];
  
  const recentEnrollments = [
    { id: 1, studentId: "M23-1470-578", name: "John Doe", program: "BSIT", yearLevel: "2nd Year", date: "2023-10-15", status: "Completed" },
    { id: 2, studentId: "M23-1470-579", name: "Jane Smith", program: "BSCS", yearLevel: "1st Year", date: "2023-10-14", status: "Pending" },
    { id: 3, studentId: "M23-1470-580", name: "Robert Johnson", program: "BSIT", yearLevel: "3rd Year", date: "2023-10-14", status: "Completed" },
    { id: 4, studentId: "M23-1470-581", name: "Emily Davis", program: "BSN", yearLevel: "2nd Year", date: "2023-10-13", status: "Completed" },
    { id: 5, studentId: "M23-1470-582", name: "Michael Wilson", program: "BSCS", yearLevel: "4th Year", date: "2023-10-13", status: "Pending" },
  ];
  
  const pendingApprovals = [
    { id: 1, type: "Course Override", requestedBy: "John Doe (M23-1470-578)", date: "2023-10-15", status: "Pending" },
    { id: 2, type: "Late Enrollment", requestedBy: "Jane Smith (M23-1470-579)", date: "2023-10-14", status: "Pending" },
    { id: 3, type: "Subject Change", requestedBy: "Robert Johnson (M23-1470-580)", date: "2023-10-14", status: "Pending" },
    { id: 4, type: "Schedule Adjustment", requestedBy: "Dr. Williams (T-2023-0045)", date: "2023-10-13", status: "Pending" },
    { id: 5, type: "Grade Change", requestedBy: "Dr. Smith (T-2023-0042)", date: "2023-10-13", status: "Pending" },
  ];
  
  const systemAlerts = [
    { id: 1, title: "Database Backup Completed", date: "2023-10-15", severity: "Info", message: "Daily database backup completed successfully." },
    { id: 2, title: "High Server Load", date: "2023-10-14", severity: "Warning", message: "Server load exceeded 80% during peak hours." },
    { id: 3, title: "Failed Login Attempts", date: "2023-10-14", severity: "Warning", message: "Multiple failed login attempts detected from IP 192.168.1.100." },
    { id: 4, title: "Storage Space Low", date: "2023-10-13", severity: "Critical", message: "Server storage space below 10%. Please clean up unnecessary files." },
  ];
  
  const departments = [
    { id: 1, code: "BSIT", name: "Information Technology", students: 450, faculty: 25, courses: 35 },
    { id: 2, code: "BSCS", name: "Computer Science", students: 380, faculty: 20, courses: 30 },
    { id: 3, code: "BSN", name: "Nursing", students: 320, faculty: 18, courses: 28 },
    { id: 4, code: "BSRT", name: "Radiologic Technology", students: 100, faculty: 12, courses: 22 },
    { id: 5, code: "SHS", name: "Senior High School", students: 0, faculty: 10, courses: 15 },
  ];

  return (
    <DashboardLayout userRole="admin" userName={adminInfo.name}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <i className={`fas fa-${index === 0 ? 'user-graduate' : index === 1 ? 'chalkboard-teacher' : index === 2 ? 'book' : 'chart-line'} text-muted-foreground`}></i>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`text-${stat.change.startsWith('+') ? 'green' : 'red'}-500`}>{stat.change}</span> {stat.period}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Enrollments</CardTitle>
                  <CardDescription>Latest student enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentEnrollments.slice(0, 3).map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">{enrollment.studentId}</TableCell>
                          <TableCell>{enrollment.name}</TableCell>
                          <TableCell>{enrollment.program}</TableCell>
                          <TableCell>
                            <Badge variant={enrollment.status === "Completed" ? "default" : "outline"}>
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button variant="outline" className="w-full mt-4">View All Enrollments</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>Requests requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingApprovals.slice(0, 3).map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{approval.type}</p>
                          <p className="text-sm text-muted-foreground">By: {approval.requestedBy}</p>
                        </div>
                        <Button size="sm">Review</Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">View All Requests</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <Card key={alert.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{alert.title}</h3>
                          <p className="text-sm text-muted-foreground">Date: {alert.date}</p>
                        </div>
                        <Badge 
                          variant={
                            alert.severity === "Critical" 
                              ? "destructive" 
                              : alert.severity === "Warning" 
                                ? "default" 
                                : "outline"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="mt-2">{alert.message}</p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="enrollments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Management</CardTitle>
                <CardDescription>View and manage student enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Year Level</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">{enrollment.studentId}</TableCell>
                        <TableCell>{enrollment.name}</TableCell>
                        <TableCell>{enrollment.program}</TableCell>
                        <TableCell>{enrollment.yearLevel}</TableCell>
                        <TableCell>{enrollment.date}</TableCell>
                        <TableCell>
                          <Badge variant={enrollment.status === "Completed" ? "default" : "outline"}>
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between mt-4">
                  <Button variant="outline">Previous</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Academic departments and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Department Name</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">{department.code}</TableCell>
                        <TableCell>{department.name}</TableCell>
                        <TableCell>{department.students}</TableCell>
                        <TableCell>{department.faculty}</TableCell>
                        <TableCell>{department.courses}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>System health and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <Card key={alert.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{alert.title}</h3>
                          <p className="text-sm text-muted-foreground">Date: {alert.date}</p>
                        </div>
                        <Badge 
                          variant={
                            alert.severity === "Critical" 
                              ? "destructive" 
                              : alert.severity === "Warning" 
                                ? "default" 
                                : "outline"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="mt-2">{alert.message}</p>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">Acknowledge</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                  <CardDescription>Scheduled maintenance tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Database Backup</p>
                        <p className="text-sm text-muted-foreground">Daily at 2:00 AM</p>
                      </div>
                      <Badge variant="outline">Automated</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Updates</p>
                        <p className="text-sm text-muted-foreground">Weekly on Sunday</p>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Log Rotation</p>
                        <p className="text-sm text-muted-foreground">Daily at 1:00 AM</p>
                      </div>
                      <Badge variant="outline">Automated</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>System user statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Total Users</p>
                        <p className="text-sm text-muted-foreground">All system users</p>
                      </div>
                      <Badge>1,350</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-muted-foreground">Currently logged in</p>
                      </div>
                      <Badge>42</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Accounts</p>
                        <p className="text-sm text-muted-foreground">Last 30 days</p>
                      </div>
                      <Badge>78</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Manage Users</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
