document.addEventListener('DOMContentLoaded', function() {
  // Student data (would be fetched from API in production)
  const studentData = {
    id: 'm23-1470-578',
    name: 'Juan Dela Cruz',
    department: 'BSIT',
    email: 'm23-1470-578@manila.uphsl.edu.ph',
    program: 'Bachelor of Science in Information Technology',
    yearLevel: 2,
    requiredUnits: 192,
    academicRecord: {
      cumulativeGPA: 3.60,
      totalUnitsTaken: 45,
      totalUnitsCompleted: 45,
      terms: [
        {
          id: '2024-2025-1',
          academicYear: '2024-2025',
          semester: '1st Semester',
          status: 'in-progress',
          gpa: 3.70,
          courses: [
            {
              code: 'IT201',
              title: 'Data Structures and Algorithms',
              units: 3,
              midterm: 89,
              finals: null,
              average: null,
              grade: null,
              remarks: 'in-progress'
            },
            {
              code: 'IT202',
              title: 'Information Management',
              units: 3,
              midterm: 92,
              finals: null,
              average: null,
              grade: null,
              remarks: 'in-progress'
            },
            {
              code: 'GE103',
              title: 'Purposive Communication',
              units: 3,
              midterm: 85,
              finals: null,
              average: null,
              grade: null,
              remarks: 'in-progress'
            }
          ]
        },
        {
          id: '2023-2024-2',
          academicYear: '2023-2024',
          semester: '2nd Semester',
          status: 'completed',
          gpa: 3.70,
          courses: [
            {
              code: 'IT102',
              title: 'Computer Programming 2',
              units: 3,
              midterm: 90,
              finals: 94,
              average: 92,
              grade: 3.70,
              remarks: 'passed'
            },
            {
              code: 'GE102',
              title: 'Art Appreciation',
              units: 3,
              midterm: 88,
              finals: 92,
              average: 90,
              grade: 3.50,
              remarks: 'passed'
            },
            {
              code: 'MATH102',
              title: 'Calculus 1',
              units: 3,
              midterm: 92,
              finals: 90,
              average: 91,
              grade: 3.75,
              remarks: 'passed'
            },
            {
              code: 'NSTP2',
              title: 'National Service Training Program 2',
              units: 3,
              midterm: 95,
              finals: 93,
              average: 94,
              grade: 4.00,
              remarks: 'passed'
            }
          ]
        },
        {
          id: '2023-2024-1',
          academicYear: '2023-2024',
          semester: '1st Semester',
          status: 'completed',
          gpa: 3.50,
          courses: [
            {
              code: 'IT101',
              title: 'Computer Programming 1',
              units: 3,
              midterm: 88,
              finals: 90,
              average: 89,
              grade: 3.50,
              remarks: 'passed'
            },
            {
              code: 'GE101',
              title: 'Understanding the Self',
              units: 3,
              midterm: 90,
              finals: 85,
              average: 87.5,
              grade: 3.25,
              remarks: 'passed'
            },
            {
              code: 'MATH101',
              title: 'College Algebra',
              units: 3,
              midterm: 87,
              finals: 88,
              average: 87.5,
              grade: 3.25,
              remarks: 'passed'
            },
            {
              code: 'NSTP1',
              title: 'National Service Training Program 1',
              units: 3,
              midterm: 95,
              finals: 97,
              average: 96,
              grade: 4.00,
              remarks: 'passed'
            }
          ]
        }
      ],
      gpaTrend: [3.50, 3.70, 3.70] // GPA for each term
    }
  };

  // Initialize the page
  initializePage();
  initializeChart();
  setupEventListeners();

  // Initialize page with student data
  function initializePage() {
    // Set student information
    document.getElementById('student-id').textContent = `ID: ${studentData.id}`;
    document.getElementById('student-name').textContent = studentData.name;
    document.getElementById('student-dept').textContent = `Department: ${studentData.department}`;
    document.getElementById('footer-student-name').textContent = studentData.name;

    // Set GPA and progress information
    document.getElementById('cumulative-gpa').textContent = studentData.academicRecord.cumulativeGPA.toFixed(2);
    document.getElementById('total-units').textContent = studentData.academicRecord.totalUnitsTaken;
    document.getElementById('completed-units').textContent = studentData.academicRecord.totalUnitsCompleted;
    document.getElementById('required-units').textContent = studentData.requiredUnits;

    // Calculate and set completion percentage
    const completionPercentage = (studentData.academicRecord.totalUnitsCompleted / studentData.requiredUnits * 100).toFixed(0);
    document.getElementById('completion-percentage').textContent = `${completionPercentage}%`;
    document.getElementById('progress-bar').style.width = `${completionPercentage}%`;

    // Populate term selector
    const termSelector = document.getElementById('academic-term');
    termSelector.innerHTML = '<option value="all">All Terms</option>';
    
    studentData.academicRecord.terms.forEach(term => {
      const option = document.createElement('option');
      option.value = term.id;
      option.textContent = `${term.academicYear} (${term.semester})`;
      termSelector.appendChild(option);
    });

    // Set current term heading and GPA
    const currentTerm = studentData.academicRecord.terms[0]; // Assuming the first term is the current one
    document.getElementById('current-term-heading').textContent = `Academic Year ${currentTerm.academicYear} (${currentTerm.semester})`;
    document.getElementById('term-gpa').textContent = currentTerm.gpa.toFixed(2);

    // Show initial term (all terms by default)
    displayTermGrades('all');
  }

  // Initialize the GPA trend chart
  function initializeChart() {
    const ctx = document.getElementById('gpa-trend-chart').getContext('2d');
    
    // Define the terms for the x-axis
    const terms = studentData.academicRecord.terms.map(term => `${term.academicYear} (${term.semester})`);
    
    // Create the chart
    const gpaChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: terms.reverse(), // Reverse to show oldest first
        datasets: [{
          label: 'GPA',
          data: studentData.academicRecord.gpaTrend,
          borderColor: '#e77f33',
          backgroundColor: 'rgba(231, 127, 51, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#e77f33',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `GPA: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 4,
            ticks: {
              stepSize: 0.5
            }
          }
        }
      }
    });
  }

  // Set up event listeners
  function setupEventListeners() {
    // Term selector change event
    document.getElementById('academic-term').addEventListener('change', function() {
      displayTermGrades(this.value);
    });

    // Download grades button
    document.getElementById('download-grades-btn').addEventListener('click', function() {
      downloadAcademicRecord();
    });

    // Request verification button
    document.getElementById('request-verification-btn').addEventListener('click', function() {
      showVerificationModal();
    });

    // Close verification modal
    document.getElementById('close-verification-modal').addEventListener('click', function() {
      document.getElementById('verification-modal').style.display = 'none';
    });

    // Verification purpose change
    document.getElementById('verification-purpose').addEventListener('change', function() {
      const otherPurposeGroup = document.getElementById('other-purpose-group');
      if (this.value === 'other') {
        otherPurposeGroup.style.display = 'block';
      } else {
        otherPurposeGroup.style.display = 'none';
      }
    });

    // Verification form submission
    document.getElementById('verification-form').addEventListener('submit', function(e) {
      e.preventDefault();
      submitVerificationRequest();
    });
  }

  // Display grades for the selected term
  function displayTermGrades(termId) {
    // Show all terms if 'all' is selected, otherwise filter
    let visibleTerms;
    if (termId === 'all') {
      visibleTerms = document.querySelectorAll('.grades-container');
      visibleTerms.forEach(term => {
        term.style.display = 'block';
      });
    } else {
      // Hide all terms first
      document.querySelectorAll('.grades-container').forEach(term => {
        term.style.display = 'none';
      });
      
      // Find the selected term from student data
      const selectedTerm = studentData.academicRecord.terms.find(term => term.id === termId);
      if (selectedTerm) {
        // Update current term heading and GPA
        document.getElementById('current-term-heading').textContent = `Academic Year ${selectedTerm.academicYear} (${selectedTerm.semester})`;
        document.getElementById('term-gpa').textContent = selectedTerm.gpa.toFixed(2);
        
        // Show the first grades container (it will display our selected term)
        const firstContainer = document.querySelector('.grades-container');
        firstContainer.style.display = 'block';
        
        // Update the current term's status badge
        const statusBadge = firstContainer.querySelector('.term-status .status-badge');
        statusBadge.className = `status-badge ${selectedTerm.status}`;
        statusBadge.textContent = selectedTerm.status.charAt(0).toUpperCase() + selectedTerm.status.slice(1);
        
        // Clear and populate the table with selected term's courses
        const tableBody = document.getElementById('current-term-grades');
        tableBody.innerHTML = '';
        
        selectedTerm.courses.forEach(course => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.title}</td>
            <td>${course.units}</td>
            <td>${course.midterm ? course.midterm + '%' : '--'}</td>
            <td>${course.finals ? course.finals + '%' : '--'}</td>
            <td>${course.average ? course.average + '%' : '--'}</td>
            <td>${course.grade ? course.grade.toFixed(2) : '--'}</td>
            <td><span class="status-badge ${course.remarks}">${course.remarks.charAt(0).toUpperCase() + course.remarks.slice(1)}</span></td>
          `;
          tableBody.appendChild(row);
        });
      }
    }
  }

  // Download academic record
  function downloadAcademicRecord() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate content for the academic record
    printWindow.document.write(`
      <html>
      <head>
        <title>Academic Record - ${studentData.id}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .record-title { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .student-info { margin-bottom: 20px; }
          .info-row { display: flex; margin-bottom: 5px; }
          .info-label { font-weight: bold; width: 180px; }
          .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .term-header { background-color: #41413c; color: white; padding: 10px; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .passed { color: #155724; }
          .failed { color: #721c24; }
          .in-progress { color: #856404; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          .disclaimer { font-size: 10px; font-style: italic; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>University of Health and Sciences</h1>
          <div class="record-title">ACADEMIC RECORD / TRANSCRIPT OF RECORDS</div>
        </div>
        
        <div class="student-info">
          <div class="info-row">
            <div class="info-label">Student ID:</div>
            <div>${studentData.id}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Student Name:</div>
            <div>${studentData.name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Program:</div>
            <div>${studentData.program}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Department:</div>
            <div>${studentData.department}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Year Level:</div>
            <div>${studentData.yearLevel}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Date Generated:</div>
            <div>${new Date().toLocaleDateString()}</div>
          </div>
        </div>
        
        <div class="summary">
          <div class="info-row">
            <div class="info-label">Cumulative GPA:</div>
            <div><strong>${studentData.academicRecord.cumulativeGPA.toFixed(2)}</strong></div>
          </div>
          <div class="info-row">
            <div class="info-label">Total Units Completed:</div>
            <div>${studentData.academicRecord.totalUnitsCompleted}/${studentData.requiredUnits}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Completion Progress:</div>
            <div>${(studentData.academicRecord.totalUnitsCompleted / studentData.requiredUnits * 100).toFixed(0)}%</div>
          </div>
        </div>
    `);
    
    // Add each academic term
    studentData.academicRecord.terms.forEach(term => {
      printWindow.document.write(`
        <div class="term-header">
          Academic Year ${term.academicYear} (${term.semester}) - 
          GPA: ${term.gpa.toFixed(2)}
        </div>
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Units</th>
              <th>Midterm</th>
              <th>Finals</th>
              <th>Average</th>
              <th>Final Grade</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
      `);
      
      // Add courses for this term
      term.courses.forEach(course => {
        printWindow.document.write(`
          <tr>
            <td>${course.code}</td>
            <td>${course.title}</td>
            <td>${course.units}</td>
            <td>${course.midterm ? course.midterm + '%' : '--'}</td>
            <td>${course.finals ? course.finals + '%' : '--'}</td>
            <td>${course.average ? course.average + '%' : '--'}</td>
            <td>${course.grade ? course.grade.toFixed(2) : '--'}</td>
            <td class="${course.remarks}">${course.remarks.charAt(0).toUpperCase() + course.remarks.slice(1)}</td>
          </tr>
        `);
      });
      
      printWindow.document.write(`
          </tbody>
        </table>
      `);
    });
    
    // Add footer and close document
    printWindow.document.write(`
        <div class="footer">
          <p>This is an unofficial academic record unless signed and stamped by the University Registrar.</p>
          <p>University of Health and Sciences - Manila Campus</p>
        </div>
        <div class="disclaimer">
          Reference Number: AR-${studentData.id}-${new Date().getTime().toString().substr(-6)}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  // Show verification request modal
  function showVerificationModal() {
    document.getElementById('verification-modal').style.display = 'flex';
  }

  // Submit verification request
  function submitVerificationRequest() {
    const purpose = document.getElementById('verification-purpose').value;
    const copies = document.getElementById('verification-copies').value;
    const notes = document.getElementById('verification-notes').value;
    let otherPurpose = '';
    
    if (purpose === 'other') {
      otherPurpose = document.getElementById('other-purpose').value;
    }
    
    // Prepare request data (would be sent to API in production)
    const requestData = {
      studentId: studentData.id,
      studentName: studentData.name,
      purpose: purpose === 'other' ? otherPurpose : purpose,
      copies: parseInt(copies),
      notes: notes,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    console.log('Verification request submitted:', requestData);
    
    // Show success message
    alert('Your transcript verification request has been submitted. Please allow 3-5 working days for processing.');
    
    // Close modal and reset form
    document.getElementById('verification-modal').style.display = 'none';
    document.getElementById('verification-form').reset();
    document.getElementById('other-purpose-group').style.display = 'none';
  }
});
