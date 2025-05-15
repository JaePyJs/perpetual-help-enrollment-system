// Student Enrollment JavaScript

// Import subjects data from separate file
// In production, this would be fetched from the API

document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const newEnrollmentBtn = document.getElementById('new-enrollment-btn');
  const viewEnrollmentBtn = document.getElementById('view-enrollment-btn');
  const enrollmentFormContainer = document.getElementById('enrollment-form-container');
  const enrollmentDetails = document.getElementById('enrollment-details');
  const enrollmentForm = document.getElementById('enrollment-form');
  const cancelEnrollmentBtn = document.getElementById('cancel-enrollment');
  const backToEnrollmentBtn = document.getElementById('back-to-enrollment');
  const addDropBtn = document.getElementById('add-drop-btn');
  const viewPaymentBtn = document.getElementById('view-payment-btn');
  const printAssessmentBtn = document.getElementById('print-assessment-btn');
  const subjectListContainer = document.getElementById('subject-list');
  
  // Elements for enrollment summary
  const selectedCountElem = document.getElementById('selected-count');
  const totalUnitsElem = document.getElementById('total-units');
  const estimatedTuitionElem = document.getElementById('estimated-tuition');
  
  // Track currently selected subjects and their sections
  const selectedSubjects = [];
  
  // Student info (would be fetched from API in production)
  const studentData = {
    id: 'm23-1470-578',
    name: 'Juan Dela Cruz',
    department: 'BSIT',
    program: 'Bachelor of Science in Information Technology',
    yearLevel: 2,
    email: 'm23-1470-578@manila.uphsl.edu.ph',
    completedCourses: ['IT101', 'IT102', 'GE101', 'GE102', 'NSTP1', 'NSTP2'], // Track completed prerequisites
    currentEnrollment: {
      exists: true,
      academicYear: '2024-2025',
      semester: '1st',
      status: 'pending',
      paymentStatus: 'unpaid',
      subjects: [
        {
          code: 'IT201',
          title: 'Data Structures and Algorithms',
          units: '3 (2 lec, 1 lab)',
          schedule: 'M/W 9:00AM-10:30AM, Rm 305',
          section: 'A',
          status: 'enrolled'
        },
        {
          code: 'IT202',
          title: 'Information Management',
          units: '3 (2 lec, 1 lab)',
          schedule: 'M/W 1:00PM-2:30PM, Rm 305',
          section: 'A',
          status: 'enrolled'
        },
        {
          code: 'GE103',
          title: 'Purposive Communication',
          units: '3 (3 lec, 0 lab)',
          schedule: 'M/W 3:00PM-4:30PM, Rm 205',
          section: 'A',
          status: 'enrolled'
        }
      ],
      financials: {
        tuitionFee: 9000.00,
        labFee: 1000.00,
        miscFee: 1300.00,
        totalAssessment: 11300.00,
        amountPaid: 0.00,
        balance: 11300.00
      }
    }
  };
  
  // Academic calendar data (would be fetched from API in production)
  const academicCalendar = {
    academicYear: '2024-2025',
    semester: '1st',
    regularEnrollment: {
      start: 'May 15, 2025',
      end: 'June 15, 2025'
    },
    lateEnrollment: {
      start: 'June 16, 2025',
      end: 'June 30, 2025'
    },
    addDrop: {
      start: 'June 16, 2025',
      end: 'July 15, 2025'
    },
    classesStart: 'June 5, 2025'
  };
  
  // Initialize page based on enrollment status
  initializePage();
  
  // Event listeners
  newEnrollmentBtn.addEventListener('click', showEnrollmentForm);
  viewEnrollmentBtn.addEventListener('click', showEnrollmentDetails);
  cancelEnrollmentBtn.addEventListener('click', hideEnrollmentForm);
  backToEnrollmentBtn.addEventListener('click', hideEnrollmentDetails);
  enrollmentForm.addEventListener('submit', handleEnrollmentSubmit);
  
  // Add listeners to subject checkboxes
  const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]');
  subjectCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateEnrollmentSummary);
  });
  
  // Buttons in enrollment details
  addDropBtn.addEventListener('click', () => alert('Add/Drop functionality would open here'));
  viewPaymentBtn.addEventListener('click', () => window.location.href = 'student-finances.html');
  printAssessmentBtn.addEventListener('click', () => printAssessment());
  
  /**
   * Initialize the page based on student's enrollment status
   */
  function initializePage() {
    // Set student information
    document.getElementById('student-id').textContent = `ID: ${studentData.id}`;
    document.getElementById('student-name').textContent = studentData.name;
    document.getElementById('student-dept').textContent = `Department: ${studentData.department}`;
    document.getElementById('footer-student-name').textContent = studentData.name;
    
    // Set academic calendar information
    document.getElementById('academic-year').textContent = academicCalendar.academicYear;
    document.getElementById('semester').textContent = academicCalendar.semester;
    document.getElementById('year-level').textContent = studentData.yearLevel;
    document.getElementById('regular-period').textContent = `${academicCalendar.regularEnrollment.start} - ${academicCalendar.regularEnrollment.end}`;
    document.getElementById('late-period').textContent = `${academicCalendar.lateEnrollment.start} - ${academicCalendar.lateEnrollment.end}`;
    document.getElementById('add-drop-period').textContent = `${academicCalendar.addDrop.start} - ${academicCalendar.addDrop.end}`;
    document.getElementById('classes-start').textContent = academicCalendar.classesStart;
    
    // Check if student has existing enrollment
    if (studentData.currentEnrollment && studentData.currentEnrollment.exists) {
      // Update enrollment status display
      document.getElementById('enrollment-status').textContent = 
        studentData.currentEnrollment.status.charAt(0).toUpperCase() + 
        studentData.currentEnrollment.status.slice(1);
      document.getElementById('enrollment-status').className = `status-${studentData.currentEnrollment.status}`;
      
      // Enable view enrollment button
      viewEnrollmentBtn.disabled = false;
      
      // Set enrollment details data
      document.getElementById('status-badge').textContent = 
        studentData.currentEnrollment.status.charAt(0).toUpperCase() + 
        studentData.currentEnrollment.status.slice(1);
      document.getElementById('status-badge').className = `badge badge-${studentData.currentEnrollment.status}`;
      
      document.getElementById('payment-badge').textContent = 
        studentData.currentEnrollment.paymentStatus.charAt(0).toUpperCase() + 
        studentData.currentEnrollment.paymentStatus.slice(1);
      
      document.getElementById('details-student-id').textContent = studentData.id;
      document.getElementById('details-student-name').textContent = studentData.name;
      document.getElementById('details-program').textContent = studentData.program;
      document.getElementById('details-year-level').textContent = studentData.yearLevel;
      document.getElementById('details-academic-year').textContent = studentData.currentEnrollment.academicYear;
      document.getElementById('details-semester').textContent = studentData.currentEnrollment.semester;
      
      // Set financial details
      document.getElementById('details-tuition').textContent = `₱${studentData.currentEnrollment.financials.tuitionFee.toFixed(2)}`;
      document.getElementById('details-lab-fee').textContent = `₱${studentData.currentEnrollment.financials.labFee.toFixed(2)}`;
      document.getElementById('details-misc-fee').textContent = `₱${studentData.currentEnrollment.financials.miscFee.toFixed(2)}`;
      document.getElementById('details-total-assessment').textContent = `₱${studentData.currentEnrollment.financials.totalAssessment.toFixed(2)}`;
      document.getElementById('details-amount-paid').textContent = `₱${studentData.currentEnrollment.financials.amountPaid.toFixed(2)}`;
      document.getElementById('details-balance').textContent = `₱${studentData.currentEnrollment.financials.balance.toFixed(2)}`;
      
      // Set subjects in enrollment details
      const enrolledSubjectsContainer = document.getElementById('enrolled-subjects');
      enrolledSubjectsContainer.innerHTML = '';
      
      studentData.currentEnrollment.subjects.forEach(subject => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${subject.code}</td>
          <td>${subject.title}</td>
          <td>${subject.units}</td>
          <td>${subject.schedule}</td>
          <td>${subject.section}</td>
          <td><span class="status-${subject.status}">${subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}</span></td>
        `;
        enrolledSubjectsContainer.appendChild(row);
      });
      
      // If enrollment is already approved, disable new enrollment button
      if (studentData.currentEnrollment.status === 'approved') {
        newEnrollmentBtn.disabled = true;
      }
    } else {
      // No current enrollment
      document.getElementById('enrollment-status').textContent = 'Not Enrolled';
      document.getElementById('enrollment-status').className = 'status-rejected';
      viewEnrollmentBtn.disabled = true;
    }
    
    // Set form details
    document.getElementById('form-academic-year').textContent = academicCalendar.academicYear;
    document.getElementById('form-semester').textContent = academicCalendar.semester;
  }
  
  /**
   * Show the enrollment form
   */
  function showEnrollmentForm() {
    enrollmentFormContainer.style.display = 'block';
    enrollmentDetails.style.display = 'none';
    
    // Clear selected subjects
    selectedSubjects.length = 0;
    
    // Generate the subject list dynamically
    generateSubjectList();
    
    // Update enrollment summary
    updateEnrollmentSummary();
    
    // Hide action buttons
    document.getElementById('enrollment-action-buttons').style.display = 'none';
  }
  
  /**
   * Hide the enrollment form
   */
  function hideEnrollmentForm() {
    enrollmentFormContainer.style.display = 'none';
    document.getElementById('enrollment-action-buttons').style.display = 'flex';
  }
  
  /**
   * Show enrollment details
   */
  function showEnrollmentDetails() {
    enrollmentDetails.style.display = 'block';
    enrollmentFormContainer.style.display = 'none';
    
    // Hide action buttons
    document.getElementById('enrollment-action-buttons').style.display = 'none';
  }
  
  /**
   * Hide enrollment details
   */
  function hideEnrollmentDetails() {
    enrollmentDetails.style.display = 'none';
    document.getElementById('enrollment-action-buttons').style.display = 'flex';
  }
  
  /**
   * Update the enrollment summary based on selected subjects
   */
  function updateEnrollmentSummary() {
    const selectedCount = selectedSubjects.length;
    let totalUnits = 0;
    let labUnits = 0;
    
    // Calculate total units
    selectedSubjects.forEach(subjectId => {
      const subject = availableSubjects.find(s => s.id === parseInt(subjectId));
      if (subject) {
        totalUnits += subject.units;
        labUnits += subject.labUnits;
      }
    });
    
    // Calculate estimated tuition (₱1000 per unit, plus ₱500 per lab unit)
    const lectureFee = (totalUnits - labUnits) * 1000;
    const labFee = labUnits * 1500; // Lab units cost more
    const estimatedTuition = lectureFee + labFee;
    
    // Update summary display
    selectedCountElem.textContent = selectedCount;
    totalUnitsElem.textContent = totalUnits;
    estimatedTuitionElem.textContent = `₱${estimatedTuition.toFixed(2)}`;
  }
  
  /**
   * Handle enrollment form submission
   */
  function handleEnrollmentSubmit(e) {
    e.preventDefault();
    
    // Verify selected subjects
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject to enroll in.');
      return;
    }
    
    // Check for schedule conflicts one final time
    const conflicts = checkScheduleConflicts();
    if (conflicts.length > 0) {
      const conflictMsg = conflicts.map(conflict => 
        `${conflict.subject1.code} (${conflict.section1}) conflicts with ${conflict.subject2.code} (${conflict.section2})`
      ).join('\n');
      
      if (!confirm(`Warning: You have schedule conflicts:\n${conflictMsg}\n\nDo you still want to proceed with enrollment?`)) {
        return;
      }
    }
    
    // Prepare enrollment data
    const enrollmentData = {
      studentId: studentData.id,
      academicYear: academicCalendar.academicYear,
      semester: academicCalendar.semester,
      subjects: selectedSubjects.map(subjectId => {
        const subject = availableSubjects.find(s => s.id === parseInt(subjectId));
        const sectionSelect = document.querySelector(`select[name="section-${subject.id}"]`);
        const sectionId = sectionSelect ? sectionSelect.value : 'A';
        const section = subject.sections.find(s => s.id === sectionId);
        
        return {
          code: subject.code,
          title: subject.title,
          units: `${subject.units} (${subject.lecUnits} lec, ${subject.labUnits} lab)`,
          schedule: `${section.schedule}, ${section.room}`,
          section: section.id,
          status: 'enrolled'
        };
      })
    };
    
    // In production, this would submit to the API
    // For demo, just show enrollment details
    console.log('Enrollment data to submit:', enrollmentData);
    alert('Enrollment submitted successfully! In production, this would be sent to the server.');
    
    // Simulate a successful enrollment by updating student data
    studentData.currentEnrollment.exists = true;
    studentData.currentEnrollment.status = 'pending';
    studentData.currentEnrollment.subjects = enrollmentData.subjects;
    
    // Update financial assessment based on selected subjects
    const totalUnits = enrollmentData.subjects.reduce((total, subject) => {
      const units = parseInt(subject.units.split(' ')[0]);
      return total + units;
    }, 0);
    
    studentData.currentEnrollment.financials.tuitionFee = totalUnits * 1000;
    studentData.currentEnrollment.financials.totalAssessment = 
      studentData.currentEnrollment.financials.tuitionFee + 
      studentData.currentEnrollment.financials.labFee + 
      studentData.currentEnrollment.financials.miscFee;
    studentData.currentEnrollment.financials.balance = 
      studentData.currentEnrollment.financials.totalAssessment - 
      studentData.currentEnrollment.financials.amountPaid;
    
    // Update the page
    initializePage();
    
    // Hide form, show details
    hideEnrollmentForm();
    showEnrollmentDetails();
  }
});
