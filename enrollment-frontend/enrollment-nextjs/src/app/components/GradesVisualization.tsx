"use client";

import React, { useState, useEffect } from "react";
import { useSupabaseData } from "@/lib/useSupabaseData";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

interface GradeData {
  id: string;
  course_code: string;
  course_name: string;
  semester: string;
  grade: number;
  credits: number;
  status: string;
  year: number;
}

interface SemesterGrades {
  semester: string;
  year: number;
  courses: GradeData[];
  gpa: number;
}

/**
 * GradesVisualization Component
 * 
 * Displays student grades with visualization elements:
 * - Semester breakdown
 * - GPA calculation
 * - Grade distribution chart
 * - Performance trends
 * 
 * @param studentId - The ID of the student to display grades for
 */
export default function GradesVisualization({ studentId }: { studentId: string }) {
  const [semesters, setSemesters] = useState<SemesterGrades[]>([]);
  const [cumulativeGPA, setCumulativeGPA] = useState<number>(0);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  // Fetch grades data from Supabase
  const {
    data: gradesData,
    loading,
    error,
  } = useSupabaseData<GradeData>({
    table: "student_grades",
    match: { student_id: studentId },
    order: { column: "year", ascending: false },
  });

  // Process grades data when it changes
  useEffect(() => {
    if (!gradesData) return;

    // Group grades by semester
    const semesterMap = new Map<string, GradeData[]>();
    
    gradesData.forEach(grade => {
      const key = `${grade.semester} ${grade.year}`;
      if (!semesterMap.has(key)) {
        semesterMap.set(key, []);
      }
      semesterMap.get(key)?.push(grade);
    });

    // Calculate GPA for each semester
    const semesterGrades: SemesterGrades[] = [];
    let totalGradePoints = 0;
    let totalCredits = 0;

    semesterMap.forEach((courses, key) => {
      let semesterGradePoints = 0;
      let semesterCredits = 0;
      
      courses.forEach(course => {
        semesterGradePoints += course.grade * course.credits;
        semesterCredits += course.credits;
        
        totalGradePoints += course.grade * course.credits;
        totalCredits += course.credits;
      });
      
      const [semester, yearStr] = key.split(' ');
      const year = parseInt(yearStr);
      
      semesterGrades.push({
        semester,
        year,
        courses,
        gpa: semesterCredits > 0 ? semesterGradePoints / semesterCredits : 0
      });
    });

    // Sort semesters by year and term
    semesterGrades.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      
      const semesterOrder = { 'Spring': 1, 'Summer': 2, 'Fall': 3 };
      return (semesterOrder[b.semester as keyof typeof semesterOrder] || 0) - 
             (semesterOrder[a.semester as keyof typeof semesterOrder] || 0);
    });

    // Calculate cumulative GPA
    const overallGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    
    setSemesters(semesterGrades);
    setCumulativeGPA(overallGPA);
    
    // Set the most recent semester as selected by default
    if (semesterGrades.length > 0 && !selectedSemester) {
      setSelectedSemester(`${semesterGrades[0].semester} ${semesterGrades[0].year}`);
    }
  }, [gradesData, selectedSemester]);

  // Get the currently selected semester data
  const currentSemester = selectedSemester 
    ? semesters.find(s => `${s.semester} ${s.year}` === selectedSemester)
    : semesters[0];

  // Handle loading and error states
  if (loading) return <Loading size="medium" message="Loading grades data..." />;
  if (error) return <ErrorMessage message={`Error loading grades: ${error}`} />;
  if (!gradesData || gradesData.length === 0) {
    return (
      <div className="card p-4">
        <p>No grades data available. Please contact your academic advisor.</p>
      </div>
    );
  }

  // Get letter grade from numeric grade
  const getLetterGrade = (grade: number): string => {
    if (grade >= 4.0) return 'A';
    if (grade >= 3.7) return 'A-';
    if (grade >= 3.3) return 'B+';
    if (grade >= 3.0) return 'B';
    if (grade >= 2.7) return 'B-';
    if (grade >= 2.3) return 'C+';
    if (grade >= 2.0) return 'C';
    if (grade >= 1.7) return 'C-';
    if (grade >= 1.3) return 'D+';
    if (grade >= 1.0) return 'D';
    return 'F';
  };

  // Get color class based on grade
  const getGradeColorClass = (grade: number): string => {
    if (grade >= 3.7) return 'text-green-600 dark:text-green-400';
    if (grade >= 3.0) return 'text-green-500 dark:text-green-300';
    if (grade >= 2.0) return 'text-yellow-500 dark:text-yellow-300';
    if (grade >= 1.0) return 'text-orange-500 dark:text-orange-300';
    return 'text-red-500 dark:text-red-300';
  };

  return (
    <div className="grades-visualization">
      {/* GPA Summary */}
      <div className="mb-6">
        <div className="card p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Cumulative GPA</h3>
              <div className="flex items-center justify-center md:justify-start">
                <span className={`text-4xl font-bold ${getGradeColorClass(cumulativeGPA)}`}>
                  {cumulativeGPA.toFixed(2)}
                </span>
                <span className={`ml-2 text-xl ${getGradeColorClass(cumulativeGPA)}`}>
                  ({getLetterGrade(cumulativeGPA)})
                </span>
              </div>
            </div>
            
            {/* Semester Selector */}
            <div>
              <label htmlFor="semester-select" className="block text-sm font-medium mb-1">
                Select Semester
              </label>
              <select
                id="semester-select"
                className="form-select rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                value={selectedSemester || ''}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                {semesters.map((sem) => (
                  <option key={`${sem.semester}-${sem.year}`} value={`${sem.semester} ${sem.year}`}>
                    {sem.semester} {sem.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Current Semester Grades */}
      {currentSemester && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">
            {currentSemester.semester} {currentSemester.year} Grades
          </h3>
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {currentSemester.courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.course_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.course_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getGradeColorClass(course.grade)}>
                        {course.grade.toFixed(1)} ({getLetterGrade(course.grade)})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.status === 'Completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : course.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right font-medium">
                    Semester GPA:
                  </td>
                  <td colSpan={2} className={`px-6 py-3 font-bold ${getGradeColorClass(currentSemester.gpa)}`}>
                    {currentSemester.gpa.toFixed(2)} ({getLetterGrade(currentSemester.gpa)})
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
