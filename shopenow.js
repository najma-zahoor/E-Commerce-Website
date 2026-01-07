// Sample Products Data with Pakistani Rupees
const products = [
    { id: 1, name: "Wireless Bluetooth Headphones", category: "electronics", price: 19999, originalPrice: 25999, rating: 4.5, badge: "sale", image: "🎧", color: "black" },
    { id: 2, name: "Smartphone Pro Max", category: "electronics", price: 199999, originalPrice: 239999, rating: 4.8, badge: "new", image: "📱", color: "blue" },
    { id: 3, name: "Running Shoes", category: "fashion", price: 7999, originalPrice: null, rating: 4.3, badge: null, image: "👟", color: "red" },
    { id: 4, name: "Laptop Ultra", category: "electronics", price: 259999, originalPrice: 299999, rating: 4.7, badge: "sale", image: "💻", color: "silver" },
    { id: 5, name: "Smart Watch Series 5", category: "electronics", price: 59999, originalPrice: 79999, rating: 4.6, badge: "sale", image: "⌚", color: "black" },
    { id: 6, name: "Cotton T-Shirt", category: "fashion", price: 2499, originalPrice: null, rating: 4.2, badge: null, image: "👕", color: "white" },
    { id: 7, name: "Coffee Maker", category: "home", price: 17999, originalPrice: 25999, rating: 4.4, badge: "sale", image: "☕", color: "black" },
    { id: 8, name: "Yoga Mat", category: "sports", price: 3499, originalPrice: 4999, rating: 4.1, badge: "sale", image: "🧘", color: "green" },
    { id: 9, name: "Gaming Console", category: "electronics", price: 99999, originalPrice: null, rating: 4.9, badge: "new", image: "🎮", color: "black" },
    { id: 10, name: "Backpack", category: "fashion", price: 5999, originalPrice: 7999, rating: 4.3, badge: "sale", image: "🎒", color: "blue" },
    { id: 11, name: "Desk Lamp", category: "home", price: 3999, originalPrice: null, rating: 4.0, badge: null, image: "💡", color: "white" },
    { id: 12, name: "Fitness Tracker", category: "sports", price: 25999, originalPrice: 39999, rating: 4.5, badge: "sale", image: "🏃", color: "black" }
];

let cart = [
    { id: 1, name: "Wireless Bluetooth Headphones", price: 19999, quantity: 1, image: "🎧" },
    { id: 3, name: "Running Shoes", price: 7999, quantity: 2, image: "👟" },
    { id: 5, name: "Smart Watch Series 5", price: 59999, quantity: 1, image: "⌚" }
];

let wishlist = [2, 9];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const filterToggle = document.getElementById('filterToggle');
const filtersSidebar = document.getElementById('filtersSidebar');
const priceSlider = document.getElementById('priceSlider');
const priceValue = document.getElementById('priceValue');
const sortSelect = document.getElementById('sortSelect');
const viewButtons = document.querySelectorAll('.view-btn');
const colorOptions = document.querySelectorAll('.color-option');
const productCount = document.getElementById('productCount');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartDisplay();
    
    // Price slider update
    priceSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        priceValue.textContent = 'Rs ' + value.toLocaleString();
    });
    
    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // View toggle
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            productsGrid.className = this.dataset.view === 'list' ? 'products-list' : 'products-grid';
        });
    });
    
    // Sort products
    sortSelect.addEventListener('change', sortProducts);
    
    // Mobile filter toggle
    filterToggle.addEventListener('click', () => {
        filtersSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    // Close filters on overlay click
    overlay.addEventListener('click', () => {
        filtersSidebar.classList.remove('active');
        overlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    });
});

// Cart functionality
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Format currency function
function formatCurrency(amount) {
    return 'Rs ' + amount.toLocaleString();
}

// Render Products
function renderProducts(filteredProducts = products) {
    productsGrid.innerHTML = '';
    productCount.textContent = filteredProducts.length;
    
    filteredProducts.forEach(product => {
        const isInWishlist = wishlist.includes(product.id);
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge === 'new' ? 'NEW' : 'SALE'}</div>` : ''}
            <div class="product-image">
                <span style="font-size: 3.5rem;">${product.image}</span>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category.toUpperCase()}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} (${product.rating})
                </div>
                <div class="product-price">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-wishlist ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartHeader = document.querySelector('.cart-header h2');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartHeader.textContent = `Your Cart (${totalItems})`;
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <span style="font-size: 2rem;">${item.image}</span>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update totals
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    document.querySelectorAll('.cart-total .total-row')[0].innerHTML = `<span>Subtotal:</span> <span>${formatCurrency(subtotal)}</span>`;
    document.querySelectorAll('.cart-total .total-row')[2].innerHTML = `<span>Tax:</span> <span>${formatCurrency(tax)}</span>`;
    document.querySelectorAll('.cart-total .total-row')[3].innerHTML = `<span>Total:</span> <span>${formatCurrency(total)}</span>`;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showNotification('Item removed from cart');
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    const btn = event.currentTarget;
    
    if (index === -1) {
        wishlist.push(productId);
        btn.classList.add('active');
        showNotification('Added to wishlist!');
    } else {
        wishlist.splice(index, 1);
        btn.classList.remove('active');
        showNotification('Removed from wishlist');
    }
}

// Filter Functions
function filterCategory(category) {
    let filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProducts(filtered);
    
    // Update active category buttons
    document.querySelectorAll('.shop-hero .btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(category)) {
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
        } else {
            btn.style.background = 'white';
            btn.style.color = 'var(--dark)';
        }
    });
}

function applyFilters() {
    const selectedPrice = parseInt(priceSlider.value);
    const selectedColor = document.querySelector('.color-option.active').dataset.color;
    
    let filtered = products.filter(product => {
        const priceMatch = product.price <= selectedPrice;
        const colorMatch = selectedColor === 'all' || product.color === selectedColor;
        
        return priceMatch && colorMatch;
    });
    
    renderProducts(filtered);
    filtersSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

function resetFilters() {
    priceSlider.value = 50000;
    priceValue.textContent = 'Rs 50,000';
    colorOptions.forEach(o => o.classList.remove('active'));
    colorOptions[0].classList.add('active');
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('cat1').checked = true;
    sortSelect.value = 'featured';
    renderProducts();
}

function sortProducts() {
    const sortBy = sortSelect.value;
    let sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    renderProducts(sorted);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}