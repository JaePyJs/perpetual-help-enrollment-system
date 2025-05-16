"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Search,
  User,
  X,
  ChevronRight,
  Info,
  Plus,
  Trash2,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WeeklyScheduleView } from "@/components/student/enrollment/weekly-schedule-view";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string;
  instructor: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
    location: string;
  };
  prerequisites: string[];
  department: string;
  seats: {
    total: number;
    available: number;
  };
  status: "open" | "closed" | "waitlist";
}

export function CourseSelection() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCredits, setSelectedCredits] = useState("all");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [courseDetailsOpen, setCourseDetailsOpen] = useState<string | null>(
    null
  );

  // Sample course data
  const courses: Course[] = [
    {
      id: "cs301",
      code: "CS301",
      name: "Data Structures and Algorithms",
      credits: 3,
      description:
        "This course covers fundamental data structures and algorithms including arrays, linked lists, stacks, queues, trees, graphs, sorting, and searching algorithms. Students will analyze algorithm efficiency and implement data structures in programming assignments.",
      instructor: "Dr. James Wilson",
      schedule: {
        days: ["Monday", "Wednesday"],
        startTime: "9:00 AM",
        endTime: "10:30 AM",
        location: "Room 301",
      },
      prerequisites: ["CS201", "MATH220"],
      department: "Computer Science",
      seats: {
        total: 30,
        available: 8,
      },
      status: "open",
    },
    {
      id: "cs315",
      code: "CS315",
      name: "Database Systems",
      credits: 3,
      description:
        "Introduction to database design and implementation. Topics include data modeling, relational algebra, SQL, indexing, transaction processing, and database security. Students will design and implement a database application.",
      instructor: "Dr. Sarah Chen",
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "10:30 AM",
        endTime: "12:00 PM",
        location: "Room 302",
      },
      prerequisites: ["CS201"],
      department: "Computer Science",
      seats: {
        total: 25,
        available: 5,
      },
      status: "open",
    },
    {
      id: "cs320",
      code: "CS320",
      name: "Software Engineering",
      credits: 3,
      description:
        "This course introduces software engineering principles and practices. Topics include software development methodologies, requirements analysis, design patterns, testing strategies, and project management.",
      instructor: "Prof. Michael Brown",
      schedule: {
        days: ["Thursday", "Friday"],
        startTime: "1:00 PM",
        endTime: "2:30 PM",
        location: "Room 303",
      },
      prerequisites: ["CS201", "CS215"],
      department: "Computer Science",
      seats: {
        total: 30,
        available: 12,
      },
      status: "open",
    },
    {
      id: "math240",
      code: "MATH240",
      name: "Discrete Mathematics",
      credits: 3,
      description:
        "Introduction to discrete mathematical structures used in computer science. Topics include sets, relations, functions, logic, proof techniques, combinatorics, graphs, trees, and Boolean algebra.",
      instructor: "Dr. Robert Taylor",
      schedule: {
        days: ["Monday", "Friday"],
        startTime: "1:00 PM",
        endTime: "2:30 PM",
        location: "Room 205",
      },
      prerequisites: ["MATH120"],
      department: "Mathematics",
      seats: {
        total: 35,
        available: 15,
      },
      status: "open",
    },
    {
      id: "eng210",
      code: "ENG210",
      name: "Technical Writing",
      credits: 3,
      description:
        "Development of skills in writing clear, precise, and effective technical documents. Focus on writing for specific audiences and purposes in academic and professional contexts.",
      instructor: "Prof. Emily Johnson",
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "2:30 PM",
        endTime: "4:00 PM",
        location: "Room 105",
      },
      prerequisites: ["ENG101"],
      department: "English",
      seats: {
        total: 25,
        available: 10,
      },
      status: "open",
    },
    {
      id: "cs350",
      code: "CS350",
      name: "Computer Networks",
      credits: 3,
      description:
        "Introduction to computer networks and data communications. Topics include network architectures, protocols, Internet applications, and network security.",
      instructor: "Dr. Lisa Martinez",
      schedule: {
        days: ["Monday", "Wednesday"],
        startTime: "2:30 PM",
        endTime: "4:00 PM",
        location: "Room 304",
      },
      prerequisites: ["CS201", "CS215"],
      department: "Computer Science",
      seats: {
        total: 25,
        available: 0,
      },
      status: "closed",
    },
    {
      id: "cs360",
      code: "CS360",
      name: "Advanced Computing Systems",
      credits: 3,
      description:
        "Introduction to advanced computing concepts and techniques. Topics include search algorithms, knowledge representation, computational models, algorithm design, and system architecture.",
      instructor: "Dr. David Kim",
      schedule: {
        days: ["Tuesday", "Thursday"],
        startTime: "4:00 PM",
        endTime: "5:30 PM",
        location: "Room 305",
      },
      prerequisites: ["CS301", "MATH240"],
      department: "Computer Science",
      seats: {
        total: 30,
        available: 2,
      },
      status: "waitlist",
    },
  ];

  const departments = Array.from(
    new Set(courses.map((course) => course.department))
  );

  const filteredCourses = courses.filter((course) => {
    // Search filter
    const matchesSearch =
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    // Department filter
    const matchesDepartment =
      selectedDepartment === "all" || course.department === selectedDepartment;

    // Credits filter
    const matchesCredits =
      selectedCredits === "all" ||
      course.credits.toString() === selectedCredits;

    // Days filter
    const matchesDays =
      selectedDays.length === 0 ||
      selectedDays.some((day) => course.schedule.days.includes(day));

    return matchesSearch && matchesDepartment && matchesCredits && matchesDays;
  });

  const addCourse = (course: Course) => {
    // Check if course is already added
    if (selectedCourses.some((c) => c.id === course.id)) {
      toast({
        title: "Course already added",
        description: `${course.code}: ${course.name} is already in your selection.`,
        variant: "destructive",
      });
      return;
    }

    // Check for schedule conflicts
    const hasConflict = selectedCourses.some((selectedCourse) => {
      const selectedDays = selectedCourse.schedule.days;
      const newDays = course.schedule.days;

      // Check if there's any day overlap
      const daysOverlap = selectedDays.some((day) => newDays.includes(day));

      if (!daysOverlap) return false;

      // Convert times to minutes for easier comparison
      const convertToMinutes = (timeStr: string) => {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const selectedStart = convertToMinutes(selectedCourse.schedule.startTime);
      const selectedEnd = convertToMinutes(selectedCourse.schedule.endTime);
      const newStart = convertToMinutes(course.schedule.startTime);
      const newEnd = convertToMinutes(course.schedule.endTime);

      // Check if times overlap
      return (
        (newStart >= selectedStart && newStart < selectedEnd) ||
        (newEnd > selectedStart && newEnd <= selectedEnd) ||
        (newStart <= selectedStart && newEnd >= selectedEnd)
      );
    });

    if (hasConflict) {
      toast({
        title: "Schedule Conflict",
        description: `${course.code} conflicts with another course in your selection.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedCourses([...selectedCourses, course]);
    toast({
      title: "Course Added",
      description: `${course.code}: ${course.name} has been added to your selection.`,
    });
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses(
      selectedCourses.filter((course) => course.id !== courseId)
    );
    toast({
      title: "Course Removed",
      description: "The course has been removed from your selection.",
    });
  };

  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-poppins font-bold">
              Course Selection
            </h1>
            <p className="text-sm text-muted-foreground">
              Select courses for Fall 2023 semester
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/student/dashboard">Back to Dashboard</Link>
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-600"
              disabled={selectedCourses.length === 0}
              asChild
            >
              <Link href="/student/enrollment/schedule">
                Continue to Schedule
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-7">
          <div className="space-y-4 md:col-span-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Available Courses</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
                <div className="flex w-full items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by course code, name, or instructor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              {showFilters && (
                <CardContent className="border-t pt-3">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <Select
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Credits</label>
                      <Select
                        value={selectedCredits}
                        onValueChange={setSelectedCredits}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Credits" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Credits</SelectItem>
                          <SelectItem value="1">1 Credit</SelectItem>
                          <SelectItem value="2">2 Credits</SelectItem>
                          <SelectItem value="3">3 Credits</SelectItem>
                          <SelectItem value="4">4 Credits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Days</label>
                      <div className="flex flex-wrap gap-1">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                        ].map((day) => {
                          const shortDay = day.substring(0, 2);
                          const isSelected = selectedDays.includes(day);

                          return (
                            <Button
                              key={day}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className={
                                isSelected
                                  ? "bg-primary hover:bg-primary-600"
                                  : ""
                              }
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedDays(
                                    selectedDays.filter((d) => d !== day)
                                  );
                                } else {
                                  setSelectedDays([...selectedDays, day]);
                                }
                              }}
                            >
                              {shortDay}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}

              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {filteredCourses.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        No courses match your search criteria
                      </p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedDepartment("all");
                          setSelectedCredits("all");
                          setSelectedDays([]);
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredCourses.map((course) => (
                        <div key={course.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  {course.code}: {course.name}
                                </h3>
                                {course.status === "waitlist" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                                  >
                                    Waitlist
                                  </Badge>
                                )}
                                {course.status === "closed" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                  >
                                    Closed
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {course.credits}{" "}
                                {course.credits === 1 ? "Credit" : "Credits"} •{" "}
                                {course.instructor}
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{course.schedule.days.join(", ")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>
                                    {course.schedule.startTime} -{" "}
                                    {course.schedule.endTime}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{course.schedule.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>
                                    {course.seats.available} of{" "}
                                    {course.seats.total} seats available
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Dialog
                                open={courseDetailsOpen === course.id}
                                onOpenChange={(open) =>
                                  setCourseDetailsOpen(open ? course.id : null)
                                }
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only">
                                      Course Details
                                    </span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {course.code}: {course.name}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Department
                                        </h4>
                                        <p>{course.department}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Credits
                                        </h4>
                                        <p>{course.credits}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Instructor
                                        </h4>
                                        <p>{course.instructor}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Schedule
                                        </h4>
                                        <p>
                                          {course.schedule.days.join(", ")},{" "}
                                          {course.schedule.startTime} -{" "}
                                          {course.schedule.endTime}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Location
                                        </h4>
                                        <p>{course.schedule.location}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Availability
                                        </h4>
                                        <p>
                                          {course.seats.available} of{" "}
                                          {course.seats.total} seats available
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Prerequisites
                                      </h4>
                                      <p>
                                        {course.prerequisites.length > 0
                                          ? course.prerequisites.join(", ")
                                          : "None"}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Description
                                      </h4>
                                      <p className="text-sm">
                                        {course.description}
                                      </p>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        addCourse(course);
                                        setCourseDetailsOpen(null);
                                      }}
                                      disabled={course.status === "closed"}
                                      className="bg-primary hover:bg-primary-600"
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Add Course
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => addCourse(course)}
                                      disabled={course.status === "closed"}
                                      size="sm"
                                      className="bg-primary hover:bg-primary-600"
                                    >
                                      <Plus className="h-4 w-4" />
                                      <span className="sr-only">
                                        Add Course
                                      </span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {course.status === "closed"
                                      ? "Course is closed for enrollment"
                                      : "Add to your course selection"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Selected Courses</CardTitle>
                <CardDescription>
                  {selectedCourses.length === 0
                    ? "No courses selected yet"
                    : `${selectedCourses.length} courses selected (${totalCredits} credits)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCourses.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your selected courses will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-start justify-between rounded-lg border p-3"
                      >
                        <div>
                          <div className="font-medium">
                            {course.code}: {course.name}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {course.credits}{" "}
                            {course.credits === 1 ? "Credit" : "Credits"} •{" "}
                            {course.instructor}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {course.schedule.days.join(", ")},{" "}
                            {course.schedule.startTime} -{" "}
                            {course.schedule.endTime}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCourse(course.id)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove Course</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <WeeklyScheduleView selectedCourses={selectedCourses} />
                <Button
                  className="w-full bg-primary hover:bg-primary-600"
                  disabled={selectedCourses.length === 0}
                  asChild
                >
                  <Link href="/student/enrollment/schedule">
                    Continue to Schedule
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
