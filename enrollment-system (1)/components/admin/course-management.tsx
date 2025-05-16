"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CourseManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

  const courses = [
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      department: "Computer Science",
      credits: 3,
      instructor: "Dr. James Wilson",
      status: "Active",
      enrollment: 45,
      capacity: 50,
    },
    {
      id: "BUS202",
      name: "Principles of Marketing",
      department: "Business Administration",
      credits: 3,
      instructor: "Prof. Sarah Johnson",
      status: "Active",
      enrollment: 38,
      capacity: 40,
    },
    {
      id: "MATH301",
      name: "Advanced Calculus",
      department: "Mathematics",
      credits: 4,
      instructor: "Dr. Robert Chen",
      status: "Active",
      enrollment: 25,
      capacity: 30,
    },
    {
      id: "ENG101",
      name: "English Composition",
      department: "English",
      credits: 3,
      instructor: "Prof. Maria Garcia",
      status: "Inactive",
      enrollment: 0,
      capacity: 35,
    },
    {
      id: "PHYS201",
      name: "Physics for Engineers",
      department: "Physics",
      credits: 4,
      instructor: "Dr. John Smith",
      status: "Active",
      enrollment: 32,
      capacity: 35,
    },
  ]

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return null
    }
  }

  const getEnrollmentStatus = (enrollment: number, capacity: number) => {
    const percentage = (enrollment / capacity) * 100
    if (percentage >= 90) {
      return (
        <Badge className="bg-red-100 text-red-800">
          {enrollment}/{capacity} (Almost Full)
        </Badge>
      )
    } else if (percentage >= 70) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          {enrollment}/{capacity}
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          {enrollment}/{capacity}
        </Badge>
      )
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">Manage courses, schedules, and faculty assignments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>View and manage all courses in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search courses..."
                      className="w-[200px] pl-8 md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new course. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="courseId" className="text-right">
                            Course ID
                          </Label>
                          <Input id="courseId" placeholder="e.g., CS101" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="courseName" className="text-right">
                            Course Name
                          </Label>
                          <Input
                            id="courseName"
                            placeholder="e.g., Introduction to Computer Science"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="department" className="text-right">
                            Department
                          </Label>
                          <Select>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cs">Computer Science</SelectItem>
                              <SelectItem value="business">Business Administration</SelectItem>
                              <SelectItem value="math">Mathematics</SelectItem>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="credits" className="text-right">
                            Credits
                          </Label>
                          <Input id="credits" type="number" placeholder="e.g., 3" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="instructor" className="text-right">
                            Instructor
                          </Label>
                          <Select>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select instructor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wilson">Dr. James Wilson</SelectItem>
                              <SelectItem value="johnson">Prof. Sarah Johnson</SelectItem>
                              <SelectItem value="chen">Dr. Robert Chen</SelectItem>
                              <SelectItem value="garcia">Prof. Maria Garcia</SelectItem>
                              <SelectItem value="smith">Dr. John Smith</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="capacity" className="text-right">
                            Capacity
                          </Label>
                          <Input id="capacity" type="number" placeholder="e.g., 30" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea id="description" placeholder="Enter course description" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddCourseOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" onClick={() => setIsAddCourseOpen(false)}>
                          Save Course
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course ID</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.id}</TableCell>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.department}</TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell>{course.instructor}</TableCell>
                            <TableCell>{getStatusBadge(course.status)}</TableCell>
                            <TableCell>{getEnrollmentStatus(course.enrollment, course.capacity)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit course</DropdownMenuItem>
                                  <DropdownMenuItem>Manage schedule</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    {course.status === "Active" ? "Deactivate course" : "Activate course"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No courses found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="active">
                {/* Similar table structure for active courses only */}
                <p className="text-sm text-muted-foreground">Active courses filter view will be displayed here</p>
              </TabsContent>

              <TabsContent value="inactive">
                {/* Similar table structure for inactive courses only */}
                <p className="text-sm text-muted-foreground">Inactive courses filter view will be displayed here</p>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Export Data</Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
