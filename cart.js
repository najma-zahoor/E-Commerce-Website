// ===== CART PAGE FUNCTIONALITY =====

// DOM Elements
const cartItemsContainer = document.querySelector('.cart-items');
const orderSummaryContainer = document.querySelector('.order-summary');
const emptyCartContainer = document.querySelector('.empty-cart');
const continueShoppingBtn = document.querySelector('.continue-shopping');
const checkoutBtn = document.querySelector('.checkout-btn');

// State
let cartItems = [];

// Initialize
function initCartPage() {
    loadCartItems();
    setupEventListeners();
}

// Load cart items
function loadCartItems() {
    const savedCart = localStorage.getItem('shopCart');
    cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    if (cartItems.length === 0) {
        showEmptyCart();
    } else {
        displayCartItems();
        updateOrderSummary();
    }
}

// Display cart items
function displayCartItems() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    emptyCartContainer.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    
    cartItems.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });
}

// Create cart item element
function createCartItemElement(item, index) {
    const element = document.createElement('div');
    element.className = 'cart-item';
    element.dataset.index = index;
    
    const subtotal = (item.price * item.quantity).toFixed(2);
    
    element.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image" loading="lazy">
        <div class="item-details">
            <h3 class="item-name">${item.name}</h3>
            <p class="item-price">$${item.price}</p>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="item-subtotal">
                Subtotal: <span>$${subtotal}</span>
            </div>
        </div>
    `;
    
    return element;
}

// Update quantity
window.updateQuantity = function(index, change) {
    const item = cartItems[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        removeItem(index);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCartDisplay();
    updateOrderSummary();
};

// Remove item
window.removeItem = function(index) {
    cartItems.splice(index, 1);
    saveCart();
    updateCartDisplay();
    updateOrderSummary();
    
    if (cartItems.length === 0) {
        showEmptyCart();
    }
};

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shopCart', JSON.stringify(cartItems));
    
    // Update cart count in header
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Update cart display
function updateCartDisplay() {
    displayCartItems();
}

// Update order summary
function updateOrderSummary() {
    if (!orderSummaryContainer) return;
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    orderSummaryContainer.innerHTML = `
        <h2 class="summary-title">Order Summary</h2>
        <div class="summary-row">
            <span>Subtotal (${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div class="summary-row">
            <span>Tax</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row summary-total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <button class="checkout-btn">
            <i class="fas fa-lock"></i> Proceed to Checkout
        </button>
        <a href="products.html" class="continue-shopping">
            <i class="fas fa-arrow-left"></i> Continue Shopping
        </a>
    `;
    
    // Re-attach event listeners
    const newCheckoutBtn = orderSummaryContainer.querySelector('.checkout-btn');
    const newContinueShoppingBtn = orderSummaryContainer.querySelector('.continue-shopping');
    
    if (newCheckoutBtn) {
        newCheckoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    if (newContinueShoppingBtn) {
        newContinueShoppingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'products.html';
        });
    }
}

// Show empty cart
function showEmptyCart() {
    if (emptyCartContainer && cartItemsContainer && orderSummaryContainer) {
        emptyCartContainer.style.display = 'block';
        cartItemsContainer.style.display = 'none';
        orderSummaryContainer.style.display = 'none';
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Save order details for checkout page
    const orderDetails = {
        items: cartItems,
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 50 ? 0 : 9.99,
        tax: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('checkoutOrder', JSON.stringify(orderDetails));
    window.location.href = 'checkout.html';
}

// Setup event listeners
function setupEventListeners() {
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'products.html';
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCartPage);