// login.js - Login Page JavaScript

const LoginManager = {
    init() {
        this.setupEventListeners();
        this.checkRememberedUser();
        this.checkUrlParameters();
        this.setupPasswordToggle();
    },

    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Email validation on blur
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validateEmail(emailInput.value);
            });
        }

        // Password validation on blur
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('blur', () => {
                this.validatePassword(passwordInput.value);
            });
        }

        // Real-time email validation
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                const emailError = document.getElementById('emailError');
                emailError.textContent = '';
            });
        }

        // Real-time password validation
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                const passwordError = document.getElementById('passwordError');
                passwordError.textContent = '';
            });
        }
    },

    setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Toggle eye icon
                const icon = toggleBtn.querySelector('i');
                if (type === 'text') {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        }
    },

    checkRememberedUser() {
        const remember = localStorage.getItem('rememberUser');
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        
        if (remember === 'true' && rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('remember').checked = true;
        }
    },

    checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');
        
        if (message === 'password_reset_success') {
            this.showSuccess('Password reset successful! Please login with your new password.');
        } else if (message === 'registration_success') {
            this.showSuccess('Registration successful! Please login to your account.');
        } else if (message === 'session_expired') {
            this.showError('Your session has expired. Please login again.');
        }
    },

    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        const loginBtn = document.getElementById('loginBtn');
        
        // Validate inputs
        if (!this.validateEmail(email)) return;
        if (!this.validatePassword(password)) return;
        
        // Show loading state
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        loginBtn.disabled = true;
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if user exists in localStorage (for demo)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Save user session
                const userData = {
                    id: user.id || Date.now(),
                    name: user.name,
                    email: user.email,
                    role: user.role || 'customer',
                    tier: user.tier || 'standard',
                    createdAt: user.createdAt || new Date().toISOString()
                };
                
                // Save to localStorage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Remember user if checked
                if (remember) {
                    localStorage.setItem('rememberUser', 'true');
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberUser');
                    localStorage.removeItem('rememberedEmail');
                }
                
                // Save login timestamp
                localStorage.setItem('lastLogin', new Date().toISOString());
                
                // Show success message
                this.showSuccess('Login successful! Redirecting...');
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            } else {
                // Check if email exists
                const emailExists = users.some(u => u.email === email);
                
                if (emailExists) {
                    throw new Error('Incorrect password. Please try again.');
                } else {
                    throw new Error('No account found with this email.');
                }
            }
            
        } catch (error) {
            this.showError(error.message);
            
            // Add error class to inputs
            document.getElementById('email').classList.add('error');
            document.getElementById('password').classList.add('error');
            
            // Remove error class after 2 seconds
            setTimeout(() => {
                document.getElementById('email').classList.remove('error');
                document.getElementById('password').classList.remove('error');
            }, 2000);
            
        } finally {
            // Reset button state
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    },

    validateEmail(email) {
        const emailError = document.getElementById('emailError');
        
        if (!email) {
            this.showFieldError('emailError', 'Email is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showFieldError('emailError', 'Please enter a valid email address');
            return false;
        }
        
        // Clear error
        this.clearFieldError('emailError');
        return true;
    },

    validatePassword(password) {
        const passwordError = document.getElementById('passwordError');
        
        if (!password) {
            this.showFieldError('passwordError', 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showFieldError('passwordError', 'Password must be at least 6 characters');
            return false;
        }
        
        // Clear error
        this.clearFieldError('passwordError');
        return true;
    },

    showFieldError(fieldId, message) {
        const element = document.getElementById(fieldId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    },

    clearFieldError(fieldId) {
        const element = document.getElementById(fieldId);
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    },

    showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        
        if (successElement && successText) {
            successText.textContent = message;
            successElement.style.display = 'block';
            
            // Hide error message if showing
            document.getElementById('errorMessage').style.display = 'none';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 5000);
        }
    },

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorElement && errorText) {
            errorText.textContent = message;
            errorElement.style.display = 'block';
            
            // Hide success message if showing
            document.getElementById('successMessage').style.display = 'none';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    },

    socialLogin(provider) {
        // Show loading
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => btn.disabled = true);
        
        // Simulate social login process
        this.showSuccess(`Redirecting to ${provider} login...`);
        
        // In a real app, this would redirect to OAuth provider
        setTimeout(() => {
            // For demo, simulate successful social login
            const userData = {
                id: Date.now(),
                name: 'Social User',
                email: `socialuser@${provider}.com`,
                role: 'customer',
                tier: 'standard',
                provider: provider,
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('socialLogin', 'true');
            
            this.showSuccess(`${provider} login successful!`);
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        }, 2000);
    },

    // Demo user creation for testing
    createDemoUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Only create demo users if none exist
        if (users.length === 0) {
            const demoUsers = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123', // In real app, this would be hashed
                    role: 'customer',
                    tier: 'gold',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    password: 'password456',
                    role: 'customer',
                    tier: 'standard',
                    createdAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('users', JSON.stringify(demoUsers));
            console.log('Demo users created for testing');
        }
    }
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    LoginManager.init();
    LoginManager.createDemoUsers(); // Remove this in production
    
    // Add CSS for animations and additional styles
    const style = document.createElement('style');
    style.textContent = `
        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: fadeIn 0.5s ease;
        }
        
        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .password-container {
            position: relative;
        }
        
        .toggle-password {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 5px;
        }
        
        .toggle-password:hover {
            color: #3498db;
        }
        
        .divider {
            display: flex;
            align-items: center;
            margin: 20px 0;
            color: #666;
        }
        
        .divider::before,
        .divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #ddd;
        }
        
        .divider span {
            padding: 0 15px;
        }
        
        .social-login {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .social-btn {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .social-btn.google:hover {
            border-color: #db4437;
            background: #f8f9fa;
            color: #db4437;
        }
        
        .social-btn.facebook:hover {
            border-color: #4267B2;
            background: #f8f9fa;
            color: #4267B2;
        }
        
        .social-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        input.error {
            border-color: #e74c3c !important;
            animation: shake 0.5s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .auth-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
});

// Make LoginManager available globally
window.LoginManager = LoginManager;