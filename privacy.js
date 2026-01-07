// privacy.js - Privacy Policy Page JavaScript

const PrivacyManager = {
    init() {
        this.setupScrollSpy();
        this.setupScrollTop();
        this.setupCookieSettings();
        this.setupSmoothScrolling();
        this.setupSectionHighlighting();
        this.setupTableOfContents();
        this.setupMobileNavigation();
    },

    setupScrollSpy() {
        const sections = document.querySelectorAll('.privacy-section');
        const navLinks = document.querySelectorAll('.toc-list a');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        // Set initial active state
        this.updateActiveSection();
        
        // Update on scroll with throttling
        let isScrolling;
        window.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                this.updateActiveSection();
                this.toggleScrollTopButton();
            }, 100);
        });
        
        // Update on click (smooth scroll)
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offset = 100; // Account for header
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, targetId);
                }
            });
        });
    },

    updateActiveSection() {
        const sections = document.querySelectorAll('.privacy-section');
        const navLinks = document.querySelectorAll('.toc-list a');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 150;
        
        // Find current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = '#' + section.id;
            }
        });
        
        // Update navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    },

    setupScrollTop() {
        const scrollTopBtn = document.getElementById('scrollTop');
        if (!scrollTopBtn) return;
        
        // Initial state
        this.toggleScrollTopButton();
        
        // Click handler
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Keyboard support
        scrollTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    },

    toggleScrollTopButton() {
        const scrollTopBtn = document.getElementById('scrollTop');
        if (scrollTopBtn) {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
                scrollTopBtn.setAttribute('aria-hidden', 'false');
            } else {
                scrollTopBtn.classList.remove('visible');
                scrollTopBtn.setAttribute('aria-hidden', 'true');
            }
        }
    },

    setupCookieSettings() {
        // Load saved cookie preferences
        this.loadCookiePreferences();
        
        // Save preferences when toggles change
        const cookieToggles = document.querySelectorAll('.cookie-toggle input[type="checkbox"]:not([disabled])');
        cookieToggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                this.saveCookiePreferences();
                this.showCookieNotification(toggle.id);
            });
        });
        
        // Setup toggle switch animations
        this.setupToggleSwitches();
    },

    loadCookiePreferences() {
        const savedPreferences = localStorage.getItem('shopCartCookiePrefs');
        if (savedPreferences) {
            try {
                const preferences = JSON.parse(savedPreferences);
                
                // Apply saved preferences
                const performanceToggle = document.getElementById('performanceCookies');
                const functionalityToggle = document.getElementById('functionalityCookies');
                const advertisingToggle = document.getElementById('advertisingCookies');
                
                if (performanceToggle) performanceToggle.checked = preferences.performance || false;
                if (functionalityToggle) functionalityToggle.checked = preferences.functionality || false;
                if (advertisingToggle) advertisingToggle.checked = preferences.advertising || false;
                
            } catch (error) {
                console.error('Error loading cookie preferences:', error);
                localStorage.removeItem('shopCartCookiePrefs');
            }
        }
    },

    saveCookiePreferences() {
        const performanceToggle = document.getElementById('performanceCookies');
        const functionalityToggle = document.getElementById('functionalityCookies');
        const advertisingToggle = document.getElementById('advertisingCookies');
        
        const preferences = {
            performance: performanceToggle ? performanceToggle.checked : false,
            functionality: functionalityToggle ? functionalityToggle.checked : false,
            advertising: advertisingToggle ? advertisingToggle.checked : false,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('shopCartCookiePrefs', JSON.stringify(preferences));
        } catch (error) {
            console.error('Error saving cookie preferences:', error);
        }
    },

    setupToggleSwitches() {
        const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
        
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const slider = this.nextElementSibling;
                if (this.checked) {
                    slider.style.transform = 'translateX(20px)';
                } else {
                    slider.style.transform = 'translateX(0)';
                }
            });
            
            // Set initial position
            const slider = toggle.nextElementSibling;
            if (toggle.checked) {
                slider.style.transform = 'translateX(20px)';
            } else {
                slider.style.transform = 'translateX(0)';
            }
        });
    },

    showCookieNotification(toggleId) {
        let message = '';
        
        switch(toggleId) {
            case 'performanceCookies':
                message = 'Performance cookies setting updated';
                break;
            case 'functionalityCookies':
                message = 'Functionality cookies setting updated';
                break;
            case 'advertisingCookies':
                message = 'Advertising cookies setting updated';
                break;
            default:
                message = 'Cookie preferences updated';
        }
        
        this.showNotification(message, 'success');
    },

    setupSmoothScrolling() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 100;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    },

    setupSectionHighlighting() {
        const sections = document.querySelectorAll('.privacy-section');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('highlighted');
                        entry.target.setAttribute('aria-current', 'true');
                    } else {
                        entry.target.classList.remove('highlighted');
                        entry.target.removeAttribute('aria-current');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-100px 0px -100px 0px'
            }
        );
        
        sections.forEach(section => {
            observer.observe(section);
        });
    },

    setupTableOfContents() {
        const sections = document.querySelectorAll('.privacy-section h2');
        const tocContainer = document.querySelector('.toc-list');
        
        if (!tocContainer || sections.length === 0) return;
        
        // Clear existing TOC
        tocContainer.innerHTML = '';
        
        // Create TOC items
        sections.forEach(section => {
            const parentSection = section.closest('.privacy-section');
            if (!parentSection) return;
            
            const sectionId = parentSection.id;
            const sectionTitle = section.textContent.replace(/^\d+\.\s*/, ''); // Remove numbering
            
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="#${sectionId}" class="toc-link">
                    <i class="fas fa-chevron-right"></i>
                    ${sectionTitle}
                </a>
            `;
            
            tocContainer.appendChild(listItem);
        });
    },

    setupMobileNavigation() {
        const tocToggle = document.createElement('button');
        tocToggle.className = 'toc-mobile-toggle';
        tocToggle.innerHTML = '<i class="fas fa-list"></i> Table of Contents';
        tocToggle.setAttribute('aria-label', 'Toggle table of contents');
        
        const tocContainer = document.querySelector('.privacy-toc');
        if (tocContainer) {
            tocContainer.insertBefore(tocToggle, tocContainer.firstChild);
            
            tocToggle.addEventListener('click', () => {
                tocContainer.classList.toggle('mobile-open');
                tocToggle.setAttribute('aria-expanded', 
                    tocContainer.classList.contains('mobile-open').toString()
                );
            });
            
            // Close TOC when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !tocContainer.contains(e.target) && 
                    !tocToggle.contains(e.target)) {
                    tocContainer.classList.remove('mobile-open');
                    tocToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    },

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.privacy-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `privacy-notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        let icon = 'fa-info-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : 
                         type === 'success' ? '#2ecc71' : 
                         type === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
            max-width: 350px;
            word-wrap: break-word;
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Print functionality
    setupPrintButton() {
        const printBtn = document.createElement('button');
        printBtn.className = 'print-btn';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Policy';
        printBtn.setAttribute('aria-label', 'Print privacy policy');
        
        const heroSection = document.querySelector('.privacy-hero .container');
        if (heroSection) {
            heroSection.appendChild(printBtn);
            
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    },

    // Copy section link functionality
    setupCopyLinks() {
        const sectionHeadings = document.querySelectorAll('.privacy-section h2');
        
        sectionHeadings.forEach(heading => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-link-btn';
            copyBtn.innerHTML = '<i class="fas fa-link"></i>';
            copyBtn.setAttribute('aria-label', 'Copy section link');
            copyBtn.setAttribute('title', 'Copy link to this section');
            
            heading.appendChild(copyBtn);
            
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const parentSection = heading.closest('.privacy-section');
                const sectionId = parentSection.id;
                const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
                
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('Link copied to clipboard!', 'success');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    this.showNotification('Failed to copy link', 'error');
                });
            });
        });
    }
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    PrivacyManager.init();
    PrivacyManager.setupPrintButton();
    PrivacyManager.setupCopyLinks();
    
    // Add CSS animations and styles
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
        
        .scroll-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #3498db;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }
        
        .scroll-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-top:hover {
            background: #2980b9;
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
        }
        
        .privacy-section.highlighted {
            background: linear-gradient(90deg, rgba(52, 152, 219, 0.05) 0%, rgba(52, 152, 219, 0) 100%);
            border-left: 4px solid #3498db;
            padding-left: 20px;
            margin-left: -20px;
            transition: all 0.3s ease;
        }
        
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .toggle-slider {
            background-color: #3498db;
        }
        
        input:checked + .toggle-slider:before {
            transform: translateX(26px);
        }
        
        input:disabled + .toggle-slider {
            background-color: #95a5a6;
            cursor: not-allowed;
        }
        
        .print-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #2c3e50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        
        .print-btn:hover {
            background: #34495e;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .copy-link-btn {
            background: none;
            border: none;
            color: #3498db;
            cursor: pointer;
            padding: 5px;
            margin-left: 10px;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }
        
        .copy-link-btn:hover {
            opacity: 1;
        }
        
        .toc-mobile-toggle {
            display: none;
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            margin-bottom: 15px;
            width: 100%;
        }
        
        @media (max-width: 768px) {
            .toc-mobile-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .privacy-toc {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            }
            
            .privacy-toc.mobile-open {
                max-height: 400px;
            }
        }
        
        @media print {
            .scroll-top,
            .print-btn,
            .copy-link-btn,
            .toc-mobile-toggle,
            .cookie-settings,
            .toggle-switch {
                display: none !important;
            }
            
            .privacy-section.highlighted {
                background: none;
                border-left: none;
                padding-left: 0;
                margin-left: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Make PrivacyManager available globally
window.PrivacyManager = PrivacyManager;