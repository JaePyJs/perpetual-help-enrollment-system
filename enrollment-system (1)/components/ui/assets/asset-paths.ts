/**
 * Asset Paths Configuration
 *
 * This file centralizes all asset paths used throughout the application.
 * Update paths here to change assets application-wide.
 */

// Branding Assets
export const brandingAssets = {
  // College logo variants
  logo: {
    full: "/images/branding/phcm-logo-full.svg",
    white: "/images/branding/phcm-logo-white.svg",
    simplified: "/images/branding/phcm-logo-simplified.svg",
    favicon: "/favicon.ico",
    appIcon: "/images/branding/phcm-app-icon.png",
  },
  // Brand patterns and textures
  patterns: {
    header: "/images/branding/header-pattern.svg",
    card: "/images/branding/card-pattern.svg",
    sidebar: "/images/branding/sidebar-pattern.svg",
  },
}

// User Interface Icons
// These could be replaced with an icon library like Lucide React
export const uiIcons = {
  // Navigation icons
  navigation: {
    dashboard: "/images/icons/dashboard.svg",
    courses: "/images/icons/courses.svg",
    grades: "/images/icons/grades.svg",
    calendar: "/images/icons/calendar.svg",
    profile: "/images/icons/profile.svg",
    settings: "/images/icons/settings.svg",
    financial: "/images/icons/financial.svg",
    enrollment: "/images/icons/enrollment.svg",
  },
  // Action icons
  actions: {
    add: "/images/icons/add.svg",
    edit: "/images/icons/edit.svg",
    delete: "/images/icons/delete.svg",
    save: "/images/icons/save.svg",
    cancel: "/images/icons/cancel.svg",
    search: "/images/icons/search.svg",
    filter: "/images/icons/filter.svg",
    sort: "/images/icons/sort.svg",
    download: "/images/icons/download.svg",
    upload: "/images/icons/upload.svg",
  },
  // Status indicators
  status: {
    success: "/images/icons/status-success.svg",
    warning: "/images/icons/status-warning.svg",
    error: "/images/icons/status-error.svg",
    info: "/images/icons/status-info.svg",
    pending: "/images/icons/status-pending.svg",
  },
  // Feature icons
  features: {
    academic: "/images/icons/academic.svg",
    attendance: "/images/icons/attendance.svg",
    payment: "/images/icons/payment.svg",
    schedule: "/images/icons/schedule.svg",
    notification: "/images/icons/notification.svg",
    report: "/images/icons/report.svg",
  },
}

// Illustrations
export const illustrations = {
  // Empty states
  emptyStates: {
    noResults: "/images/illustrations/no-results.svg",
    noCourses: "/images/illustrations/no-courses.svg",
    noGrades: "/images/illustrations/no-grades.svg",
    noSchedule: "/images/illustrations/no-schedule.svg",
  },
  // Success/completion
  success: {
    enrollmentComplete: "/images/illustrations/enrollment-complete.svg",
    paymentSuccess: "/images/illustrations/payment-success.svg",
    registrationComplete: "/images/illustrations/registration-complete.svg",
  },
  // Error states
  error: {
    generalError: "/images/illustrations/general-error.svg",
    paymentError: "/images/illustrations/payment-error.svg",
    serverError: "/images/illustrations/server-error.svg",
  },
  // Onboarding
  onboarding: {
    welcome: "/images/illustrations/welcome.svg",
    studentGuide: "/images/illustrations/student-guide.svg",
    teacherGuide: "/images/illustrations/teacher-guide.svg",
    adminGuide: "/images/illustrations/admin-guide.svg",
  },
}

// Avatar Images
export const avatars = {
  // Default profile pictures
  defaults: {
    student: "/images/avatars/default-student.svg",
    teacher: "/images/avatars/default-teacher.svg",
    admin: "/images/avatars/default-admin.svg",
  },
  // Placeholder course images
  courses: {
    default: "/images/avatars/default-course.svg",
    computerScience: "/images/avatars/course-cs.svg",
    business: "/images/avatars/course-business.svg",
    arts: "/images/avatars/course-arts.svg",
    science: "/images/avatars/course-science.svg",
    engineering: "/images/avatars/course-engineering.svg",
  },
}

// Background Elements
export const backgrounds = {
  // Header/hero backgrounds
  headers: {
    main: "/images/backgrounds/header-main.svg",
    student: "/images/backgrounds/header-student.svg",
    teacher: "/images/backgrounds/header-teacher.svg",
    admin: "/images/backgrounds/header-admin.svg",
  },
  // Card and section backgrounds
  cards: {
    light: "/images/backgrounds/card-light.svg",
    dark: "/images/backgrounds/card-dark.svg",
    primary: "/images/backgrounds/card-primary.svg",
    secondary: "/images/backgrounds/card-secondary.svg",
  },
  // Decorative elements
  decorative: {
    dots: "/images/backgrounds/decorative-dots.svg",
    waves: "/images/backgrounds/decorative-waves.svg",
    grid: "/images/backgrounds/decorative-grid.svg",
  },
}

// Photo Assets
export const photos = {
  // Campus imagery
  campus: {
    main: "/images/photos/campus-main.jpg",
    library: "/images/photos/campus-library.jpg",
    classroom: "/images/photos/campus-classroom.jpg",
    laboratory: "/images/photos/campus-laboratory.jpg",
  },
  // Academic-themed photos
  academic: {
    studying: "/images/photos/academic-studying.jpg",
    graduation: "/images/photos/academic-graduation.jpg",
    lecture: "/images/photos/academic-lecture.jpg",
    research: "/images/photos/academic-research.jpg",
  },
  // Diverse student/teacher imagery
  people: {
    students: "/images/photos/people-students.jpg",
    teachers: "/images/photos/people-teachers.jpg",
    diversity: "/images/photos/people-diversity.jpg",
    collaboration: "/images/photos/people-collaboration.jpg",
  },
}
