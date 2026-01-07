// account.js - Account Management JavaScript

// ===== USER DATA =====
const userData = {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+92 0123456789",
    tier: "Gold",
    orders: 3,
    rating: 4.8,
    wishlistCount: 5
};

// ===== ACTIVITY DATA =====
const activityData = [
    {
        id: 1,
        icon: "fa-shopping-cart",
        title: "Order Placed",
        description: "Order #ORD-789012 has been placed successfully",
        time: "2 hours ago"
    },
    {
        id: 2,
        icon: "fa-truck",
        title: "Order Shipped",
        description: "Order #ORD-456789 has been shipped",
        time: "1 day ago"
    },
    {
        id: 3,
        icon: "fa-heart",
        title: "Added to Wishlist",
        description: "Wireless Headphones added to wishlist",
        time: "2 days ago"
    },
    {
        id: 4,
        icon: "fa-star",
        title: "Review Posted",
        description: "You reviewed Smart Watch Series 5",
        time: "3 days ago"
    }
];

// ===== ORDER DATA =====
const orderData = [
    {
        id: "ORD-789012",
        date: "Dec 15, 2025",
        status: "delivered",
        statusText: "Delivered",
        total: 429.97,
        items: [
            {
                name: "Smart Watch Series 5",
                price: 249.99,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
            },
            {
                name: "Wireless Bluetooth Headphones",
                price: 89.99,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
            }
        ]
    },
    {
        id: "ORD-456789",
        date: "Dec 10, 2023",
        status: "shipped",
        statusText: "Shipped",
        total: 79.99,
        items: [
            {
                name: "Designer Backpack",
                price: 79.99,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
            }
        ]
    },
    {
        id: "ORD-123456",
        date: "Dec 5, 2023",
        status: "processing",
        statusText: "Processing",
        total: 219.98,
        items: [
            {
                name: "Kitchen Knife Set",
                price: 69.99,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"
            },
            {
                name: "Premium Coffee Maker",
                price: 149.99,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"
            }
        ]
    }
];

// ===== ADDRESS DATA =====
const addressData = [
    {
        id: 1,
        name: "Home",
        isDefault: true,
        address: "123 Main Street<br>Apt 4B<br>Punjab<br>Pakistan",
        phone: "+92 0123456789"
    }
];

// ===== WISHLIST DATA =====
const wishlistData = [
    {
        id: 1,
        name: "Premium Laptop",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        inStock: true
    },
    {
        id: 2,
        name: "Wireless Earbuds",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?w=400",
        inStock: true
    },
    {
        id: 3,
        name: "Smart Home Speaker",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
        inStock: false
    },
    {
        id: 4,
        name: "Gaming Console",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
        inStock: true
    },
    {
        id: 5,
        name: "Digital Camera",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
        inStock: true
    }
];

// ===== ACCOUNT MANAGER =====
const AccountManager = {
    currentTab: 'dashboard',
    cartCount: 0,

    init() {
        this.loadCartCount();
        this.setupTabs();
        this.setupUserProfile();
        this.loadDashboard();
        this.loadOrders();
        this.loadAddresses();
        this.loadWishlist();
        this.setupForms();
        this.setupModal();
        this.setupEventListeners();
        this.updateUserInfo();
    },

    loadCartCount() {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        // If there's a cart display elsewhere on the page, update it here
        const cartCountEl = document.querySelector('.cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = this.cartCount;
            cartCountEl.style.display = this.cartCount > 0 ? 'flex' : 'none';
        }
    },

    setupTabs() {
        const menuItems = document.querySelectorAll('.menu-item');
        const tabContents = document.querySelectorAll('.tab-content');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.dataset.tab;
                
                // Remove active class from all menu items
                menuItems.forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                
                // Hide all tab contents
                tabContents.forEach(content => content.classList.remove('active'));
                // Show selected tab content
                document.getElementById(tabId).classList.add('active');
                
                this.currentTab = tabId;
            });
        });
    },

    setupUserProfile() {
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            // Set avatar initials
            const initials = userData.name.split(' ').map(n => n[0]).join('');
            profileAvatar.textContent = initials;
        }
    },

    loadDashboard() {
        // Update welcome message
        const welcomeName = document.getElementById('welcomeName');
        if (welcomeName) {
            const firstName = userData.name.split(' ')[0];
            welcomeName.textContent = firstName;
        }

        // Load activities
        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = activityData.map(activity => {
                return `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas ${activity.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <h4>${activity.title}</h4>
                            <p>${activity.description}</p>
                        </div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                `;
            }).join('');
        }
    },

    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        if (!ordersList) return;

        ordersList.innerHTML = orderData.map(order => {
            return `
                <div class="order-card" data-status="${order.status}">
                    <div class="order-header">
                        <div class="order-info">
                            <div class="order-id">Order #${order.id}</div>
                            <div class="order-date">Placed on ${order.date}</div>
                        </div>
                        <div class="order-status status-${order.status}">${order.statusText}</div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => {
                            return `
                                <div class="order-item">
                                    <div class="item-img">
                                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
                                    </div>
                                    <div class="item-details">
                                        <div class="item-name">${item.name}</div>
                                        <div class="item-price">Rs ${item.price.toFixed(2)}</div>
                                        <div class="item-quantity">Quantity: ${item.quantity}</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="order-footer">
                        <div class="order-total">Total: Rs ${order.total.toFixed(2)}</div>
                        <div class="order-actions">
                            <button class="btn-action btn-view" data-order="${order.id}">View Details</button>
                            ${order.status === 'delivered' 
                                ? `<button class="btn-action btn-reorder" data-order="${order.id}">Reorder</button>`
                                : order.status === 'shipped'
                                ? `<button class="btn-action btn-track" data-order="${order.id}">Track Order</button>`
                                : ''
                            }
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    loadAddresses() {
        const addressesGrid = document.getElementById('addressesGrid');
        if (!addressesGrid) return;

        addressesGrid.innerHTML = addressData.map(address => {
            return `
                <div class="address-card ${address.isDefault ? 'default' : ''}" data-address-id="${address.id}">
                    <div class="address-header">
                        <div class="address-name">${address.name}</div>
                        ${address.isDefault ? '<div class="default-badge">Default</div>' : ''}
                    </div>
                    <div class="address-details">${address.address}</div>
                    <div class="address-phone">
                        <i class="fas fa-phone"></i> ${address.phone}
                    </div>
                    <div class="address-actions">
                        <button class="btn-edit" data-address-id="${address.id}">Edit</button>
                        ${!address.isDefault ? '<button class="btn-delete" data-address-id="${address.id}">Delete</button>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    loadWishlist() {
        const wishlistGrid = document.getElementById('wishlistGrid');
        if (!wishlistGrid) return;

        wishlistGrid.innerHTML = wishlistData.map(item => {
            return `
                <div class="wishlist-item" data-item-id="${item.id}">
                    <div class="remove-wishlist" onclick="AccountManager.removeFromWishlist(${item.id})">
                        <i class="fas fa-times"></i>
                    </div>
                    <div class="wishlist-img">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
                    </div>
                    <div class="wishlist-content">
                        <h3 class="wishlist-title">${item.name}</h3>
                        <div class="wishlist-price">Rs ${item.price.toFixed(2)}</div>
                        <div class="wishlist-actions">
                            ${item.inStock 
                                ? `<button class="btn-move-to-cart" onclick="AccountManager.moveToCart(${item.id})">
                                    <i class="fas fa-cart-plus"></i> Move to Cart
                                   </button>`
                                : `<button class="btn-out-of-stock" disabled>
                                    Out of Stock
                                   </button>`
                            }
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    setupForms() {
        // Personal Info Form
        const personalForm = document.getElementById('personalForm');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                
                // Update user data
                userData.name = `${firstName} ${lastName}`;
                userData.email = email;
                userData.phone = phone;
                
                // Update UI
                this.updateUserInfo();
                this.showToast('Personal information updated successfully', 'success');
            });
        }

        // Password Form
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const currentPass = document.getElementById('currentPassword').value;
                const newPass = document.getElementById('newPassword').value;
                const confirmPass = document.getElementById('confirmPassword').value;

                if (!currentPass || !newPass || !confirmPass) {
                    this.showToast('Please fill all password fields', 'error');
                    return;
                }

                if (newPass !== confirmPass) {
                    this.showToast('New passwords do not match', 'error');
                    return;
                }

                if (newPass.length < 6) {
                    this.showToast('Password must be at least 6 characters long', 'error');
                    return;
                }

                this.showToast('Password updated successfully', 'success');
                passwordForm.reset();
            });
        }

        // Notification Form
        const notificationForm = document.getElementById('notificationForm');
        if (notificationForm) {
            notificationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showToast('Notification preferences saved', 'success');
            });
        }

        // Address Form
        const addressForm = document.getElementById('addressForm');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const addressName = document.getElementById('addressName').value;
                const fullName = document.getElementById('fullName').value;
                const addressLine1 = document.getElementById('addressLine1').value;
                const addressLine2 = document.getElementById('addressLine2').value;
                const city = document.getElementById('city').value;
                const state = document.getElementById('state').value;
                const zipCode = document.getElementById('zipCode').value;
                const country = document.getElementById('country').value;
                const phoneNumber = document.getElementById('phoneNumber').value;
                const setDefault = document.getElementById('setDefault').checked;
                
                // Create new address object
                const newAddress = {
                    id: addressData.length + 1,
                    name: addressName,
                    isDefault: setDefault,
                    address: `${addressLine1}<br>${addressLine2 ? addressLine2 + '<br>' : ''}${city}<br>${state}<br>${country}`,
                    phone: phoneNumber
                };
                
                // If setting as default, remove default from others
                if (setDefault) {
                    addressData.forEach(addr => addr.isDefault = false);
                }
                
                // Add to addresses
                addressData.push(newAddress);
                
                // Reload addresses
                this.loadAddresses();
                
                // Close modal
                this.closeModal();
                
                this.showToast('Address added successfully', 'success');
                addressForm.reset();
            });
        }

        // Order Filters
        const orderFilter = document.getElementById('orderFilter');
        const timeFilter = document.getElementById('timeFilter');
        
        if (orderFilter && timeFilter) {
            orderFilter.addEventListener('change', () => this.filterOrders());
            timeFilter.addEventListener('change', () => this.filterOrders());
        }
    },

    setupModal() {
        const addressModal = document.getElementById('addressModal');
        const addAddressBtn = document.getElementById('addAddressBtn');
        const closeModal = document.getElementById('closeModal');

        // Open modal
        if (addAddressBtn) {
            addAddressBtn.addEventListener('click', () => {
                this.openModal();
            });
        }

        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal when clicking outside
        if (addressModal) {
            addressModal.addEventListener('click', (e) => {
                if (e.target === addressModal) {
                    this.closeModal();
                }
            });
        }
    },

    setupEventListeners() {
        // Order action buttons (event delegation)
        document.addEventListener('click', (e) => {
            // Order view button
            if (e.target.classList.contains('btn-view') || e.target.closest('.btn-view')) {
                const button = e.target.classList.contains('btn-view') ? e.target : e.target.closest('.btn-view');
                const orderId = button.dataset.order;
                this.showToast(`Viewing details for order ${orderId}`, 'info');
            }
            
            // Reorder button
            if (e.target.classList.contains('btn-reorder') || e.target.closest('.btn-reorder')) {
                const button = e.target.classList.contains('btn-reorder') ? e.target : e.target.closest('.btn-reorder');
                const orderId = button.dataset.order;
                this.showToast(`Adding items from order ${orderId} to cart`, 'success');
                this.cartCount++;
                this.loadCartCount();
            }
            
            // Track order button
            if (e.target.classList.contains('btn-track') || e.target.closest('.btn-track')) {
                const button = e.target.classList.contains('btn-track') ? e.target : e.target.closest('.btn-track');
                const orderId = button.dataset.order;
                this.showToast(`Tracking order ${orderId}`, 'info');
            }
            
            // Edit address button
            if (e.target.classList.contains('btn-edit') || e.target.closest('.btn-edit')) {
                const button = e.target.classList.contains('btn-edit') ? e.target : e.target.closest('.btn-edit');
                const addressId = button.dataset.addressId;
                this.showToast(`Edit address feature coming soon (ID: ${addressId})`, 'warning');
            }
            
            // Delete address button
            if (e.target.classList.contains('btn-delete') || e.target.closest('.btn-delete')) {
                const button = e.target.classList.contains('btn-delete') ? e.target : e.target.closest('.btn-delete');
                const addressId = parseInt(button.dataset.addressId);
                this.deleteAddress(addressId);
            }
        });

        // Delete account button
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    this.showToast('Account deletion request submitted', 'warning');
                }
            });
        }
    },

    filterOrders() {
        const status = document.getElementById('orderFilter').value;
        const time = document.getElementById('timeFilter').value;
        const orders = document.querySelectorAll('.order-card');
        
        orders.forEach(order => {
            let show = true;
            
            // Filter by status
            if (status !== 'all' && order.dataset.status !== status) {
                show = false;
            }
            
            // Filter by time (simplified - in real app, compare dates)
            if (time !== 'all') {
                // Implementation would compare order dates
            }
            
            order.style.display = show ? 'block' : 'none';
        });
    },

    removeFromWishlist(itemId) {
        const item = wishlistData.find(i => i.id === itemId);
        if (item) {
            if (confirm(`Remove "${item.name}" from wishlist?`)) {
                const index = wishlistData.findIndex(i => i.id === itemId);
                if (index !== -1) {
                    wishlistData.splice(index, 1);
                    userData.wishlistCount--;
                    this.updateUserInfo();
                    this.loadWishlist();
                    this.showToast(`${item.name} removed from wishlist`, 'success');
                }
            }
        }
    },

    moveToCart(itemId) {
        const item = wishlistData.find(i => i.id === itemId);
        if (item) {
            this.cartCount++;
            this.loadCartCount();
            
            // Add to cart in localStorage
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Remove from wishlist
            this.removeFromWishlist(itemId);
            
            this.showToast(`${item.name} added to cart`, 'success');
        }
    },

    deleteAddress(addressId) {
        if (confirm('Are you sure you want to delete this address?')) {
            const index = addressData.findIndex(addr => addr.id === addressId);
            if (index !== -1 && !addressData[index].isDefault) {
                addressData.splice(index, 1);
                this.loadAddresses();
                this.showToast('Address deleted', 'success');
            } else if (addressData[index].isDefault) {
                this.showToast('Cannot delete default address', 'error');
            }
        }
    },

    updateUserInfo() {
        // Update profile info
        document.getElementById('profileName').textContent = userData.name;
        document.getElementById('profileEmail').textContent = userData.email;
        document.getElementById('profileTier').textContent = `${userData.tier} Member`;
        
        // Update stats
        document.getElementById('ordersCount').textContent = userData.orders;
        document.getElementById('averageRating').textContent = userData.rating;
        document.getElementById('wishlistCount').textContent = userData.wishlistCount;
        document.getElementById('memberTier').textContent = userData.tier;
        
        // Update badges
        document.getElementById('ordersBadge').textContent = userData.orders;
        document.getElementById('wishlistBadge').textContent = userData.wishlistCount;
        
        // Update avatar initials
        const initials = userData.name.split(' ').map(n => n[0]).join('');
        document.getElementById('profileAvatar').textContent = initials;
    },

    openModal() {
        const addressModal = document.getElementById('addressModal');
        if (addressModal) {
            addressModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal() {
        const addressModal = document.getElementById('addressModal');
        if (addressModal) {
            addressModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.className = 'toast';
        
        let icon = 'fa-check-circle';
        if (type === 'error') {
            toast.classList.add('error');
            icon = 'fa-exclamation-circle';
        } else if (type === 'warning') {
            toast.classList.add('warning');
            icon = 'fa-exclamation-triangle';
        } else if (type === 'info') {
            toast.classList.add('info');
            icon = 'fa-info-circle';
        }

        toast.innerHTML = `<i class="fas ${icon}"></i> <span id="toastMessage">${message}</span>`;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    AccountManager.init();
});

// Make AccountManager available globally
window.AccountManager = AccountManager;