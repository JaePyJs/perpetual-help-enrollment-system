// Sample data for teacher courses and student grades
// This simulates the data that would typically come from an API

const teacherData = {
    id: "t2023-0045",
    name: "Prof. Maria Santos",
    department: "Information Technology",
    email: "m.santos@faculty.uphsl.edu.ph",
    courses: [
        {
            id: "IT201-A",
            code: "IT201",
            name: "Data Structures and Algorithms",
            section: "A",
            schedule: "MWF 9:00-10:30 AM",
            room: "TECH-301",
            semester: "1st Semester",
            academicYear: "2024-2025",
            enrolledCount: 32,
            capacity: 35,
            status: "active"
        },
        {
            id: "IT202-B",
            code: "IT202",
            name: "Information Management",
            section: "B",
            schedule: "TTH 1:00-2:30 PM",
            room: "TECH-405",
            semester: "1st Semester",
            academicYear: "2024-2025",
            enrolledCount: 28,
            capacity: 30,
            status: "active"
        },
        {
            id: "IT301-A",
            code: "IT301",
            name: "Web Application Development",
            section: "A",
            schedule: "MWF 1:00-2:30 PM",
            room: "TECH-302",
            semester: "1st Semester",
            academicYear: "2024-2025",
            enrolledCount: 25,
            capacity: 30,
            status: "active"
        },
        {
            id: "GE103-C",
            code: "GE103",
            name: "Purposive Communication",
            section: "C",
            schedule: "TTH 9:00-10:30 AM",
            room: "GEN-201",
            semester: "1st Semester",
            academicYear: "2024-2025",
            enrolledCount: 30,
            capacity: 30,
            status: "active"
        }
    ],
    students: [
        {
            id: "m23-1470-578",
            name: "Juan Dela Cruz",
            email: "m23-1470-578@manila.uphsl.edu.ph",
            program: "BS Information Technology",
            yearLevel: 2,
            courses: ["IT201-A", "IT301-A", "GE103-C"]
        },
        {
            id: "m23-1471-590",
            name: "Maria Garcia",
            email: "m23-1471-590@manila.uphsl.edu.ph",
            program: "BS Information Technology",
            yearLevel: 2,
            courses: ["IT201-A", "IT202-B", "IT301-A", "GE103-C"]
        },
        {
            id: "m23-1472-601",
            name: "Miguel Tan",
            email: "m23-1472-601@manila.uphsl.edu.ph",
            program: "BS Information Technology",
            yearLevel: 2,
            courses: ["IT201-A", "IT202-B", "GE103-C"]
        },
        {
            id: "m22-1380-421",
            name: "Carlo Santos",
            email: "m22-1380-421@manila.uphsl.edu.ph",
            program: "BS Information Technology",
            yearLevel: 3,
            courses: ["IT202-B", "IT301-A", "GE103-C"]
        },
        {
            id: "m22-1385-482",
            name: "Sophia Reyes",
            email: "m22-1385-482@manila.uphsl.edu.ph",
            program: "BS Information Technology",
            yearLevel: 3,
            courses: ["IT301-A"]
        },
        {
            id: "m23-1475-612",
            name: "Ana Reyes",
            email: "m23-1475-612@manila.uphsl.edu.ph",
            program: "BS Information Technology",
            yearLevel: 2,
            courses: ["IT201-A"]
        },
        {
            id: "m23-1480-625",
            name: "Paolo Mendoza",
            email: "m23-1480-625@manila.uphsl.edu.ph",
            program: "BS Information Technology",
            yearLevel: 2,
            courses: ["IT201-A"]
        },
        {
            id: "m24-1305-510",
            name: "Sofia Lim",
            email: "m24-1305-510@manila.uphsl.edu.ph",
            program: "BS Information Technology",
            yearLevel: 1,
            courses: ["IT201-A"]
        }
    ],
    // Sample grading data
    grades: {
        "IT201-A": {
            courseName: "Data Structures and Algorithms",
            gradingComponents: {
                assignments: 0.20,
                quizzes: 0.20,
                midterm: 0.25,
                finals: 0.35
            },
            section: "A",
            schedule: "MWF 9:00-10:30 AM",
            students: [
                {
                    studentId: "m23-1470-578",
                    studentName: "Juan Dela Cruz",
                    assignments: 88,
                    quizzes: 92,
                    midterm: 85,
                    finals: 87,
                    comments: "Strong understanding of algorithms but needs to improve on time complexity concepts.",
                    status: "passing",
                    history: [
                        {
                            timestamp: "2025-04-20T14:30:00Z",
                            assignments: 82,
                            quizzes: 85,
                            midterm: 85,
                            finals: null,
                            comments: "Doing well on practical assignments.",
                            teacher: "Prof. Maria Santos"
                        },
                        {
                            timestamp: "2025-05-05T10:15:00Z",
                            assignments: 88,
                            quizzes: 92,
                            midterm: 85,
                            finals: null,
                            comments: "Quiz scores have improved significantly.",
                            teacher: "Prof. Maria Santos"
                        }
                    ]
                },
                {
                    studentId: "m23-1471-590",
                    studentName: "Maria Garcia",
                    assignments: 91,
                    quizzes: 89,
                    midterm: 93,
                    finals: 95,
                    comments: "Excellent work throughout the semester. Shows exceptional problem-solving abilities.",
                    status: "passing",
                    history: [
                        {
                            timestamp: "2025-04-15T11:20:00Z",
                            assignments: 88,
                            quizzes: 85,
                            midterm: 93,
                            finals: null,
                            comments: "Outstanding midterm performance.",
                            teacher: "Prof. Maria Santos"
                        }
                    ]
                },
                {
                    studentId: "m23-1472-601",
                    studentName: "Miguel Tan",
                    assignments: 82,
                    quizzes: 85,
                    midterm: 80,
                    finals: 78,
                    comments: "Struggling with algorithm optimization concepts. Recommended for tutoring.",
                    status: "passing"
                },
                {
                    studentId: "m23-1475-612",
                    studentName: "Ana Reyes",
                    assignments: 95,
                    quizzes: 93,
                    midterm: 91,
                    finals: 94,
                    comments: "Exceptional student with strong analytical skills.",
                    status: "passing"
                },
                {
                    studentId: "m23-1480-625",
                    studentName: "Paolo Mendoza",
                    assignments: 75,
                    quizzes: 68,
                    midterm: 72,
                    finals: 65,
                    comments: "Having difficulty with the course material. Needs significant improvement.",
                    status: "failing",
                    history: [
                        {
                            timestamp: "2025-04-18T09:45:00Z",
                            assignments: 70,
                            quizzes: 65,
                            midterm: 72,
                            finals: null,
                            comments: "Struggling with basic concepts. Recommended additional study resources.",
                            teacher: "Prof. Maria Santos"
                        }
                    ]
                },
                {
                    studentId: "m24-1305-510",
                    studentName: "Sofia Lim",
                    assignments: 89,
                    quizzes: 87,
                    midterm: 84,
                    finals: 88,
                    comments: "Good progress throughout the semester.",
                    status: "passing"
                },
                {
                    studentId: "m24-1310-522",
                    studentName: "Gabriel Santos",
                    assignments: 83,
                    quizzes: 79,
                    midterm: 81,
                    finals: 83,
                    comments: "Consistent performance, but could improve on theoretical concepts.",
                    status: "passing"
                },
                {
                    studentId: "m24-1315-538",
                    studentName: "Isabella Cruz",
                    assignments: 92,
                    quizzes: 90,
                    midterm: 88,
                    finals: 91,
                    comments: "Strong analytical skills and excellent code quality.",
                    status: "passing"
                }
            ]
        },
        "IT202-B": {
            courseName: "Information Management",
            gradingComponents: {
                assignments: 0.25,
                quizzes: 0.15,
                midterm: 0.30,
                finals: 0.30
            },
            section: "B",
            schedule: "TTH 1:00-2:30 PM",
            students: [
                {
                    studentId: "m23-1470-578",
                    studentName: "Juan Dela Cruz",
                    assignments: 90,
                    quizzes: 88,
                    midterm: 91,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m22-1380-421",
                    studentName: "Carlo Santos",
                    assignments: 85,
                    quizzes: 88,
                    midterm: 82,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m23-1471-590",
                    studentName: "Maria Garcia",
                    assignments: 94,
                    quizzes: 90,
                    midterm: 92,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m23-1472-601",
                    studentName: "Miguel Tan",
                    assignments: 87,
                    quizzes: 84,
                    midterm: 86,
                    finals: null,
                    status: "in-progress"
                }
            ]
        },
        "IT301-A": {
            courseName: "Web Application Development",
            gradingComponents: {
                assignments: 0.30,
                quizzes: 0.15,
                midterm: 0.25,
                finals: 0.30
            },
            section: "A",
            schedule: "MWF 1:00-2:30 PM",
            students: [
                {
                    studentId: "m22-1380-421",
                    studentName: "Carlo Santos",
                    assignments: 95,
                    quizzes: 92,
                    midterm: 88,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m22-1385-482",
                    studentName: "Sophia Reyes",
                    assignments: 98,
                    quizzes: 95,
                    midterm: 94,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m23-1470-578",
                    studentName: "Juan Dela Cruz",
                    assignments: 90,
                    quizzes: 88,
                    midterm: 91,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m23-1471-590",
                    studentName: "Maria Garcia",
                    assignments: 94,
                    quizzes: 90,
                    midterm: 92,
                    finals: null,
                    status: "in-progress"
                }
            ]
        },
        "GE103-C": {
            courseName: "Purposive Communication",
            gradingComponents: {
                assignments: 0.25,
                quizzes: 0.15,
                midterm: 0.30,
                finals: 0.30
            },
            section: "C",
            schedule: "TTH 9:00-10:30 AM",
            students: [
                {
                    studentId: "m23-1471-590",
                    studentName: "Maria Garcia",
                    assignments: 94,
                    quizzes: 90,
                    midterm: 92,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m23-1472-601",
                    studentName: "Miguel Tan",
                    assignments: 87,
                    quizzes: 84,
                    midterm: 86,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m23-1470-578",
                    studentName: "Juan Dela Cruz",
                    assignments: 90,
                    quizzes: 88,
                    midterm: 91,
                    finals: null,
                    status: "in-progress"
                },
                {
                    studentId: "m22-1380-421",
                    studentName: "Carlo Santos",
                    assignments: 85,
                    quizzes: 88,
                    midterm: 82,
                    finals: null,
                    status: "in-progress"
                }
            ]
        }
    },
    // Recent teacher activity
    recentActivity: [
        {
            description: "Finalized grades for IT201-A",
            timestamp: "2025-05-09T08:30:00Z",
            category: "grades"
        },
        {
            description: "Added comments for Maria Garcia's assignment",
            timestamp: "2025-05-08T14:45:00Z",
            category: "student"
        },
        {
            description: "Updated midterm scores for IT301-A",
            timestamp: "2025-05-08T11:20:00Z",
            category: "grades"
        },
        {
            description: "Graded quizzes for IT202-B",
            timestamp: "2025-05-07T16:10:00Z",
            category: "grades"
        },
        {
            description: "Posted announcement for GE103-C",
            timestamp: "2025-05-07T09:05:00Z",
            category: "course"
        },
        {
            description: "Added grade improvement options for Paolo Mendoza",
            timestamp: "2025-05-06T13:25:00Z",
            category: "student"
        },
        {
            description: "Generated performance reports for IT301-A",
            timestamp: "2025-05-06T10:15:00Z",
            category: "reports"
        },
        {
            description: "Reviewed student feedback on teaching methods",
            timestamp: "2025-05-05T15:40:00Z",
            category: "feedback"
        }
    ],
    // Dashboard statistics
    stats: {
        activeCourses: 4,
        totalStudents: 28,
        pendingGrades: 5,
        completedAssignments: 24,
        upcomingDeadlines: 3,
        gradedQuizzes: 18,
        courseCompletion: 85
    }
};
