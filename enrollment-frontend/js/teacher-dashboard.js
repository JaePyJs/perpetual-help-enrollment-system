// Teacher Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    loadTeacherData();
    loadDashboardStats();
    loadRecentActivity();
    loadCourseFilters(); // Load course options in filters
    showContent('home');

    // Set up event listeners for filters
    document.getElementById('semester-filter')?.addEventListener('change', filterCourses);
    document.getElementById('course-search')?.addEventListener('input', filterCourses);
    document.getElementById('student-search')?.addEventListener('input', filterStudents);
    document.getElementById('course-filter')?.addEventListener('change', filterStudents);
    document.getElementById('grade-course-filter')?.addEventListener('change', loadGradeSheet);
    document.getElementById('grading-period')?.addEventListener('change', loadGradeSheet);
});

// Load teacher data from sample data
function loadTeacherData() {
    // In production this would come from an API or localStorage
    document.getElementById('teacher-name').textContent = teacherData.name;
}

// Load dashboard statistics from sample data
function loadDashboardStats() {
    // In production this would fetch from an API
    const stats = teacherData.stats;
    document.getElementById('active-courses').textContent = stats.activeCourses;
    document.getElementById('total-students').textContent = stats.totalStudents;
    document.getElementById('pending-grades').textContent = stats.pendingGrades;
}

// Load recent activity from sample data
function loadRecentActivity() {
    // In production this would fetch from an API
    const activities = teacherData.recentActivity;
    const activityFeed = document.getElementById('activity-feed');
    
    activityFeed.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-content">${activity.description}</div>
            <div class="activity-time">${formatDate(activity.timestamp)}</div>
        </div>
    `).join('');
}

// Show/hide content sections
function showContent(section) {
    document.querySelectorAll('.content-section').forEach(div => {
        div.style.display = 'none';
    });
    document.getElementById(`${section}-content`).style.display = 'block';
    
    if (section === 'courses') {
        loadCourses();
    } else if (section === 'students') {
        loadStudents();
    } else if (section === 'grades') {
        loadGradeSheet();
    }
}

// Load course filters with available courses
function loadCourseFilters() {
    const courseFilter = document.getElementById('course-filter');
    const gradeCourseFilter = document.getElementById('grade-course-filter');
    
    // Clear existing options except the first one
    courseFilter.innerHTML = '<option value="">All Courses</option>';
    gradeCourseFilter.innerHTML = '<option value="">Select Course</option>';
    
    // Add course options
    teacherData.courses.forEach(course => {
        // Add to student filter
        const courseOption = document.createElement('option');
        courseOption.value = course.id;
        courseOption.textContent = `${course.code} - ${course.name} (${course.section})`;
        courseFilter.appendChild(courseOption);
        
        // Add to grade filter
        const gradeOption = document.createElement('option');
        gradeOption.value = course.id;
        gradeOption.textContent = `${course.code} - ${course.name} (${course.section})`;
        gradeCourseFilter.appendChild(gradeOption);
    });
}

// Load courses
function loadCourses() {
    const courses = teacherData.courses;
    const coursesGrid = document.getElementById('courses-grid');
    
    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card" data-semester="${course.semester.split(' ')[0]}">
            <h3>${course.name}</h3>
            <p>${course.code} - Section ${course.section}</p>
            <p>Schedule: ${course.schedule}</p>
            <p>Students: ${course.enrolledCount}/${course.capacity}</p>
            <div class="course-actions">
                <button onclick="viewCourse('${course.id}')">View Details</button>
                <button onclick="manageCourse('${course.id}')">Manage</button>
            </div>
        </div>
    `).join('');
}

// Filter courses
function filterCourses() {
    const semester = document.getElementById('semester-filter').value;
    const searchTerm = document.getElementById('course-search').value.toLowerCase();
    const courses = document.querySelectorAll('.course-card');
    
    courses.forEach(course => {
        const courseContent = course.textContent.toLowerCase();
        const semesterMatch = !semester || course.dataset.semester === semester;
        const searchMatch = !searchTerm || courseContent.includes(searchTerm);
        course.style.display = semesterMatch && searchMatch ? 'block' : 'none';
    });
}

// Load students from sample data
function loadStudents() {
    const students = teacherData.students;
    const studentsList = document.getElementById('students-list');
    const selectedCourse = document.getElementById('course-filter').value;
    
    // Filter students based on course if one is selected
    let filteredStudents = students;
    if (selectedCourse) {
        filteredStudents = students.filter(student => 
            student.courses.includes(selectedCourse)
        );
    }
    
    studentsList.innerHTML = filteredStudents.map(student => `
        <div class="student-item" data-courses="${student.courses.join(',')}">
            <div class="student-info">
                <h3>${student.name}</h3>
                <p>ID: ${student.id}</p>
                <p>${student.email}</p>
                <p>${student.program} - Year ${student.yearLevel}</p>
            </div>
            <div class="student-actions">
                <button onclick="viewStudent('${student.id}')">View Profile</button>
                <button onclick="viewGrades('${student.id}')">View Grades</button>
            </div>
        </div>
    `).join('');
}

// Filter students
function filterStudents() {
    const course = document.getElementById('course-filter').value;
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const students = document.querySelectorAll('.student-item');
    
    students.forEach(student => {
        const studentContent = student.textContent.toLowerCase();
        const courseMatch = !course || student.dataset.course === course;
        const searchMatch = !searchTerm || studentContent.includes(searchTerm);
        student.style.display = courseMatch && searchMatch ? 'flex' : 'none';
    });
}

// Load grade sheet from sample data
function loadGradeSheet() {
    const courseId = document.getElementById('grade-course-filter').value;
    const period = document.getElementById('grading-period').value;
    
    if (!courseId || !period) return;
    
    // Get grades for the selected course
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        const gradeSheet = document.getElementById('grade-sheet');
        gradeSheet.innerHTML = `<div class="no-data">No grade data found for this course.</div>`;
        return;
    }
    
    // Create the grade sheet
    const gradeSheet = document.getElementById('grade-sheet');
    gradeSheet.innerHTML = `
        <div class="grade-info">
            <h2>${courseGrades.courseName}</h2>
            <p>Grading Components: 
               Assignments (${courseGrades.gradingComponents.assignments * 100}%), 
               Quizzes (${courseGrades.gradingComponents.quizzes * 100}%), 
               Midterm (${courseGrades.gradingComponents.midterm * 100}%), 
               Finals (${courseGrades.gradingComponents.finals * 100}%)</p>
        </div>
        <table class="grade-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Assignments</th>
                    <th>Quizzes</th>
                    <th>Midterm</th>
                    <th>Finals</th>
                    <th>Final Grade</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${courseGrades.students.map(student => `
                    <tr>
                        <td>${student.studentName}</td>
                        <td>${student.studentId}</td>
                        <td><input type="number" id="assignments-${student.studentId}" value="${student.assignments}" min="0" max="100"></td>
                        <td><input type="number" id="quizzes-${student.studentId}" value="${student.quizzes}" min="0" max="100"></td>
                        <td><input type="number" id="midterm-${student.studentId}" value="${student.midterm}" min="0" max="100"></td>
                        <td><input type="number" id="finals-${student.studentId}" value="${student.finals || ''}" min="0" max="100"></td>
                        <td id="final-grade-${student.studentId}">${calculateFinalGrade(student, courseGrades.gradingComponents) || '--'}</td>
                        <td><span class="status-badge ${student.status}">${student.status}</span></td>
                        <td>
                            <button onclick="saveGrades('${student.studentId}', '${courseId}')">Save</button>
                            <button onclick="viewStudentDetails('${student.studentId}')">Details</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="grade-actions">
            <button class="primary-btn" onclick="saveAllGrades('${courseId}')">Save All Grades</button>
            <button class="secondary-btn" onclick="generateGradeReport('${courseId}')">Generate Report</button>
        </div>
    `;
    
    // Add event listeners to update final grade on input change
    courseGrades.students.forEach(student => {
        ['assignments', 'quizzes', 'midterm', 'finals'].forEach(component => {
            const input = document.getElementById(`${component}-${student.studentId}`);
            if (input) {
                input.addEventListener('input', () => {
                    updateFinalGrade(student.studentId, courseGrades.gradingComponents, courseId);
                });
            }
        });
    });
}

// Generate grade report for a course
function generateGradeReport(courseId) {
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        alert('No grade data found for this course.');
        return;
    }
    
    // Open a new window for the report
    const reportWindow = window.open('', '_blank');
    
    // Calculate statistics
    const stats = calculateCourseStats(courseGrades);
    
    // Generate the report HTML
    reportWindow.document.write(`
        <html>
        <head>
            <title>Grade Report - ${courseGrades.courseName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2 { color: #41413c; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                .stats { display: flex; gap: 20px; margin: 20px 0; }
                .stat-card { flex: 1; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
                .passed { color: green; }
                .failed { color: red; }
                .in-progress { color: orange; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="no-print">
                <button onclick="window.print()">Print Report</button>
                <button onclick="window.close()">Close</button>
            </div>
            
            <h1>Grade Report</h1>
            <h2>${courseGrades.courseName}</h2>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>Class Average</h3>
                    <p>${stats.average.toFixed(2)}%</p>
                </div>
                <div class="stat-card">
                    <h3>Highest Score</h3>
                    <p>${stats.highest.toFixed(2)}%</p>
                </div>
                <div class="stat-card">
                    <h3>Lowest Score</h3>
                    <p>${stats.lowest.toFixed(2)}%</p>
                </div>
                <div class="stat-card">
                    <h3>Pass Rate</h3>
                    <p>${stats.passRate.toFixed(2)}%</p>
                </div>
            </div>
            
            <h3>Student Grades</h3>
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Student ID</th>
                        <th>Assignments</th>
                        <th>Quizzes</th>
                        <th>Midterm</th>
                        <th>Finals</th>
                        <th>Final Grade</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${courseGrades.students.map(student => {
                        const finalGrade = calculateFinalGrade(student, courseGrades.gradingComponents);
                        return `
                            <tr>
                                <td>${student.studentName}</td>
                                <td>${student.studentId}</td>
                                <td>${student.assignments}%</td>
                                <td>${student.quizzes}%</td>
                                <td>${student.midterm}%</td>
                                <td>${student.finals !== null ? student.finals + '%' : '--'}</td>
                                <td>${finalGrade !== null ? finalGrade.toFixed(2) : '--'}</td>
                                <td class="${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
            
            <div class="no-print">
                <p><strong>Note:</strong> This is an unofficial grade report generated by the teacher.</p>
            </div>
        </body>
        </html>
    `);
    
    reportWindow.document.close();
}

// Calculate statistics for course grades
function calculateCourseStats(courseGrades) {
    const students = courseGrades.students;
    const components = courseGrades.gradingComponents;
    
    // Initialize variables
    let totalAverage = 0;
    let highest = 0;
    let lowest = 100;
    let passCount = 0;
    let gradedCount = 0;
    
    // Calculate stats for each student
    students.forEach(student => {
        // Skip students without finals grades
        if (student.finals === null) return;
        
        gradedCount++;
        
        // Calculate weighted average
        const weightedAverage = 
            (student.assignments * components.assignments) +
            (student.quizzes * components.quizzes) +
            (student.midterm * components.midterm) +
            (student.finals * components.finals);
        
        totalAverage += weightedAverage;
        highest = Math.max(highest, weightedAverage);
        lowest = Math.min(lowest, weightedAverage);
        
        // Check if passing
        if (student.status === 'passed') {
            passCount++;
        }
    });
    
    // Calculate final stats
    return {
        average: gradedCount > 0 ? totalAverage / gradedCount : 0,
        highest: highest,
        lowest: lowest === 100 && gradedCount === 0 ? 0 : lowest,
        passRate: gradedCount > 0 ? (passCount / gradedCount) * 100 : 0
    };
}

// Calculate final grade based on grade components
function calculateFinalGrade(student, gradingComponents) {
    // If finals grade is not entered yet, return null
    if (!student.finals) return null;
    
    // Calculate weighted average
    const weightedAverage = 
        (student.assignments * gradingComponents.assignments) +
        (student.quizzes * gradingComponents.quizzes) +
        (student.midterm * gradingComponents.midterm) +
        (student.finals * gradingComponents.finals);
    
    // Convert percentage to 4.0 scale
    // For example: 95-100 = 4.0, 90-94 = 3.75, 85-89 = 3.5, etc.
    if (weightedAverage >= 95) return 4.00;
    if (weightedAverage >= 90) return 3.75;
    if (weightedAverage >= 85) return 3.50;
    if (weightedAverage >= 80) return 3.25;
    if (weightedAverage >= 75) return 3.00;
    if (weightedAverage >= 70) return 2.75;
    if (weightedAverage >= 65) return 2.50;
    if (weightedAverage >= 60) return 2.25;
    return 0.00; // Failing grade
}

// Update the final grade display when inputs change
function updateFinalGrade(studentId, gradingComponents, courseId) {
    // Get the values from inputs
    const assignments = parseFloat(document.getElementById(`assignments-${studentId}`).value) || 0;
    const quizzes = parseFloat(document.getElementById(`quizzes-${studentId}`).value) || 0;
    const midterm = parseFloat(document.getElementById(`midterm-${studentId}`).value) || 0;
    const finalsInput = document.getElementById(`finals-${studentId}`);
    const finals = finalsInput.value ? parseFloat(finalsInput.value) : null;
    
    // Create a temporary student object with the current values
    const tempStudent = {
        studentId,
        assignments,
        quizzes,
        midterm,
        finals
    };
    
    // Calculate and display the final grade
    const finalGrade = calculateFinalGrade(tempStudent, gradingComponents);
    const finalGradeElement = document.getElementById(`final-grade-${studentId}`);
    
    if (finalGrade) {
        finalGradeElement.textContent = finalGrade.toFixed(2);
    } else {
        finalGradeElement.textContent = '--';
    }
}

// Save grades for a single student
function saveGrades(studentId, courseId) {
    // In a real application, this would send the data to an API
    // For now, we'll just update our sample data
    
    // Get the values from inputs
    const assignments = parseFloat(document.getElementById(`assignments-${studentId}`).value) || 0;
    const quizzes = parseFloat(document.getElementById(`quizzes-${studentId}`).value) || 0;
    const midterm = parseFloat(document.getElementById(`midterm-${studentId}`).value) || 0;
    const finalsInput = document.getElementById(`finals-${studentId}`);
    const finals = finalsInput.value ? parseFloat(finalsInput.value) : null;
    
    // Find the student in our data
    const courseGrades = teacherData.grades[courseId];
    const studentIndex = courseGrades.students.findIndex(s => s.studentId === studentId);
    
    if (studentIndex !== -1) {
        // Update the student's grades
        courseGrades.students[studentIndex].assignments = assignments;
        courseGrades.students[studentIndex].quizzes = quizzes;
        courseGrades.students[studentIndex].midterm = midterm;
        courseGrades.students[studentIndex].finals = finals;
        
        // Update status if finals is entered
        if (finals !== null) {
            // Calculate final grade
            const finalGrade = calculateFinalGrade(
                courseGrades.students[studentIndex],
                courseGrades.gradingComponents
            );
            
            // Update status based on final grade
            courseGrades.students[studentIndex].status = finalGrade >= 2.0 ? 'passed' : 'failed';
        }
        
        // Show success message
        alert(`Grades for ${courseGrades.students[studentIndex].studentName} have been saved.`);
    }
}

// Save grades for all students in a course
function saveAllGrades(courseId) {
    // In a real application, this would send all data to an API
    // Get the course grades
    const courseGrades = teacherData.grades[courseId];
    
    // Update all students' grades
    courseGrades.students.forEach(student => {
        saveGrades(student.studentId, courseId);
    });
    
    // Show success message
    alert(`All grades for ${courseGrades.courseName} have been saved.`);
}

// Generate performance report content
function generatePerformanceReport() {
    let content = '<div class="performance-report">';
    
    // Add charts and visualizations here (placeholder)
    content += '<p>Performance visualization would be displayed here.</p>';
    content += '<p>This report shows the overall performance of students across all courses.</p>';
    
    // Add sample data table
    content += `
        <table>
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Average Grade</th>
                    <th>Pass Rate</th>
                    <th>Completion Rate</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Generate data for each course
    Object.keys(teacherData.grades).forEach(courseId => {
        const course = teacherData.grades[courseId];
        const stats = calculateCourseStats(course);
        
        content += `
            <tr>
                <td>${course.courseName}</td>
                <td>${stats.average.toFixed(2)}%</td>
                <td>${stats.passRate.toFixed(2)}%</td>
                <td>${(course.students.filter(s => s.finals !== null).length / course.students.length * 100).toFixed(2)}%</td>
            </tr>
        `;
    });
    
    content += '</tbody></table></div>';
    return content;
}

// Generate attendance report content (placeholder)
function generateAttendanceReport() {
    return `
        <p>Attendance data would be displayed here.</p>
        <p>This feature will be implemented in a future update.</p>
    `;
}

// Generate grade distribution report content (placeholder)
function generateDistributionReport() {
    return `
        <p>Grade distribution visualization would be displayed here.</p>
        <p>This feature will be implemented in a future update.</p>
    `;
}

// Generate reports
function generateReport(type) {
    // Determine which report to generate
    let reportTitle, reportContent;
    
    switch (type) {
        case 'performance':
            reportTitle = 'Class Performance Report';
            reportContent = generatePerformanceReport();
            break;
        case 'attendance':
            reportTitle = 'Attendance Summary Report';
            reportContent = generateAttendanceReport();
            break;
        case 'distribution':
            reportTitle = 'Grade Distribution Report';
            reportContent = generateDistributionReport();
            break;
        default:
            reportTitle = 'Report';
            reportContent = '<p>No report type selected.</p>';
    }
    
    // Display the report
    const reportPreview = document.getElementById('report-preview');
    reportPreview.innerHTML = `
        <div class="report-header">
            <h2>${reportTitle}</h2>
            <button onclick="downloadReport('${type}')">Download</button>
        </div>
        <div class="report-content">
            ${reportContent}
        </div>
    `;
}

// Download report
function downloadReport(type) {
    alert(`Downloading ${type} report... This feature will be fully implemented in the next version.`);
}

// Format date helper
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// View student details
function viewStudent(studentId) {
    const student = teacherData.students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Student not found.');
        return;
    }
    
    // In a real app, this would navigate to a student profile page
    // For now, we'll just show an alert with student info
    alert(`Student Profile:\n\nName: ${student.name}\nID: ${student.id}\nEmail: ${student.email}\nProgram: ${student.program}\nYear Level: ${student.yearLevel}`);
}

// View student grades
function viewGrades(studentId) {
    const student = teacherData.students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Student not found.');
        return;
    }
    
    // In a real app, this would navigate to a student grades page
    // For now, we'll just open a popup with the student's grades
    const coursesWithGrades = [];
    
    // Find grades for the student across all courses
    Object.keys(teacherData.grades).forEach(courseId => {
        const courseGrades = teacherData.grades[courseId];
        const studentGrade = courseGrades.students.find(s => s.studentId === studentId);
        
        if (studentGrade) {
            coursesWithGrades.push({
                courseName: courseGrades.courseName,
                courseId: courseId,
                grades: studentGrade
            });
        }
    });
    
    // Open a new window with the grades
    const gradesWindow = window.open('', '_blank');
    
    gradesWindow.document.write(`
        <html>
        <head>
            <title>Grades for ${student.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2 { color: #41413c; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                .passed { color: green; }
                .failed { color: red; }
                .in-progress { color: orange; }
            </style>
        </head>
        <body>
            <h1>Grades for ${student.name}</h1>
            <p>Student ID: ${student.id}</p>
            <p>Program: ${student.program} - Year ${student.yearLevel}</p>
            
            <h2>Current Courses and Grades</h2>
            ${coursesWithGrades.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Assignments</th>
                            <th>Quizzes</th>
                            <th>Midterm</th>
                            <th>Finals</th>
                            <th>Final Grade</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${coursesWithGrades.map(course => {
                            const finalGrade = calculateFinalGrade(
                                course.grades,
                                teacherData.grades[course.courseId].gradingComponents
                            );
                            return `
                                <tr>
                                    <td>${course.courseName}</td>
                                    <td>${course.grades.assignments}%</td>
                                    <td>${course.grades.quizzes}%</td>
                                    <td>${course.grades.midterm}%</td>
                                    <td>${course.grades.finals !== null ? course.grades.finals + '%' : '--'}</td>
                                    <td>${finalGrade !== null ? finalGrade.toFixed(2) : '--'}</td>
                                    <td class="${course.grades.status}">${course.grades.status.charAt(0).toUpperCase() + course.grades.status.slice(1)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            ` : '<p>No grades available for this student.</p>'}
            
            <button onclick="window.close()">Close</button>
        </body>
        </html>
    `);
    
    gradesWindow.document.close();
}

// View student details in grade interface
function viewStudentDetails(studentId) {
    // Simply call the viewStudent function for now
    viewStudent(studentId);
}

// View course details
function viewCourse(courseId) {
    const course = teacherData.courses.find(c => c.id === courseId);
    
    if (!course) {
        alert('Course not found.');
        return;
    }
    
    // In a real app, this would navigate to a course details page
    // For now, we'll just show an alert with course info
    alert(`Course Details:\n\nCourse: ${course.name} (${course.code})\nSection: ${course.section}\nSchedule: ${course.schedule}\nRoom: ${course.room}\nEnrolled: ${course.enrolledCount}/${course.capacity}`);
}

// Manage course - switch to grades page with selected course
function manageCourse(courseId) {
    document.getElementById('grade-course-filter').value = courseId;
    showContent('grades');
    loadGradeSheet();
}

// Logout function
function logout() {
    // In a real app, this would clear session data
    console.log('Logging out...');
    // No need to add code here as the link already navigates to the login page
}
