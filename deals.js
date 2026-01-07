// Deals page functionality

// Sample deals data
const dealsData = [
    {
        id: 1,
        title: "Wireless Bluetooth Earbuds",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        currentPrice: 29.99,
        originalPrice: 79.99,
        discount: 63,
        rating: 4.5,
        reviews: 1284,
        sold: 85,
        endsIn: "2 days",
        trending: true
    },
    {
        id: 2,
        title: "Organic Cotton T-Shirt",
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        currentPrice: 14.99,
        originalPrice: 34.99,
        discount: 57,
        rating: 4.3,
        reviews: 567,
        sold: 72,
        endsIn: "1 day",
        trending: true
    },
    {
        id: 3,
        title: "Stainless Steel Cookware Set",
        category: "Home",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        currentPrice: 89.99,
        originalPrice: 199.99,
        discount: 55,
        rating: 4.7,
        reviews: 892,
        sold: 45,
        endsIn: "3 days",
        popular: true
    },
    {
        id: 4,
        title: "Yoga Mat & Accessories Kit",
        category: "Sports",
        image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        currentPrice: 34.99,
        originalPrice: 69.99,
        discount: 50,
        rating: 4.4,
        reviews: 423,
        sold: 91,
        endsIn: "5 hours",
        ending: true
    },
    {
        id: 5,
        title: "Professional Hair Dryer",
        category: "Beauty",
        image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        currentPrice: 39.99,
        originalPrice: 89.99,
        discount: 56,
        rating: 4.6,
        reviews: 734,
        sold: 63,
        endsIn: "6 days",
        biggest: true
    },
    {
        id: 6,
        title: "Gaming Mouse & Keyboard",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        currentPrice: 49.99,
        originalPrice: 119.99,
        discount: 58,
        rating: 4.8,
        reviews: 1567,
        sold: 78,
        endsIn: "4 days",
        popular: true
    }
];

// Initialize deals page
function initDealsPage() {
    loadDeals('all');
    setupFilterButtons();
    setupAddToCartButtons();
}

// Load deals with filtering
function loadDeals(filter) {
    const dealsGrid = document.querySelector('.deals-grid');
    if (!dealsGrid) return;
    
    let filteredDeals = dealsData;
    
    if (filter !== 'all') {
        filteredDeals = dealsData.filter(deal => deal[filter]);
    }
    
    const dealsHTML = filteredDeals.map(deal => `
        <div class="deal-card" data-deal-id="${deal.id}">
            <div class="deal-badge">${deal.discount}% OFF</div>
            <div class="deal-image">
                <img src="${deal.image}" alt="${deal.title}">
            </div>
            <div class="deal-content">
                <div class="deal-category">
                    <i class="fas fa-tag"></i> ${deal.category}
                </div>
                <h3 class="deal-title">
                    <a href="product.html?id=${deal.id}">${deal.title}</a>
                </h3>
                <div class="deal-price">
                    <span class="deal-price-current">$${deal.currentPrice.toFixed(2)}</span>
                    <span class="deal-price-original">$${deal.originalPrice.toFixed(2)}</span>
                </div>
                <div class="deal-rating">
                    <div class="stars">
                        ${generateStars(deal.rating)}
                    </div>
                    <span class="review-count">(${deal.reviews})</span>
                </div>
                <div class="deal-meta">
                    <span class="deal-sold">${deal.sold}% sold</span>
                    <span class="deal-ends">Ends in ${deal.endsIn}</span>
                </div>
                <button class="btn btn-primary btn-block add-to-cart" data-id="${deal.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    dealsGrid.innerHTML = dealsHTML;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Load deals with selected filter
            const filter = this.getAttribute('data-filter');
            loadDeals(filter);
        });
    });
}

// Setup add to cart buttons
function setupAddToCartButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const productId = button.getAttribute('data-id');
            
            addToCart(productId, button);
        }
        
        if (e.target.closest('.btn-danger')) {
            const button = e.target.closest('.btn-danger');
            const productId = button.parentElement.querySelector('h3').textContent;
            const price = button.parentElement.querySelector('.current-price').textContent;
            
            alert(`You're about to buy: ${productId} for ${price}`);
            // In a real app, this would redirect to checkout
        }
    });
}

// Add to cart function
function addToCart(productId, button) {
    // Simulate API call
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    button.disabled = true;
    
    setTimeout(() => {
        // Update cart count
        let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
        cartCount++;
        localStorage.setItem('cartCount', cartCount.toString());
        
        // Update UI
        document.querySelector('.cart-count').textContent = cartCount;
        
        // Show success message
        showNotification('Product added to cart!', 'success');
        
        // Reset button
        button.innerHTML = '<i class="fas fa-cart-plus"></i> Added to Cart';
        button.classList.add('btn-success');
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            button.classList.remove('btn-success');
            button.disabled = false;
        }, 2000);
        
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.deals-container')) {
        initDealsPage();
    }
});