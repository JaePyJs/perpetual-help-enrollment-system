/**
 * Messaging System
 * This module provides messaging functionality between users,
 * including direct messages, class announcements, and general announcements.
 */

// Initialize the messaging system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize security modules if available
    if (window.SecurityModule) {
        SecurityModule.init();
    }
    
    if (window.SessionManager) {
        SessionManager.init();
    }
    
    // Load messages for the current user
    loadMessages('inbox');
    
    // Setup event listeners
    setupEventListeners();
    
    // Update unread message count
    updateUnreadCount();
    
    // Log page access
    logAccessEvent('messaging_page_access');
});

// Setup event listeners
function setupEventListeners() {
    // Folder selection
    const folderItems = document.querySelectorAll('.folder-list li');
    folderItems.forEach(item => {
        item.addEventListener('click', function() {
            const folder = this.getAttribute('data-folder');
            // Update active class
            folderItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            // Load messages for selected folder
            loadMessages(folder);
        });
    });
    
    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce(function() {
        const activeFolder = document.querySelector('.folder-list li.active').getAttribute('data-folder');
        loadMessages(activeFolder, 1, searchInput.value);
    }, 500));
    
    // Compose message button
    const composeBtn = document.getElementById('compose-btn');
    composeBtn.addEventListener('click', showComposeForm);
    
    // Empty state compose button
    const emptyComposeBtn = document.getElementById('empty-compose-btn');
    if (emptyComposeBtn) {
        emptyComposeBtn.addEventListener('click', showComposeForm);
    }
    
    // Mobile back button (in case of responsive view)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mobile-back')) {
            showMessageList();
        }
    });
}

// Load messages for a specific folder
function loadMessages(folder, page = 1, search = '') {
    const messageList = document.getElementById('message-list');
    messageList.innerHTML = '<div class="loading">Loading messages...</div>';
    
    // In a real implementation, we would fetch from the API
    /*
    fetch(`/api/messages?folder=${folder}&page=${page}&limit=10&search=${encodeURIComponent(search)}`, {
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayMessages(data.messages, data.pagination);
    })
    .catch(error => {
        console.error('Error fetching messages:', error);
        messageList.innerHTML = '<div class="error">Error loading messages. Please try again.</div>';
    });
    */
    
    // For demo purposes, use mock data
    const mockMessages = generateMockMessages(folder, search);
    const mockPagination = {
        total: mockMessages.length,
        page: page,
        limit: 10,
        pages: Math.ceil(mockMessages.length / 10)
    };
    
    // Get messages for the current page
    const startIndex = (page - 1) * mockPagination.limit;
    const endIndex = startIndex + mockPagination.limit;
    const paginatedMessages = mockMessages.slice(startIndex, endIndex);
    
    // Display messages
    setTimeout(() => {
        displayMessages(paginatedMessages, mockPagination);
    }, 300); // Simulate API delay
}

// Generate mock messages for demo
function generateMockMessages(folder, search = '') {
    const messages = [];
    const currentUser = { id: 'current-user', name: 'Current User' };
    
    // Define templates based on folder
    const templates = {
        inbox: [
            { sender: { id: 'user1', name: 'John Smith' }, subject: 'Class schedule changes', content: 'Dear colleague, there have been some changes to the class schedule for next week...' },
            { sender: { id: 'user2', name: 'Maria Garcia' }, subject: 'Question about homework', content: 'Hello Professor, I had a question about the homework assignment due next Friday...' },
            { sender: { id: 'user3', name: 'Principal Wilson' }, subject: 'Faculty Meeting', content: 'Please be reminded that we have a faculty meeting on Thursday at 3:00 PM...' },
            { sender: { id: 'user4', name: 'Susan Taylor' }, subject: 'Student progress report', content: 'I wanted to discuss the progress of some students in your class...' },
            { sender: { id: 'user5', name: 'David Johnson' }, subject: 'Guest speaker opportunity', content: 'There is an opportunity for a guest speaker in your class next month...' }
        ],
        sent: [
            { recipients: [{ id: 'user1', name: 'John Smith' }], subject: 'Re: Class schedule changes', content: "Thanks for letting me know. I'll adjust my plans accordingly..." },
            { recipients: [{ id: 'user2', name: 'Maria Garcia' }], subject: 'Re: Question about homework', content: "You can submit the assignment by Monday if you need more time..." },
            { recipients: [{ id: 'user3', name: 'Principal Wilson' }], subject: 'Re: Faculty Meeting', content: "I'll be there. I also have some points to discuss about the new curriculum..." },
            { recipients: [{ id: 'admin', name: 'Admin Team' }], subject: 'Tech support request', content: "My classroom projector has been flickering lately. Could someone take a look?..." },
            { recipients: [{ id: 'class101', name: 'Mathematics 101' }], subject: "Next week's assignment", content: "Please prepare chapters 7-9 for next week's class. We'll be discussing linear algebra..." }
        ],
        archived: [
            { sender: { id: 'user6', name: 'Academic Affairs' }, subject: 'Semester Calendar', content: 'Please find attached the semester calendar with important dates...' },
            { sender: { id: 'user7', name: 'IT Department' }, subject: 'System Maintenance', content: 'The school management system will be down for maintenance this Saturday...' }
        ],
        deleted: [
            { sender: { id: 'user8', name: 'Newsletter' }, subject: 'Weekly School Newsletter', content: "Here are the highlights from this week's activities..." },
            { sender: { id: 'user9', name: 'Library' }, subject: 'Overdue Book Notice', content: 'This is a reminder that you have books due for return...' }
        ]
    };
    
    // Generate messages based on templates for the selected folder
    if (templates[folder]) {
        templates[folder].forEach((template, index) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Random date within last 2 weeks
            
            messages.push({
                id: `${folder}-${index}`,
                sender: template.sender || currentUser,
                recipients: template.recipients || [currentUser],
                subject: template.subject,
                content: template.content,
                createdAt: date.toISOString(),
                isRead: Math.random() > 0.3, // 30% chance of being unread
                attachments: []
            });
        });
    }
    
    // Add some with attachments
    if (messages.length > 2) {
        messages[1].attachments = [
            { filename: 'document.pdf', originalname: 'Important Document.pdf', size: 1024 * 1024 }
        ];
    }
    
    // Filter by search term if provided
    if (search) {
        return messages.filter(message => 
            message.subject.toLowerCase().includes(search.toLowerCase()) ||
            message.content.toLowerCase().includes(search.toLowerCase()) ||
            message.sender.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Sort by date (newest first)
    return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Display messages in the message list
function displayMessages(messages, pagination) {
    const messageList = document.getElementById('message-list');
    const template = document.getElementById('message-item-template');
    
    // Clear the list
    messageList.innerHTML = '';
    
    if (messages.length === 0) {
        messageList.innerHTML = '<div class="empty-list">No messages found</div>';
        return;
    }
    
    // Add messages to the list
    messages.forEach(message => {
        const messageItem = template.content.cloneNode(true).querySelector('.message-item');
        
        // Set message data
        messageItem.setAttribute('data-id', message.id);
        if (!message.isRead) {
            messageItem.classList.add('unread');
        }
        
        // Set message content
        const sender = messageItem.querySelector('.message-sender');
        sender.textContent = message.sender ? message.sender.name : 'You';
        
        const time = messageItem.querySelector('.message-time');
        time.textContent = formatDate(message.createdAt);
        
        const subject = messageItem.querySelector('.message-subject');
        subject.textContent = message.subject;
        
        const preview = messageItem.querySelector('.message-preview');
        preview.textContent = message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '');
        
        // Add click event
        messageItem.addEventListener('click', function() {
            viewMessage(message.id);
        });
        
        messageList.appendChild(messageItem);
    });
    
    // Add pagination
    updatePagination(pagination);
}

// Update pagination controls
function updatePagination(pagination) {
    const paginationContainer = document.getElementById('message-pagination');
    paginationContainer.innerHTML = '';
    
    if (pagination.pages <= 1) {
        return; // No pagination needed
    }
    
    // Add page buttons
    for (let i = 1; i <= pagination.pages; i++) {
        const pageItem = document.createElement('div');
        pageItem.classList.add('page-item');
        if (i === pagination.page) {
            pageItem.classList.add('active');
        }
        pageItem.textContent = i;
        
        // Add click event
        pageItem.addEventListener('click', function() {
            const activeFolder = document.querySelector('.folder-list li.active').getAttribute('data-folder');
            const searchInput = document.getElementById('search-input');
            loadMessages(activeFolder, i, searchInput.value);
        });
        
        paginationContainer.appendChild(pageItem);
    }
}

// View a message
function viewMessage(messageId) {
    const messageContent = document.getElementById('message-content');
    const template = document.getElementById('message-view-template');
    
    // Create loading state
    messageContent.innerHTML = '<div class="loading-message">Loading message...</div>';
    
    // Show message content on mobile
    if (window.innerWidth < 768) {
        document.querySelector('.message-sidebar').classList.remove('mobile-visible');
        document.querySelector('.message-content').style.display = 'block';
    }
    
    // In a real implementation, we would fetch from the API
    /*
    fetch(`/api/messages/${messageId}`, {
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(message => {
        displayMessageContent(message);
    })
    .catch(error => {
        console.error('Error fetching message:', error);
        messageContent.innerHTML = '<div class="error">Error loading message. Please try again.</div>';
    });
    */
    
    // For demo purposes, get the message from our mock data
    const folders = ['inbox', 'sent', 'archived', 'deleted'];
    let foundMessage = null;
    
    // Search for the message in all folders
    for (const folder of folders) {
        const messages = generateMockMessages(folder);
        foundMessage = messages.find(message => message.id === messageId);
        if (foundMessage) break;
    }
    
    // Display message
    setTimeout(() => {
        if (foundMessage) {
            displayMessageContent(foundMessage);
        } else {
            messageContent.innerHTML = '<div class="error">Message not found.</div>';
        }
    }, 300); // Simulate API delay
}

// Display message content
function displayMessageContent(message) {
    const messageContent = document.getElementById('message-content');
    const template = document.getElementById('message-view-template');
    const messageView = template.content.cloneNode(true).querySelector('.message-view');
    
    // Set message data
    messageView.querySelector('.message-view-subject').textContent = message.subject;
    messageView.querySelector('.message-sender').textContent = message.sender.name;
    
    // Format recipients
    const recipientNames = message.recipients.map(recipient => recipient.name).join(', ');
    messageView.querySelector('.message-recipients').textContent = recipientNames;
    
    // Format date
    messageView.querySelector('.message-date').textContent = formatDate(message.createdAt, true);
    
    // Set message content
    messageView.querySelector('.message-text').textContent = message.content;
    
    // Handle attachments
    const attachmentsContainer = messageView.querySelector('.message-attachments');
    const attachmentsList = attachmentsContainer.querySelector('.attachment-list');
    
    if (message.attachments && message.attachments.length > 0) {
        attachmentsList.innerHTML = '';
        
        message.attachments.forEach(attachment => {
            const attachmentItem = document.createElement('li');
            attachmentItem.classList.add('attachment-item');
            
            // Determine icon based on file type
            let icon = '📄';
            const fileExt = attachment.originalname.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
                icon = '🖼️';
            } else if (['pdf'].includes(fileExt)) {
                icon = '📑';
            } else if (['doc', 'docx'].includes(fileExt)) {
                icon = '📝';
            } else if (['xls', 'xlsx'].includes(fileExt)) {
                icon = '📊';
            } else if (['ppt', 'pptx'].includes(fileExt)) {
                icon = '📋';
            }
            
            attachmentItem.innerHTML = `
                <span class="attachment-icon">${icon}</span>
                <span>${attachment.originalname}</span>
                <a href="#" class="download-attachment" data-filename="${attachment.filename}">Download</a>
            `;
            
            attachmentsList.appendChild(attachmentItem);
        });
        
        attachmentsContainer.style.display = 'block';
    } else {
        attachmentsContainer.style.display = 'none';
    }
    
    // Setup reply functionality
    const replyInput = messageView.querySelector('.reply-input');
    const sendReplyBtn = messageView.querySelector('#send-reply-btn');
    
    sendReplyBtn.addEventListener('click', function() {
        if (replyInput.value.trim()) {
            sendReply(message.id, replyInput.value);
        }
    });
    
    // Add to DOM
    messageContent.innerHTML = '';
    messageContent.appendChild(messageView);
}

// Show compose message form
function showComposeForm() {
    const messageContent = document.getElementById('message-content');
    const template = document.getElementById('compose-template');
    const composeForm = template.content.cloneNode(true);
    
    // Clear any existing content
    messageContent.innerHTML = '';
    messageContent.appendChild(composeForm);
    
    // Show message content on mobile
    if (window.innerWidth < 768) {
        document.querySelector('.message-sidebar').classList.remove('mobile-visible');
        document.querySelector('.message-content').style.display = 'block';
    }
    
    // Setup form events
    const form = document.getElementById('compose-form');
    const messageType = document.getElementById('message-type');
    const recipientsGroup = document.getElementById('recipients-group');
    const courseGroup = document.getElementById('course-group');
    const priorityGroup = document.getElementById('priority-group');
    const cancelBtn = document.getElementById('cancel-compose');
    
    // Load courses for class announcements
    loadCourses();
    
    // Change form based on message type
    messageType.addEventListener('change', function() {
        const type = this.value;
        
        if (type === 'direct') {
            recipientsGroup.style.display = 'block';
            courseGroup.style.display = 'none';
            priorityGroup.style.display = 'none';
        } else if (type === 'class') {
            recipientsGroup.style.display = 'none';
            courseGroup.style.display = 'block';
            priorityGroup.style.display = 'block';
        } else if (type === 'announcement') {
            recipientsGroup.style.display = 'none';
            courseGroup.style.display = 'none';
            priorityGroup.style.display = 'block';
        }
    });
    
    // Setup recipient input for direct messages
    setupRecipientInput();
    
    // Cancel button
    cancelBtn.addEventListener('click', function() {
        // Clear form and go back to message list
        form.reset();
        showMessageList();
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });
}

// Setup recipient input with token-style interface
function setupRecipientInput() {
    const tokenInput = document.getElementById('token-input');
    const recipientInput = document.getElementById('recipient-input');
    const suggestions = document.getElementById('recipient-suggestions');
    
    // Mock recipient data
    const recipients = [
        { id: 'user1', name: 'John Smith' },
        { id: 'user2', name: 'Maria Garcia' },
        { id: 'user3', name: 'Principal Wilson' },
        { id: 'user4', name: 'Susan Taylor' },
        { id: 'user5', name: 'David Johnson' },
        { id: 'user6', name: 'Academic Affairs' },
        { id: 'user7', name: 'IT Department' }
    ];
    
    // Selected recipients
    const selectedRecipients = [];
    
    // Input event for recipient search
    recipientInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            suggestions.style.display = 'none';
            return;
        }
        
        // Filter recipients based on query
        const filteredRecipients = recipients.filter(recipient => 
            recipient.name.toLowerCase().includes(query) &&
            !selectedRecipients.some(r => r.id === recipient.id)
        );
        
        // Show suggestions
        if (filteredRecipients.length > 0) {
            suggestions.innerHTML = '';
            
            filteredRecipients.forEach(recipient => {
                const item = document.createElement('div');
                item.classList.add('suggestion-item');
                item.textContent = recipient.name;
                item.setAttribute('data-id', recipient.id);
                
                item.addEventListener('click', function() {
                    addRecipient(recipient);
                    recipientInput.value = '';
                    suggestions.style.display = 'none';
                });
                
                suggestions.appendChild(item);
            });
            
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    });
    
    // Add a recipient token
    function addRecipient(recipient) {
        selectedRecipients.push(recipient);
        
        const token = document.createElement('div');
        token.classList.add('recipient-token');
        token.innerHTML = `
            <span>${recipient.name}</span>
            <span class="remove-token" data-id="${recipient.id}">&times;</span>
        `;
        
        // Remove token on click
        token.querySelector('.remove-token').addEventListener('click', function() {
            const recipientId = this.getAttribute('data-id');
            const index = selectedRecipients.findIndex(r => r.id === recipientId);
            
            if (index !== -1) {
                selectedRecipients.splice(index, 1);
                token.remove();
            }
        });
        
        // Add token before the input
        tokenInput.insertBefore(token, recipientInput);
    }
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!tokenInput.contains(e.target)) {
            suggestions.style.display = 'none';
        }
    });
}

// Load courses for class announcements
function loadCourses() {
    const courseSelect = document.getElementById('course-select');
    
    if (!courseSelect) return;
    
    // Mock course data
    const courses = [
        { id: 'course1', name: 'Mathematics 101', code: 'MATH101' },
        { id: 'course2', name: 'Introduction to Physics', code: 'PHYS101' },
        { id: 'course3', name: 'English Literature', code: 'ENG201' },
        { id: 'course4', name: 'Computer Science Basics', code: 'CS101' },
        { id: 'course5', name: 'Chemistry Lab', code: 'CHEM102' }
    ];
    
    // Clear existing options except the first one
    const firstOption = courseSelect.options[0];
    courseSelect.innerHTML = '';
    courseSelect.appendChild(firstOption);
    
    // Add course options
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = `${course.code} - ${course.name}`;
        courseSelect.appendChild(option);
    });
}

// Send a message
function sendMessage() {
    const messageType = document.getElementById('message-type').value;
    const subject = document.getElementById('message-subject').value;
    const content = document.getElementById('message-content').value;
    
    if (!subject || !content) {
        alert('Please fill in all required fields.');
        return;
    }
    
    let recipients = [];
    let course = null;
    let priority = 'normal';
    
    // Get recipients based on message type
    if (messageType === 'direct') {
        const recipientTokens = document.querySelectorAll('.recipient-token');
        
        if (recipientTokens.length === 0) {
            alert('Please add at least one recipient.');
            return;
        }
        
        recipients = Array.from(recipientTokens).map(token => {
            const id = token.querySelector('.remove-token').getAttribute('data-id');
            const name = token.querySelector('span').textContent;
            return { id, name };
        });
    } else if (messageType === 'class') {
        const courseSelect = document.getElementById('course-select');
        
        if (!courseSelect.value) {
            alert('Please select a course.');
            return;
        }
        
        course = {
            id: courseSelect.value,
            name: courseSelect.options[courseSelect.selectedIndex].textContent
        };
        
        priority = document.getElementById('message-priority').value;
    } else if (messageType === 'announcement') {
        // General announcements go to all users or a specific group
        priority = document.getElementById('message-priority').value;
    }
    
    // Get attachments
    const attachmentInput = document.getElementById('message-attachments');
    const attachments = attachmentInput.files;
    
    // In a real implementation, we would send to the API
    /*
    const formData = new FormData();
    formData.append('messageType', messageType);
    formData.append('subject', subject);
    formData.append('content', content);
    
    if (messageType === 'direct') {
        recipients.forEach(recipient => {
            formData.append('recipients', recipient.id);
        });
    } else if (messageType === 'class') {
        formData.append('course', course.id);
    }
    
    if (priority !== 'normal') {
        formData.append('priority', priority);
    }
    
    // Add attachments
    if (attachments.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }
    }
    
    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Message sent successfully!');
        // Go back to inbox
        loadMessages('inbox');
        showMessageList();
    })
    .catch(error => {
        console.error('Error sending message:', error);
        alert('Error sending message. Please try again.');
    });
    */
    
    // For demo, simulate API call
    setTimeout(() => {
        alert('Message sent successfully!');
        // Go back to inbox
        loadMessages('inbox');
        showMessageList();
    }, 1000);
}

// Send a reply to a message
function sendReply(messageId, content) {
    if (!content.trim()) {
        alert('Please enter a reply message.');
        return;
    }
    
    // In a real implementation, we would send to the API
    /*
    const formData = new FormData();
    formData.append('parentMessage', messageId);
    formData.append('messageType', 'direct');
    formData.append('subject', 'Re: Original Subject'); // This would be fetched from the parent
    formData.append('content', content);
    
    // Add recipient (the original sender)
    formData.append('recipients', originalSenderId);
    
    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Reply sent successfully!');
        // Reload the message to show the reply
        viewMessage(messageId);
    })
    .catch(error => {
        console.error('Error sending reply:', error);
        alert('Error sending reply. Please try again.');
    });
    */
    
    // For demo, simulate API call
    setTimeout(() => {
        alert('Reply sent successfully!');
        // Clear the reply input
        document.querySelector('.reply-input').value = '';
    }, 1000);
}

// Show the message list (useful for mobile view)
function showMessageList() {
    if (window.innerWidth < 768) {
        document.querySelector('.message-sidebar').classList.add('mobile-visible');
        document.querySelector('.message-content').style.display = 'none';
    } else {
        // For desktop, show empty state
        const messageContent = document.getElementById('message-content');
        messageContent.innerHTML = `
            <div class="empty-state" id="empty-state">
                <div class="empty-icon">✉️</div>
                <div class="empty-text">Select a message to view its contents</div>
                <button class="action-button" id="empty-compose-btn">Compose New Message</button>
            </div>
        `;
        
        // Add event listener to the new compose button
        const emptyComposeBtn = document.getElementById('empty-compose-btn');
        if (emptyComposeBtn) {
            emptyComposeBtn.addEventListener('click', showComposeForm);
        }
    }
}

// Update unread message count
function updateUnreadCount() {
    // In a real implementation, we would fetch from the API
    /*
    fetch('/api/messages/unread/count', {
        headers: {
            'Authorization': `Bearer ${SessionManager.getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('inbox-count').textContent = data.count;
    })
    .catch(error => {
        console.error('Error getting unread count:', error);
    });
    */
    
    // For demo, use a random number
    const count = Math.floor(Math.random() * 10);
    document.getElementById('inbox-count').textContent = count;
}

// Format date
function formatDate(dateString, includeTime = false) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
        if (includeTime) {
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return `Today`;
    }
    
    // Check if the date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
        if (includeTime) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return `Yesterday`;
    }
    
    // Otherwise, format the date
    if (includeTime) {
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString();
}

// Debounce function for search input
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
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
