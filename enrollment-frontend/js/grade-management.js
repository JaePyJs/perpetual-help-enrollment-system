/**
 * Grade Management System for Teacher Dashboard
 * This module provides advanced grade management capabilities
 * for teachers to input, track, and analyze student grades.
 * 
 * Grade Analytics functionality added: Course performance analysis, student reports,
 * class rankings, and at-risk student identification.
 */

// Initialize the grade management system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize security modules if available
    if (window.SecurityModule) {
        SecurityModule.init();
    }
    
    if (window.SessionManager) {
        SessionManager.init();
    }
    
    // Load data
    loadCourseDropdowns();
    loadGradingComponents();
    
    // Set up event listeners for grading scale inputs validation
    setupGradeScaleValidation();
    
    // Check if a courseId was specified in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    
    if (courseId) {
        // Set the course dropdown to the specified course
        document.getElementById('grade-course-filter').value = courseId;
        // Trigger the grade sheet load
        loadGradeSheet();
    }
    
    // Initialize grade analysis view
    initializeAnalysisView();
    
    // Log page access
    logAccessEvent('grade_management_page_access');
});

// Load course data into dropdowns
function loadCourseDropdowns() {
    const courseFilter = document.getElementById('grade-course-filter');
    
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
}

// Load grading components from data or default
function loadGradingComponents() {
    // If we have stored components in localStorage, use those
    const storedComponents = JSON.parse(localStorage.getItem('gradingComponents'));
    
    if (storedComponents) {
        document.getElementById('assignments-weight').value = storedComponents.assignments * 100;
        document.getElementById('quizzes-weight').value = storedComponents.quizzes * 100;
        document.getElementById('midterm-weight').value = storedComponents.midterm * 100;
        document.getElementById('finals-weight').value = storedComponents.finals * 100;
    }
    
    // Update the total
    updateWeights();
}

// Update weights when the user changes component values
function updateWeights() {
    const assignmentsWeight = parseInt(document.getElementById('assignments-weight').value) || 0;
    const quizzesWeight = parseInt(document.getElementById('quizzes-weight').value) || 0;
    const midtermWeight = parseInt(document.getElementById('midterm-weight').value) || 0;
    const finalsWeight = parseInt(document.getElementById('finals-weight').value) || 0;
    
    // Calculate total
    const total = assignmentsWeight + quizzesWeight + midtermWeight + finalsWeight;
    
    // Update total display
    document.getElementById('weight-total').textContent = `Total: ${total}%`;
    
    // Highlight total if not 100%
    if (total !== 100) {
        document.getElementById('weight-total').style.color = '#e74c3c';
    } else {
        document.getElementById('weight-total').style.color = '#2ecc71';
        
        // Save weights to localStorage
        const components = {
            assignments: assignmentsWeight / 100,
            quizzes: quizzesWeight / 100,
            midterm: midtermWeight / 100,
            finals: finalsWeight / 100
        };
        
        localStorage.setItem('gradingComponents', JSON.stringify(components));
        
        // If a course is selected, update the grade sheet
        const courseId = document.getElementById('grade-course-filter').value;
        if (courseId) {
            updateGradeSheet();
        }
    }
}

// Setup validation for grade scale inputs
function setupGradeScaleValidation() {
    const scaleInputs = document.querySelectorAll('.grade-scale input');
    
    scaleInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Validate that higher grades have higher thresholds
            validateGradeScale();
        });
    });
}

// Validate the grade scale inputs
function validateGradeScale() {
    const aThreshold = parseInt(document.getElementById('scale-a').value) || 93;
    const aMinusThreshold = parseInt(document.getElementById('scale-a-minus').value) || 90;
    const bPlusThreshold = parseInt(document.getElementById('scale-b-plus').value) || 87;
    const bThreshold = parseInt(document.getElementById('scale-b').value) || 83;
    const bMinusThreshold = parseInt(document.getElementById('scale-b-minus').value) || 80;
    const cPlusThreshold = parseInt(document.getElementById('scale-c-plus').value) || 77;
    const cThreshold = parseInt(document.getElementById('scale-c').value) || 73;
    const cMinusThreshold = parseInt(document.getElementById('scale-c-minus').value) || 70;
    const dPlusThreshold = parseInt(document.getElementById('scale-d-plus').value) || 67;
    const dThreshold = parseInt(document.getElementById('scale-d').value) || 63;
    const dMinusThreshold = parseInt(document.getElementById('scale-d-minus').value) || 60;
    
    // Store scale values in localStorage
    const gradeScale = {
        A: aThreshold,
        'A-': aMinusThreshold,
        'B+': bPlusThreshold,
        B: bThreshold,
        'B-': bMinusThreshold,
        'C+': cPlusThreshold,
        C: cThreshold,
        'C-': cMinusThreshold,
        'D+': dPlusThreshold,
        D: dThreshold,
        'D-': dMinusThreshold,
        F: 0
    };
    
    localStorage.setItem('gradeScale', JSON.stringify(gradeScale));
    
    // If a course is selected, update the grade sheet
    const courseId = document.getElementById('grade-course-filter').value;
    if (courseId) {
        updateGradeSheet();
    }
}

// Load grade sheet
function loadGradeSheet() {
    const courseId = document.getElementById('grade-course-filter').value;
    const period = document.getElementById('grading-period').value;
    
    if (!courseId || !period) {
        document.getElementById('grade-sheet').innerHTML = `
            <p>Please select a course and grading period to load grades.</p>
        `;
        
        // Disable action buttons
        document.getElementById('save-all-btn').disabled = true;
        document.getElementById('calculate-btn').disabled = true;
        document.getElementById('finalize-btn').disabled = true;
        
        return;
    }
    
    // Enable action buttons
    document.getElementById('save-all-btn').disabled = false;
    document.getElementById('calculate-btn').disabled = false;
    document.getElementById('finalize-btn').disabled = false;
    
    // Get grades for the selected course
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        document.getElementById('grade-sheet').innerHTML = `
            <div class="no-data">No grade data found for this course.</div>
        `;
        return;
    }
    
    // Check if grades have been finalized
    const isFinalized = courseGrades.isFinalized || false;
    let finalizedMessage = '';
    
    if (isFinalized) {
        finalizedMessage = `
            <div class="grading-locked-message">
                <strong>Note:</strong> Grades for this course have been finalized and submitted. 
                Any changes will require approval from the department chair.
            </div>
        `;
        
        document.getElementById('finalize-btn').disabled = true;
    }
    
    // Create the grade sheet
    const gradeSheet = document.getElementById('grade-sheet');
    gradeSheet.innerHTML = `
        ${finalizedMessage}
        <div class="grade-info">
            <h2>${courseGrades.courseName}</h2>
            <p>
                <strong>Section:</strong> ${courseGrades.section} |
                <strong>Schedule:</strong> ${courseGrades.schedule} |
                <strong>Enrolled:</strong> ${courseGrades.students.length} students
            </p>
        </div>
        <table class="grade-table" id="grades-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Assignments</th>
                    <th>Quizzes</th>
                    <th>Midterm</th>
                    <th>Finals</th>
                    <th>Final Grade</th>
                    <th>Letter Grade</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${courseGrades.students.map(student => `
                    <tr data-student-id="${student.studentId}" data-student-name="${student.studentName}">
                        <td>${student.studentName}</td>
                        <td>${student.studentId}</td>
                        <td><input type="number" id="assignments-${student.studentId}" value="${student.assignments || ''}" min="0" max="100" ${isFinalized ? 'disabled' : ''}></td>
                        <td><input type="number" id="quizzes-${student.studentId}" value="${student.quizzes || ''}" min="0" max="100" ${isFinalized ? 'disabled' : ''}></td>
                        <td><input type="number" id="midterm-${student.studentId}" value="${student.midterm || ''}" min="0" max="100" ${isFinalized ? 'disabled' : ''}></td>
                        <td><input type="number" id="finals-${student.studentId}" value="${student.finals || ''}" min="0" max="100" ${isFinalized ? 'disabled' : ''}></td>
                        <td id="final-grade-${student.studentId}" class="final-grade">${calculateFinalGrade(student) || '--'}</td>
                        <td id="letter-grade-${student.studentId}" class="letter-grade">${calculateLetterGrade(calculateFinalGrade(student)) || '--'}</td>
                        <td><span class="status-badge ${getGradeStatus(calculateFinalGrade(student))}">${getGradeStatusText(calculateFinalGrade(student))}</span></td>
                        <td>
                            <button onclick="saveStudentGrades('${student.studentId}')" ${isFinalized ? 'disabled' : ''}>Save</button>
                            <button class="history-button" onclick="showGradeHistory('${student.studentId}')">History</button>
                        </td>
                    </tr>
                    <tr class="grade-comments" data-student-id="${student.studentId}">
                        <td colspan="10">
                            <textarea id="comments-${student.studentId}" placeholder="Add comments or notes about this student's performance..." ${isFinalized ? 'disabled' : ''}>${student.comments || ''}</textarea>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Add event listeners to update final grade on input change
    courseGrades.students.forEach(student => {
        ['assignments', 'quizzes', 'midterm', 'finals'].forEach(component => {
            const input = document.getElementById(`${component}-${student.studentId}`);
            if (input) {
                input.addEventListener('input', () => {
                    updateStudentGrade(student.studentId);
                });
            }
        });
    });
    
    // Log course grade view
    logAccessEvent('course_grades_view', { courseId: courseId, period: period });
}

// Calculate final grade for a student
function calculateFinalGrade(student) {
    // Get weights from the form
    const assignmentsWeight = parseInt(document.getElementById('assignments-weight').value) / 100 || 0.3;
    const quizzesWeight = parseInt(document.getElementById('quizzes-weight').value) / 100 || 0.2;
    const midtermWeight = parseInt(document.getElementById('midterm-weight').value) / 100 || 0.2;
    const finalsWeight = parseInt(document.getElementById('finals-weight').value) / 100 || 0.3;
    
    // Get student grades (either from the form or from the student object)
    let assignments, quizzes, midterm, finals;
    
    // Try to get value from the form first
    const assignmentsInput = document.getElementById(`assignments-${student.studentId}`);
    const quizzesInput = document.getElementById(`quizzes-${student.studentId}`);
    const midtermInput = document.getElementById(`midterm-${student.studentId}`);
    const finalsInput = document.getElementById(`finals-${student.studentId}`);
    
    // If inputs exist, use those values, otherwise fall back to student object
    assignments = assignmentsInput ? parseFloat(assignmentsInput.value) : student.assignments;
    quizzes = quizzesInput ? parseFloat(quizzesInput.value) : student.quizzes;
    midterm = midtermInput ? parseFloat(midtermInput.value) : student.midterm;
    finals = finalsInput ? parseFloat(finalsInput.value) : student.finals;
    
    // If any component is missing, return null
    if (isNaN(assignments) || isNaN(quizzes) || isNaN(midterm) || isNaN(finals)) {
        return null;
    }
    
    // Calculate weighted final grade
    const finalGrade = 
        (assignments * assignmentsWeight) + 
        (quizzes * quizzesWeight) + 
        (midterm * midtermWeight) + 
        (finals * finalsWeight);
    
    // Round to 2 decimal places
    return Math.round(finalGrade * 100) / 100;
}

// Update a student's final grade display
function updateStudentGrade(studentId) {
    // Get the student data
    const courseId = document.getElementById('grade-course-filter').value;
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) return;
    
    const student = courseGrades.students.find(s => s.studentId === studentId);
    
    if (!student) return;
    
    // Create a temporary student object with form values
    const tempStudent = {
        studentId: studentId,
        assignments: parseFloat(document.getElementById(`assignments-${studentId}`).value),
        quizzes: parseFloat(document.getElementById(`quizzes-${studentId}`).value),
        midterm: parseFloat(document.getElementById(`midterm-${studentId}`).value),
        finals: parseFloat(document.getElementById(`finals-${studentId}`).value)
    };
    
    // Calculate final grade
    const finalGrade = calculateFinalGrade(tempStudent);
    const letterGrade = calculateLetterGrade(finalGrade);
    const status = getGradeStatus(finalGrade);
    
    // Update display
    document.getElementById(`final-grade-${studentId}`).textContent = finalGrade || '--';
    document.getElementById(`letter-grade-${studentId}`).textContent = letterGrade || '--';
    
    // Update status badge
    const statusCell = document.querySelector(`tr[data-student-id="${studentId}"] .status-badge`);
    if (statusCell) {
        statusCell.className = `status-badge ${status}`;
        statusCell.textContent = getGradeStatusText(finalGrade);
    }
}

// Calculate letter grade based on percentage
function calculateLetterGrade(percentage) {
    if (percentage === null || isNaN(percentage)) return '--';
    
    // Get thresholds from the form
    const aThreshold = parseInt(document.getElementById('scale-a').value) || 93;
    const aMinusThreshold = parseInt(document.getElementById('scale-a-minus').value) || 90;
    const bPlusThreshold = parseInt(document.getElementById('scale-b-plus').value) || 87;
    const bThreshold = parseInt(document.getElementById('scale-b').value) || 83;
    const bMinusThreshold = parseInt(document.getElementById('scale-b-minus').value) || 80;
    const cPlusThreshold = parseInt(document.getElementById('scale-c-plus').value) || 77;
    const cThreshold = parseInt(document.getElementById('scale-c').value) || 73;
    const cMinusThreshold = parseInt(document.getElementById('scale-c-minus').value) || 70;
    const dPlusThreshold = parseInt(document.getElementById('scale-d-plus').value) || 67;
    const dThreshold = parseInt(document.getElementById('scale-d').value) || 63;
    const dMinusThreshold = parseInt(document.getElementById('scale-d-minus').value) || 60;
    
    // Determine letter grade
    if (percentage >= aThreshold) return 'A';
    if (percentage >= aMinusThreshold) return 'A-';
    if (percentage >= bPlusThreshold) return 'B+';
    if (percentage >= bThreshold) return 'B';
    if (percentage >= bMinusThreshold) return 'B-';
    if (percentage >= cPlusThreshold) return 'C+';
    if (percentage >= cThreshold) return 'C';
    if (percentage >= cMinusThreshold) return 'C-';
    if (percentage >= dPlusThreshold) return 'D+';
    if (percentage >= dThreshold) return 'D';
    if (percentage >= dMinusThreshold) return 'D-';
    return 'F';
}

// Get grade status (passing, failing, incomplete)
function getGradeStatus(finalGrade) {
    if (finalGrade === null || isNaN(finalGrade)) return 'incomplete';
    
    // Get passing threshold (D- or 60% by default)
    const passingThreshold = parseInt(document.getElementById('scale-d-minus').value) || 60;
    
    if (finalGrade >= passingThreshold) {
        return 'passing';
    } else {
        return 'failing';
    }
}

// Get grade status text
function getGradeStatusText(finalGrade) {
    const status = getGradeStatus(finalGrade);
    
    switch (status) {
        case 'passing':
            return 'Passing';
        case 'failing':
            return 'Failing';
        case 'incomplete':
            return 'Incomplete';
        case 'withdrawn':
            return 'Withdrawn';
        default:
            return 'Unknown';
    }
}

// Save grades for a single student
function saveStudentGrades(studentId) {
    const courseId = document.getElementById('grade-course-filter').value;
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        alert('Error: Course not found');
        return;
    }
    
    // Find the student
    const studentIndex = courseGrades.students.findIndex(s => s.studentId === studentId);
    
    if (studentIndex === -1) {
        alert('Error: Student not found');
        return;
    }
    
    // Get values from form
    const assignments = parseFloat(document.getElementById(`assignments-${studentId}`).value);
    const quizzes = parseFloat(document.getElementById(`quizzes-${studentId}`).value);
    const midterm = parseFloat(document.getElementById(`midterm-${studentId}`).value);
    const finals = parseFloat(document.getElementById(`finals-${studentId}`).value);
    const comments = document.getElementById(`comments-${studentId}`).value;
    
    // Create history entry before updating
    if (!courseGrades.students[studentIndex].history) {
        courseGrades.students[studentIndex].history = [];
    }
    
    // Add history entry
    courseGrades.students[studentIndex].history.push({
        timestamp: new Date().toISOString(),
        assignments: courseGrades.students[studentIndex].assignments,
        quizzes: courseGrades.students[studentIndex].quizzes,
        midterm: courseGrades.students[studentIndex].midterm,
        finals: courseGrades.students[studentIndex].finals,
        comments: courseGrades.students[studentIndex].comments,
        teacher: teacherData.name
    });
    
    // Update student grades
    courseGrades.students[studentIndex].assignments = assignments;
    courseGrades.students[studentIndex].quizzes = quizzes;
    courseGrades.students[studentIndex].midterm = midterm;
    courseGrades.students[studentIndex].finals = finals;
    courseGrades.students[studentIndex].comments = comments;
    
    // Calculate final grade
    const finalGrade = calculateFinalGrade(courseGrades.students[studentIndex]);
    const letterGrade = calculateLetterGrade(finalGrade);
    
    // Update display
    document.getElementById(`final-grade-${studentId}`).textContent = finalGrade || '--';
    document.getElementById(`letter-grade-${studentId}`).textContent = letterGrade || '--';
    
    // Update status badge
    const statusCell = document.querySelector(`tr[data-student-id="${studentId}"] .status-badge`);
    if (statusCell) {
        const status = getGradeStatus(finalGrade);
        statusCell.className = `status-badge ${status}`;
        statusCell.textContent = getGradeStatusText(finalGrade);
    }
    
    // In a real app, this would send data to the server
    // For now, update the local data
    teacherData.grades[courseId] = courseGrades;
    
    // Show success message
    alert(`Grades saved for ${courseGrades.students[studentIndex].studentName}.`);
    
    // Log the grade update
    logAccessEvent('student_grade_update', {
        courseId: courseId,
        studentId: studentId,
        studentName: courseGrades.students[studentIndex].studentName
    });
}

// Save all grades
function saveAllGrades() {
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!courseId) {
        alert('Please select a course first.');
        return;
    }
    
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        alert('Error: Course not found');
        return;
    }
    
    // Get weights
    const assignmentsWeight = parseInt(document.getElementById('assignments-weight').value) / 100;
    const quizzesWeight = parseInt(document.getElementById('quizzes-weight').value) / 100;
    const midtermWeight = parseInt(document.getElementById('midterm-weight').value) / 100;
    const finalsWeight = parseInt(document.getElementById('finals-weight').value) / 100;
    
    // Check if weights sum to 1
    const totalWeight = assignmentsWeight + quizzesWeight + midtermWeight + finalsWeight;
    if (Math.abs(totalWeight - 1) > 0.01) {
        alert('Grading component weights must add up to 100%. Please adjust the weights.');
        return;
    }
    
    // Update each student's grades
    courseGrades.students.forEach(student => {
        // Only update if the student has inputs on the page
        const assignmentsInput = document.getElementById(`assignments-${student.studentId}`);
        const quizzesInput = document.getElementById(`quizzes-${student.studentId}`);
        const midtermInput = document.getElementById(`midterm-${student.studentId}`);
        const finalsInput = document.getElementById(`finals-${student.studentId}`);
        const commentsInput = document.getElementById(`comments-${student.studentId}`);
        
        if (assignmentsInput && quizzesInput && midtermInput && finalsInput) {
            // Create history entry before updating
            if (!student.history) {
                student.history = [];
            }
            
            // Add history entry
            student.history.push({
                timestamp: new Date().toISOString(),
                assignments: student.assignments,
                quizzes: student.quizzes,
                midterm: student.midterm,
                finals: student.finals,
                comments: student.comments,
                teacher: teacherData.name
            });
            
            // Update student grades
            student.assignments = parseFloat(assignmentsInput.value) || null;
            student.quizzes = parseFloat(quizzesInput.value) || null;
            student.midterm = parseFloat(midtermInput.value) || null;
            student.finals = parseFloat(finalsInput.value) || null;
            student.comments = commentsInput ? commentsInput.value : '';
        }
    });
    
    // Save updated weights
    courseGrades.gradingComponents = {
        assignments: assignmentsWeight,
        quizzes: quizzesWeight,
        midterm: midtermWeight,
        finals: finalsWeight
    };
    
    // In a real app, this would send data to the server
    // For now, update the local data
    teacherData.grades[courseId] = courseGrades;
    
    // Reload grade sheet to reflect changes
    loadGradeSheet();
    
    // Show success message
    alert('All grades have been saved successfully.');
    
    // Log the batch grade update
    logAccessEvent('batch_grade_update', {
        courseId: courseId,
        courseName: courseGrades.courseName,
        studentCount: courseGrades.students.length
    });
}

// Recalculate all grades
function recalculateAllGrades() {
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!courseId) {
        alert('Please select a course first.');
        return;
    }
    
    // Get all student rows
    const studentRows = document.querySelectorAll('#grades-table tbody tr[data-student-id]');
    
    // Update each student's grade
    studentRows.forEach(row => {
        const studentId = row.getAttribute('data-student-id');
        updateStudentGrade(studentId);
    });
    
    // Show confirmation
    alert('All grades have been recalculated based on the current grading components.');
}

// Finalize grades for a course
function finalizeGrades() {
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!courseId) {
        alert('Please select a course first.');
        return;
    }
    
    // Confirm finalization
    if (!confirm('Are you sure you want to finalize grades for this course? Once finalized, grades cannot be changed without approval from the department chair.')) {
        return;
    }
    
    // Save all grades first
    saveAllGrades();
    
    // Mark grades as finalized
    const courseGrades = teacherData.grades[courseId];
    courseGrades.isFinalized = true;
    courseGrades.finalizedDate = new Date().toISOString();
    courseGrades.finalizedBy = teacherData.name;
    
    // Update the local data
    teacherData.grades[courseId] = courseGrades;
    
    // Reload grade sheet to reflect changes
    loadGradeSheet();
    
    // Show success message
    alert(`Grades for ${courseGrades.courseName} have been finalized and submitted.`);
    
    // Log the grade finalization
    logAccessEvent('grades_finalized', {
        courseId: courseId,
        courseName: courseGrades.courseName,
        studentCount: courseGrades.students.length,
        finalizedDate: courseGrades.finalizedDate
    });
}

// Show grade history for a student
function showGradeHistory(studentId) {
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!courseId) {
        alert('Please select a course first.');
        return;
    }
    
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        alert('Error: Course not found');
        return;
    }
    
    // Find the student
    const student = courseGrades.students.find(s => s.studentId === studentId);
    
    if (!student) {
        alert('Error: Student not found');
        return;
    }
    
    // Get student history (create empty array if none exists)
    const history = student.history || [];
    
    // Add current grades to history for display
    const fullHistory = [...history, {
        timestamp: 'Current',
        assignments: student.assignments,
        quizzes: student.quizzes,
        midterm: student.midterm,
        finals: student.finals,
        comments: student.comments,
        teacher: teacherData.name
    }];
    
    // Get student info element
    const studentInfoElement = document.getElementById('history-student-info');
    studentInfoElement.innerHTML = `
        <div class="student-details">
            <h3>${student.studentName}</h3>
            <p>Student ID: ${studentId}</p>
            <p>Course: ${courseGrades.courseName}</p>
        </div>
    `;
    
    // Get history table element
    const historyTableElement = document.getElementById('grade-history-table');
    
    // If no history, show message
    if (history.length === 0) {
        historyTableElement.innerHTML = `
            <p>No grade history available for this student. Current grades shown below.</p>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Assignments</th>
                        <th>Quizzes</th>
                        <th>Midterm</th>
                        <th>Finals</th>
                        <th>Comments</th>
                        <th>Updated By</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Current</td>
                        <td>${student.assignments || '--'}</td>
                        <td>${student.quizzes || '--'}</td>
                        <td>${student.midterm || '--'}</td>
                        <td>${student.finals || '--'}</td>
                        <td>${student.comments || '--'}</td>
                        <td>${teacherData.name}</td>
                    </tr>
                </tbody>
            </table>
        `;
    } else {
        // Show history table
        historyTableElement.innerHTML = `
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Assignments</th>
                        <th>Quizzes</th>
                        <th>Midterm</th>
                        <th>Finals</th>
                        <th>Comments</th>
                        <th>Updated By</th>
                    </tr>
                </thead>
                <tbody>
                    ${fullHistory.reverse().map(entry => `
                        <tr>
                            <td>${entry.timestamp === 'Current' ? 'Current' : formatDate(entry.timestamp)}</td>
                            <td>${entry.assignments || '--'}</td>
                            <td>${entry.quizzes || '--'}</td>
                            <td>${entry.midterm || '--'}</td>
                            <td>${entry.finals || '--'}</td>
                            <td>${entry.comments || '--'}</td>
                            <td>${entry.teacher}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    // Show the modal
    document.getElementById('grade-history-modal').style.display = 'block';
    
    // Log history view
    logAccessEvent('grade_history_view', {
        courseId: courseId,
        studentId: studentId,
        studentName: student.studentName
    });
}

// Close the grade history modal
function closeHistoryModal() {
    document.getElementById('grade-history-modal').style.display = 'none';
}

// Filter the grade table based on search and status filter
function filterGradeTable() {
    const searchTerm = document.getElementById('student-filter').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    // Get all student rows
    const studentRows = document.querySelectorAll('#grades-table tbody tr[data-student-id]');
    
    // Filter rows
    studentRows.forEach(row => {
        const studentId = row.getAttribute('data-student-id');
        const studentName = row.getAttribute('data-student-name').toLowerCase();
        const statusBadge = row.querySelector('.status-badge');
        const status = statusBadge ? statusBadge.className.split(' ')[1] : '';
        
        // Check if row matches filters
        const matchesSearch = !searchTerm || studentName.includes(searchTerm) || studentId.includes(searchTerm);
        const matchesStatus = !statusFilter || status === statusFilter;
        
        // Show/hide row
        if (matchesSearch && matchesStatus) {
            row.style.display = '';
            // Also show the comments row
            const commentsRow = document.querySelector(`.grade-comments[data-student-id="${studentId}"]`);
            if (commentsRow) {
                commentsRow.style.display = '';
            }
        } else {
            row.style.display = 'none';
            // Also hide the comments row
            const commentsRow = document.querySelector(`.grade-comments[data-student-id="${studentId}"]`);
            if (commentsRow) {
                commentsRow.style.display = 'none';
            }
        }
    });
}

// Toggle batch upload section display
function toggleBatchUpload() {
    const batchUploadSection = document.getElementById('batch-upload-section');
    if (batchUploadSection.style.display === 'none' || !batchUploadSection.style.display) {
        batchUploadSection.style.display = 'block';
    } else {
        batchUploadSection.style.display = 'none';
    }
}

// Download grade template CSV
function downloadGradeTemplate() {
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!courseId) {
        alert('Please select a course first.');
        return;
    }
    
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        alert('Error: Course not found');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Student ID,Student Name,Assignments,Quizzes,Midterm,Finals,Comments\n';
    
    // Add student data
    courseGrades.students.forEach(student => {
        csvContent += `${student.studentId},${student.studentName},${student.assignments || ''},${student.quizzes || ''},${student.midterm || ''},${student.finals || ''},'${student.comments || ''}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${courseGrades.courseName}_grades_template.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    
    // Log template download
    logAccessEvent('grade_template_download', {
        courseId: courseId,
        courseName: courseGrades.courseName
    });
}

// Upload and process grade CSV
function uploadGradeCSV() {
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!courseId) {
        alert('Please select a course first.');
        return;
    }
    
    const fileInput = document.getElementById('grade-csv-upload');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a CSV file to upload.');
        return;
    }
    
    const file = fileInput.files[0];
    
    // Check file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Please upload a CSV file.');
        return;
    }
    
    // Read file
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const contents = e.target.result;
        
        // Process CSV
        try {
            processGradeCSV(contents, courseId);
        } catch (error) {
            alert('Error processing CSV: ' + error.message);
        }
    };
    
    reader.onerror = function() {
        alert('Error reading file.');
    };
    
    reader.readAsText(file);
}

// Process grade CSV content
function processGradeCSV(csvContent, courseId) {
    // Get course data
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        throw new Error('Course not found');
    }
    
    // Parse CSV
    const lines = csvContent.split('\n');
    
    // Check header
    const header = lines[0].trim();
    const expectedHeader = ['Student ID', 'Student Name', 'Assignments', 'Quizzes', 'Midterm', 'Finals', 'Comments'];
    
    // Simple validation (in a real app, would be more robust)
    if (!header.includes('Student ID') || !header.includes('Assignments')) {
        throw new Error('Invalid CSV format. Please use the template provided.');
    }
    
    // Process each line
    const updatedStudents = [];
    let errorLines = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        // Split by comma (simple CSV parser, doesn't handle escaped commas in fields)
        const values = line.split(',');
        
        // Validate line
        if (values.length < 4) {
            errorLines.push(i + 1);
            continue;
        }
        
        const studentId = values[0].trim();
        const assignments = parseFloat(values[2]) || null;
        const quizzes = parseFloat(values[3]) || null;
        const midterm = parseFloat(values[4]) || null;
        const finals = parseFloat(values[5]) || null;
        const comments = values[6] ? values[6].trim() : '';
        
        // Find student in course data
        const studentIndex = courseGrades.students.findIndex(s => s.studentId === studentId);
        
        if (studentIndex === -1) {
            errorLines.push(i + 1);
            continue;
        }
        
        // Create history entry before updating
        if (!courseGrades.students[studentIndex].history) {
            courseGrades.students[studentIndex].history = [];
        }
        
        // Add history entry
        courseGrades.students[studentIndex].history.push({
            timestamp: new Date().toISOString(),
            assignments: courseGrades.students[studentIndex].assignments,
            quizzes: courseGrades.students[studentIndex].quizzes,
            midterm: courseGrades.students[studentIndex].midterm,
            finals: courseGrades.students[studentIndex].finals,
            comments: courseGrades.students[studentIndex].comments,
            teacher: teacherData.name
        });
        
        // Update student grades
        courseGrades.students[studentIndex].assignments = assignments;
        courseGrades.students[studentIndex].quizzes = quizzes;
        courseGrades.students[studentIndex].midterm = midterm;
        courseGrades.students[studentIndex].finals = finals;
        courseGrades.students[studentIndex].comments = comments;
        
        updatedStudents.push(courseGrades.students[studentIndex].studentName);
    }
    
    // Update the data
    teacherData.grades[courseId] = courseGrades;
    
    // Reload grade sheet
    loadGradeSheet();
    
    // Show results
    if (errorLines.length > 0) {
        alert(`Updated ${updatedStudents.length} students successfully. \n\nThere were issues with ${errorLines.length} lines in the CSV (lines: ${errorLines.join(', ')}). Please check these lines and try again.`);
    } else {
        alert(`Successfully updated grades for ${updatedStudents.length} students.`);
    }
    
    // Reset file input
    document.getElementById('grade-csv-upload').value = '';
    
    // Log batch upload
    logAccessEvent('grade_csv_upload', {
        courseId: courseId,
        courseName: courseGrades.courseName,
        updatedCount: updatedStudents.length,
        errorCount: errorLines.length
    });
}

// Export grades to CSV
function exportGradesToCSV() {
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!courseId) {
        alert('Please select a course first.');
        return;
    }
    
    const courseGrades = teacherData.grades[courseId];
    
    if (!courseGrades) {
        alert('Error: Course not found');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Student ID,Student Name,Assignments,Quizzes,Midterm,Finals,Final Grade,Letter Grade,Status,Comments\n';
    
    // Add student data
    courseGrades.students.forEach(student => {
        const finalGrade = calculateFinalGrade(student);
        const letterGrade = calculateLetterGrade(finalGrade);
        const status = getGradeStatusText(finalGrade);
        
        csvContent += `${student.studentId},${student.studentName},${student.assignments || ''},${student.quizzes || ''},${student.midterm || ''},${student.finals || ''},${finalGrade || ''},${letterGrade || ''},${status},'${student.comments || ''}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${courseGrades.courseName}_grades_export.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    
    // Log export
    logAccessEvent('grade_export', {
        courseId: courseId,
        courseName: courseGrades.courseName,
        studentCount: courseGrades.students.length
    });
}

// Format date helper
function formatDate(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

// Update grade sheet based on current settings
function updateGradeSheet() {
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!courseId) return;
    
    // Get all student rows
    const studentRows = document.querySelectorAll('#grades-table tbody tr[data-student-id]');
    
    // Update each student's grade display
    studentRows.forEach(row => {
        const studentId = row.getAttribute('data-student-id');
        updateStudentGrade(studentId);
    });
}

// Log security and access events
function logAccessEvent(eventType, details = {}) {
    // In a real app, this would send to a server endpoint
    // For demo purposes, just log to console and add to local storage for the admin security logs
    
    const event = {
        timestamp: new Date().toISOString(),
        userId: teacherData.id || 'teacher-001',
        userName: teacherData.name || 'Teacher User',
        userRole: 'teacher',
        eventType: eventType,
        details: details
    };
    
    console.log('Access Event:', event);
    
    // Add to local storage if available
    if (window.localStorage) {
        const accessLogs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
        accessLogs.push({
            userId: event.userId,
            page: 'grade-management.html',
            timestamp: event.timestamp,
            userAgent: navigator.userAgent,
            ipAddress: '127.0.0.1' // Placeholder
        });
        
        // Keep only last 100 logs
        if (accessLogs.length > 100) {
            accessLogs.shift();
        }
        
        localStorage.setItem('accessLogs', JSON.stringify(accessLogs));
        
        // Also add to security logs for some events
        if (['grades_finalized', 'grade_csv_upload'].includes(eventType)) {
            const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
            securityLogs.push({
                userId: event.userId,
                event: eventType,
                timestamp: event.timestamp,
                userAgent: navigator.userAgent,
                ipAddress: '127.0.0.1',
                isSuccess: true,
                details: details
            });
            
            // Keep only last 100 logs
            if (securityLogs.length > 100) {
                securityLogs.shift();
            }
            
            localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
        }
    }
}

// Logout function
function logout() {
    // Use session manager if available
    if (window.SessionManager) {
        SessionManager.logoutUser('You have been logged out successfully.');
        return false; // Prevent default link behavior
    }
    
    // Basic logout
    console.log('Logging out...');
    window.location.href = 'loginpage.html';
    return false;
}

/**
 * Grade Analysis Functions - Student Reports and Class Rankings
 * These functions provide detailed student performance insights and rankings
 */

// Populate student selector dropdown for individual reports
function populateStudentSelector(courseId) {
    const studentSelector = document.getElementById('student-report-selector');
    if (!studentSelector) return;
    
    // Clear existing options except the first one
    studentSelector.innerHTML = '<option value="">Choose a student...</option>';
    
    // Get course data
    const courseData = teacherData.grades[courseId];
    if (!courseData || !courseData.students) return;
    
    // Add student options sorted by name
    const sortedStudents = [...courseData.students].sort((a, b) => 
        a.studentName.localeCompare(b.studentName));
    
    sortedStudents.forEach(student => {
        const option = document.createElement('option');
        option.value = student.studentId;
        option.textContent = `${student.studentName} (${student.studentId})`;
        studentSelector.appendChild(option);
    });
}

// Load and display an individual student report
function loadStudentReport() {
    const studentId = document.getElementById('student-report-selector').value;
    const courseId = document.getElementById('grade-course-filter').value;
    
    if (!studentId || !courseId) {
        return;
    }
    
    // Get course data
    const courseData = teacherData.grades[courseId];
    if (!courseData || !courseData.students) return;
    
    // Find student data
    const studentData = courseData.students.find(s => s.studentId === studentId);
    if (!studentData) return;
    
    // Generate report using the grade-analysis.js module
    const report = window.GradeAnalysis.generateStudentReport(studentData, courseData);
    
    // Display the report
    displayStudentReport(report, courseData);
    
    // Log the report generation
    logAccessEvent('student_report_generated', { studentId, courseId });
}

// Display a student report in the UI
function displayStudentReport(report, courseData) {
    const reportContainer = document.getElementById('student-report-container');
    if (!reportContainer || !report) return;
    
    // Create report content
    let reportHTML = `
        <div class="report-header">
            <h4>${report.studentName} (${report.studentId})</h4>
            <p><strong>Course:</strong> ${report.courseName}</p>
            <p>
                <strong>Overall Grade:</strong> ${report.overallGrade.toFixed(2)}% 
                (${report.letterGrade}, ${report.numericGrade})
                <span class="performance-trend trend-${report.performanceTrend}">
                    ${report.performanceTrend.charAt(0).toUpperCase() + report.performanceTrend.slice(1)}
                </span>
            </p>
            <p><strong>Status:</strong> <span class="grade-status-${report.status}">${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span></p>
        </div>
        
        <div class="report-section">
            <h4>Component Scores</h4>
            <div class="component-scores">
    `;
    
    // Add component scores
    for (const component in report.components) {
        const componentData = report.components[component];
        reportHTML += `
            <div class="score-item">
                <div class="score-label">${component.charAt(0).toUpperCase() + component.slice(1)} (${componentData.weight}%)</div>
                <div class="score-value">${componentData.score !== null ? componentData.score.toFixed(2) + '%' : 'Not Graded'}</div>
                <div class="score-comparison">
                    Class Avg: ${componentData.classAverage.toFixed(2)}% 
                    (${componentData.percentageOfClassAverage > 100 ? '+' : ''}${(componentData.percentageOfClassAverage - 100).toFixed(2)}%)
                </div>
                <div class="score-performance">${componentData.performance}</div>
            </div>
        `;
    }
    
    reportHTML += `
            </div>
        </div>
        
        <div class="report-section">
            <h4>Performance Analysis</h4>
    `;
    
    // Add strengths and areas for improvement
    if (report.strengths.length > 0) {
        reportHTML += `
            <p><strong>Strengths:</strong> 
                ${report.strengths.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
            </p>
        `;
    }
    
    if (report.areasForImprovement.length > 0) {
        reportHTML += `
            <p><strong>Areas for Improvement:</strong> 
                ${report.areasForImprovement.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}
            </p>
        `;
    }
    
    // Add recommendations
    if (report.recommendations.length > 0) {
        reportHTML += `
            <div class="report-section">
                <h4>Recommendations</h4>
                <ul>
                    ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Add comments
    if (report.comments) {
        reportHTML += `
            <div class="report-section">
                <h4>Teacher Comments</h4>
                <p>${report.comments}</p>
            </div>
        `;
    }
    
    reportHTML += `
        <div class="report-actions">
            <button class="primary-btn" onclick="showDetailedStudentReport('${report.studentId}')">View Detailed Report</button>
        </div>
    `;
    
    // Update the report container
    reportContainer.innerHTML = reportHTML;
}

// Generate and display class rankings
function generateClassRankings(courseId) {
    // Get course data
    const courseData = teacherData.grades[courseId];
    if (!courseData || !courseData.students) return;
    
    // Generate rankings using the grade-analysis.js module
    const rankings = window.GradeAnalysis.generateClassRankings(courseData);
    
    // Display the rankings
    displayClassRankings(rankings);
    
    // Log the rankings generation
    logAccessEvent('class_rankings_generated', { courseId });
}

// Display class rankings in the UI
function displayClassRankings(rankings) {
    const tableBody = document.getElementById('ranking-table-body');
    if (!tableBody || !rankings) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add ranking rows
    rankings.forEach(student => {
        const row = document.createElement('tr');
        
        // Add class for top ranks
        if (student.rank <= 3) {
            row.classList.add(`rank-${student.rank}`);
        }
        
        row.innerHTML = `
            <td>${student.rank}</td>
            <td>${student.studentId}</td>
            <td>${student.studentName}</td>
            <td>${student.overallScore.toFixed(2)}%</td>
            <td>${student.letterGrade}</td>
            <td>${student.numericGrade}</td>
            <td>Top ${student.percentile}%</td>
            <td>${student.status}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update the at-risk students list
function updateAtRiskList() {
    const courseId = document.getElementById('grade-course-filter').value;
    if (!courseId) return;
    
    // Get course data
    const courseData = teacherData.grades[courseId];
    if (!courseData || !courseData.students) return;
    
    // Get threshold value
    const thresholdInput = document.getElementById('at-risk-threshold');
    const threshold = thresholdInput ? parseInt(thresholdInput.value) || 70 : 70;
    
    // Generate at-risk list using the grade-analysis.js module
    const atRiskStudents = window.GradeAnalysis.identifyAtRiskStudents(courseData, threshold);
    
    // Display the at-risk list
    displayAtRiskStudents(atRiskStudents, threshold);
    
    // Log the at-risk list generation
    logAccessEvent('at_risk_students_identified', { courseId, threshold });
}

// Display at-risk students in the UI
function displayAtRiskStudents(atRiskStudents, threshold) {
    const tableBody = document.getElementById('at-risk-table-body');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Check if no students are at risk
    if (atRiskStudents.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="text-center">No students below the threshold of ${threshold}%</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    // Add at-risk student rows
    atRiskStudents.forEach(student => {
        const row = document.createElement('tr');
        
        // Generate weak areas display
        const weakAreasHTML = student.weakAreas.length > 0 ?
            `<div class="weak-areas-list">${
                student.weakAreas.map(area => 
                    `<span class="weak-area-tag">${area.component} (${area.score.toFixed(1)}%)</span>`
                ).join('')
            }</div>` :
            'Overall performance';
        
        row.innerHTML = `
            <td>${student.studentId}</td>
            <td>${student.studentName}</td>
            <td>${student.overallScore.toFixed(2)}%</td>
            <td>${weakAreasHTML}</td>
            <td>${student.status}</td>
            <td>
                <button class="small-btn" onclick="showDetailedStudentReport('${student.studentId}')">View Report</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Show detailed student report in a modal
function showDetailedStudentReport(studentId) {
    const courseId = document.getElementById('grade-course-filter').value;
    if (!courseId || !studentId) return;
    
    // Get course data
    const courseData = teacherData.grades[courseId];
    if (!courseData || !courseData.students) return;
    
    // Find student data
    const studentData = courseData.students.find(s => s.studentId === studentId);
    if (!studentData) return;
    
    // Generate report
    const report = window.GradeAnalysis.generateStudentReport(studentData, courseData);
    
    // Display in modal
    const reportDetail = document.getElementById('student-report-detail');
    if (!reportDetail) return;
    
    // Create detailed report content with more extensive information
    let reportHTML = `
        <div class="detailed-report">
            <div class="report-header">
                <h3>${report.studentName}</h3>
                <p><strong>Student ID:</strong> ${report.studentId}</p>
                <p><strong>Course:</strong> ${report.courseName}</p>
                <p>
                    <strong>Overall Grade:</strong> ${report.overallGrade.toFixed(2)}% 
                    (${report.letterGrade}, ${report.numericGrade})
                    <span class="performance-trend trend-${report.performanceTrend}">
                        ${report.performanceTrend.charAt(0).toUpperCase() + report.performanceTrend.slice(1)}
                    </span>
                </p>
                <p><strong>Status:</strong> <span class="grade-status-${report.status}">${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span></p>
            </div>
            
            <div class="report-section">
                <h4>Component Breakdown</h4>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Weight</th>
                            <th>Score</th>
                            <th>Class Avg</th>
                            <th>Comparison</th>
                            <th>Performance</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Add component rows
    for (const component in report.components) {
        const componentData = report.components[component];
        const comparisonValue = componentData.percentageOfClassAverage - 100;
        const comparisonClass = comparisonValue > 0 ? 'text-success' : comparisonValue < 0 ? 'text-danger' : 'text-neutral';
        
        reportHTML += `
            <tr>
                <td>${component.charAt(0).toUpperCase() + component.slice(1)}</td>
                <td>${componentData.weight}%</td>
                <td>${componentData.score !== null ? componentData.score.toFixed(2) + '%' : 'Not Graded'}</td>
                <td>${componentData.classAverage.toFixed(2)}%</td>
                <td class="${comparisonClass}">${comparisonValue > 0 ? '+' : ''}${comparisonValue.toFixed(2)}%</td>
                <td>${componentData.performance}</td>
            </tr>
        `;
    }
    
    reportHTML += `
                    </tbody>
                </table>
            </div>
            
            <div class="report-section">
                <h4>Performance Analysis</h4>
                <div class="performance-insights">
    `;
    
    // Add strengths and areas for improvement
    reportHTML += `
        <div class="insight-section">
            <h5>Strengths</h5>
            ${report.strengths.length > 0 ?
                `<ul>${report.strengths.map(s => `<li>${s.charAt(0).toUpperCase() + s.slice(1)}</li>`).join('')}</ul>` :
                '<p>No specific strengths identified.</p>'
            }
        </div>
        
        <div class="insight-section">
            <h5>Areas for Improvement</h5>
            ${report.areasForImprovement.length > 0 ?
                `<ul>${report.areasForImprovement.map(a => `<li>${a.charAt(0).toUpperCase() + a.slice(1)}</li>`).join('')}</ul>` :
                '<p>No specific areas for improvement identified.</p>'
            }
        </div>
    `;
    
    reportHTML += `
                </div>
            </div>
            
            <div class="report-section">
                <h4>Recommendations</h4>
                ${report.recommendations.length > 0 ?
                    `<ul>${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>` :
                    '<p>No specific recommendations at this time.</p>'
                }
            </div>
    `;
    
    // Add performance trend analysis if history exists
    if (studentData.history && studentData.history.length > 0) {
        reportHTML += `
            <div class="report-section">
                <h4>Performance History</h4>
                <p>Performance trend: <strong>${report.performanceTrend.charAt(0).toUpperCase() + report.performanceTrend.slice(1)}</strong></p>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Assignments</th>
                            <th>Quizzes</th>
                            <th>Midterm</th>
                            <th>Finals</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Sort history by timestamp (newest first)
        const sortedHistory = [...studentData.history].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp));
        
        // Add history rows
        sortedHistory.forEach(entry => {
            reportHTML += `
                <tr>
                    <td>${formatDate(entry.timestamp)}</td>
                    <td>${entry.assignments !== null ? entry.assignments + '%' : '-'}</td>
                    <td>${entry.quizzes !== null ? entry.quizzes + '%' : '-'}</td>
                    <td>${entry.midterm !== null ? entry.midterm + '%' : '-'}</td>
                    <td>${entry.finals !== null ? entry.finals + '%' : '-'}</td>
                    <td>${entry.comments || '-'}</td>
                </tr>
            `;
        });
        
        reportHTML += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Add comments
    reportHTML += `
        <div class="report-section">
            <h4>Teacher Comments</h4>
            <p>${report.comments || 'No comments provided.'}</p>
        </div>
    `;
    
    reportHTML += `</div>`;
    
    // Update the report detail container
    reportDetail.innerHTML = reportHTML;
    
    // Show the modal
    document.getElementById('student-report-modal').style.display = 'block';
    
    // Log the detailed report view
    logAccessEvent('student_detailed_report_viewed', { studentId, courseId });
}

// Close the student report modal
function closeStudentReportModal() {
    document.getElementById('student-report-modal').style.display = 'none';
}

// Print student report
function printStudentReport() {
    const reportContent = document.getElementById('student-report-detail').innerHTML;
    
    // Create a printable window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Student Performance Report</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                    h3, h4, h5 { margin-top: 20px; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f4f4f4; }
                    ul { padding-left: 20px; }
                    .report-section { margin-bottom: 30px; }
                    .text-success { color: green; }
                    .text-danger { color: red; }
                    .text-neutral { color: #555; }
                    .report-header { border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }
                    .performance-trend { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 0.85rem; margin-left: 10px; }
                    .trend-improving { background-color: #e8f5e9; color: #2e7d32; }
                    .trend-declining { background-color: #ffebee; color: #c62828; }
                    .trend-steady { background-color: #e3f2fd; color: #1565c0; }
                    @media print {
                        body { margin: 0; padding: 20px; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    ${reportContent}
                </div>
                <div style="text-align: center; margin-top: 30px; font-size: 0.8rem; color: #777;">
                    <p>Generated on ${new Date().toLocaleString()} | UPHSL School Enrollment System</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
        </html>
    `);
    
    // Log the print action
    logAccessEvent('student_report_printed');
}

// Email student report
function emailStudentReport() {
    const courseId = document.getElementById('grade-course-filter').value;
    const studentId = document.querySelector('#student-report-detail .student-id')?.textContent || 
                    document.querySelector('#student-report-detail strong:contains("Student ID")').nextSibling.textContent.trim();
    
    if (!courseId || !studentId) {
        alert('Could not determine course or student information.');
        return;
    }
    
    // In a real implementation, this would trigger an API call to send the email
    // For this mock, we'll just show a success message
    alert(`Report would be emailed to student with ID: ${studentId}\nThis feature would connect to an email service in a production environment.`);
    
    // Log the email action
    logAccessEvent('student_report_emailed', { studentId, courseId });
}
