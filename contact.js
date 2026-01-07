// Contact page functionality

// Initialize contact page
function initContactPage() {
    setupFormValidation();
    setupFileUpload();
    setupFAQAccordion();
    setupLiveChat();
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

// Validate form
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    // Reset error states
    resetErrors();
    
    // Validate name
    if (!name.value.trim()) {
        showError(name, 'Please enter your full name');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showError(email, 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (!subject.value) {
        showError(subject, 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showError(message, 'Please enter your message');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

// Show error for form field
function showError(field, message) {
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '0.25rem';
    
    // Insert after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

// Reset all error states
function resetErrors() {
    // Remove error classes
    document.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });
    
    // Remove error messages
    document.querySelectorAll('.error-message').forEach(element => {
        element.remove();
    });
}

// Validate email format
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Submit form (simulated)
function submitForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        resetFileList();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reset file upload area
        resetFileList();
        
    }, 1500);
}

// Setup file upload
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('attachment');
    const fileList = document.getElementById('file-list');
    
    if (!uploadArea || !fileInput || !fileList) return;
    
    // Click on upload area to trigger file input
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f0f8ff';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
}

// Handle selected files
function handleFiles(files) {
    const fileList = document.getElementById('file-list');
    
    // Clear existing list
    fileList.innerHTML = '';
    
    // Validate and add files
    Array.from(files).forEach((file, index) => {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`File "${file.name}" is too large (max 5MB)`, 'error');
            return;
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            showNotification(`File "${file.name}" has invalid format`, 'error');
            return;
        }
        
        // Create file item
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-name">
                <i class="fas fa-paperclip"></i>
                <span>${file.name}</span>
                <small>(${(file.size / 1024 / 1024).toFixed(2)} MB)</small>
            </div>
            <button class="remove-file" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(fileItem);
    });
    
    // Setup remove buttons
    document.querySelectorAll('.remove-file').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            removeFile(index);
        });
    });
}

// Remove file from list
function removeFile(index) {
    const fileInput = document.getElementById('attachment');
    const files = Array.from(fileInput.files);
    
    // Remove file from array
    files.splice(index, 1);
    
    // Update file input (requires creating a new FileList)
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
    
    // Refresh file list display
    handleFiles(fileInput.files);
}

// Reset file list
function resetFileList() {
    const fileInput = document.getElementById('attachment');
    const fileList = document.getElementById('file-list');
    
    fileInput.value = '';
    fileList.innerHTML = '';
}

// Setup FAQ accordion
function setupFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Get the answer element
            const answer = this.nextElementSibling;
            
            // Toggle answer visibility
            if (this.classList.contains('active')) {
                answer.classList.add('show');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.classList.remove('show');
                answer.style.maxHeight = null;
            }
            
            // Close other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    otherAnswer.classList.remove('show');
                    otherAnswer.style.maxHeight = null;
                }
            });
        });
    });
}

// Setup live chat
function setupLiveChat() {
    const chatInput = document.querySelector('.chat-input input');
    const chatSendBtn = document.querySelector('.chat-input button');
    const chatBody = document.querySelector('.chat-body');
    
    if (!chatInput || !chatSendBtn || !chatBody) return;
    
    // Send message on button click
    chatSendBtn.addEventListener('click', sendChatMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Auto-reply after user message
    window.sendChatMessage = function() {
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        addChatMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Auto-reply after delay
        setTimeout(() => {
            const replies = [
                "Thanks for your message! How can I assist you today?",
                "I'll connect you with a support agent shortly.",
                "Is this regarding an order issue, product question, or something else?",
                "I'm here to help! Could you provide more details about your concern?"
            ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            addChatMessage(randomReply, 'bot');
        }, 1000);
    }
    
    // Add message to chat
    function addChatMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <strong>${sender === 'bot' ? 'ShopEasy Bot' : 'You'}:</strong> ${text}
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.contact-container')) {
        initContactPage();
    }
});