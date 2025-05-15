document.addEventListener('DOMContentLoaded', function() {
  // Load student data
  loadStudentData();
  
  // Set up event listeners
  setupEventListeners();
});

// Load student data
function loadStudentData() {
  // For demo purposes, we're using hardcoded data
  // In a real app, this would come from localStorage or an API call
  const studentData = {
    id: 'm23-1470-578',
    name: 'Juan Dela Cruz',
    department: 'BSIT',
    email: 'm23-1470-578@manila.uphsl.edu.ph',
    personalInfo: {
      firstName: 'Juan',
      middleName: 'Santos',
      lastName: 'Dela Cruz',
      birthdate: '2003-05-15',
      gender: 'male',
      civilStatus: 'single',
      nationality: 'Filipino',
      religion: 'Roman Catholic'
    },
    contactInfo: {
      schoolEmail: 'm23-1470-578@manila.uphsl.edu.ph',
      personalEmail: 'juan.delacruz@gmail.com',
      mobileNumber: '09123456789',
      presentAddress: '123 Rizal Ave, Sampaloc, Manila',
      permanentAddress: '123 Rizal Ave, Sampaloc, Manila',
      emergencyContact: {
        name: 'Maria Dela Cruz',
        relation: 'Mother',
        contactNumber: '09187654321'
      }
    },
    academicInfo: {
      studentId: 'm23-1470-578',
      department: 'BSIT',
      departmentFull: 'Bachelor of Science in Information Technology',
      yearLevel: '2nd Year',
      section: 'A-5',
      enrollmentStatus: 'Enrolled',
      enrollmentDate: 'June 1, 2023',
      adviser: 'Prof. Pedro Santos',
      academicHistory: [
        {
          academicYear: '2023-2024',
          semester: '1st Semester',
          units: 21,
          gpa: 3.5,
          status: 'Completed'
        },
        {
          academicYear: '2023-2024',
          semester: '2nd Semester',
          units: 24,
          gpa: 3.7,
          status: 'Completed'
        },
        {
          academicYear: '2024-2025',
          semester: '1st Semester',
          units: 21,
          gpa: null,
          status: 'In Progress'
        }
      ]
    },
    documents: [
      {
        type: 'ID Picture',
        dateUploaded: 'June 5, 2023',
        status: 'verified',
        filePath: 'documents/id-picture.jpg'
      },
      {
        type: 'Birth Certificate',
        dateUploaded: 'June 5, 2023',
        status: 'verified',
        filePath: 'documents/birth-certificate.pdf'
      },
      {
        type: 'Form 137',
        dateUploaded: 'June 5, 2023',
        status: 'verified',
        filePath: 'documents/form-137.pdf'
      },
      {
        type: 'Medical Certificate',
        dateUploaded: 'June 7, 2023',
        status: 'pending',
        filePath: 'documents/medical-certificate.pdf'
      }
    ]
  };
  
  // Update UI with student data
  document.getElementById('student-id').textContent = `ID: ${studentData.id}`;
  document.getElementById('student-name').textContent = studentData.name;
  document.getElementById('student-dept').textContent = `Department: ${studentData.department}`;
  document.getElementById('footer-student-name').textContent = studentData.name;
  
  // Populate forms with student data
  populatePersonalInfoForm(studentData.personalInfo);
  populateContactInfoForm(studentData.contactInfo);
  populateAcademicInfo(studentData.academicInfo);
  populateDocuments(studentData.documents);
}

// Populate personal info form
function populatePersonalInfoForm(personalInfo) {
  document.getElementById('first-name').value = personalInfo.firstName;
  document.getElementById('middle-name').value = personalInfo.middleName;
  document.getElementById('last-name').value = personalInfo.lastName;
  document.getElementById('birthdate').value = personalInfo.birthdate;
  document.getElementById('gender').value = personalInfo.gender;
  document.getElementById('civil-status').value = personalInfo.civilStatus;
  document.getElementById('nationality').value = personalInfo.nationality;
  document.getElementById('religion').value = personalInfo.religion;
}

// Populate contact info form
function populateContactInfoForm(contactInfo) {
  document.getElementById('email').value = contactInfo.schoolEmail;
  document.getElementById('personal-email').value = contactInfo.personalEmail;
  document.getElementById('mobile-number').value = contactInfo.mobileNumber;
  document.getElementById('present-address').value = contactInfo.presentAddress;
  document.getElementById('permanent-address').value = contactInfo.permanentAddress;
  document.getElementById('emergency-contact-name').value = contactInfo.emergencyContact.name;
  document.getElementById('emergency-contact-relation').value = contactInfo.emergencyContact.relation;
  document.getElementById('emergency-contact-number').value = contactInfo.emergencyContact.contactNumber;
}

// Populate academic info
function populateAcademicInfo(academicInfo) {
  // Update readonly academic info
  const infoGroups = document.querySelectorAll('#academic-info .info-group');
  infoGroups[0].querySelector('p').textContent = academicInfo.studentId;
  infoGroups[1].querySelector('p').textContent = academicInfo.departmentFull;
  infoGroups[2].querySelector('p').textContent = academicInfo.yearLevel;
  infoGroups[3].querySelector('p').textContent = academicInfo.section;
  infoGroups[4].querySelector('p').textContent = academicInfo.enrollmentStatus;
  infoGroups[5].querySelector('p').textContent = academicInfo.enrollmentDate;
  infoGroups[6].querySelector('p').textContent = academicInfo.adviser;
  
  // Populate academic history table
  const historyTableBody = document.querySelector('#academic-info .history-table tbody');
  historyTableBody.innerHTML = '';
  
  academicInfo.academicHistory.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.academicYear}</td>
      <td>${record.semester}</td>
      <td>${record.units}</td>
      <td>${record.gpa !== null ? record.gpa : '-'}</td>
      <td>${record.status}</td>
    `;
    historyTableBody.appendChild(row);
  });
}

// Populate documents
function populateDocuments(documents) {
  const documentTableBody = document.querySelector('#documents .documents-table tbody');
  documentTableBody.innerHTML = '';
  
  documents.forEach(document => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${document.type}</td>
      <td>${document.dateUploaded}</td>
      <td><span class="status ${document.status}">${capitalize(document.status)}</span></td>
      <td>
        <button class="action-btn view" data-document-path="${document.filePath}" data-document-type="${document.type}">View</button>
        <button class="action-btn download" data-document-path="${document.filePath}" data-document-type="${document.type}">Download</button>
      </td>
    `;
    documentTableBody.appendChild(row);
  });
  
  // Add event listeners to the new buttons
  document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', function() {
      const documentPath = this.getAttribute('data-document-path');
      const documentType = this.getAttribute('data-document-type');
      viewDocument(documentPath, documentType);
    });
  });
  
  document.querySelectorAll('.action-btn.download').forEach(btn => {
    btn.addEventListener('click', function() {
      const documentPath = this.getAttribute('data-document-path');
      const documentType = this.getAttribute('data-document-type');
      downloadDocument(documentPath, documentType);
    });
  });
}

// Capitalize first letter
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Setup event listeners
function setupEventListeners() {
  // Profile nav links
  document.querySelectorAll('.profile-nav li').forEach(navItem => {
    navItem.addEventListener('click', function() {
      // Remove active class from all nav items
      document.querySelectorAll('.profile-nav li').forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to clicked nav item
      this.classList.add('active');
      
      // Hide all sections
      document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Show selected section
      const sectionId = this.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
    });
  });
  
  // Change photo button
  document.getElementById('change-photo-btn').addEventListener('click', function() {
    document.getElementById('photo-upload').click();
  });
  
  // Photo upload
  document.getElementById('photo-upload').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('profile-image').src = e.target.result;
        
        // In a real app, you would upload the image to the server here
        console.log('Profile image changed, would upload to server in a real app');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  
  // Form submissions
  document.getElementById('personal-info-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const personalInfo = {
      firstName: document.getElementById('first-name').value,
      middleName: document.getElementById('middle-name').value,
      lastName: document.getElementById('last-name').value,
      birthdate: document.getElementById('birthdate').value,
      gender: document.getElementById('gender').value,
      civilStatus: document.getElementById('civil-status').value,
      nationality: document.getElementById('nationality').value,
      religion: document.getElementById('religion').value
    };
    
    // This would be an API call in a real app
    console.log('Personal info updated:', personalInfo);
    
    // Show success message
    showAlert('Personal information updated successfully', 'success');
  });
  
  document.getElementById('contact-info-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const contactInfo = {
      personalEmail: document.getElementById('personal-email').value,
      mobileNumber: document.getElementById('mobile-number').value,
      presentAddress: document.getElementById('present-address').value,
      permanentAddress: document.getElementById('permanent-address').value,
      emergencyContact: {
        name: document.getElementById('emergency-contact-name').value,
        relation: document.getElementById('emergency-contact-relation').value,
        contactNumber: document.getElementById('emergency-contact-number').value
      }
    };
    
    // This would be an API call in a real app
    console.log('Contact info updated:', contactInfo);
    
    // Show success message
    showAlert('Contact information updated successfully', 'success');
  });
  
  document.getElementById('document-upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const documentType = document.getElementById('document-type').value;
    const documentFile = document.getElementById('document-file').files[0];
    
    // This would be an API call in a real app
    console.log('Document uploaded:', {
      type: documentType,
      file: documentFile ? documentFile.name : 'No file selected'
    });
    
    // Show success message
    showAlert('Document uploaded successfully. It will be verified by the registrar.', 'success');
    
    // Reset form
    this.reset();
  });
  
  document.getElementById('password-change-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      showAlert('New passwords do not match', 'error');
      return;
    }
    
    // Check password strength
    if (!isStrongPassword(newPassword)) {
      showAlert('Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, one number, and one symbol', 'error');
      return;
    }
    
    // This would be an API call in a real app
    console.log('Password changed');
    
    // Show success message
    showAlert('Password changed successfully', 'success');
    
    // Reset form
    this.reset();
  });
  
  document.getElementById('notification-settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const notificationSettings = {
      emailNotifications: document.getElementById('email-notifications').checked,
      paymentReminders: document.getElementById('payment-reminders').checked,
      enrollmentNotifications: document.getElementById('enrollment-notifications').checked,
      gradeNotifications: document.getElementById('grade-notifications').checked
    };
    
    // This would be an API call in a real app
    console.log('Notification settings updated:', notificationSettings);
    
    // Show success message
    showAlert('Notification preferences saved', 'success');
  });
  
  // Close document modal
  document.getElementById('close-document-modal').addEventListener('click', function() {
    document.getElementById('document-modal').style.display = 'none';
  });
  
  // Download document from modal
  document.getElementById('download-document-btn').addEventListener('click', function() {
    const documentPath = this.getAttribute('data-document-path');
    const documentType = this.getAttribute('data-document-type');
    if (documentPath && documentType) {
      downloadDocument(documentPath, documentType);
    }
  });
}

// Check if password is strong
function isStrongPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// View document
function viewDocument(documentPath, documentType) {
  console.log(`Viewing document: ${documentType} at path ${documentPath}`);
  
  // Update modal title
  document.getElementById('document-modal-title').textContent = documentType;
  
  // Get file extension
  const fileExtension = documentPath.split('.').pop().toLowerCase();
  
  // Update modal content based on file type
  const previewContainer = document.getElementById('document-preview');
  
  if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
    // It's an image
    previewContainer.innerHTML = `<img src="${documentPath}" alt="${documentType}" style="max-width: 100%; max-height: 500px;">`;
  } else if (fileExtension === 'pdf') {
    // It's a PDF
    previewContainer.innerHTML = `
      <div class="pdf-preview">
        <p>PDF Preview is not available. Please download the document to view it.</p>
        <p>File: ${documentPath}</p>
      </div>
    `;
  } else {
    // Other file types
    previewContainer.innerHTML = `
      <div class="file-preview">
        <p>Preview is not available for this file type. Please download the document to view it.</p>
        <p>File: ${documentPath}</p>
      </div>
    `;
  }
  
  // Set download button data
  document.getElementById('download-document-btn').setAttribute('data-document-path', documentPath);
  document.getElementById('download-document-btn').setAttribute('data-document-type', documentType);
  
  // Show modal
  document.getElementById('document-modal').style.display = 'flex';
}

// Download document
function downloadDocument(documentPath, documentType) {
  console.log(`Downloading document: ${documentType} at path ${documentPath}`);
  
  // In a real app, this would trigger a download
  alert(`Downloading ${documentType}`);
}

// Show alert message
function showAlert(message, type) {
  // Create alert element
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;
  
  // Add alert to the page
  document.querySelector('.main-content').insertBefore(alertElement, document.querySelector('.profile-container'));
  
  // Remove alert after 3 seconds
  setTimeout(() => {
    alertElement.remove();
  }, 3000);
}

// Add alert styles to the document
const alertStyles = document.createElement('style');
alertStyles.textContent = `
  .alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    font-weight: bold;
  }
  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }
  .alert-error {
    background-color: #f8d7da;
    color: #721c24;
  }
`;
document.head.appendChild(alertStyles);
