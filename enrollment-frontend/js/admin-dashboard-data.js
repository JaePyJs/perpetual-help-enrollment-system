// Sample data for Admin Dashboard
// This simulates the data that would typically come from an API

const adminData = {
    id: "admin-001",
    name: "Admin User",
    email: "admin@uphsl.edu.ph",
    role: "Administrator",
    lastLogin: "2025-05-09T09:30:00Z",
    
    // System statistics
    stats: {
        totalStudents: 2450,
        totalTeachers: 125,
        totalDepartments: 8,
        totalSubjects: 215,
        activeEnrollments: 1850,
        pendingEnrollments: 320,
        pendingPayments: 480
    },
    
    // Department data
    departments: [
        {
            id: "dept-001",
            code: "BSIT",
            name: "Bachelor of Science in Information Technology",
            head: "Dr. Maria Santos",
            students: 420,
            teachers: 18,
            subjects: 32
        },
        {
            id: "dept-002",
            code: "BSCS",
            name: "Bachelor of Science in Computer Science",
            head: "Dr. Anna Liza Villanueva",
            students: 310,
            teachers: 15,
            subjects: 28
        },
        {
            id: "dept-003",
            code: "BSN",
            name: "Bachelor of Science in Nursing",
            head: "Dr. Elena Reyes",
            students: 380,
            teachers: 22,
            subjects: 35
        },
        {
            id: "dept-004",
            code: "BSBA",
            name: "Bachelor of Science in Business Administration",
            head: "Dr. Roberto Lim",
            students: 405,
            teachers: 19,
            subjects: 30
        },
        {
            id: "dept-005",
            code: "BSED",
            name: "Bachelor of Science in Education",
            head: "Dr. Ana Tan",
            students: 350,
            teachers: 17,
            subjects: 28
        },
        {
            id: "dept-006",
            code: "BSCE",
            name: "Bachelor of Science in Civil Engineering",
            head: "Dr. Carlos Mendoza",
            students: 290,
            teachers: 14,
            subjects: 32
        },
        {
            id: "dept-007",
            code: "BSIE",
            name: "Bachelor of Science in Industrial Engineering",
            head: "Dr. Patricia Santos",
            students: 195,
            teachers: 12,
            subjects: 30
        },
        {
            id: "dept-008",
            code: "BSPT",
            name: "Bachelor of Science in Physical Therapy",
            head: "Dr. Miguel Garcia",
            students: 210,
            teachers: 13,
            subjects: 29
        }
    ],
    
    // User management sample data
    users: [
        {
            id: "m23-1470-578",
            name: "Juan Dela Cruz",
            email: "m23-1470-578@manila.uphsl.edu.ph",
            role: "Student",
            department: "BSIT",
            status: "Active",
            lastLogin: "2025-05-08T14:20:00Z"
        },
        {
            id: "m23-1471-590",
            name: "Maria Garcia",
            email: "m23-1471-590@manila.uphsl.edu.ph",
            role: "Student",
            department: "BSIT",
            status: "Active",
            lastLogin: "2025-05-08T10:15:00Z"
        },
        {
            id: "t2023-0045",
            name: "Prof. Maria Santos",
            email: "m.santos@faculty.uphsl.edu.ph",
            role: "Teacher",
            department: "BSIT",
            status: "Active",
            lastLogin: "2025-05-08T16:30:00Z"
        },
        {
            id: "t2021-0032",
            name: "Prof. Jose Rizal",
            email: "j.rizal@faculty.uphsl.edu.ph",
            role: "Teacher",
            department: "BSED",
            status: "Active",
            lastLogin: "2025-05-07T11:45:00Z"
        },
        {
            id: "admin-002",
            name: "Admin Assistant",
            email: "admin2@uphsl.edu.ph",
            role: "Administrator",
            department: "Admin",
            status: "Active",
            lastLogin: "2025-05-08T08:20:00Z"
        }
    ],
    
    // Subject management sample data
    subjects: [
        {
            id: "subj-001",
            code: "IT101",
            title: "Computer Programming 1",
            department: "BSIT",
            units: 3,
            prerequisites: [],
            sections: 4,
            enrolledStudents: 120,
            status: "Active"
        },
        {
            id: "subj-002",
            code: "IT102",
            title: "Computer Programming 2",
            department: "BSIT",
            units: 3,
            prerequisites: ["IT101"],
            sections: 3,
            enrolledStudents: 95,
            status: "Active"
        },
        {
            id: "subj-003",
            code: "IT201",
            title: "Data Structures and Algorithms",
            department: "BSIT",
            units: 3,
            prerequisites: ["IT102"],
            sections: 2,
            enrolledStudents: 85,
            status: "Active"
        },
        {
            id: "subj-004",
            code: "IT202",
            title: "Information Management",
            department: "BSIT",
            units: 3,
            prerequisites: ["IT102"],
            sections: 2,
            enrolledStudents: 82,
            status: "Active"
        },
        {
            id: "subj-005",
            code: "IT301",
            title: "Web Application Development",
            department: "BSIT",
            units: 3,
            prerequisites: ["IT201", "IT202"],
            sections: 1,
            enrolledStudents: 40,
            status: "Active"
        }
    ],
    
    // Recent activity
    recentActivity: [
        {
            description: "New student enrolled in BSIT department",
            timestamp: "2025-05-08T16:30:00Z",
            category: "enrollment"
        },
        {
            description: "Updated curriculum for BSCE program",
            timestamp: "2025-05-08T14:20:00Z",
            category: "curriculum"
        },
        {
            description: "New teacher account created for BSBA department",
            timestamp: "2025-05-08T11:45:00Z",
            category: "user-management"
        },
        {
            description: "System backup completed successfully",
            timestamp: "2025-05-08T03:00:00Z",
            category: "system"
        },
        {
            description: "End of semester report generated",
            timestamp: "2025-05-07T17:15:00Z",
            category: "report"
        }
    ],
    
    // Enrollment statistics
    enrollmentStats: {
        currentSemester: "1st Semester",
        academicYear: "2024-2025",
        totalEnrollments: 2170,
        byDepartment: [
            { department: "BSIT", count: 420 },
            { department: "BSCS", count: 310 },
            { department: "BSN", count: 380 },
            { department: "BSBA", count: 405 },
            { department: "BSED", count: 350 },
            { department: "BSCE", count: 290 },
            { department: "BSIE", count: 195 },
            { department: "BSPT", count: 210 }
        ],
        byYearLevel: [
            { yearLevel: 1, count: 650 },
            { yearLevel: 2, count: 580 },
            { yearLevel: 3, count: 520 },
            { yearLevel: 4, count: 420 }
        ],
        byStatus: [
            { status: "Confirmed", count: 1850 },
            { status: "Pending", count: 320 }
        ],
        byPaymentStatus: [
            { status: "Paid", count: 1650 },
            { status: "Partially Paid", count: 200 },
            { status: "Unpaid", count: 320 }
        ]
    }
};
