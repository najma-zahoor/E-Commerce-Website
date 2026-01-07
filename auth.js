// Handle user registration
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert('Error: ' + (data.error || 'Registration failed'));
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');
    }
}

// Handle user login
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include' // Important for session cookies
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Error: ' + (data.error || 'Login failed'));
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    }
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch(`${API_BASE_URL}/logout/`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            alert('Logged out successfully');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Check if user is logged in
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/`, {
            credentials: 'include'
        });
        
        // If we can access cart, user is logged in (or has session)
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Add event listeners
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}