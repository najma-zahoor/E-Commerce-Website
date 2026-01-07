// ===== GLOBAL VARIABLES =====
let cartCount = 0;
let wishlistCount = 0;

// ===== DOM ELEMENTS =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartCountElement = document.querySelector('.cart-count');
const backToTopBtn = document.getElementById('back-to-top');

// ===== MOBILE MENU =====
function initMobileMenu() {
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-links') && !event.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn.querySelector('i')) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    if (!searchInput || !searchBtn) return;
    
    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            // Store search query in sessionStorage
            sessionStorage.setItem('searchQuery', query);
            // Redirect to products page
            window.location.href = 'products.html';
        }
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// ===== CART MANAGEMENT =====
function initCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        updateCartCount();
    }
    
    // Update cart count display
    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
        }
    }
    
    // Add to cart function
    window.addToCart = function(productId, productName, price, image) {
        let cart = JSON.parse(localStorage.getItem('shopCart')) || [];
        
        //