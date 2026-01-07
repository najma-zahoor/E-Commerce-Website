// index.js - Main JavaScript for ShopCart E-Commerce

// DOM Elements
const overlay = document.getElementById('overlay');
const signInModal = document.getElementById('signInModal');
const signInForm = document.getElementById('signInForm');

// Cart and Wishlist elements
const cartLink = document.querySelector('.cart-link');
let cartCountElement = null;

// Initialize cart count element
function initCartCount() {
    // Create cart count badge if it doesn't exist
    if (!document.querySelector('.cart-count')) {
        const countBadge = document.createElement('span');
        countBadge.className = 'cart-count';
        countBadge.textContent = '0';
        cartLink.appendChild(countBadge);
    }
    cartCountElement = document.querySelector('.cart-count');
}

// Cart state
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count element
    initCartCount();
    
    // Update cart count on page load
    updateCartCount();
    
    // Set up product event listeners
    setupProductEventListeners();
    
    // Set up auth links (if user is logged in)
    updateAuthUI();
});

// ==================== CART FUNCTIONALITY ====================

function addToCart(product) {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        // Update quantity if already in cart
        cartItems[existingItemIndex].quantity += product.quantity || 1;
    } else {
        // Add new item to cart
        cartItems.push({
            ...product,
            quantity: product.quantity || 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update UI
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
}

function updateCartQuantity(productId, newQuantity) {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cartItems[itemIndex].quantity = newQuantity;
        } else {
            // Remove if quantity is 0
            cartItems.splice(itemIndex, 1);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
    }
}

function updateCartCount() {
    if (cartCountElement) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Show/hide badge based on count
        if (totalItems > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// ==================== WISHLIST FUNCTIONALITY ====================

function toggleWishlist(product) {
    const existingItemIndex = wishlistItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        // Remove from wishlist
        wishlistItems.splice(existingItemIndex, 1);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        // Add to wishlist
        wishlistItems.push(product);
        showNotification(`${product.name} added to wishlist!`);
    }
    
    // Save to localStorage
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
}

// ==================== PRODUCT EVENT LISTENERS ====================

function setupProductEventListeners() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: productCard.dataset.productId || generateProductId(productCard),
                name: productCard.querySelector('.product-title').textContent,
                price: parsePrice(productCard.querySelector('.product-price').textContent),
                image: productCard.querySelector('.product-img img')?.src || '',
                badge: productCard.querySelector('.product-badge')?.textContent || null
            };
            
            // Add to cart
            addToCart(product);
            
            // Button animation feedback
            const originalText = this.textContent;
            const originalBg = this.style.background;
            this.textContent = 'Added!';
            this.style.background = '#4caf50';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = originalBg;
            }, 1500);
        });
    });
    
    // Product card click for more details
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on add to cart button
            if (!e.target.closest('.add-to-cart')) {
                const productId = this.dataset.productId || generateProductId(this);
                // In a real app, you would navigate to product detail page
                // For now, we'll show an alert
                const productName = this.querySelector('.product-title').textContent;
                alert(`Viewing details for: ${productName}\n\nIn a full implementation, this would navigate to the product detail page.`);
                // window.location.href = `/product.html?id=${productId}`;
            }
        });
    });
}

// ==================== MODAL FUNCTIONALITY ====================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        if (overlay) overlay.classList.add('active');
        
        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        if (overlay) overlay.classList.remove('active');
        
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        // Close any open modals
        const openModals = document.querySelectorAll('.modal[style*="display: block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Remove overlay
        if (overlay) overlay.classList.remove('active');
    }
}

// ==================== AUTHENTICATION ====================

function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isLoggedIn && user) {
        // Update UI for logged-in user
        const authLinks = document.querySelectorAll('.auth-link');
        authLinks.forEach(link => {
            link.style.display = 'none';
        });
        
        // Create user menu if it doesn't exist
        const userMenu = document.querySelector('.user-menu');
        if (!userMenu) {
            const authContainer = document.querySelector('.auth-links');
            const userMenuHTML = `
                <div class="user-menu" style="display: flex; align-items: center;">
                    <span class="user-name">${user.name || 'My Account'}</span>
                    <button onclick="signOut()" style="margin-left: 10px; padding: 5px 10px; background: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer;">Logout</button>
                </div>
            `;
            authContainer.insertAdjacentHTML('beforeend', userMenuHTML);
        } else {
            userMenu.style.display = 'flex';
            userMenu.querySelector('.user-name').textContent = user.name || 'My Account';
        }
    }
}

function signOut() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    // Show auth links again
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
        link.style.display = 'inline';
    });
    
    // Hide user menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.style.display = 'none';
    }
    
    showNotification('Logged out successfully');
}

// Handle sign in form submission
if (signInForm) {
    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        // Basic validation
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a successful login
        const user = {
            name: email.split('@')[0], // Use part of email as name
            email: email
        };
        
        // Save user session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        updateAuthUI();
        
        // Close modal and show success message
        closeModal('signInModal');
        showNotification('Welcome back, ' + user.name + '!');
    });
}

// ==================== UTILITY FUNCTIONS ====================

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : '#4CAF50'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function parsePrice(priceText) {
    // Extract numeric value from price string (handles "Rs69,999" or "Rs69,999<span>...")
    let priceString = priceText;
    
    // Remove any HTML tags if present
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = priceString;
    priceString = tempDiv.textContent || priceString;
    
    // Extract numbers
    const match = priceString.match(/[\d,]+\.?\d*/);
    if (match) {
        return parseFloat(match[0].replace(/,/g, ''));
    }
    return 0;
}

function generateProductId(element) {
    // Generate a simple ID based on product name
    const productName = element.querySelector('.product-title')?.textContent || '';
    const timestamp = Date.now();
    return 'prod_' + productName.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '') + '_' + timestamp;
}

// Add CSS for animations and cart count
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
    
    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
    }
    
    .cart-link {
        position: relative;
        display: inline-flex;
        align-items: center;
    }
    
    .add-to-cart {
        transition: all 0.3s ease;
    }
    
    .add-to-cart:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .notification {
        font-family: inherit;
    }
`;
document.head.appendChild(style);

// ==================== EVENT LISTENERS ====================

// Close modals when clicking overlay
if (overlay) {
    overlay.addEventListener('click', () => {
        closeModal('signInModal');
    });
}

// Add data-product-id to product cards for identification
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        if (!card.dataset.productId) {
            const productName = card.querySelector('.product-title')?.textContent || `product_${index}`;
            card.dataset.productId = generateProductId(card);
        }
    });
});

// Make functions available globally for onclick attributes
window.openModal = openModal;
window.closeModal = closeModal;
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.showNotification = showNotification;
window.signOut = signOut;

// Close modal when clicking the close button
if (signInModal) {
    const closeBtn = signInModal.querySelector('button[onclick*="closeModal"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal('signInModal'));
    }
}