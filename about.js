// about.js - JavaScript for About Page Functionality

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initializeMobileMenu();
    
    // Initialize user dropdown
    initializeUserDropdown();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize animated counters
    initializeAnimatedCounters();
    
    // Initialize testimonial slider
    initializeTestimonialSlider();
    
    // Initialize team member hover effects
    initializeTeamMemberEffects();
    
    // Initialize smooth scrolling for internal links
    initializeSmoothScrolling();
});

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            const icon = this.querySelector('i');
            
            if (navLinks) {
                navLinks.classList.toggle('active');
                
                if (navLinks.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navLinks = document.querySelector('.nav-links');
            
            if (navLinks && navLinks.classList.contains('active') && 
                !event.target.closest('.nav-links') && 
                !event.target.closest('.mobile-menu-toggle')) {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
}

// User Dropdown Functionality
function initializeUserDropdown() {
    const userDropdownToggle = document.querySelector('.user-dropdown-toggle');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    
    if (userDropdownToggle && userDropdownMenu) {
        userDropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdownMenu.classList.remove('show');
        });

        // Prevent dropdown from closing when clicking inside
        userDropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    }
}

// Animated Counter Functionality
function initializeAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length > 0) {
        // Function to animate counter
        function animateCounter(counter) {
            const target = +counter.getAttribute('data-count');
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        }
        
        // Observer to trigger animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        // Observe each counter
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
}

// Testimonial Slider Functionality
function initializeTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;
    
    const testimonials = testimonialSlider.querySelectorAll('.testimonial');
    let currentIndex = 0;
    const intervalTime = 5000; // 5 seconds
    
    // Only run if there are multiple testimonials
    if (testimonials.length > 1) {
        // Function to show testimonial
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }
        
        // Initialize first testimonial
        showTestimonial(currentIndex);
        
        // Auto-rotate testimonials
        const autoRotate = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, intervalTime);
        
        // Pause auto-rotation on hover
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            clearInterval(autoRotate);
            setInterval(() => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            }, intervalTime);
        });
    }
}

// Team Member Hover Effects
function initializeTeamMemberEffects() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            this.style.transition = 'all 0.3s ease';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// Smooth Scrolling Functionality
function initializeSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update cart count from localStorage
function updateCartCountFromStorage() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Initialize cart count on page load
updateCartCountFromStorage();

// Expose functions globally if needed
window.updateCartCountFromStorage = updateCartCountFromStorage;

// Add CSS for testimonial slider
const style = document.createElement('style');
style.textContent = `
    .testimonial-slider {
        position: relative;
        overflow: hidden;
    }
    
    .testimonial {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .team-member {
        transition: all 0.3s ease;
    }
    
    .stat-number {
        font-weight: bold;
        color: var(--primary-color, #667eea);
    }
`;
document.head.appendChild(style);