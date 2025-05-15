/**
 * Attendance Tracking System
 * This module provides functionality for teachers to track student attendance,
 * view attendance history, and generate attendance reports.
 */

// Initialize the attendance tracking system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize security modules if available
    if (window.SecurityModule) {
        SecurityModule.init();
    }
    
    if (window.SessionManager) {
        SessionManager.init();
    }
    
    // Set current date as default in the date picker
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('session-date').value = formattedDate;
    
    // Load data
    loadCourseDropdowns();
    loadAcademicYears();
    
    // Add event listeners
    document.getElementById('new-session-btn').addEventListener('click', setupNewAttendanceSession);
    document.getElementById('save-attendance-btn').addEventListener('click', saveAttendanceSession);
    document.getElementById('cancel-attendance-btn').addEventListener('click', cancelAttendanceSession);
    document.getElementById('export-report-btn').addEventListener('click', exportAttendanceReport);
    document.getElementById('print-report-btn').addEventListener('click', printAttendanceReport);
    
    // Log page access
    logAccessEvent('attendance_tracking_page_access');
});

// Load course data into dropdowns
function loadCourseDropdowns() {
    // Get all course filter dropdowns
    const courseFilters = [
        document.getElementById('course-filter'),
        document.getElementById('history-course-filter'),
        document.getElementById('report-course-filter')
    ];
    
    // For each dropdown, populate with course options
    courseFilters.forEach(courseFilter => {
        if (!courseFilter) return;
        
        // Clear existing options except the first one
        courseFilter.innerHTML = '<option value="">Select Course</option>';
        
        // Add course options
        teacherData.courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = `${course.code} - ${course.name} (${course.section})`;
            courseFilter.appendChild(option);
        });
    });
}

// Load academic years into dropdowns
function loadAcademicYears() {
    // Get all academic year filter dropdowns
    const yearFilters = [
        document.getElementById('history-academic-year'),
        document.getElementById('report-academic-year')
    ];
    
    // Mock academic year data (this would typically come from API)
    const academicYears = [
        { id: "2025-2026", label: "2025-2026" },
        { id: "2024-2025", label: "2024-2025" },
        { id: "2023-2024", label: "2023-2024" }
    ];
    
    // For each dropdown, populate with academic year options
    yearFilters.forEach(yearFilter => {
        if (!yearFilter) return;
        
        // Clear existing options except the first one
        yearFilter.innerHTML = '<option value="">All Academic Years</option>';
        
        // Add academic year options
        academicYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year.id;
            option.textContent = year.label;
            yearFilter.appendChild(option);
        });
    });
}

// Show/hide tabs
function showTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Show the selected tab content
    document.getElementById(tabId).style.display = 'block';
    
    // Update active tab styles
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Find and activate the tab that was clicked
    const activeTab = Array.from(tabs).find(tab => 
        tab.getAttribute('onclick') === `showTab('${tabId}')`
    );
    
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Load data for the selected tab
    if (tabId === 'attendance-history') {
        loadAttendanceHistory();
    } else if (tabId === 'attendance-reports') {
        generateAttendanceReport();
    }
}

// Load student list for attendance recording
function loadStudentList() {
    const courseId = document.getElementById('course-filter').value;
    const studentsList = document.getElementById('students-attendance-list');
    
    if (!courseId) {
        studentsList.innerHTML = '<p>Please select a course to load the student list.</p>';
        document.getElementById('save-attendance-btn').disabled = true;
        return;
    }
    
    // Enable save button
    document.getElementById('save-attendance-btn').disabled = false;
    
    // Find the selected course
    const selectedCourse = teacherData.courses.find(course => course.id === courseId);
    
    if (!selectedCourse || !selectedCourse.students || selectedCourse.students.length === 0) {
        studentsList.innerHTML = '<p>No students enrolled in this course.</p>';
        return;
    }
    
    // Create attendance table
    let tableHTML = `
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Minutes Late</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add students to the table
    selectedCourse.students.forEach(student => {
        tableHTML += `
            <tr data-student-id="${student.id}">
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>
                    <select class="status-selector" onchange="updateAttendanceStatus(this)">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="minutes-late" min="0" value="0" disabled>
                </td>
                <td>
                    <input type="text" class="notes-input" placeholder="Add notes...">
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    studentsList.innerHTML = tableHTML;
}

// Update attendance status and enable/disable minutes late input
function updateAttendanceStatus(selectElement) {
    const row = selectElement.closest('tr');
    const minutesLateInput = row.querySelector('.minutes-late');
    
    // Enable minutes late input only if status is "late"
    if (selectElement.value === 'late') {
        minutesLateInput.disabled = false;
        minutesLateInput.value = '5'; // Default value
    } else {
        minutesLateInput.disabled = true;
        minutesLateInput.value = '0';
    }
    
    // Update row background color based on status
    row.className = ''; // Clear existing classes
    row.classList.add('status-' + selectElement.value);
}

// Setup a new attendance recording session
function setupNewAttendanceSession() {
    // Show the record attendance tab
    showTab('record-attendance');
    
    // Clear any previous selections
    document.getElementById('course-filter').value = '';
    document.getElementById('session-type').value = 'lecture';
    document.getElementById('session-number').value = '1';
    document.getElementById('session-duration').value = '60';
    
    // Set current date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('session-date').value = formattedDate;
    
    // Clear student list
    document.getElementById('students-attendance-list').innerHTML = 
        '<p>Please select a course to load the student list.</p>';
    
    // Disable save button
    document.getElementById('save-attendance-btn').disabled = true;
}

// Save attendance session
function saveAttendanceSession() {
    const courseId = document.getElementById('course-filter').value;
    const sessionType = document.getElementById('session-type').value;
    const sessionDate = document.getElementById('session-date').value;
    const sessionNumber = document.getElementById('session-number').value;
    const sessionDuration = document.getElementById('session-duration').value;
    
    if (!courseId || !sessionDate || !sessionNumber || !sessionDuration) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Collect attendance records
    const records = [];
    const studentRows = document.querySelectorAll('#students-attendance-list tr[data-student-id]');
    
    studentRows.forEach(row => {
        const studentId = row.getAttribute('data-student-id');
        const status = row.querySelector('.status-selector').value;
        const minutesLate = parseInt(row.querySelector('.minutes-late').value) || 0;
        const notes = row.querySelector('.notes-input').value;
        
        records.push({
            student: studentId,
            status: status,
            minutesLate: minutesLate,
            notes: notes
        });
    });
    
    // Create attendance object (this would be sent to API)
    const attendanceData = {
        course: courseId,
        date: sessionDate,
        academicYear: "2024-2025", // This would typically come from the system's current academic year
        sessionType: sessionType,
        sessionNumber: parseInt(sessionNumber),
        duration: parseInt(sessionDuration),
        records: records,
        notes: ""
    };
    
    // Mock API call (would be replaced with actual API call)
    console.log("Saving attendance data:", attendanceData);
    
    // In a real implementation, we would make an API call here:
    /*
    fetch('/api/attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SessionManager.getToken()}`
        },
        body: JSON.stringify(attendanceData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Attendance saved successfully!');
        loadAttendanceHistory(); // Refresh history if we're viewing it
    })
    .catch(error => {
        console.error('Error saving attendance:', error);
        alert('Failed to save attendance. Please try again.');
    });
    */
    
    // For demo, simulate successful save
    setTimeout(() => {
        alert('Attendance saved successfully!');
        
        // Add to mock data for demo
        if (!teacherData.attendanceRecords) {
            teacherData.attendanceRecords = {};
        }
        
        if (!teacherData.attendanceRecords[courseId]) {
            teacherData.attendanceRecords[courseId] = [];
        }
        
        // Add this record with a generated ID
        const recordId = 'att_' + Date.now();
        teacherData.attendanceRecords[courseId].push({
            _id: recordId,
            ...attendanceData,
            createdAt: new Date().toISOString()
        });
        
        // Reset the form
        setupNewAttendanceSession();
        
        // Refresh history if we're viewing it
        if (document.getElementById('attendance-history').style.display !== 'none') {
            loadAttendanceHistory();
        }
    }, 1000);
}

// Cancel attendance session
function cancelAttendanceSession() {
    // Simply reset the form
    setupNewAttendanceSession();
}

// Load attendance history
function loadAttendanceHistory() {
    const courseId = document.getElementById('history-course-filter').value;
    const academicYear = document.getElementById('history-academic-year').value;
    const sessionsList = document.getElementById('attendance-sessions-list');
    
    if (!courseId) {
        sessionsList.innerHTML = '<p>Please select a course to view attendance history.</p>';
        return;
    }
    
    // In a real implementation, we would fetch from the API here
    /*
    const url = `/api/attendance/course/${courseId}` + 
               (academicYear ? `?academicYear=${academicYear}` : '');
    
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayAttendanceHistory(data);
    })
    .catch(error => {
        console.error('Error fetching attendance history:', error);
        sessionsList.innerHTML = '<p>Error loading attendance history. Please try again.</p>';
    });
    */
    
    // For demo, use mock data
    let mockAttendanceRecords = [];
    
    // Check if we have mock data for this course
    if (teacherData.attendanceRecords && teacherData.attendanceRecords[courseId]) {
        mockAttendanceRecords = teacherData.attendanceRecords[courseId];
    } else {
        // Generate some mock attendance records if none exist
        const selectedCourse = teacherData.courses.find(course => course.id === courseId);
        
        if (selectedCourse && selectedCourse.students) {
            // Create example records for the last 5 weeks
            for (let i = 0; i < 5; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (i * 7)); // Go back i weeks
                
                const records = [];
                selectedCourse.students.forEach(student => {
                    // Random status with appropriate distribution
                    const rand = Math.random();
                    let status, minutesLate = 0, notes = "";
                    
                    if (rand < 0.8) {
                        status = "present";
                    } else if (rand < 0.9) {
                        status = "late";
                        minutesLate = Math.floor(Math.random() * 15) + 5;
                    } else if (rand < 0.95) {
                        status = "absent";
                    } else {
                        status = "excused";
                        notes = "Medical appointment";
                    }
                    
                    records.push({
                        student: student.id,
                        studentName: student.name, // For display purposes in mock data
                        studentId: student.studentId, // For display purposes in mock data
                        status,
                        minutesLate,
                        notes
                    });
                });
                
                mockAttendanceRecords.push({
                    _id: `mock_${courseId}_${i}`,
                    course: courseId,
                    courseName: selectedCourse.name, // For display purposes in mock data
                    date: date.toISOString().split('T')[0],
                    academicYear: "2024-2025",
                    sessionType: "lecture",
                    sessionNumber: i + 1,
                    duration: 60,
                    records: records,
                    createdAt: date.toISOString()
                });
            }
            
            // Store the generated mock data
            if (!teacherData.attendanceRecords) {
                teacherData.attendanceRecords = {};
            }
            teacherData.attendanceRecords[courseId] = mockAttendanceRecords;
        }
    }
    
    // Filter by academic year if selected
    if (academicYear) {
        mockAttendanceRecords = mockAttendanceRecords.filter(
            record => record.academicYear === academicYear
        );
    }
    
    // Sort by date (newest first)
    mockAttendanceRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    displayAttendanceHistory(mockAttendanceRecords);
}

// Display attendance history
function displayAttendanceHistory(records) {
    const sessionsList = document.getElementById('attendance-sessions-list');
    
    if (!records || records.length === 0) {
        sessionsList.innerHTML = '<p>No attendance records found for this course.</p>';
        return;
    }
    
    let html = '';
    
    records.forEach(record => {
        // Calculate summary statistics
        const totalStudents = record.records.length;
        const presentCount = record.records.filter(r => r.status === 'present').length;
        const absentCount = record.records.filter(r => r.status === 'absent').length;
        const lateCount = record.records.filter(r => r.status === 'late').length;
        const excusedCount = record.records.filter(r => r.status === 'excused').length;
        const attendanceRate = ((presentCount + lateCount) / totalStudents * 100).toFixed(1);
        
        const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        html += `
            <div class="session-card" data-record-id="${record._id}">
                <h3>Session ${record.sessionNumber} - ${formattedDate}</h3>
                <div class="session-info">
                    <div class="session-stat">Type: ${capitalizeFirstLetter(record.sessionType)}</div>
                    <div class="session-stat">Duration: ${record.duration} min</div>
                    <div class="session-stat">Students: ${totalStudents}</div>
                    <div class="session-stat">Attendance: ${attendanceRate}%</div>
                </div>
                <div class="session-info">
                    <div class="session-stat status-present">Present: ${presentCount}</div>
                    <div class="session-stat status-absent">Absent: ${absentCount}</div>
                    <div class="session-stat status-late">Late: ${lateCount}</div>
                    <div class="session-stat status-excused">Excused: ${excusedCount}</div>
                </div>
                <div class="action-buttons">
                    <button class="action-button" onclick="viewAttendanceSession('${record._id}')">View Details</button>
                    <button class="action-button" onclick="editAttendanceSession('${record._id}')">Edit</button>
                </div>
            </div>
        `;
    });
    
    sessionsList.innerHTML = html;
}

// View attendance session details
function viewAttendanceSession(recordId) {
    alert('Viewing attendance session: ' + recordId);
    // In a real implementation, this would open a modal with the session details
}

// Edit attendance session
function editAttendanceSession(recordId) {
    alert('Editing attendance session: ' + recordId);
    // In a real implementation, this would open the edit form with the session data
}

// Close attendance modal
function closeAttendanceModal() {
    document.getElementById('attendance-modal').style.display = 'none';
}

// Generate attendance report
function generateAttendanceReport() {
    const courseId = document.getElementById('report-course-filter').value;
    const academicYear = document.getElementById('report-academic-year').value;
    const reportContainer = document.getElementById('attendance-report');
    const summaryContainer = document.getElementById('attendance-summary');
    
    if (!courseId) {
        reportContainer.innerHTML = '<p>Please select a course to generate an attendance report.</p>';
        summaryContainer.innerHTML = '';
        document.getElementById('export-report-btn').disabled = true;
        document.getElementById('print-report-btn').disabled = true;
        return;
    }
    
    // Enable action buttons
    document.getElementById('export-report-btn').disabled = false;
    document.getElementById('print-report-btn').disabled = false;
    
    // In a real implementation, we would fetch from the API here
    /*
    fetch(`/api/attendance/report/course/${courseId}` + 
          (academicYear ? `?academicYear=${academicYear}` : ''), {
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayAttendanceReport(data);
    })
    .catch(error => {
        console.error('Error generating attendance report:', error);
        reportContainer.innerHTML = '<p>Error generating report. Please try again.</p>';
        summaryContainer.innerHTML = '';
    });
    */
    
    // For demo, generate a report from mock data
    let mockAttendanceRecords = [];
    
    // Use the same mock data from attendance history
    if (teacherData.attendanceRecords && teacherData.attendanceRecords[courseId]) {
        mockAttendanceRecords = teacherData.attendanceRecords[courseId];
    } else {
        reportContainer.innerHTML = '<p>No attendance data available for this course.</p>';
        summaryContainer.innerHTML = '';
        return;
    }
    
    // Filter by academic year if selected
    if (academicYear) {
        mockAttendanceRecords = mockAttendanceRecords.filter(
            record => record.academicYear === academicYear
        );
    }
    
    if (mockAttendanceRecords.length === 0) {
        reportContainer.innerHTML = '<p>No attendance data available for the selected criteria.</p>';
        summaryContainer.innerHTML = '';
        return;
    }
    
    // Find the course info
    const selectedCourse = teacherData.courses.find(course => course.id === courseId);
    
    // Generate student attendance summary
    const studentAttendance = {};
    
    mockAttendanceRecords.forEach(record => {
        record.records.forEach(student => {
            const studentId = student.student;
            
            if (!studentAttendance[studentId]) {
                // Find student info from the first record
                const studentInfo = selectedCourse.students.find(s => s.id === studentId);
                
                studentAttendance[studentId] = {
                    id: studentId,
                    name: studentInfo ? studentInfo.name : 'Unknown',
                    studentId: studentInfo ? studentInfo.studentId : 'Unknown',
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                    totalSessions: 0,
                    minutesLate: 0
                };
            }
            
            // Update counts
            studentAttendance[studentId][student.status]++;
            studentAttendance[studentId].totalSessions++;
            
            if (student.status === 'late') {
                studentAttendance[studentId].minutesLate += student.minutesLate;
            }
        });
    });
    
    // Calculate overall statistics
    const totalSessions = mockAttendanceRecords.length;
    let totalPresent = 0, totalAbsent = 0, totalLate = 0, totalExcused = 0;
    let totalStudents = 0, perfectAttendance = 0, atRiskStudents = 0;
    
    Object.values(studentAttendance).forEach(student => {
        totalPresent += student.present;
        totalAbsent += student.absent;
        totalLate += student.late;
        totalExcused += student.excused;
        totalStudents++;
        
        // Perfect attendance = 100% present or excused
        if (student.present + student.excused === student.totalSessions) {
            perfectAttendance++;
        }
        
        // At risk = more than 20% absences
        if ((student.absent / student.totalSessions) > 0.2) {
            atRiskStudents++;
        }
    });
    
    const totalRecords = totalPresent + totalAbsent + totalLate + totalExcused;
    const averageAttendance = (totalPresent + totalLate) / totalRecords * 100;
    
    // Display summary cards
    let summaryHTML = `
        <div class="summary-card">
            <h3>Sessions</h3>
            <div class="summary-value">${totalSessions}</div>
        </div>
        <div class="summary-card">
            <h3>Students</h3>
            <div class="summary-value">${totalStudents}</div>
        </div>
        <div class="summary-card">
            <h3>Avg. Attendance</h3>
            <div class="summary-value">${averageAttendance.toFixed(1)}%</div>
        </div>
        <div class="summary-card">
            <h3>Perfect Attendance</h3>
            <div class="summary-value">${perfectAttendance}</div>
        </div>
        <div class="summary-card">
            <h3>At Risk</h3>
            <div class="summary-value">${atRiskStudents}</div>
        </div>
    `;
    
    summaryContainer.innerHTML = summaryHTML;
    
    // Create the detailed report table
    let reportHTML = `
        <h2>Attendance Report: ${selectedCourse.code} - ${selectedCourse.name}</h2>
        <p>Academic Year: ${academicYear || 'All'} | Total Sessions: ${totalSessions}</p>
        
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Excused</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Sort students by name
    const sortedStudents = Object.values(studentAttendance).sort((a, b) => 
        a.name.localeCompare(b.name)
    );
    
    sortedStudents.forEach(student => {
        const attendancePercentage = (
            (student.present + student.late) / student.totalSessions * 100
        ).toFixed(1);
        
        let status = '';
        if (attendancePercentage >= 95) {
            status = '<span style="color: #2ecc71;">Excellent</span>';
        } else if (attendancePercentage >= 85) {
            status = '<span style="color: #3498db;">Good</span>';
        } else if (attendancePercentage >= 75) {
            status = '<span style="color: #f39c12;">Fair</span>';
        } else {
            status = '<span style="color: #e74c3c;">At Risk</span>';
        }
        
        reportHTML += `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.present}</td>
                <td>${student.absent}</td>
                <td>${student.late}</td>
                <td>${student.excused}</td>
                <td>${attendancePercentage}%</td>
                <td>${status}</td>
            </tr>
        `;
    });
    
    reportHTML += `
            </tbody>
        </table>
        
        <h3>Session Details</h3>
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Session #</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Excused</th>
                    <th>Attendance %</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Sort sessions by date (oldest first for the report)
    mockAttendanceRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    mockAttendanceRecords.forEach(session => {
        const totalStudentsInSession = session.records.length;
        const presentCount = session.records.filter(r => r.status === 'present').length;
        const absentCount = session.records.filter(r => r.status === 'absent').length;
        const lateCount = session.records.filter(r => r.status === 'late').length;
        const excusedCount = session.records.filter(r => r.status === 'excused').length;
        const attendanceRate = ((presentCount + lateCount) / totalStudentsInSession * 100).toFixed(1);
        
        const sessionDate = new Date(session.date).toLocaleDateString();
        
        reportHTML += `
            <tr>
                <td>${sessionDate}</td>
                <td>${session.sessionNumber}</td>
                <td>${capitalizeFirstLetter(session.sessionType)}</td>
                <td>${session.duration} min</td>
                <td>${presentCount}</td>
                <td>${absentCount}</td>
                <td>${lateCount}</td>
                <td>${excusedCount}</td>
                <td>${attendanceRate}%</td>
            </tr>
        `;
    });
    
    reportHTML += `
            </tbody>
        </table>
        
        <p><small>Report generated on: ${new Date().toLocaleString()}</small></p>
    `;
    
    reportContainer.innerHTML = reportHTML;
}

// Export attendance report to CSV
function exportAttendanceReport() {
    const courseId = document.getElementById('report-course-filter').value;
    
    if (!courseId) {
        alert('Please select a course first.');
        return;
    }
    
    // Find the course info
    const selectedCourse = teacherData.courses.find(course => course.id === courseId);
    
    // In a real implementation, we would download from the API
    alert(`Exporting attendance report for ${selectedCourse.code} - ${selectedCourse.name}`);
    
    // This would typically trigger a download through the API
    // For demo purposes, we just show an alert
}

// Print attendance report
function printAttendanceReport() {
    window.print();
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Log security and access events
function logAccessEvent(eventType, details = {}) {
    if (window.SecurityModule) {
        SecurityModule.logEvent(eventType, details);
    }
    
    console.log(`[EVENT] ${eventType}`, details);
}

// Logout function
function logout() {
    if (window.SessionManager) {
        SessionManager.clearSession();
    }
    
    // Redirect to login page
    window.location.href = 'loginpage.html';
}
