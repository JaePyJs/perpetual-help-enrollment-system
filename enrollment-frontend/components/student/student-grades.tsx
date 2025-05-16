"use client";

/**
 * Student Grades Component
 *
 * This component displays a student's academic grades, including:
 * - Current term grades
 * - Grade history
 * - GPA trends
 *
 * Backend Integration:
 * To fully integrate with the backend API:
 * 1. Uncomment the API calls in the useEffect hook
 * 2. Import the necessary API functions from @/lib/api
 * 3. Add state for storing the fetched data
 * 4. Replace the sample data with the fetched data
 *
 * The component is currently using sample data for demonstration purposes.
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
// Import API client and services
import apiClient from "@/lib/api-client";
import {
  studentApi,
  Grade as ApiGrade,
  AcademicTerm as ApiTerm,
} from "@/services/api";
import { Loading } from "@/components/ui/loading";
import { ApiErrorMessage } from "@/components/ui/error-message";

// Types
type Grade = {
  id: string;
  courseCode: string;
  courseName: string;
  units: number;
  midterm: number | null;
  finals: number | null;
  finalGrade: number | null;
  letterGrade: string | null;
  status: "passed" | "failed" | "ongoing" | "incomplete";
};

// Map API grade to our internal Grade type
const mapApiGradeToGrade = (apiGrade: any): Grade => ({
  id: apiGrade.id,
  courseCode: apiGrade.courseCode,
  courseName: apiGrade.courseName,
  units: apiGrade.credits,
  midterm: null, // API might not provide midterm/finals breakdown
  finals: null,
  finalGrade: typeof apiGrade.grade === "number" ? apiGrade.grade : null,
  letterGrade:
    typeof apiGrade.letterGrade === "string" ? apiGrade.letterGrade : null,
  status:
    apiGrade.letterGrade === "F"
      ? "failed"
      : apiGrade.letterGrade
      ? "passed"
      : "ongoing", // Determine status based on letter grade
});

type AcademicTerm = {
  id: string;
  year: string;
  semester: string;
};

// Helper functions
const getLetterGrade = (score: number | null): string => {
  if (score === null) return "-";
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

const getStatusColor = (status: string): string => {
  switch (status) {
    case "passed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "ongoing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "incomplete":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const calculateGPA = (grades: Grade[]): number => {
  if (!grades || grades.length === 0) return 0;

  const completedCourses = grades.filter(
    (grade) =>
      grade.finalGrade !== null &&
      (grade.status === "passed" || grade.status === "failed")
  );

  if (completedCourses.length === 0) return 0;

  const totalPoints = completedCourses.reduce((sum, course) => {
    const gradePoint = course.finalGrade ? course.finalGrade / 20 - 1 : 0; // Convert percentage to 4.0 scale
    return sum + gradePoint * course.units;
  }, 0);

  const totalUnits = completedCourses.reduce(
    (sum, course) => sum + course.units,
    0
  );

  return totalPoints / totalUnits;
};

// Sample data - would be replaced with API calls in production
const sampleGrades: Record<string, Grade[]> = {
  "2023-2024-1st": [
    {
      id: "1",
      courseCode: "CS101",
      courseName: "Introduction to Programming",
      units: 3,
      midterm: 88,
      finals: 92,
      finalGrade: 90,
      letterGrade: "A",
      status: "passed",
    },
    {
      id: "2",
      courseCode: "MATH201",
      courseName: "Calculus I",
      units: 4,
      midterm: 78,
      finals: 82,
      finalGrade: 80,
      letterGrade: "B",
      status: "passed",
    },
    {
      id: "3",
      courseCode: "ENG101",
      courseName: "English Composition",
      units: 3,
      midterm: 85,
      finals: 88,
      finalGrade: 87,
      letterGrade: "B+",
      status: "passed",
    },
    {
      id: "4",
      courseCode: "PHYS101",
      courseName: "Physics I",
      units: 4,
      midterm: 75,
      finals: null,
      finalGrade: null,
      letterGrade: null,
      status: "ongoing",
    },
    {
      id: "5",
      courseCode: "CHEM101",
      courseName: "General Chemistry",
      units: 4,
      midterm: 82,
      finals: null,
      finalGrade: null,
      letterGrade: null,
      status: "ongoing",
    },
  ],
  "2022-2023-2nd": [
    {
      id: "6",
      courseCode: "HIST101",
      courseName: "World History",
      units: 3,
      midterm: 90,
      finals: 88,
      finalGrade: 89,
      letterGrade: "B+",
      status: "passed",
    },
    {
      id: "7",
      courseCode: "BIO101",
      courseName: "Biology I",
      units: 4,
      midterm: 92,
      finals: 94,
      finalGrade: 93,
      letterGrade: "A",
      status: "passed",
    },
    {
      id: "8",
      courseCode: "SOC101",
      courseName: "Introduction to Sociology",
      units: 3,
      midterm: 85,
      finals: 80,
      finalGrade: 82,
      letterGrade: "B",
      status: "passed",
    },
    {
      id: "9",
      courseCode: "PSYCH101",
      courseName: "Introduction to Psychology",
      units: 3,
      midterm: 78,
      finals: 72,
      finalGrade: 75,
      letterGrade: "C",
      status: "passed",
    },
  ],
};

// Academic terms for the dropdown
const academicTerms: AcademicTerm[] = [
  { id: "2023-2024-1st", year: "2023-2024", semester: "1st Semester" },
  { id: "2022-2023-2nd", year: "2022-2023", semester: "2nd Semester" },
];

// GPA trend data for the chart
const gpaData = [
  { term: "2021-2022 1st", gpa: 3.2 },
  { term: "2021-2022 2nd", gpa: 3.4 },
  { term: "2022-2023 1st", gpa: 3.5 },
  { term: "2022-2023 2nd", gpa: 3.6 },
  { term: "2023-2024 1st", gpa: 3.75 },
];

export function StudentGrades() {
  // We'll use the auth context in a real implementation to fetch user-specific data
  const {} = useAuth();
  const router = useRouter();
  const [selectedTerm, setSelectedTerm] = useState<string>("2023-2024-1st");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for storing fetched data
  const [grades, setGrades] = useState<Record<string, Grade[]>>(sampleGrades);
  const [terms, setTerms] = useState<AcademicTerm[]>(academicTerms);
  const [gpaHistory, setGpaHistory] =
    useState<{ term: string; gpa: number }[]>(gpaData);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          console.log("API request timed out, using sample data");
          setLoading(false);
        }, 5000); // 5 seconds timeout

        try {
          // Try to fetch academic terms
          const termsData = await studentApi.getAcademicTerms();
          if (termsData && termsData.length > 0) {
            // Map API terms to our format
            const formattedTerms = termsData.map((term) => ({
              id: `${term.academicYear}-${term.semester}`,
              year: term.academicYear,
              semester: term.semester,
            }));
            setTerms(formattedTerms);
          }

          // Try to fetch GPA data
          const gpaData = await studentApi.getGpaData();
          if (gpaData && gpaData.length > 0) {
            setGpaHistory(gpaData);
          }

          // Try to fetch grades for the selected term
          const termParts = selectedTerm.split("-");
          const academicYear = `${termParts[0]}-${termParts[1]}`;
          const semester = termParts[2];

          const gradesData = await studentApi.getGrades(academicYear, semester);
          if (gradesData && gradesData.length > 0) {
            // Map API grades to our format using the helper function
            const formattedGrades = gradesData.map(mapApiGradeToGrade);

            // Update the grades state with the fetched data
            setGrades((prevGrades) => ({
              ...prevGrades,
              [selectedTerm]: formattedGrades,
            }));
          }
        } catch (apiError) {
          console.error("API request failed:", apiError);
          // We'll continue using the sample data
        }

        // Clear the timeout since we've completed the requests
        clearTimeout(timeoutId);
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Failed to load grades. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTerm]);

  // Get the grades for the selected term
  const currentGrades = grades[selectedTerm] || [];

  // Calculate GPA for the current term
  const termGPA = calculateGPA(currentGrades);

  // Calculate cumulative GPA
  const cumulativeGPA = gpaHistory[gpaHistory.length - 1]?.gpa || 0;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Loading size="large" text="Loading your academic records..." />
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
            href="/student/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Academic Grades</span>
        </nav>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Academic Grades
            </h2>
            <p className="text-muted-foreground">
              View and track your academic performance
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

            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select academic term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {term.year} - {term.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Term GPA</CardTitle>
            <CardDescription>
              {academicTerms.find((t) => t.id === selectedTerm)?.year} -{" "}
              {academicTerms.find((t) => t.id === selectedTerm)?.semester}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{termGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {getLetterGrade(termGPA * 25)} equivalent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cumulative GPA</CardTitle>
            <CardDescription>Overall academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{cumulativeGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {getLetterGrade(cumulativeGPA * 25)} equivalent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Units Completed</CardTitle>
            <CardDescription>Total credit units earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {Object.values(grades)
                .flat()
                .reduce(
                  (sum, grade) =>
                    grade.status === "passed" ? sum + grade.units : sum,
                  0
                )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of{" "}
              {Object.values(grades)
                .flat()
                .reduce((sum, grade) => sum + grade.units, 0)}{" "}
              attempted
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Grades</TabsTrigger>
          <TabsTrigger value="history">Grade History</TabsTrigger>
          <TabsTrigger value="trends">GPA Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Grades</CardTitle>
              <CardDescription>
                {terms.find((t) => t.id === selectedTerm)?.year} -{" "}
                {terms.find((t) => t.id === selectedTerm)?.semester}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Midterm</TableHead>
                    <TableHead>Finals</TableHead>
                    <TableHead>Final Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGrades.length > 0 ? (
                    currentGrades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">
                          {grade.courseCode}
                        </TableCell>
                        <TableCell>{grade.courseName}</TableCell>
                        <TableCell>{grade.units}</TableCell>
                        <TableCell>
                          {grade.midterm !== null ? grade.midterm : "-"}
                        </TableCell>
                        <TableCell>
                          {grade.finals !== null ? grade.finals : "-"}
                        </TableCell>
                        <TableCell>
                          {grade.finalGrade !== null ? (
                            <div className="flex items-center gap-2">
                              <span>{grade.finalGrade}</span>
                              <span className="text-xs text-muted-foreground">
                                ({grade.letterGrade})
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(grade.status)}>
                            {grade.status.charAt(0).toUpperCase() +
                              grade.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <div className="rounded-full bg-muted p-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6 text-muted-foreground"
                            >
                              <path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1" />
                              <path d="M14 15V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h4" />
                              <path d="M9 2v4" />
                              <path d="M9 15v2" />
                              <path d="M9 20v2" />
                            </svg>
                          </div>
                          <div className="text-xl font-medium">
                            No grades found
                          </div>
                          <div className="text-sm text-muted-foreground max-w-md">
                            No grades are available for this academic term.
                            Grades will appear here once they are submitted by
                            your instructors.
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade History</CardTitle>
              <CardDescription>All courses taken</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Academic Term</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Final Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(grades).flat().length > 0 ? (
                    Object.entries(grades).flatMap(([termId, gradesList]) => {
                      const term = terms.find((t) => t.id === termId);
                      return gradesList.map((grade) => (
                        <TableRow key={`${termId}-${grade.id}`}>
                          <TableCell>
                            {term?.year} {term?.semester}
                          </TableCell>
                          <TableCell className="font-medium">
                            {grade.courseCode}
                          </TableCell>
                          <TableCell>{grade.courseName}</TableCell>
                          <TableCell>{grade.units}</TableCell>
                          <TableCell>
                            {grade.finalGrade !== null ? (
                              <div className="flex items-center gap-2">
                                <span>{grade.finalGrade}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({grade.letterGrade})
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(grade.status)}>
                              {grade.status.charAt(0).toUpperCase() +
                                grade.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ));
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <div className="rounded-full bg-muted p-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6 text-muted-foreground"
                            >
                              <path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1" />
                              <path d="M14 15V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h4" />
                              <path d="M9 2v4" />
                              <path d="M9 15v2" />
                              <path d="M9 20v2" />
                            </svg>
                          </div>
                          <div className="text-xl font-medium">
                            No grade history found
                          </div>
                          <div className="text-sm text-muted-foreground max-w-md">
                            Your academic history will appear here once you have
                            completed courses and received grades.
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>GPA Trends</CardTitle>
              <CardDescription>
                Your academic performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid gap-4 grid-cols-5">
                  {gpaHistory.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        {item.term}
                      </div>
                      <div className="relative w-full">
                        <div
                          className="h-40 w-4 mx-auto bg-muted overflow-hidden rounded-full"
                          aria-hidden="true"
                        >
                          <div
                            className="bg-primary h-full w-full origin-bottom transition-all duration-500"
                            style={{ transform: `scaleY(${item.gpa / 4})` }}
                          />
                        </div>
                        <div className="mt-2 text-center font-medium">
                          {item.gpa.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-2">GPA Summary</h4>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Starting GPA
                      </dt>
                      <dd className="text-2xl font-bold">
                        {gpaHistory[0].gpa.toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Current GPA
                      </dt>
                      <dd className="text-2xl font-bold">
                        {gpaHistory[gpaHistory.length - 1].gpa.toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Improvement
                      </dt>
                      <dd className="text-2xl font-bold text-green-600">
                        +
                        {(
                          gpaHistory[gpaHistory.length - 1].gpa -
                          gpaHistory[0].gpa
                        ).toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Academic Standing
                      </dt>
                      <dd className="text-lg font-medium">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Good Standing
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
