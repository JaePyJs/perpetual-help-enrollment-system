/**
 * Schedule Management System
 * This module provides functionality for viewing and managing class schedules,
 * including weekly views, list views, room availability, and admin functions.
 */

// Initialize the schedule management system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize security modules if available
    if (window.SecurityModule) {
        SecurityModule.init();
    }
    
    if (window.SessionManager) {
        SessionManager.init();
    }
    
    // Check if user is admin and show admin controls if so
    checkAdminStatus();
    
    // Load data
    loadAcademicYears();
    loadRooms();
    
    // Set current date as default in date fields
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    if (document.getElementById('form-start-date')) {
        document.getElementById('form-start-date').value = formattedDate;
    }
    
    if (document.getElementById('form-end-date')) {
        // Set end date to 4 months from now by default (typical semester length)
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 4);
        document.getElementById('form-end-date').value = endDate.toISOString().split('T')[0];
    }
    
    // Add event listeners
    setupEventListeners();
    
    // Load initial schedule data
    loadWeeklySchedule();
    
    // Log page access
    logAccessEvent('schedule_management_page_access');
});

// Setup event listeners
function setupEventListeners() {
    // User type filter change
    const userFilter = document.getElementById('user-filter');
    if (userFilter) {
        userFilter.addEventListener('change', function() {
            const userSelect = document.getElementById('user-select');
            
            if (this.value === 'self') {
                userSelect.style.display = 'none';
            } else {
                userSelect.style.display = 'inline-block';
                loadUserOptions(this.value);
            }
            
            loadWeeklySchedule();
        });
    }
    
    // New schedule button
    const newScheduleBtn = document.getElementById('new-schedule-btn');
    if (newScheduleBtn) {
        newScheduleBtn.addEventListener('click', openNewScheduleForm);
    }
    
    // Create schedule button (in manage tab)
    const createScheduleBtn = document.getElementById('create-schedule-btn');
    if (createScheduleBtn) {
        createScheduleBtn.addEventListener('click', openNewScheduleForm);
    }
    
    // Schedule form submission
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSchedule();
        });
    }
    
    // Schedule time fields for conflict checking
    const timeFields = document.querySelectorAll('#form-day-of-week, #form-start-time, #form-end-time, #form-room, #form-teacher');
    timeFields.forEach(field => {
        field.addEventListener('change', checkScheduleConflicts);
    });
}

// Check if user is admin and show admin controls
function checkAdminStatus() {
    // In a real implementation, this would check the logged-in user's role
    // For demo, let's check if teacherData has isAdmin property
    const isAdmin = teacherData && teacherData.isAdmin === true;
    
    // Show admin controls if admin
    if (isAdmin) {
        document.getElementById('admin-actions').style.display = 'flex';
        document.getElementById('manage-tab').style.display = 'block';
    }
}

// Load academic years into dropdowns
function loadAcademicYears() {
    // Get all academic year filter dropdowns
    const yearFilters = [
        document.getElementById('academic-year-filter'),
        document.getElementById('list-academic-year-filter'),
        document.getElementById('manage-academic-year-filter')
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
        
        // Keep the first option and clear others
        const firstOption = yearFilter.options[0];
        yearFilter.innerHTML = '';
        yearFilter.appendChild(firstOption);
        
        // Add academic year options
        academicYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year.id;
            option.textContent = year.label;
            yearFilter.appendChild(option);
        });
    });
}

// Load room data
function loadRooms() {
    // Mock room data (this would typically come from API)
    const rooms = [
        { id: "room101", name: "Room 101", building: "Main", capacity: 40 },
        { id: "room102", name: "Room 102", building: "Main", capacity: 40 },
        { id: "room103", name: "Room 103", building: "Main", capacity: 30 },
        { id: "lab1", name: "Computer Lab 1", building: "Science", capacity: 25 },
        { id: "lab2", name: "Computer Lab 2", building: "Science", capacity: 25 },
        { id: "chem1", name: "Chemistry Lab", building: "Lab", capacity: 20 },
        { id: "phys1", name: "Physics Lab", building: "Lab", capacity: 20 },
        { id: "art1", name: "Art Studio", building: "Arts", capacity: 15 },
        { id: "hall1", name: "Lecture Hall 1", building: "Main", capacity: 100 },
        { id: "hall2", name: "Lecture Hall 2", building: "Main", capacity: 100 }
    ];
    
    // Save to global scope for demo
    window.roomsData = rooms;
    
    // Populate room dropdown in schedule form
    const roomDropdown = document.getElementById('form-room');
    if (roomDropdown) {
        // Keep the first option and clear others
        const firstOption = roomDropdown.options[0];
        roomDropdown.innerHTML = '';
        roomDropdown.appendChild(firstOption);
        
        // Add room options
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `${room.name} (${room.building})`;
            roomDropdown.appendChild(option);
        });
    }
    
    // Populate room filter in manage tab
    const roomFilter = document.getElementById('room-filter');
    if (roomFilter) {
        // Keep the first option and clear others
        const firstOption = roomFilter.options[0];
        roomFilter.innerHTML = '';
        roomFilter.appendChild(firstOption);
        
        // Add room options
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `${room.name} (${room.building})`;
            roomFilter.appendChild(option);
        });
    }
}

// Load user options based on type (teacher/student)
function loadUserOptions(userType) {
    const userSelect = document.getElementById('user-select');
    
    if (!userSelect) return;
    
    // Clear existing options except the first one
    const firstOption = userSelect.options[0];
    userSelect.innerHTML = '';
    userSelect.appendChild(firstOption);
    
    if (userType === 'teacher') {
        // Load teachers (mock data)
        const teachers = [
            { id: "t1", name: "Dr. Smith" },
            { id: "t2", name: "Prof. Johnson" },
            { id: "t3", name: "Ms. Garcia" },
            { id: "t4", name: "Mr. Wilson" }
        ];
        
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            userSelect.appendChild(option);
        });
    } else if (userType === 'student') {
        // Load students (mock data)
        const students = [
            { id: "s1", name: "Alice Andrews" },
            { id: "s2", name: "Bob Brown" },
            { id: "s3", name: "Charlie Chen" },
            { id: "s4", name: "Diana Davis" }
        ];
        
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            userSelect.appendChild(option);
        });
    }
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
    if (tabId === 'list-view') {
        loadClassList();
    } else if (tabId === 'room-availability') {
        loadRoomAvailability();
    } else if (tabId === 'manage-schedules') {
        loadManagedSchedules();
    }
}

// Load weekly schedule view
function loadWeeklySchedule() {
    const userType = document.getElementById('user-filter').value;
    const userId = userType === 'self' ? 'currentUser' : document.getElementById('user-select').value;
    const academicYear = document.getElementById('academic-year-filter').value || '2024-2025';
    const calendarContainer = document.getElementById('schedule-calendar-container');
    
    if (!userId || userType !== 'self' && !userId) {
        calendarContainer.innerHTML = '<p>Please select a user to view schedule.</p>';
        return;
    }
    
    // In a real implementation, we would fetch from the API here
    // Mock schedule data for demo
    let scheduleData = [];
    
    if (userType === 'self' || userId === 'currentUser') {
        // Mock data for current user (teacher)
        scheduleData = generateMockScheduleForUser('teacher', 'currentUser', academicYear);
    } else if (userType === 'teacher') {
        // Mock data for selected teacher
        scheduleData = generateMockScheduleForUser('teacher', userId, academicYear);
    } else if (userType === 'student') {
        // Mock data for selected student
        scheduleData = generateMockScheduleForUser('student', userId, academicYear);
    }
    
    // Generate weekly schedule calendar
    generateWeeklyCalendar(scheduleData);
}

// Generate mock schedule data for a user
function generateMockScheduleForUser(userType, userId, academicYear) {
    // Create some mock schedule items
    const mockSchedule = [];
    
    // Use teacherData courses if available
    if (userType === 'teacher' && teacherData && teacherData.courses) {
        teacherData.courses.forEach((course, index) => {
            // Assign different days and times for each course
            const dayOfWeek = (index % 5) + 1; // Monday to Friday
            const startHour = 8 + (index % 5); // 8 AM to 12 PM
            const startTime = startHour * 60; // Convert to minutes from midnight
            const duration = (index % 2 === 0) ? 90 : 120; // 90 or 120 minutes
            
            mockSchedule.push({
                id: `schedule-${index}`,
                course: {
                    id: course.id,
                    name: course.name,
                    code: course.code
                },
                teacher: {
                    id: userId,
                    name: "Current Teacher"
                },
                room: {
                    id: `room10${index + 1}`,
                    name: `Room 10${index + 1}`,
                    building: "Main"
                },
                scheduleType: index % 3 === 0 ? "laboratory" : "lecture",
                dayOfWeek: dayOfWeek,
                startTime: startTime,
                endTime: startTime + duration,
                academicYear: academicYear
            });
        });
    } else {
        // Generate generic mock data
        for (let i = 0; i < 5; i++) {
            const dayOfWeek = (i % 5) + 1; // Monday to Friday
            const startHour = 8 + (i % 5); // 8 AM to 12 PM
            const startTime = startHour * 60; // Convert to minutes from midnight
            const duration = (i % 2 === 0) ? 90 : 120; // 90 or 120 minutes
            
            mockSchedule.push({
                id: `schedule-${i}`,
                course: {
                    id: `course-${i}`,
                    name: `Course ${i + 1}`,
                    code: `COURSE${101 + i}`
                },
                teacher: {
                    id: userId,
                    name: userType === 'teacher' ? "Selected Teacher" : "Dr. Smith"
                },
                room: {
                    id: `room10${i + 1}`,
                    name: `Room 10${i + 1}`,
                    building: "Main"
                },
                scheduleType: i % 3 === 0 ? "laboratory" : "lecture",
                dayOfWeek: dayOfWeek,
                startTime: startTime,
                endTime: startTime + duration,
                academicYear: academicYear
            });
        }
    }
    
    return mockSchedule;
}

// Generate weekly calendar view
function generateWeeklyCalendar(scheduleData) {
    const calendarContainer = document.getElementById('schedule-calendar-container');
    
    // If no data
    if (!scheduleData || scheduleData.length === 0) {
        calendarContainer.innerHTML = '<p>No schedule data available.</p>';
        return;
    }
    
    // Start and end hours for the schedule (e.g., 8 AM to 8 PM)
    const startHour = 8;
    const endHour = 20;
    
    // Create the table structure
    let tableHTML = `
        <table class="schedule-calendar">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Create time slots
    for (let hour = startHour; hour < endHour; hour++) {
        const formattedHour = formatHour(hour);
        
        tableHTML += `
            <tr>
                <td class="time-slot">${formattedHour}</td>
        `;
        
        // Add cells for each day
        for (let day = 0; day < 7; day++) {
            tableHTML += `<td class="schedule-cell" data-day="${day}" data-hour="${hour}"></td>`;
        }
        
        tableHTML += `</tr>`;
    }
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    calendarContainer.innerHTML = tableHTML;
    
    // Place schedule items in the calendar
    scheduleData.forEach(item => {
        placeScheduleItemInCalendar(item);
    });
}

// Format hour to 12-hour format with AM/PM
function formatHour(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${displayHour}:00 ${period}`;
}

// Format minutes to time string (e.g., 570 -> "9:30 AM")
function formatMinutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${period}`;
}

// Place a schedule item in the calendar
function placeScheduleItemInCalendar(item) {
    const day = item.dayOfWeek;
    const startHour = Math.floor(item.startTime / 60);
    const endHour = Math.ceil(item.endTime / 60);
    const startMinute = item.startTime % 60;
    const endMinute = item.endTime % 60;
    
    // Find the cell for the starting hour
    const startCell = document.querySelector(`.schedule-cell[data-day="${day}"][data-hour="${startHour}"]`);
    
    if (!startCell) return; // Skip if cell doesn't exist
    
    // Calculate item height based on duration
    const durationHours = (item.endTime - item.startTime) / 60;
    const heightPercentage = (durationHours * 100) + '%';
    
    // Calculate top offset based on start minute
    const topOffset = (startMinute / 60) * 100;
    
    // Create the schedule item
    const scheduleItem = document.createElement('div');
    scheduleItem.className = `schedule-item ${item.scheduleType}`;
    scheduleItem.style.height = heightPercentage;
    scheduleItem.style.top = `${topOffset}%`;
    scheduleItem.setAttribute('data-id', item.id);
    scheduleItem.setAttribute('title', `${item.course.code} - ${item.course.name}\n${formatMinutesToTime(item.startTime)} - ${formatMinutesToTime(item.endTime)}\n${item.room.name}`);
    
    // Item content
    scheduleItem.innerHTML = `
        <strong>${item.course.code}</strong><br>
        ${formatMinutesToTime(item.startTime)} - ${formatMinutesToTime(item.endTime)}<br>
        ${item.room.name}
    `;
    
    // Add click event
    scheduleItem.addEventListener('click', function() {
        viewScheduleDetails(item.id);
    });
    
    // Add to calendar
    startCell.appendChild(scheduleItem);
}

// View schedule details
function viewScheduleDetails(scheduleId) {
    alert(`Viewing schedule details for ID: ${scheduleId}`);
    // In a real implementation, this would open a modal with the details
}

// Load class list view
function loadClassList() {
    const academicYear = document.getElementById('list-academic-year-filter').value || '2024-2025';
    const listContainer = document.getElementById('class-list-container');
    
    // In a real implementation, we would fetch from the API here
    // Mock schedule data for demo
    const scheduleData = generateMockScheduleForUser('teacher', 'currentUser', academicYear);
    
    if (!scheduleData || scheduleData.length === 0) {
        listContainer.innerHTML = '<p>No class schedule data available.</p>';
        return;
    }
    
    // Generate class list table
    let tableHTML = `
        <table class="class-list" id="class-list-table">
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Teacher</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Sort by day and time
    scheduleData.sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) {
            return a.dayOfWeek - b.dayOfWeek;
        }
        return a.startTime - b.startTime;
    });
    
    // Add rows
    scheduleData.forEach(item => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[item.dayOfWeek];
        
        tableHTML += `
            <tr data-id="${item.id}" data-day="${item.dayOfWeek}" data-course="${item.course.code}" data-type="${item.scheduleType}">
                <td>${item.course.code} - ${item.course.name}</td>
                <td>${dayName}</td>
                <td>${formatMinutesToTime(item.startTime)} - ${formatMinutesToTime(item.endTime)}</td>
                <td>${item.room.name}</td>
                <td>${capitalizeFirstLetter(item.scheduleType)}</td>
                <td>${item.teacher.name}</td>
                <td>
                    <button class="action-button" onclick="viewScheduleDetails('${item.id}')">View</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    listContainer.innerHTML = tableHTML;
}

// Filter class list based on search and day filter
function filterClassList() {
    const searchTerm = document.getElementById('class-search').value.toLowerCase();
    const dayFilter = document.getElementById('day-filter').value;
    const rows = document.querySelectorAll('#class-list-table tbody tr');
    
    rows.forEach(row => {
        const courseName = row.querySelector('td:first-child').textContent.toLowerCase();
        const rowDay = row.getAttribute('data-day');
        const rowType = row.getAttribute('data-type');
        
        const matchesSearch = !searchTerm || courseName.includes(searchTerm);
        const matchesDay = !dayFilter || rowDay === dayFilter;
        
        row.style.display = matchesSearch && matchesDay ? '' : 'none';
    });
}

// Load room availability view
function loadRoomAvailability() {
    const buildingFilter = document.getElementById('building-filter').value;
    const dayOfWeek = document.getElementById('day-of-week-filter').value;
    const timeInput = document.getElementById('time-filter').value;
    const roomListContainer = document.getElementById('room-list-container');
    
    // Convert time to minutes
    const [hours, minutes] = timeInput.split(':');
    const timeInMinutes = parseInt(hours) * 60 + parseInt(minutes);
    
    // Filter rooms by building if a building is selected
    let rooms = window.roomsData || [];
    if (buildingFilter) {
        rooms = rooms.filter(room => room.building === buildingFilter);
    }
    
    if (rooms.length === 0) {
        roomListContainer.innerHTML = '<p>No rooms available.</p>';
        return;
    }
    
    // Generate mock schedule data for checking room availability
    const scheduleData = generateMockScheduleForUser('teacher', 'currentUser', '2024-2025');
    
    // Generate room cards
    let roomCardsHTML = '';
    
    rooms.forEach(room => {
        // Check if room is occupied at the selected time and day
        const isOccupied = scheduleData.some(schedule => 
            schedule.room.id === room.id && 
            schedule.dayOfWeek.toString() === dayOfWeek.toString() &&
            schedule.startTime <= timeInMinutes && 
            schedule.endTime > timeInMinutes
        );
        
        // Get the occupying class if occupied
        let occupyingClass = null;
        if (isOccupied) {
            occupyingClass = scheduleData.find(schedule => 
                schedule.room.id === room.id && 
                schedule.dayOfWeek.toString() === dayOfWeek.toString() &&
                schedule.startTime <= timeInMinutes && 
                schedule.endTime > timeInMinutes
            );
        }
        
        roomCardsHTML += `
            <div class="room-card">
                <h3>${room.name}</h3>
                <div class="room-status">
                    <div class="status-indicator status-${isOccupied ? 'occupied' : 'free'}"></div>
                    <span>${isOccupied ? 'Occupied' : 'Available'}</span>
                </div>
                <p>Building: ${room.building}</p>
                <p>Capacity: ${room.capacity} students</p>
                ${isOccupied && occupyingClass ? `
                    <p>Current class: ${occupyingClass.course.code} - ${occupyingClass.course.name}</p>
                    <p>Time: ${formatMinutesToTime(occupyingClass.startTime)} - ${formatMinutesToTime(occupyingClass.endTime)}</p>
                ` : ''}
            </div>
        `;
    });
    
    roomListContainer.innerHTML = roomCardsHTML;
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

// Admin functionality: Load managed schedules
function loadManagedSchedules() {
    const academicYear = document.getElementById('manage-academic-year-filter').value || '2024-2025';
    const managedSchedulesList = document.getElementById('managed-schedules-list');
    
    // In a real implementation, we would fetch from the API here
    // Mock schedule data for demo
    const scheduleData = generateMockScheduleForUser('teacher', 'currentUser', academicYear);
    
    if (!scheduleData || scheduleData.length === 0) {
        managedSchedulesList.innerHTML = '<p>No schedule data available.</p>';
        return;
    }
    
    // Generate managed schedules table
    let tableHTML = `
        <table class="class-list" id="managed-schedules-table">
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Teacher</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Sort by day and time
    scheduleData.sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) {
            return a.dayOfWeek - b.dayOfWeek;
        }
        return a.startTime - b.startTime;
    });
    
    // Add rows
    scheduleData.forEach(item => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[item.dayOfWeek];
        
        tableHTML += `
            <tr data-id="${item.id}" data-day="${item.dayOfWeek}" data-course="${item.course.code}" data-type="${item.scheduleType}" data-room="${item.room.id}" data-teacher="${item.teacher.id}">
                <td>${item.course.code} - ${item.course.name}</td>
                <td>${dayName}</td>
                <td>${formatMinutesToTime(item.startTime)} - ${formatMinutesToTime(item.endTime)}</td>
                <td>${item.room.name}</td>
                <td>${capitalizeFirstLetter(item.scheduleType)}</td>
                <td>${item.teacher.name}</td>
                <td>
                    <button class="action-button" onclick="editSchedule('${item.id}')">Edit</button>
                    <button class="action-button secondary" onclick="deleteSchedule('${item.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    managedSchedulesList.innerHTML = tableHTML;
    
    // Populate course and teacher dropdowns for filters
    populateFilterDropdowns(scheduleData);
}

// Populate course and teacher filter dropdowns
function populateFilterDropdowns(scheduleData) {
    // Extract unique courses and teachers
    const courses = [];
    const teachers = [];
    const courseIds = new Set();
    const teacherIds = new Set();
    
    scheduleData.forEach(item => {
        if (!courseIds.has(item.course.id)) {
            courses.push(item.course);
            courseIds.add(item.course.id);
        }
        
        if (!teacherIds.has(item.teacher.id)) {
            teachers.push(item.teacher);
            teacherIds.add(item.teacher.id);
        }
    });
    
    // Populate course dropdown
    const courseFilter = document.getElementById('course-filter');
    if (courseFilter) {
        // Keep the first option and clear others
        const firstOption = courseFilter.options[0];
        courseFilter.innerHTML = '';
        courseFilter.appendChild(firstOption);
        
        // Sort courses by code
        courses.sort((a, b) => a.code.localeCompare(b.code));
        
        // Add course options
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = `${course.code} - ${course.name}`;
            courseFilter.appendChild(option);
        });
    }
    
    // Populate teacher dropdown
    const teacherFilter = document.getElementById('teacher-filter');
    if (teacherFilter) {
        // Keep the first option and clear others
        const firstOption = teacherFilter.options[0];
        teacherFilter.innerHTML = '';
        teacherFilter.appendChild(firstOption);
        
        // Sort teachers by name
        teachers.sort((a, b) => a.name.localeCompare(b.name));
        
        // Add teacher options
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            teacherFilter.appendChild(option);
        });
    }
    
    // Also populate the form dropdowns
    populateFormDropdowns(courses, teachers);
}

// Populate course and teacher dropdowns in the schedule form
function populateFormDropdowns(courses, teachers) {
    // Populate course dropdown
    const courseDropdown = document.getElementById('form-course');
    if (courseDropdown) {
        // Keep the first option and clear others
        const firstOption = courseDropdown.options[0];
        courseDropdown.innerHTML = '';
        courseDropdown.appendChild(firstOption);
        
        // Add course options
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = `${course.code} - ${course.name}`;
            courseDropdown.appendChild(option);
        });
    }
    
    // Populate teacher dropdown
    const teacherDropdown = document.getElementById('form-teacher');
    if (teacherDropdown) {
        // Keep the first option and clear others
        const firstOption = teacherDropdown.options[0];
        teacherDropdown.innerHTML = '';
        teacherDropdown.appendChild(firstOption);
        
        // Add teacher options
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            teacherDropdown.appendChild(option);
        });
    }
}

// Filter managed schedules
function filterManagedSchedules() {
    const courseFilter = document.getElementById('course-filter').value;
    const teacherFilter = document.getElementById('teacher-filter').value;
    const roomFilter = document.getElementById('room-filter').value;
    const rows = document.querySelectorAll('#managed-schedules-table tbody tr');
    
    rows.forEach(row => {
        const rowCourse = row.getAttribute('data-course');
        const rowTeacher = row.getAttribute('data-teacher');
        const rowRoom = row.getAttribute('data-room');
        
        const matchesCourse = !courseFilter || row.getAttribute('data-course-id') === courseFilter;
        const matchesTeacher = !teacherFilter || rowTeacher === teacherFilter;
        const matchesRoom = !roomFilter || rowRoom === roomFilter;
        
        row.style.display = matchesCourse && matchesTeacher && matchesRoom ? '' : 'none';
    });
}

// Open the new schedule form
function openNewScheduleForm() {
    document.getElementById('schedule-form-title').textContent = 'Create New Schedule';
    document.getElementById('schedule-form').reset();
    
    // Set today's date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('form-start-date').value = formattedDate;
    
    // Set end date to 4 months from now
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 4);
    document.getElementById('form-end-date').value = endDate.toISOString().split('T')[0];
    
    // Clear any conflict warnings
    document.getElementById('conflict-warning').style.display = 'none';
    
    // Set default times
    document.getElementById('form-start-time').value = '08:00';
    document.getElementById('form-end-time').value = '09:30';
    
    // Show the modal
    document.getElementById('schedule-form-modal').style.display = 'block';
}

// Edit an existing schedule
function editSchedule(scheduleId) {
    // In a real implementation, we would fetch the schedule details from the API
    // For demo, we'll use the mock data
    const scheduleData = generateMockScheduleForUser('teacher', 'currentUser', '2024-2025');
    const schedule = scheduleData.find(item => item.id === scheduleId);
    
    if (!schedule) {
        alert('Schedule not found.');
        return;
    }
    
    // Set form title
    document.getElementById('schedule-form-title').textContent = 'Edit Schedule';
    
    // Populate form fields
    document.getElementById('form-course').value = schedule.course.id;
    document.getElementById('form-teacher').value = schedule.teacher.id;
    document.getElementById('form-room').value = schedule.room.id;
    document.getElementById('form-section').value = schedule.section || 'A';
    document.getElementById('form-schedule-type').value = schedule.scheduleType;
    document.getElementById('form-day-of-week').value = schedule.dayOfWeek;
    
    // Set times
    const startHours = Math.floor(schedule.startTime / 60);
    const startMinutes = schedule.startTime % 60;
    const endHours = Math.floor(schedule.endTime / 60);
    const endMinutes = schedule.endTime % 60;
    
    document.getElementById('form-start-time').value = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
    document.getElementById('form-end-time').value = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    
    // Set dates
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('form-start-date').value = schedule.startDate || formattedDate;
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 4);
    document.getElementById('form-end-date').value = schedule.endDate || endDate.toISOString().split('T')[0];
    
    // Set other fields
    document.getElementById('form-recurring').value = schedule.isRecurring !== undefined ? schedule.isRecurring.toString() : 'true';
    document.getElementById('form-capacity').value = schedule.capacity || 40;
    document.getElementById('form-notes').value = schedule.notes || '';
    
    // Clear any conflict warnings
    document.getElementById('conflict-warning').style.display = 'none';
    
    // Store the schedule ID for update
    document.getElementById('schedule-form').setAttribute('data-schedule-id', scheduleId);
    
    // Show the modal
    document.getElementById('schedule-form-modal').style.display = 'block';
    
    // Update date fields visibility
    toggleDateFields();
}

// Delete a schedule
function deleteSchedule(scheduleId) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        // In a real implementation, we would send a delete request to the API
        alert(`Schedule ${scheduleId} deleted.`);
        
        // Refresh the list
        loadManagedSchedules();
    }
}

// Close the schedule form modal
function closeScheduleFormModal() {
    document.getElementById('schedule-form-modal').style.display = 'none';
}

// Close the schedule detail modal
function closeScheduleModal() {
    document.getElementById('schedule-detail-modal').style.display = 'none';
}

// Toggle date fields based on recurring selection
function toggleDateFields() {
    const isRecurring = document.getElementById('form-recurring').value === 'true';
    
    // Show/hide specific date field
    document.getElementById('specific-date-group').style.display = isRecurring ? 'none' : 'block';
    
    // Make start/end date required for recurring schedules
    document.getElementById('form-start-date').required = isRecurring;
    document.getElementById('form-end-date').required = isRecurring;
}

// Check for schedule conflicts
function checkScheduleConflicts() {
    const dayOfWeek = document.getElementById('form-day-of-week').value;
    const startTimeInput = document.getElementById('form-start-time').value;
    const endTimeInput = document.getElementById('form-end-time').value;
    const room = document.getElementById('form-room').value;
    const teacher = document.getElementById('form-teacher').value;
    const scheduleId = document.getElementById('schedule-form').getAttribute('data-schedule-id');
    
    if (!dayOfWeek || !startTimeInput || !endTimeInput || (!room && !teacher)) {
        // Not enough data to check conflicts
        document.getElementById('conflict-warning').style.display = 'none';
        return;
    }
    
    // Convert time inputs to minutes from midnight
    const [startHours, startMinutes] = startTimeInput.split(':');
    const startTime = parseInt(startHours) * 60 + parseInt(startMinutes);
    
    const [endHours, endMinutes] = endTimeInput.split(':');
    const endTime = parseInt(endHours) * 60 + parseInt(endMinutes);
    
    // Validate end time is after start time
    if (endTime <= startTime) {
        document.getElementById('conflict-warning').style.display = 'block';
        document.getElementById('conflict-details').innerHTML = 'End time must be after start time.';
        return;
    }
    
    // In a real implementation, we would make an API call to check conflicts
    // For demo, we'll check against mock data
    const scheduleData = generateMockScheduleForUser('teacher', 'currentUser', '2024-2025');
    
    // Find conflicts
    const roomConflicts = [];
    const teacherConflicts = [];
    
    scheduleData.forEach(item => {
        // Skip the current schedule if we're editing
        if (scheduleId && item.id === scheduleId) return;
        
        // Check if same day
        if (item.dayOfWeek.toString() !== dayOfWeek.toString()) return;
        
        // Check for time overlap
        const timeOverlap = (
            (startTime >= item.startTime && startTime < item.endTime) || // New start during existing
            (endTime > item.startTime && endTime <= item.endTime) || // New end during existing
            (startTime <= item.startTime && endTime >= item.endTime) // New completely contains existing
        );
        
        if (!timeOverlap) return;
        
        // Check room conflict
        if (room && item.room.id === room) {
            roomConflicts.push(item);
        }
        
        // Check teacher conflict
        if (teacher && item.teacher.id === teacher) {
            teacherConflicts.push(item);
        }
    });
    
    // Display conflicts if any
    if (roomConflicts.length > 0 || teacherConflicts.length > 0) {
        let conflictHTML = '';
        
        if (roomConflicts.length > 0) {
            conflictHTML += '<p><strong>Room conflicts:</strong></p><ul>';
            roomConflicts.forEach(conflict => {
                conflictHTML += `<li>${conflict.course.code} - ${formatMinutesToTime(conflict.startTime)} to ${formatMinutesToTime(conflict.endTime)}</li>`;
            });
            conflictHTML += '</ul>';
        }
        
        if (teacherConflicts.length > 0) {
            conflictHTML += '<p><strong>Teacher conflicts:</strong></p><ul>';
            teacherConflicts.forEach(conflict => {
                conflictHTML += `<li>${conflict.course.code} - ${formatMinutesToTime(conflict.startTime)} to ${formatMinutesToTime(conflict.endTime)}</li>`;
            });
            conflictHTML += '</ul>';
        }
        
        document.getElementById('conflict-warning').style.display = 'block';
        document.getElementById('conflict-details').innerHTML = conflictHTML;
    } else {
        document.getElementById('conflict-warning').style.display = 'none';
    }
}

// Save schedule
function saveSchedule() {
    // Check for conflicts
    const hasConflicts = document.getElementById('conflict-warning').style.display !== 'none';
    if (hasConflicts) {
        if (!confirm('This schedule has conflicts. Do you want to save it anyway?')) {
            return;
        }
    }
    
    // Get form values
    const scheduleId = document.getElementById('schedule-form').getAttribute('data-schedule-id');
    const isEdit = !!scheduleId;
    
    const course = document.getElementById('form-course').value;
    const teacher = document.getElementById('form-teacher').value;
    const room = document.getElementById('form-room').value;
    const section = document.getElementById('form-section').value;
    const scheduleType = document.getElementById('form-schedule-type').value;
    const dayOfWeek = document.getElementById('form-day-of-week').value;
    const startTimeInput = document.getElementById('form-start-time').value;
    const endTimeInput = document.getElementById('form-end-time').value;
    const isRecurring = document.getElementById('form-recurring').value === 'true';
    const specificDate = document.getElementById('form-specific-date').value;
    const startDate = document.getElementById('form-start-date').value;
    const endDate = document.getElementById('form-end-date').value;
    const capacity = document.getElementById('form-capacity').value;
    const notes = document.getElementById('form-notes').value;
    
    // Convert time inputs to minutes from midnight
    const [startHours, startMinutes] = startTimeInput.split(':');
    const startTime = parseInt(startHours) * 60 + parseInt(startMinutes);
    
    const [endHours, endMinutes] = endTimeInput.split(':');
    const endTime = parseInt(endHours) * 60 + parseInt(endMinutes);
    
    // Create schedule object
    const scheduleData = {
        id: scheduleId || `schedule-${Date.now()}`,
        course: { id: course, name: 'Course Name', code: 'COURSE101' }, // Would get from API
        teacher: { id: teacher, name: 'Teacher Name' }, // Would get from API
        room: { id: room, name: 'Room Name', building: 'Building' }, // Would get from API
        section,
        scheduleType,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        isRecurring,
        specificDate: isRecurring ? null : specificDate,
        startDate: isRecurring ? startDate : null,
        endDate: isRecurring ? endDate : null,
        capacity: parseInt(capacity),
        notes,
        academicYear: '2024-2025' // Would get from form/context
    };
    
    // In a real implementation, we would send this to the API
    console.log('Saving schedule:', scheduleData);
    
    // Show success message
    alert(`Schedule ${isEdit ? 'updated' : 'created'} successfully.`);
    
    // Close the modal
    closeScheduleFormModal();
    
    // Refresh the list
    loadManagedSchedules();
    
    // If in weekly view, refresh that too
    if (document.getElementById('weekly-schedule').style.display !== 'none') {
        loadWeeklySchedule();
    }
}

// Convert time input to formatted time string
function timeInputToFormattedTime(timeInput) {
    const [hours, minutes] = timeInput.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
}

// Logout function
function logout() {
    if (window.SessionManager) {
        SessionManager.clearSession();
    }
    
    // Redirect to login page
    window.location.href = 'loginpage.html';
}
