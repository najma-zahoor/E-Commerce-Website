// forgot-password.js - Forgot Password Functionality

const ForgotPasswordManager = {
    currentStep: 1,
    verificationCode: '',
    timerInterval: null,
    timeLeft: 300, // 5 minutes in seconds
    userEmail: '',

    init() {
        this.setupEventListeners();
        this.setupCodeInputs();
        this.updateProgressSteps();
    },

    setupEventListeners() {
        // Email form submission
        const emailForm = document.getElementById('emailForm');
        if (emailForm) {
            emailForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailSubmission();
            });
        }

        // Resend code button
        const resendCodeBtn = document.getElementById('resendCodeBtn');
        if (resendCodeBtn) {
            resendCodeBtn.addEventListener('click', () => {
                this.resendVerificationCode();
            });
        }

        // Back to email button
        const backToEmailBtn = document.getElementById('backToEmailBtn');
        if (backToEmailBtn) {
            backToEmailBtn.addEventListener('click', () => {
                this.goToStep(1);
            });
        }

        // Password form submission
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordReset();
            });
        }

        // Back to verify button
        const backToVerifyBtn = document.getElementById('backToVerifyBtn');
        if (backToVerifyBtn) {
            backToVerifyBtn.addEventListener('click', () => {
                this.goToStep(2);
            });
        }

        // New password input validation
        const newPasswordInput = document.getElementById('newPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', () => {
                this.validatePasswordStrength(newPasswordInput.value);
            });
        }

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }
    },

    setupCodeInputs() {
        const codeInputs = document.querySelectorAll('#codeInputs input');
        
        codeInputs.forEach((input, index) => {
            // Handle input
            input.addEventListener('input', (e) => {
                this.handleCodeInput(e, index, codeInputs);
            });
            
            // Handle paste
            input.addEventListener('paste', (e) => {
                this.handleCodePaste(e, codeInputs);
            });
            
            // Handle keydown for navigation
            input.addEventListener('keydown', (e) => {
                this.handleCodeKeydown(e, index, codeInputs);
            });
        });
    },

    handleCodeInput(e, index, inputs) {
        const value = e.target.value;
        
        // Only allow numbers
        if (!/^\d?$/.test(value)) {
            e.target.value = '';
            return;
        }
        
        // If a number was entered, move to next input
        if (value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
        
        // Update verification code
        this.updateVerificationCode();
        
        // Enable/disable verify button based on complete code
        this.toggleVerifyButton();
    },

    handleCodePaste(e, inputs) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
        
        // Fill inputs with pasted numbers
        numbers.split('').forEach((num, index) => {
            if (inputs[index]) {
                inputs[index].value = num;
                inputs[index].classList.add('filled');
            }
        });
        
        // Focus last filled input or first empty
        const firstEmptyIndex = numbers.length < 6 ? numbers.length : 5;
        inputs[firstEmptyIndex]?.focus();
        
        // Update verification code
        this.updateVerificationCode();
        
        // Enable/disable verify button
        this.toggleVerifyButton();
    },

    handleCodeKeydown(e, index, inputs) {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (!inputs[index].value && index > 0) {
                // Move to previous input and clear it
                inputs[index - 1].value = '';
                inputs[index - 1].focus();
            } else {
                // Clear current input
                inputs[index].value = '';
            }
            
            // Update verification code
            this.updateVerificationCode();
            
            // Enable/disable verify button
            this.toggleVerifyButton();
        }
        
        // Handle arrow keys for navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            inputs[index - 1].focus();
            e.preventDefault();
        }
        if (e.key === 'ArrowRight' && index < inputs.length - 1) {
            inputs[index + 1].focus();
            e.preventDefault();
        }
    },

    updateVerificationCode() {
        const inputs = document.querySelectorAll('#codeInputs input');
        const code = Array.from(inputs).map(input => input.value).join('');
        this.verificationCode = code;
        document.getElementById('verificationCode').value = code;
    },

    toggleVerifyButton() {
        const verifyBtn = document.getElementById('verifyCodeBtn');
        const codeComplete = this.verificationCode.length === 6;
        
        if (verifyBtn) {
            verifyBtn.disabled = !codeComplete;
        }
        
        // Setup form submission when code is complete
        if (codeComplete) {
            const verifyForm = document.getElementById('verifyForm');
            if (verifyForm) {
                verifyForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleCodeVerification();
                });
            }
        }
    },

    async handleEmailSubmission() {
        const email = document.getElementById('email').value.trim();
        const emailError = document.getElementById('emailError');
        const emailSuccess = document.getElementById('emailSuccess');
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        
        // Validate email
        if (!this.validateEmail(email)) {
            this.showError(emailError, 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const originalText = sendCodeBtn.innerHTML;
        sendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendCodeBtn.disabled = true;
        
        try {
            // In a real app, this would be an API call
            // For demo, we'll simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Store email for later use
            this.userEmail = email;
            
            // Generate verification code
            this.verificationCode = this.generateVerificationCode();
            
            // Show success message
            emailSuccess.classList.add('show');
            
            // Clear any previous errors
            this.clearError(emailError);
            
            // Move to next step after a delay
            setTimeout(() => {
                this.goToStep(2);
            }, 1000);
            
        } catch (error) {
            this.showError(emailError, 'Failed to send verification code. Please try again.');
        } finally {
            // Reset button state
            sendCodeBtn.innerHTML = originalText;
            sendCodeBtn.disabled = false;
        }
    },

    async handleCodeVerification() {
        const codeError = document.getElementById('codeError');
        const verifyBtn = document.getElementById('verifyCodeBtn');
        
        // Show loading state
        const originalText = verifyBtn.innerHTML;
        verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        verifyBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo, accept any 6-digit code
            if (this.verificationCode.length === 6) {
                // Clear error
                this.clearError(codeError);
                
                // Stop timer
                this.stopTimer();
                
                // Move to next step
                this.goToStep(3);
            } else {
                throw new Error('Invalid code');
            }
            
        } catch (error) {
            this.showError(codeError, 'Invalid verification code. Please try again.');
            
            // Highlight code inputs with error
            const inputs = document.querySelectorAll('#codeInputs input');
            inputs.forEach(input => {
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 500);
            });
        } finally {
            // Reset button state
            verifyBtn.innerHTML = originalText;
            verifyBtn.disabled = false;
        }
    },

    async handlePasswordReset() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const passwordSuccess = document.getElementById('passwordSuccess');
        const resetBtn = document.getElementById('resetPasswordBtn');
        
        // Validate passwords
        if (!this.validatePassword(newPassword)) {
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showError(document.getElementById('confirmError'), 'Passwords do not match');
            return;
        }
        
        // Show loading state
        const originalText = resetBtn.innerHTML;
        resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
        resetBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real app, this would update the password via API
            // For demo, we'll store in localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === this.userEmail);
            
            if (userIndex !== -1) {
                users[userIndex].password = newPassword; // In real app, hash this!
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Show success message
            passwordSuccess.classList.add('show');
            
            // Redirect to login after delay
            setTimeout(() => {
                window.location.href = 'login.html?message=password_reset_success';
            }, 2000);
            
        } catch (error) {
            this.showError(document.getElementById('confirmError'), 'Failed to reset password. Please try again.');
        } finally {
            resetBtn.innerHTML = originalText;
            resetBtn.disabled = false;
        }
    },

    resendVerificationCode() {
        const resendLink = document.getElementById('resendLink');
        
        // Disable resend link temporarily
        resendLink.classList.add('disabled');
        
        // Generate new code
        this.verificationCode = this.generateVerificationCode();
        
        // Reset timer
        this.timeLeft = 300;
        this.startTimer();
        
        // Enable resend link after 60 seconds
        setTimeout(() => {
            resendLink.classList.remove('disabled');
        }, 60000);
        
        // Show notification (in a real app, this would send an email)
        this.showNotification('New verification code sent to your email');
    },

    goToStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.auth-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show selected step
        const stepElement = document.getElementById(`step-${stepNumber === 1 ? 'email' : stepNumber === 2 ? 'verify' : 'password'}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
        
        // Update current step
        this.currentStep = stepNumber;
        
        // Update progress steps
        this.updateProgressSteps();
        
        // Handle step-specific setup
        if (stepNumber === 2) {
            // Show email in verification step
            document.getElementById('emailDisplay').textContent = this.userEmail;
            
            // Start timer
            this.startTimer();
            
            // Clear code inputs
            document.querySelectorAll('#codeInputs input').forEach(input => {
                input.value = '';
                input.classList.remove('filled', 'error');
            });
            
            // Reset verification code
            this.verificationCode = '';
            this.updateVerificationCode();
            this.toggleVerifyButton();
            
        } else if (stepNumber === 3) {
            // Stop timer if it's running
            this.stopTimer();
            
            // Clear password fields
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('confirmError').textContent = '';
            
            // Reset password strength display
            this.resetPasswordStrength();
        }
    },

    updateProgressSteps() {
        const steps = document.querySelectorAll('.progress-steps .step');
        
        steps.forEach(step => {
            const stepNumber = parseInt(step.dataset.step);
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    },

    startTimer() {
        // Clear any existing timer
        this.stopTimer();
        
        // Update timer display immediately
        this.updateTimerDisplay();
        
        // Start new timer
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.handleTimerExpired();
            }
        }, 1000);
    },

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when less than 1 minute
            if (this.timeLeft < 60) {
                timerElement.style.color = '#e74c3c';
            }
        }
    },

    handleTimerExpired() {
        // Show error message
        this.showError(document.getElementById('codeError'), 'Verification code has expired. Please request a new one.');
        
        // Disable verify button
        const verifyBtn = document.getElementById('verifyCodeBtn');
        if (verifyBtn) {
            verifyBtn.disabled = true;
        }
    },

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePassword(password) {
        const passwordError = document.getElementById('confirmError');
        
        // Check length
        if (password.length < 8) {
            this.showError(passwordError, 'Password must be at least 8 characters long');
            return false;
        }
        
        // Check for uppercase
        if (!/[A-Z]/.test(password)) {
            this.showError(passwordError, 'Password must contain at least one uppercase letter');
            return false;
        }
        
        // Check for lowercase
        if (!/[a-z]/.test(password)) {
            this.showError(passwordError, 'Password must contain at least one lowercase letter');
            return false;
        }
        
        // Check for number
        if (!/\d/.test(password)) {
            this.showError(passwordError, 'Password must contain at least one number');
            return false;
        }
        
        // Check for special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            this.showError(passwordError, 'Password must contain at least one special character');
            return false;
        }
        
        // Clear error if all validations pass
        this.clearError(passwordError);
        return true;
    },

    validatePasswordStrength(password) {
        let strength = 0;
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        
        // Calculate strength (0-100)
        const requirementCount = Object.keys(requirements).length;
        const metRequirements = Object.values(requirements).filter(Boolean).length;
        strength = Math.round((metRequirements / requirementCount) * 100);
        
        // Update strength display
        this.updateStrengthDisplay(strength, requirements);
        
        return strength;
    },

    updateStrengthDisplay(strength, requirements) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!strengthFill || !strengthText) return;
        
        // Update fill width and color
        strengthFill.style.width = `${strength}%`;
        
        if (strength < 40) {
            strengthFill.className = 'strength-fill strength-weak';
            strengthText.textContent = 'Password strength: Weak';
        } else if (strength < 70) {
            strengthFill.className = 'strength-fill strength-medium';
            strengthText.textContent = 'Password strength: Medium';
        } else {
            strengthFill.className = 'strength-fill strength-strong';
            strengthText.textContent = 'Password strength: Strong';
        }
        
        // Update requirement indicators
        Object.keys(requirements).forEach(req => {
            const element = document.getElementById(`req${req.charAt(0).toUpperCase() + req.slice(1)}`);
            if (element) {
                if (requirements[req]) {
                    element.classList.add('valid');
                    element.querySelector('i').className = 'fas fa-check-circle';
                } else {
                    element.classList.remove('valid');
                    element.querySelector('i').className = 'fas fa-circle';
                }
            }
        });
    },

    resetPasswordStrength() {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (strengthFill && strengthText) {
            strengthFill.style.width = '0%';
            strengthFill.className = 'strength-fill';
            strengthText.textContent = 'Password strength: ';
        }
        
        // Reset requirement indicators
        ['Length', 'Uppercase', 'Lowercase', 'Number', 'Special'].forEach(req => {
            const element = document.getElementById(`req${req}`);
            if (element) {
                element.classList.remove('valid');
                element.querySelector('i').className = 'fas fa-circle';
            }
        });
    },

    validatePasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmError = document.getElementById('confirmError');
        
        if (confirmPassword && newPassword !== confirmPassword) {
            this.showError(confirmError, 'Passwords do not match');
            return false;
        }
        
        this.clearError(confirmError);
        return true;
    },

    generateVerificationCode() {
        // Generate 6-digit random code
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    },

    clearError(element) {
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    },

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    ForgotPasswordManager.init();
    
    // Add CSS animations if not already in auth.css
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .auth-step {
            display: none;
        }
        
        .auth-step.active {
            display: block;
        }
        
        .progress-steps {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin-top: 30px;
            padding: 0 20px;
        }
        
        .step-line {
            position: absolute;
            top: 15px;
            left: 20px;
            right: 20px;
            height: 2px;
            background: #ddd;
            z-index: 1;
        }
        
        .step {
            position: relative;
            z-index: 2;
            text-align: center;
            flex: 1;
        }
        
        .step-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #ddd;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 8px;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .step.active .step-circle {
            background: #3498db;
            color: white;
            transform: scale(1.1);
        }
        
        .step.completed .step-circle {
            background: #2ecc71;
            color: white;
        }
        
        .step.completed .step-circle:after {
            content: '✓';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
        }
        
        .step-label {
            font-size: 0.8rem;
            color: #666;
        }
        
        .step.active .step-label {
            color: #3498db;
            font-weight: bold;
        }
        
        .step.completed .step-label {
            color: #2ecc71;
        }
    `;
    document.head.appendChild(style);
});

// Make ForgotPasswordManager available globally
window.ForgotPasswordManager = ForgotPasswordManager;