"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Save, Edit, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { ApiErrorMessage } from "@/components/ui/error-message";
import { teacherApi } from "@/services/api";

// Types
type Student = {
  id: string;
  name: string;
  studentId: string;
  email: string;
};

type Course = {
  id: string;
  code: string;
  name: string;
  section: string;
  schedule: string;
  room: string;
  students: Student[];
};

type Grade = {
  studentId: string;
  courseId: string;
  midterm: number | null;
  finals: number | null;
  finalGrade: number | null;
  letterGrade: string | null;
  status: "submitted" | "draft" | "pending";
};

// Sample data - would be replaced with API calls in production
const sampleCourses: Course[] = [
  {
    id: "course-1",
    code: "CS101",
    name: "Introduction to Programming",
    section: "A",
    schedule: "MWF 9:00 AM - 10:30 AM",
    room: "Room 101",
    students: [
      {
        id: "student-1",
        name: "John Doe",
        studentId: "M23-1470-578",
        email: "john.doe@uphc.edu.ph",
      },
      {
        id: "student-2",
        name: "Jane Smith",
        studentId: "M23-1470-579",
        email: "jane.smith@uphc.edu.ph",
      },
      {
        id: "student-3",
        name: "Robert Johnson",
        studentId: "M23-1470-580",
        email: "robert.johnson@uphc.edu.ph",
      },
    ],
  },
  {
    id: "course-2",
    code: "CS201",
    name: "Data Structures and Algorithms",
    section: "B",
    schedule: "TTh 1:00 PM - 2:30 PM",
    room: "Room 203",
    students: [
      {
        id: "student-4",
        name: "Emily Davis",
        studentId: "M23-1470-581",
        email: "emily.davis@uphc.edu.ph",
      },
      {
        id: "student-5",
        name: "Michael Wilson",
        studentId: "M23-1470-582",
        email: "michael.wilson@uphc.edu.ph",
      },
    ],
  },
];

// Sample grades data
const sampleGrades: Record<string, Record<string, Grade>> = {
  "course-1": {
    "student-1": {
      studentId: "student-1",
      courseId: "course-1",
      midterm: 88,
      finals: 92,
      finalGrade: 90,
      letterGrade: "A",
      status: "submitted",
    },
    "student-2": {
      studentId: "student-2",
      courseId: "course-1",
      midterm: 78,
      finals: 82,
      finalGrade: 80,
      letterGrade: "B",
      status: "submitted",
    },
    "student-3": {
      studentId: "student-3",
      courseId: "course-1",
      midterm: null,
      finals: null,
      finalGrade: null,
      letterGrade: null,
      status: "pending",
    },
  },
  "course-2": {
    "student-4": {
      studentId: "student-4",
      courseId: "course-2",
      midterm: 85,
      finals: null,
      finalGrade: null,
      letterGrade: null,
      status: "draft",
    },
    "student-5": {
      studentId: "student-5",
      courseId: "course-2",
      midterm: 92,
      finals: null,
      finalGrade: null,
      letterGrade: null,
      status: "draft",
    },
  },
};

// Helper function to calculate letter grade
const calculateLetterGrade = (score: number): string => {
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
};

// Helper function to calculate final grade
const calculateFinalGrade = (midterm: number | null, finals: number | null): number | null => {
  if (midterm === null || finals === null) return null;
  return Math.round((midterm * 0.4 + finals * 0.6) * 10) / 10; // 40% midterm, 60% finals, rounded to 1 decimal
};

export function TeacherGrades() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [grades, setGrades] = useState<Record<string, Record<string, Grade>>>(sampleGrades);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Fetch courses and grades from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch courses
        const coursesData = await teacherApi.getCourses();
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
          if (!selectedCourse && coursesData.length > 0) {
            setSelectedCourse(coursesData[0].id);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourse]);

  // Get the current course
  const currentCourse = courses.find((course) => course.id === selectedCourse);

  // Filter students by search query
  const filteredStudents = currentCourse
    ? currentCourse.students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle grade change
  const handleGradeChange = (studentId: string, field: "midterm" | "finals", value: string) => {
    if (!selectedCourse) return;

    const numValue = value === "" ? null : Number(value);
    
    // Validate input
    if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
      return; // Invalid input
    }

    setGrades((prevGrades) => {
      const courseGrades = prevGrades[selectedCourse] || {};
      const studentGrade = courseGrades[studentId] || {
        studentId,
        courseId: selectedCourse,
        midterm: null,
        finals: null,
        finalGrade: null,
        letterGrade: null,
        status: "pending",
      };

      const updatedGrade = { ...studentGrade, [field]: numValue };

      // Calculate final grade if both midterm and finals are available
      if (field === "midterm" || field === "finals") {
        const midterm = field === "midterm" ? numValue : studentGrade.midterm;
        const finals = field === "finals" ? numValue : studentGrade.finals;
        
        if (midterm !== null && finals !== null) {
          const finalGrade = calculateFinalGrade(midterm, finals);
          updatedGrade.finalGrade = finalGrade;
          updatedGrade.letterGrade = finalGrade !== null ? calculateLetterGrade(finalGrade) : null;
        }
      }

      // Update status to draft if any changes are made
      updatedGrade.status = "draft";

      return {
        ...prevGrades,
        [selectedCourse]: {
          ...courseGrades,
          [studentId]: updatedGrade,
        },
      };
    });
  };

  // Handle save grades
  const handleSaveGrades = async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);
      setSaveSuccess(false);

      const courseGrades = grades[selectedCourse] || {};
      const gradesToSubmit = Object.values(courseGrades).filter(
        (grade) => grade.status === "draft"
      );

      if (gradesToSubmit.length === 0) {
        setSaveSuccess(true);
        setLoading(false);
        return;
      }

      // Submit grades to the API
      await teacherApi.submitGrades({
        courseId: selectedCourse,
        grades: gradesToSubmit,
      });

      // Update status to submitted
      setGrades((prevGrades) => {
        const courseGrades = prevGrades[selectedCourse] || {};
        const updatedCourseGrades = { ...courseGrades };

        Object.keys(updatedCourseGrades).forEach((studentId) => {
          if (updatedCourseGrades[studentId].status === "draft") {
            updatedCourseGrades[studentId] = {
              ...updatedCourseGrades[studentId],
              status: "submitted",
            };
          }
        });

        return {
          ...prevGrades,
          [selectedCourse]: updatedCourseGrades,
        };
      });

      setSaveSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error("Error saving grades:", err);
      setError("Failed to save grades. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Loading size="large" text="Loading course data..." />
      </div>
    );
  }

  if (error) {
    return (
      <ApiErrorMessage 
        error={error}
        onRetry={() => window.location.reload()}
        dismissible
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link
            href="/teacher/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Grade Management</span>
        </nav>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Grade Management
            </h2>
            <p className="text-muted-foreground">
              Manage and submit student grades
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-800 dark:text-green-300 flex items-center gap-2">
          <Check className="h-5 w-5" />
          <span>Grades saved successfully!</span>
        </div>
      )}

      {currentCourse ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentCourse.code} - {currentCourse.name}
            </CardTitle>
            <CardDescription>
              Section {currentCourse.section} • {currentCourse.schedule} •{" "}
              {currentCourse.room}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveGrades} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Grades
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Midterm</TableHead>
                    <TableHead>Finals</TableHead>
                    <TableHead>Final Grade</TableHead>
                    <TableHead>Letter Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => {
                      const studentGrade =
                        grades[selectedCourse]?.[student.id] || {
                          studentId: student.id,
                          courseId: selectedCourse,
                          midterm: null,
                          finals: null,
                          finalGrade: null,
                          letterGrade: null,
                          status: "pending",
                        };

                      const isEditing = editMode[student.id] || false;

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.studentId}
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={
                                  studentGrade.midterm === null
                                    ? ""
                                    : studentGrade.midterm
                                }
                                onChange={(e) =>
                                  handleGradeChange(
                                    student.id,
                                    "midterm",
                                    e.target.value
                                  )
                                }
                                className="w-20"
                              />
                            ) : (
                              studentGrade.midterm ?? "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={
                                  studentGrade.finals === null
                                    ? ""
                                    : studentGrade.finals
                                }
                                onChange={(e) =>
                                  handleGradeChange(
                                    student.id,
                                    "finals",
                                    e.target.value
                                  )
                                }
                                className="w-20"
                              />
                            ) : (
                              studentGrade.finals ?? "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {studentGrade.finalGrade ?? "-"}
                          </TableCell>
                          <TableCell>
                            {studentGrade.letterGrade ?? "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                studentGrade.status === "submitted"
                                  ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                  : studentGrade.status === "draft"
                                  ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              }
                            >
                              {studentGrade.status.charAt(0).toUpperCase() +
                                studentGrade.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {isEditing ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setEditMode((prev) => ({
                                    ...prev,
                                    [student.id]: false,
                                  }))
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setEditMode((prev) => ({
                                    ...prev,
                                    [student.id]: true,
                                  }))
                                }
                                disabled={
                                  studentGrade.status === "submitted"
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No courses available. Please select a course to manage grades.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
