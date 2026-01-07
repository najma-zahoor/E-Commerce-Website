// order-confirmation.js - Order Confirmation Page JavaScript

const OrderConfirmationManager = {
    orderData: null,
    
    init() {
        this.loadOrderData();
        this.setupEventListeners();
        this.setupMobileMenu();
        this.displayOrderData();
        this.updateCartCount();
        this.startOrderTimeline();
    },
    
    loadOrderData() {
        // Try to get order data from localStorage (from checkout)
        const savedOrder = localStorage.getItem('lastOrder');
        const savedCart = localStorage.getItem('cartItems');
        
        if (savedOrder) {
            try {
                this.orderData = JSON.parse(savedOrder);
            } catch (error) {
                console.error('Error parsing order data:', error);
                this.orderData = this.getDefaultOrderData();
            }
        } else if (savedCart) {
            // If no order data, create from cart
            this.orderData = this.createOrderFromCart(savedCart);
        } else {
            // Fallback to default data
            this.orderData = this.getDefaultOrderData();
        }
        
        // Clear cart after order confirmation
        this.clearCart();
    },
    
    getDefaultOrderData() {
        const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const now = new Date();
        
        return {
            orderId: orderId,
            orderDate: now.toISOString(),
            customer: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+92 0123456789'
            },
            shipping: {
                address: '123 Main Street, Apt 4B\nPunjab, Pakistan',
                method: 'Standard Shipping'
            },
            payment: {
                method: 'Credit Card',
                lastFour: '4242'
            },
            items: [
                {
                    id: 1,
                    name: 'Smartphone Pro X',
                    price: 69999,
                    quantity: 1,
                    total: 69999
                },
                {
                    id: 2,
                    name: 'Wireless Headphones',
                    price: 19999,
                    quantity: 2,
                    total: 39998
                }
            ],
            summary: {
                subtotal: 109997,
                shipping: 500,
                tax: 8799.76,
                total: 119296.76
            },
            status: 'processing'
        };
    },
    
    createOrderFromCart(cartData) {
        try {
            const cartItems = JSON.parse(cartData);
            const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
            const now = new Date();
            
            // Calculate totals
            const subtotal = cartItems.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);
            
            const shipping = subtotal > 5000 ? 0 : 500;
            const tax = subtotal * 0.08;
            const total = subtotal + shipping + tax;
            
            return {
                orderId: orderId,
                orderDate: now.toISOString(),
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                })),
                summary: {
                    subtotal: subtotal,
                    shipping: shipping,
                    tax: tax,
                    total: total
                },
                status: 'processing'
            };
            
        } catch (error) {
            console.error('Error creating order from cart:', error);
            return this.getDefaultOrderData();
        }
    },
    
    displayOrderData() {
        if (!this.orderData) return;
        
        // Hide loading overlay
        this.hideLoading();
        
        // Update order details
        this.updateOrderDetails();
        
        // Update order items
        this.updateOrderItems();
        
        // Update order timeline
        this.updateOrderTimeline();
    },
    
    updateOrderDetails() {
        const { orderId, orderDate, payment, shipping, summary, status } = this.orderData;
        
        // Format date
        const date = new Date(orderDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Update DOM elements
        document.getElementById('orderNumber').textContent = orderId;
        document.getElementById('orderDate').textContent = formattedDate;
        document.getElementById('paymentMethod').textContent = payment?.method || 'Credit Card';
        document.getElementById('shippingAddress').textContent = shipping?.address || 'Address not available';
        document.getElementById('orderStatus').textContent = this.formatStatus(status);
        document.getElementById('orderStatus').className = `order-status-badge status-${status}`;
        
        // Update amounts
        document.getElementById('subtotalAmount').textContent = `Rs ${this.formatCurrency(summary.subtotal)}`;
        document.getElementById('shippingAmount').textContent = `Rs ${this.formatCurrency(summary.shipping)}`;
        document.getElementById('taxAmount').textContent = `Rs ${this.formatCurrency(summary.tax)}`;
        document.getElementById('totalAmount').textContent = `Rs ${this.formatCurrency(summary.total)}`;
        
        // Update order placed time
        document.getElementById('orderPlacedTime').textContent = 'Just now';
    },
    
    updateOrderItems() {
        const orderItemsList = document.getElementById('orderItemsList');
        if (!orderItemsList || !this.orderData.items) return;
        
        orderItemsList.innerHTML = this.orderData.items.map(item => {
            return `
                <div class="order-item">
                    <div class="order-item-image">
                        <div class="image-placeholder">
                            <i class="fas fa-box"></i>
                        </div>
                    </div>
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">Rs ${this.formatCurrency(item.price)} each</div>
                    </div>
                    <div class="order-item-quantity">× ${item.quantity}</div>
                    <div class="order-item-total">Rs ${this.formatCurrency(item.total)}</div>
                </div>
            `;
        }).join('');
    },
    
    updateOrderTimeline() {
        const timelineSteps = document.querySelectorAll('.timeline-step');
        const status = this.orderData.status;
        
        // Reset all steps
        timelineSteps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        // Mark appropriate steps based on status
        switch(status) {
            case 'processing':
                timelineSteps[0].classList.add('completed');
                timelineSteps[1].classList.add('active');
                break;
            case 'shipped':
                timelineSteps[0].classList.add('completed');
                timelineSteps[1].classList.add('completed');
                timelineSteps[2].classList.add('active');
                break;
            case 'delivered':
                timelineSteps.forEach(step => step.classList.add('completed'));
                break;
            default:
                timelineSteps[0].classList.add('active');
        }
    },
    
    setupEventListeners() {
        // Print receipt button
        const printBtn = document.getElementById('printReceiptBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printReceipt();
            });
        }
        
        // Save order to account history
        this.saveOrderToHistory();
    },
    
    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
            
            // Close menu when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !navLinks.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                }
            });
        }
    },
    
    updateCartCount() {
        // Cart should be empty after order
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = '0';
            cartCount.style.display = 'none';
        }
    },
    
    clearCart() {
        localStorage.removeItem('cartItems');
        
        // Also clear from other pages if needed
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = '0';
            element.style.display = 'none';
        });
    },
    
    startOrderTimeline() {
        // Simulate order progress updates
        setTimeout(() => {
            this.simulateOrderProgress();
        }, 5000);
    },
    
    simulateOrderProgress() {
        const timelineSteps = document.querySelectorAll('.timeline-step');
        const currentStatus = this.orderData.status;
        
        // Move to next step if not delivered
        if (currentStatus === 'processing') {
            // After 30 seconds, mark processing as complete and move to shipped
            setTimeout(() => {
                this.orderData.status = 'shipped';
                this.updateOrderTimeline();
                this.updateOrderStatus();
                this.showNotification('Your order has been shipped!', 'success');
            }, 30000);
            
            // After 2 minutes, mark as delivered
            setTimeout(() => {
                this.orderData.status = 'delivered';
                this.updateOrderTimeline();
                this.updateOrderStatus();
                this.showNotification('Your order has been delivered!', 'success');
            }, 120000);
        }
    },
    
    updateOrderStatus() {
        const statusElement = document.getElementById('orderStatus');
        if (statusElement) {
            statusElement.textContent = this.formatStatus(this.orderData.status);
            statusElement.className = `order-status-badge status-${this.orderData.status}`;
        }
    },
    
    formatStatus(status) {
        switch(status) {
            case 'processing': return 'Processing';
            case 'shipped': return 'Shipped';
            case 'delivered': return 'Delivered';
            default: return 'Processing';
        }
    },
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-PK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    },
    
    printReceipt() {
        // Create printable content
        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="text-align: center; color: #2c3e50;">ShopCart Receipt</h1>
                <div style="margin: 20px 0; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
                    <h3>Order Details</h3>
                    <p><strong>Order Number:</strong> ${this.orderData.orderId}</p>
                    <p><strong>Date:</strong> ${new Date(this.orderData.orderDate).toLocaleString()}</p>
                    <p><strong>Status:</strong> ${this.formatStatus(this.orderData.status)}</p>
                </div>
                
                <h3>Items</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #ddd;">
                            <th style="padding: 10px; text-align: left;">Item</th>
                            <th style="padding: 10px; text-align: right;">Qty</th>
                            <th style="padding: 10px; text-align: right;">Price</th>
                            <th style="padding: 10px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.orderData.items.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px;">${item.name}</td>
                                <td style="padding: 10px; text-align: right;">${item.quantity}</td>
                                <td style="padding: 10px; text-align: right;">Rs ${this.formatCurrency(item.price)}</td>
                                <td style="padding: 10px; text-align: right;">Rs ${this.formatCurrency(item.total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="margin-top: 20px; border-top: 2px solid #2c3e50; padding-top: 15px;">
                    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                        <span>Subtotal:</span>
                        <span>Rs ${this.formatCurrency(this.orderData.summary.subtotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                        <span>Shipping:</span>
                        <span>Rs ${this.formatCurrency(this.orderData.summary.shipping)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                        <span>Tax:</span>
                        <span>Rs ${this.formatCurrency(this.orderData.summary.tax)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 1.2em;">
                        <span>Total:</span>
                        <span>Rs ${this.formatCurrency(this.orderData.summary.total)}</span>
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: center; color: #666; font-size: 0.9em;">
                    <p>Thank you for shopping with ShopCart!</p>
                    <p>For any questions, contact support@shopcart.com</p>
                </div>
            </div>
        `;
        
        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>ShopCart Receipt - ${this.orderData.orderId}</title>
                    <style>
                        @media print {
                            body { margin: 0; }
                        }
                    </style>
                </head>
                <body>${printContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        
        // Trigger print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    },
    
    saveOrderToHistory() {
        // Save order to user's order history in localStorage
        const userId = localStorage.getItem('currentUserId');
        if (userId && this.orderData) {
            try {
                const userOrders = JSON.parse(localStorage.getItem(`userOrders_${userId}`)) || [];
                
                // Add order to history
                userOrders.push({
                    ...this.orderData,
                    savedAt: new Date().toISOString()
                });
                
                // Keep only last 50 orders
                if (userOrders.length > 50) {
                    userOrders.shift();
                }
                
                localStorage.setItem(`userOrders_${userId}`, JSON.stringify(userOrders));
            } catch (error) {
                console.error('Error saving order to history:', error);
            }
        }
    },
    
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    },
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    },
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.confirmation-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `confirmation-notification ${type}`;
        
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
            top: 100px;
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
    }
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    OrderConfirmationManager.init();
    
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
        
        @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.7; }
        }
        
        .success-animation {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 30px 0;
        }
        
        .success-icon {
            font-size: 80px;
            color: #2ecc71;
            z-index: 2;
        }
        
        .success-animation-circle {
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 2px solid #2ecc71;
            animation: pulse 2s infinite;
            opacity: 0;
        }
        
        .success-animation-circle.delay-1 {
            animation-delay: 0.5s;
        }
        
        .success-animation-circle.delay-2 {
            animation-delay: 1s;
        }
        
        .order-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .status-processing {
            background: #3498db;
            color: white;
        }
        
        .status-shipped {
            background: #f39c12;
            color: white;
        }
        
        .status-delivered {
            background: #2ecc71;
            color: white;
        }
        
        .timeline-step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            opacity: 0.6;
            transition: all 0.3s ease;
        }
        
        .timeline-step.active {
            opacity: 1;
        }
        
        .timeline-step.completed {
            opacity: 1;
        }
        
        .timeline-step.completed .timeline-step-icon {
            background: #2ecc71;
            color: white;
        }
        
        .timeline-step.active .timeline-step-icon {
            background: #3498db;
            color: white;
            animation: pulse 2s infinite;
        }
        
        .timeline-step-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .timeline-step-content {
            flex: 1;
        }
        
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .loading-content i {
            font-size: 3rem;
            color: #3498db;
            margin-bottom: 20px;
        }
        
        .loading-content p {
            color: #2c3e50;
            font-size: 1.1rem;
        }
        
        @media print {
            .navbar,
            .action-buttons,
            .customer-support-card,
            .loading-overlay {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
});

// Make OrderConfirmationManager available globally
window.OrderConfirmationManager = OrderConfirmationManager;