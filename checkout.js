// checkout.js - Checkout Page JavaScript

// ===== CHECKOUT MANAGER =====
const CheckoutManager = {
    cartItems: [],
    orderSummary: {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0
    },
    paymentMethod: 'credit-card',
    shippingCost: 5.00,
    taxRate: 0.08, // 8%

    init() {
        this.loadCartItems();
        this.setupPaymentMethods();
        this.setupFormValidation();
        this.setupInputFormatting();
        this.setupEventListeners();
        this.updateOrderSummary();
    },

    loadCartItems() {
        // Load cart items from localStorage
        const cartData = localStorage.getItem('cartItems');
        if (cartData) {
            this.cartItems = JSON.parse(cartData);
        } else {
            // If no cart in localStorage, use sample data
            this.cartItems = [
                {
                    id: 1,
                    name: "Smartphone Pro X",
                    price: 69999,
                    quantity: 1,
                    image: ""
                },
                {
                    id: 2,
                    name: "Wireless Headphones",
                    price: 19999,
                    quantity: 2,
                    image: ""
                }
            ];
        }
        
        this.displayOrderItems();
    },

    displayOrderItems() {
        const orderItemsContainer = document.getElementById('order-items');
        if (!orderItemsContainer) return;

        if (this.cartItems.length === 0) {
            orderItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        orderItemsContainer.innerHTML = this.cartItems.map(item => {
            const itemTotal = item.price * item.quantity;
            return `
                <div class="order-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>Rs ${itemTotal.toLocaleString()}</span>
                </div>
            `;
        }).join('');
    },

    updateOrderSummary() {
        // Calculate subtotal
        this.orderSummary.subtotal = this.cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Calculate shipping (free over Rs 50)
        this.orderSummary.shipping = this.orderSummary.subtotal > 5000 ? 0 : this.shippingCost;
        
        // Calculate tax
        this.orderSummary.tax = this.orderSummary.subtotal * this.taxRate;
        
        // Calculate total
        this.orderSummary.total = this.orderSummary.subtotal + this.orderSummary.shipping + this.orderSummary.tax;

        // Update UI
        this.updateSummaryUI();
    },

    updateSummaryUI() {
        document.getElementById('subtotal').textContent = `Rs ${this.orderSummary.subtotal.toLocaleString()}`;
        document.getElementById('shipping').textContent = `Rs ${this.orderSummary.shipping.toLocaleString()}`;
        document.getElementById('tax').textContent = `Rs ${this.orderSummary.tax.toLocaleString()}`;
        document.getElementById('total').textContent = `Rs ${this.orderSummary.total.toLocaleString()}`;
    },

    setupPaymentMethods() {
        const paymentMethods = document.querySelectorAll('.payment-method');
        
        paymentMethods.forEach(method => {
            method.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget);
            });
        });
    },

    selectPaymentMethod(element) {
        // Remove active class from all payment methods
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('active');
        });
        
        // Add active class to selected method
        element.classList.add('active');
        
        // Get payment method
        this.paymentMethod = element.dataset.method;
        
        // Show/hide credit card details
        const cardDetails = document.getElementById('credit-card-details');
        if (this.paymentMethod === 'credit-card') {
            cardDetails.style.display = 'block';
        } else {
            cardDetails.style.display = 'none';
        }
    },

    setupFormValidation() {
        // Add required field validation
        const formInputs = document.querySelectorAll('input[required], select[required]');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });

        // Card number validation
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('blur', () => {
                this.validateCardNumber(cardNumberInput.value);
            });
        }

        // CVV validation
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('blur', () => {
                this.validateCVV(cvvInput.value);
            });
        }
    },

    setupInputFormatting() {
        // Format card number input
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                this.formatCardNumber(e.target);
            });
        }

        // Format expiry date input
        const expiryDateInput = document.getElementById('expiry-date');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                this.formatExpiryDate(e.target);
            });
        }

        // Only allow numbers in CVV
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // Only allow numbers in phone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    },

    setupEventListeners() {
        // Place order button
        const placeOrderBtn = document.getElementById('place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.placeOrder();
            });
        }

        // Terms checkbox
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                this.updatePlaceOrderButton();
            });
        }

        // Form submission
        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            const form = section.querySelector('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                });
            }
        });

        // Country change
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                this.updateShippingByCountry(e.target.value);
            });
        }
    },

    validateField(field) {
        const value = field.value.trim();
        const errorElement = field.nextElementSibling?.classList?.contains('error-message') 
            ? field.nextElementSibling 
            : null;
        
        if (!value && field.hasAttribute('required')) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (field.id === 'phone' && value) {
            if (value.length < 10) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        // Clear error
        this.clearFieldError(field);
        return true;
    },

    validateCardNumber(cardNumber) {
        if (this.paymentMethod !== 'credit-card') return true;
        
        const cleaned = cardNumber.replace(/\s+/g, '');
        if (cleaned.length < 16) {
            this.showFieldError(document.getElementById('card-number'), 'Please enter a valid card number');
            return false;
        }
        
        // Luhn algorithm check (simplified)
        let sum = 0;
        let isEven = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i), 10);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        const isValid = sum % 10 === 0;
        if (!isValid) {
            this.showFieldError(document.getElementById('card-number'), 'Invalid card number');
        }
        
        return isValid;
    },

    validateCVV(cvv) {
        if (this.paymentMethod !== 'credit-card') return true;
        
        if (cvv.length < 3 || cvv.length > 4) {
            this.showFieldError(document.getElementById('cvv'), 'Please enter a valid CVV');
            return false;
        }
        
        return true;
    },

    formatCardNumber(input) {
        let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        input.value = formatted.substring(0, 19);
    },

    formatExpiryDate(input) {
        let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        if (value.length >= 2) {
            let month = parseInt(value.substring(0, 2));
            if (month > 12) {
                month = 12;
            }
            value = (month < 10 ? '0' + month : month) + '/' + value.substring(2, 4);
        }
        
        input.value = value.substring(0, 5);
    },

    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class to field
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
        
        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    },

    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    },

    validateForm() {
        let isValid = true;
        
        // Validate required fields
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate terms
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            this.showFieldError(termsCheckbox, 'You must agree to the terms and conditions');
            isValid = false;
        }

        // Validate payment method
        if (this.paymentMethod === 'credit-card') {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('card-name').value;
            
            if (!this.validateCardNumber(cardNumber)) isValid = false;
            if (!expiryDate || expiryDate.length !== 5) {
                this.showFieldError(document.getElementById('expiry-date'), 'Please enter a valid expiry date');
                isValid = false;
            }
            if (!this.validateCVV(cvv)) isValid = false;
            if (!cardName.trim()) {
                this.showFieldError(document.getElementById('card-name'), 'Please enter name on card');
                isValid = false;
            }
        }

        return isValid;
    },

    updatePlaceOrderButton() {
        const placeOrderBtn = document.getElementById('place-order-btn');
        const termsCheckbox = document.getElementById('terms');
        
        if (placeOrderBtn && termsCheckbox) {
            placeOrderBtn.disabled = !termsCheckbox.checked;
        }
    },

    updateShippingByCountry(country) {
        // Update shipping cost based on country
        switch(country) {
            case 'PK':
                this.shippingCost = 100; // Local shipping
                break;
            case 'US':
            case 'CA':
                this.shippingCost = 15.00;
                break;
            case 'UK':
            case 'AU':
                this.shippingCost = 12.00;
                break;
            case 'IN':
                this.shippingCost = 8.00;
                break;
            default:
                this.shippingCost = 10.00;
        }
        
        this.updateOrderSummary();
    },

    async placeOrder() {
        // Validate form
        if (!this.validateForm()) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Show loading
        this.showLoading(true);

        try {
            // Collect order data
            const orderData = {
                customer: {
                    firstName: document.getElementById('first-name').value,
                    lastName: document.getElementById('last-name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    zip: document.getElementById('zip').value,
                    country: document.getElementById('country').value
                },
                payment: {
                    method: this.paymentMethod,
                    details: this.paymentMethod === 'credit-card' ? {
                        cardNumber: document.getElementById('card-number').value.replace(/\s+/g, ''),
                        expiryDate: document.getElementById('expiry-date').value,
                        cvv: document.getElementById('cvv').value,
                        name: document.getElementById('card-name').value
                    } : {}
                },
                items: this.cartItems,
                summary: this.orderSummary,
                newsletter: document.getElementById('newsletter').checked,
                timestamp: new Date().toISOString(),
                orderId: this.generateOrderId()
            };

            // Save order to localStorage
            this.saveOrder(orderData);

            // Clear cart
            this.clearCart();

            // Hide loading
            this.showLoading(false);

            // Show success message
            this.showSuccessModal(orderData.orderId);

        } catch (error) {
            console.error('Order placement error:', error);
            this.showLoading(false);
            this.showNotification('Error placing order. Please try again.', 'error');
        }
    },

    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    },

    saveOrder(orderData) {
        // Get existing orders or create new array
        const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
        
        // Add new order
        orders.push(orderData);
        
        // Save back to localStorage
        localStorage.setItem('userOrders', JSON.stringify(orders));
        
        // Save order data for immediate access
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
    },

    clearCart() {
        // Clear cart from localStorage
        localStorage.removeItem('cartItems');
        
        // Update cart count in other pages
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = '0';
            element.style.display = 'none';
        });
    },

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
        
        const placeOrderBtn = document.getElementById('place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = show;
            if (show) {
                placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            } else {
                placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
            }
        }
    },

    showSuccessModal(orderId) {
        const successModal = document.getElementById('success-modal');
        const orderIdElement = document.getElementById('order-id');
        
        if (successModal && orderIdElement) {
            orderIdElement.textContent = orderId;
            successModal.classList.add('show');
            
            // Setup modal button actions
            document.getElementById('view-order-btn').addEventListener('click', () => {
                window.location.href = `order-confirmation.html?order=${orderId}`;
            });
            
            document.getElementById('continue-shopping-btn').addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    },

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#2ecc71'};
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
    CheckoutManager.init();
    
    // Add CSS animations
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
        
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .loading-content {
            text-align: center;
        }
        
        .loading-content i {
            font-size: 3rem;
            color: #3498db;
            margin-bottom: 1rem;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal.show {
            display: flex;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        }
        
        .modal-success i {
            font-size: 4rem;
            color: #2ecc71;
            margin-bottom: 1rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        .error {
            border-color: #e74c3c !important;
        }
        
        .empty-cart {
            text-align: center;
            color: #666;
            padding: 2rem;
        }
    `;
    document.head.appendChild(style);
});

// Make CheckoutManager available globally
window.CheckoutManager = CheckoutManager;