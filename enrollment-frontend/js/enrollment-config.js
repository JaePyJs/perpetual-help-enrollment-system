/**
 * Enrollment System Configuration
 * Perpetual Help College of Manila
 */

const EnrollmentSystemConfig = {
  // Academic Years and Terms
  academicCalendar: {
    currentYear: "2025-2026",
    currentTerm: "First Semester",
    terms: [
      {
        id: "1st-sem",
        name: "First Semester",
        startDate: "2025-06-15",
        endDate: "2025-10-15",
      },
      {
        id: "2nd-sem",
        name: "Second Semester",
        startDate: "2025-11-01",
        endDate: "2026-03-15",
      },
      {
        id: "summer",
        name: "Summer Term",
        startDate: "2026-04-01",
        endDate: "2026-05-31",
      },
    ],
    enrollmentPeriods: [
      {
        term: "1st-sem",
        startDate: "2025-05-15",
        endDate: "2025-06-10",
        type: "Regular",
      },
      {
        term: "1st-sem",
        startDate: "2025-06-11",
        endDate: "2025-06-20",
        type: "Late",
        penalty: 1000,
      },
      {
        term: "2nd-sem",
        startDate: "2025-10-15",
        endDate: "2025-10-31",
        type: "Regular",
      },
      {
        term: "2nd-sem",
        startDate: "2025-11-01",
        endDate: "2025-11-10",
        type: "Late",
        penalty: 1000,
      },
      {
        term: "summer",
        startDate: "2026-03-15",
        endDate: "2026-03-31",
        type: "Regular",
      },
    ],
    holidays: [
      { date: "2025-08-21", name: "Ninoy Aquino Day" },
      { date: "2025-08-30", name: "National Heroes Day" },
      { date: "2025-11-01", name: "All Saints' Day" },
      { date: "2025-11-30", name: "Bonifacio Day" },
      { date: "2025-12-25", name: "Christmas Day" },
      { date: "2025-12-30", name: "Rizal Day" },
      { date: "2026-01-01", name: "New Year's Day" },
      { date: "2026-02-25", name: "EDSA Revolution Anniversary" },
    ],
  },

  // Colleges and Departments
  colleges: [
    {
      id: "ccs",
      name: "College of Computer Studies",
      departments: [
        { id: "it", name: "Information Technology" },
        { id: "cs", name: "Computer Science" },
      ],
      programs: [
        {
          id: "bsit",
          name: "BS Information Technology",
          departmentId: "it",
          years: 4,
        },
        {
          id: "bscs",
          name: "BS Computer Science",
          departmentId: "cs",
          years: 4,
        },
      ],
    },
    {
      id: "cba",
      name: "College of Business Administration",
      departments: [
        { id: "acct", name: "Accountancy" },
        { id: "fmgt", name: "Financial Management" },
        { id: "mktg", name: "Marketing" },
      ],
      programs: [
        {
          id: "bsba",
          name: "BS Business Administration",
          departmentId: "fmgt",
          years: 4,
        },
        { id: "bsa", name: "BS Accountancy", departmentId: "acct", years: 4 },
      ],
    },
    {
      id: "cas",
      name: "College of Arts and Sciences",
      departments: [
        { id: "eng", name: "English" },
        { id: "psyc", name: "Psychology" },
        { id: "pols", name: "Political Science" },
      ],
      programs: [
        { id: "ab-eng", name: "AB English", departmentId: "eng", years: 4 },
        {
          id: "bs-psyc",
          name: "BS Psychology",
          departmentId: "psyc",
          years: 4,
        },
      ],
    },
    {
      id: "con",
      name: "College of Nursing",
      departments: [{ id: "nurs", name: "Nursing" }],
      programs: [
        { id: "bsn", name: "BS Nursing", departmentId: "nurs", years: 4 },
      ],
    },
  ],

  // Tuition and Fees
  tuitionAndFees: {
    tuitionPerUnit: 1500,
    miscFees: [
      { id: "reg-fee", name: "Registration Fee", amount: 3000, perTerm: true },
      { id: "lib-fee", name: "Library Fee", amount: 1500, perTerm: true },
      { id: "tech-fee", name: "Technology Fee", amount: 2000, perTerm: true },
      {
        id: "lab-fee",
        name: "Laboratory Fee",
        amount: 2500,
        perCourse: true,
        appliesToCourses: ["lab"],
      },
      {
        id: "id-fee",
        name: "ID Fee",
        amount: 350,
        oneTime: true,
        appliesToYear: 1,
      },
      { id: "dev-fee", name: "Development Fee", amount: 3000, perTerm: true },
      { id: "guid-fee", name: "Guidance Fee", amount: 500, perTerm: true },
      { id: "med-fee", name: "Medical Fee", amount: 800, perTerm: true },
      { id: "ath-fee", name: "Athletic Fee", amount: 700, perTerm: true },
    ],
    paymentSchemes: [
      {
        id: "full",
        name: "Full Payment",
        discount: 0.05,
        description: "5% discount on tuition fee",
      },
      {
        id: "install",
        name: "Installment",
        installments: 4,
        surcharge: 0.03,
        description: "Pay in 4 installments with 3% surcharge",
      },
    ],
    scholarships: [
      {
        id: "academic",
        name: "Academic Excellence",
        coverage: 1.0,
        requirements: ["GWA of 1.25 or higher", "No grade below 2.0"],
      },
      {
        id: "sports",
        name: "Athletic Scholarship",
        coverage: 0.75,
        requirements: ["Member of varsity team", "GWA of 2.0 or higher"],
      },
      {
        id: "financial",
        name: "Financial Aid",
        coverage: 0.5,
        requirements: ["Family income certification", "GWA of 2.5 or higher"],
      },
      {
        id: "merit",
        name: "Merit Scholarship",
        coverage: 0.25,
        requirements: ["GWA of 1.75 or higher"],
      },
    ],
    discounts: [
      {
        id: "siblings",
        name: "Siblings Discount",
        amount: 0.1,
        description: "10% discount for students with siblings enrolled",
      },
      {
        id: "alumni",
        name: "Alumni Dependent",
        amount: 0.1,
        description: "10% discount for children of alumni",
      },
    ],
  },

  // Enrollment Rules
  enrollmentRules: {
    maxUnitsPerSemester: 24,
    maxUnitsForProbation: 18,
    minUnitsForFullTime: 12,
    maxFailedSubjectsBeforeProbation: 2,
    maxProbationTerms: 2,
    retentionGPA: 2.0, // Minimum GPA to avoid academic probation
    allowedOverload: 3, // Additional units allowed with approval
    addDropPeriodDays: 7, // Number of days after start of classes
    lateEnrollmentGracePeriod: 5, // Days after official enrollment period
  },

  // Course Statuses
  courseStatuses: [
    { id: "open", name: "Open", description: "Course is open for enrollment" },
    {
      id: "closed",
      name: "Closed",
      description: "Course has reached capacity",
    },
    {
      id: "waitlist",
      name: "Waitlisted",
      description: "Course is full but waitlist is available",
    },
    {
      id: "cancelled",
      name: "Cancelled",
      description: "Course has been cancelled",
    },
    {
      id: "pending",
      name: "Pending",
      description: "Course is awaiting approval or confirmation",
    },
  ],

  // Enrollment Statuses
  enrollmentStatuses: [
    {
      id: "pending",
      name: "Pending",
      description: "Enrollment is being processed",
    },
    {
      id: "approved",
      name: "Approved",
      description: "Enrollment has been approved",
    },
    {
      id: "rejected",
      name: "Rejected",
      description: "Enrollment has been rejected",
    },
    {
      id: "waitlisted",
      name: "Waitlisted",
      description: "Student is on waitlist for one or more courses",
    },
    {
      id: "completed",
      name: "Completed",
      description: "Enrollment process is complete",
    },
    {
      id: "dropped",
      name: "Dropped",
      description: "Student has dropped the course",
    },
    {
      id: "withdrawn",
      name: "Withdrawn",
      description: "Student has withdrawn from the term",
    },
  ],

  // Student Statuses
  studentStatuses: [
    {
      id: "active",
      name: "Active",
      description: "Student is actively enrolled",
    },
    {
      id: "inactive",
      name: "Inactive",
      description: "Student is not currently enrolled",
    },
    {
      id: "probation",
      name: "Academic Probation",
      description: "Student is on academic probation",
    },
    {
      id: "dismissed",
      name: "Dismissed",
      description: "Student has been dismissed",
    },
    {
      id: "graduated",
      name: "Graduated",
      description: "Student has graduated",
    },
    {
      id: "leave",
      name: "Leave of Absence",
      description: "Student is on approved leave",
    },
    {
      id: "suspended",
      name: "Suspended",
      description: "Student is temporarily suspended",
    },
  ],
};

// Export the configuration
if (typeof module !== "undefined" && module.exports) {
  module.exports = EnrollmentSystemConfig;
}
