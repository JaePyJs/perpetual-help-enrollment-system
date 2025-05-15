document.addEventListener('DOMContentLoaded', function() {
  // Load student data from local storage or fetch from API
  loadStudentData();
  
  // Set up event listeners
  setupEventListeners();
  
  // Load financial data
  loadFinancialData();
});

// Load student data
function loadStudentData() {
  // For demo purposes, we're using hardcoded data
  // In a real app, this would come from localStorage or an API call
  const studentData = {
    id: 'm23-1470-578',
    name: 'Juan Dela Cruz',
    department: 'BSIT',
    email: 'm23-1470-578@manila.uphsl.edu.ph'
  };
  
  // Update UI with student data
  document.getElementById('student-id').textContent = `ID: ${studentData.id}`;
  document.getElementById('student-name').textContent = studentData.name;
  document.getElementById('student-dept').textContent = `Department: ${studentData.department}`;
  document.getElementById('footer-student-name').textContent = studentData.name;
  
  // Also update modal data
  document.getElementById('modal-student-id').textContent = studentData.id;
  document.getElementById('modal-student-name').textContent = studentData.name;
}

// Load financial data
function loadFinancialData() {
  // This would be an API call in a real app
  // For demo purposes, using hardcoded data
  const financialData = {
    currentBalance: 11300.00,
    dueDate: 'June 15, 2025',
    academicYear: '2024-2025',
    semester: '1st',
    fees: {
      tuition: 9000.00,
      laboratory: 1000.00,
      registration: 500.00,
      library: 300.00,
      computer: 500.00
    },
    paymentHistory: [] // Empty for now
  };
  
  // Update UI with financial data
  document.getElementById('current-balance').textContent = `₱${financialData.currentBalance.toFixed(2)}`;
  document.getElementById('balance-status').textContent = `Payment Due: ${financialData.dueDate}`;
  
  // Set online payment amount
  document.getElementById('online-amount').value = financialData.currentBalance;
  
  // Check if there's any payment history
  updatePaymentHistory(financialData.paymentHistory);
}

// Update payment history table
function updatePaymentHistory(payments) {
  const emptyState = document.getElementById('empty-payment-history');
  const paymentTable = document.getElementById('payment-table');
  
  if (payments.length === 0) {
    emptyState.style.display = 'block';
    paymentTable.style.display = 'none';
    return;
  }
  
  emptyState.style.display = 'none';
  paymentTable.style.display = 'table';
  
  const tableBody = paymentTable.querySelector('tbody');
  tableBody.innerHTML = '';
  
  payments.forEach(payment => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${payment.receiptNumber}</td>
      <td>${formatDate(payment.date)}</td>
      <td>₱${payment.amount.toFixed(2)}</td>
      <td>${payment.method}</td>
      <td><span class="status-badge ${payment.status.toLowerCase()}">${payment.status}</span></td>
      <td>
        <button class="view-receipt-btn" data-receipt-id="${payment.receiptNumber}">View</button>
        <button class="download-receipt-btn" data-receipt-id="${payment.receiptNumber}">Download</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  // Add event listeners to the new buttons
  document.querySelectorAll('.view-receipt-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const receiptId = this.getAttribute('data-receipt-id');
      showReceiptModal(receiptId);
    });
  });
}

// Format date to a readable format
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Setup event listeners
function setupEventListeners() {
  // Make Payment button
  document.getElementById('make-payment-btn').addEventListener('click', function() {
    document.getElementById('payment-options').style.display = 'block';
    document.getElementById('payment-history').style.display = 'none';
  });
  
  // Payment History button
  document.getElementById('payment-history-btn').addEventListener('click', function() {
    document.getElementById('payment-history').style.display = 'block';
    document.getElementById('payment-options').style.display = 'none';
  });
  
  // Close buttons
  document.getElementById('close-payment-options').addEventListener('click', function() {
    document.getElementById('payment-options').style.display = 'none';
  });
  
  document.getElementById('close-payment-history').addEventListener('click', function() {
    document.getElementById('payment-history').style.display = 'none';
  });
  
  document.getElementById('close-receipt-modal').addEventListener('click', function() {
    document.getElementById('receipt-modal').style.display = 'none';
  });
  
  // Payment method selection
  document.querySelectorAll('.method-option').forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      document.querySelectorAll('.method-option').forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to selected option
      this.classList.add('active');
      
      // Hide all method details
      document.querySelectorAll('.method-details').forEach(detail => {
        detail.style.display = 'none';
      });
      
      // Show selected method details
      const method = this.getAttribute('data-method');
      document.getElementById(`method-${method}`).style.display = 'block';
    });
  });
  
  // Semester tabs
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      document.querySelectorAll('.tab-btn').forEach(t => {
        t.classList.remove('active');
      });
      
      // Add active class to selected tab
      this.classList.add('active');
      
      // In a real app, this would load semester-specific data
      const semester = this.getAttribute('data-semester');
      console.log(`Selected semester: ${semester}`);
      // Here you would fetch and display data for the selected semester
    });
  });
  
  // Receipt form submission
  document.getElementById('receipt-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const paymentAmount = document.getElementById('payment-amount').value;
    const paymentDate = document.getElementById('payment-date').value;
    const referenceNumber = document.getElementById('reference-number').value;
    const receiptFile = document.getElementById('receipt-file').files[0];
    
    // This would typically be an API call to submit the payment
    console.log('Payment submitted:', {
      amount: paymentAmount,
      date: paymentDate,
      reference: referenceNumber,
      file: receiptFile ? receiptFile.name : 'No file selected'
    });
    
    // Show success message
    alert('Payment receipt submitted successfully! Your payment will be verified within 24-48 hours.');
    
    // Reset form and close payment options
    this.reset();
    document.getElementById('payment-options').style.display = 'none';
  });
  
  // Online payment button
  document.getElementById('proceed-payment-btn').addEventListener('click', function() {
    const amount = document.getElementById('online-amount').value;
    alert(`Redirecting to payment gateway for ₱${amount}...`);
    // In a real app, this would redirect to a payment gateway
  });
  
  // Print assessment button
  document.getElementById('print-assessment-btn').addEventListener('click', function() {
    alert('Printing assessment form...');
    // In a real app, this would generate a PDF and open the print dialog
  });
  
  // Print receipt button
  document.getElementById('print-receipt-btn').addEventListener('click', function() {
    alert('Printing receipt...');
    // In a real app, this would print the receipt
  });
  
  // View statement button
  document.getElementById('view-statement-btn').addEventListener('click', function() {
    alert('Generating statement of account...');
    // In a real app, this would generate and display a statement
  });
  
  // Download assessment button
  document.getElementById('download-assessment-btn').addEventListener('click', function() {
    alert('Downloading assessment form...');
    // In a real app, this would download the assessment as a PDF
  });
  
  // Academic year filter change
  document.getElementById('academic-year-filter').addEventListener('change', function() {
    const year = this.value;
    console.log(`Filtering by academic year: ${year}`);
    // This would fetch and update the payment history based on the selected year
  });
  
  // Semester filter change
  document.getElementById('semester-filter').addEventListener('change', function() {
    const semester = this.value;
    console.log(`Filtering by semester: ${semester}`);
    // This would fetch and update the payment history based on the selected semester
  });
}

// Show receipt modal with specific receipt data
function showReceiptModal(receiptId) {
  // In a real app, this would fetch receipt data from the API
  // For demo purposes, we're using hardcoded data
  const receiptData = {
    receiptNumber: receiptId || 'R-123456',
    studentId: 'm23-1470-578',
    studentName: 'Juan Dela Cruz',
    date: 'May 9, 2025',
    paymentFor: 'Tuition Fee - AY 2024-2025, 1st Semester',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'BT-987654321',
    amountPaid: 5000.00,
    previousBalance: 11300.00,
    remainingBalance: 6300.00
  };
  
  // Update modal with receipt data
  document.getElementById('modal-receipt-number').textContent = receiptData.receiptNumber;
  document.getElementById('modal-student-id').textContent = receiptData.studentId;
  document.getElementById('modal-student-name').textContent = receiptData.studentName;
  document.getElementById('modal-receipt-date').textContent = receiptData.date;
  document.getElementById('modal-payment-for').textContent = receiptData.paymentFor;
  document.getElementById('modal-payment-method').textContent = receiptData.paymentMethod;
  document.getElementById('modal-reference-number').textContent = receiptData.referenceNumber;
  document.getElementById('modal-amount-paid').textContent = `₱${receiptData.amountPaid.toFixed(2)}`;
  document.getElementById('modal-previous-balance').textContent = `₱${receiptData.previousBalance.toFixed(2)}`;
  document.getElementById('modal-remaining-balance').textContent = `₱${receiptData.remainingBalance.toFixed(2)}`;
  
  // Show the modal
  document.getElementById('receipt-modal').style.display = 'flex';
}

// Add this to window object to allow calling from HTML
window.showReceiptModal = showReceiptModal;
