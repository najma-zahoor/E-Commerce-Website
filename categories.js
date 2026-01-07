// Categories page functionality

// Categories data
const categoriesData = [
    {
        id: 1,
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets, smartphones, laptops, and tech accessories",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 1250,
        dealCount: 45,
        isFeatured: true,
        isPopular: true,
        icon: "fas fa-laptop"
    },
    {
        id: 2,
        name: "Fashion & Apparel",
        slug: "fashion",
        description: "Clothing, shoes, accessories for men, women, and kids",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 2550,
        dealCount: 68,
        isFeatured: true,
        isPopular: true,
        icon: "fas fa-tshirt"
    },
    {
        id: 3,
        name: "Home & Garden",
        slug: "home",
        description: "Furniture, decor, kitchenware, and gardening supplies",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 1820,
        dealCount: 32,
        isFeatured: true,
        isPopular: true,
        icon: "fas fa-home"
    },
    {
        id: 4,
        name: "Sports & Outdoors",
        slug: "sports",
        description: "Fitness equipment, camping gear, sports apparel",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 890,
        dealCount: 19,
        isFeatured: false,
        isPopular: true,
        icon: "fas fa-basketball-ball"
    },
    {
        id: 5,
        name: "Beauty & Health",
        slug: "beauty",
        description: "Skincare, makeup, hair care, and wellness products",
        image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 1340,
        dealCount: 28,
        isFeatured: false,
        isPopular: true,
        icon: "fas fa-spa"
    },
    {
        id: 6,
        name: "Books & Media",
        slug: "books",
        description: "Books, movies, music, and educational materials",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 1560,
        dealCount: 24,
        isFeatured: false,
        isPopular: false,
        icon: "fas fa-book"
    },
    {
        id: 7,
        name: "Toys & Games",
        slug: "toys",
        description: "Toys, board games, video games, and collectibles",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 720,
        dealCount: 15,
        isFeatured: false,
        isPopular: false,
        icon: "fas fa-gamepad"
    },
    {
        id: 8,
        name: "Automotive",
        slug: "automotive",
        description: "Car parts, accessories, tools, and maintenance",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 640,
        dealCount: 12,
        isFeatured: false,
        isPopular: false,
        icon: "fas fa-car"
    },
    {
        id: 9,
        name: "Pet Supplies",
        slug: "pets",
        description: "Food, toys, beds, and accessories for pets",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 580,
        dealCount: 18,
        isFeatured: false,
        isPopular: false,
        icon: "fas fa-paw"
    },
    {
        id: 10,
        name: "Office Supplies",
        slug: "office",
        description: "Stationery, furniture, equipment for home office",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        productCount: 920,
        dealCount: 21,
        isFeatured: false,
        isPopular: false,
        icon: "fas fa-briefcase"
    }
];

// Initialize categories page
function initCategoriesPage() {
    loadCategories();
    setupSorting();
    setupTabs();
    setupBrandTabs();
    setupCategoryFilters();
}

// Load and display categories
function loadCategories(sortBy = 'popular') {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    let sortedCategories = [...categoriesData];
    
    // Apply sorting
    switch(sortBy) {
        case 'alphabetical':
            sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'products':
            sortedCategories.sort((a, b) => b.productCount - a.productCount);
            break;
        case 'newest':
            sortedCategories.reverse();
            break;
        case 'popular':
        default:
            sortedCategories.sort((a, b) => {
                if (a.isPopular && !b.isPopular) return -1;
                if (!a.isPopular && b.isPopular) return 1;
                return b.productCount - a.productCount;
            });
            break;
    }
    
    // Generate HTML
    const categoriesHTML = sortedCategories.map(category => `
        <div class="category-card" data-category-id="${category.id}" data-category-slug="${category.slug}">
            <div class="category-image">
                <img src="${category.image}" alt="${category.name}">
                ${category.dealCount > 20 ? `
                    <div class="category-badge">${category.dealCount} Deals</div>
                ` : ''}
            </div>
            <div class="category-content">
                <h3>${category.name}</h3>
                <p class="category-description">${category.description}</p>
                <div class="category-stats">
                    <span><i class="fas fa-box"></i> ${category.productCount.toLocaleString()} products</span>
                    <span><i class="fas fa-tag"></i> ${category.dealCount} deals</span>
                </div>
                <div class="category-actions">
                    <a href="products.html?category=${category.slug}" class="btn btn-primary">
                        <i class="${category.icon}"></i> Browse
                    </a>
                    <button class="btn btn-outline add-to-favorites" data-category-id="${category.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    categoriesGrid.innerHTML = categoriesHTML;
    
    // Setup category card interactions
    setupCategoryCardInteractions();
}

// Setup category card interactions
function setupCategoryCardInteractions() {
    // Category card clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons or links
            if (e.target.closest('.btn') || e.target.tagName === 'A') {
                return;
            }
            
            const slug = this.getAttribute('data-category-slug');
            window.location.href = `products.html?category=${slug}`;
        });
    });
    
    // Favorite buttons
    document.querySelectorAll('.add-to-favorites').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const categoryId = this.getAttribute('data-category-id');
            toggleFavorite(categoryId, this);
        });
    });
}

// Toggle favorite category
function toggleFavorite(categoryId, button) {
    const icon = button.querySelector('i');
    
    // Toggle visual state
    if (icon.classList.contains('far')) {
        // Add to favorites
        icon.className = 'fas fa-heart';
        button.classList.add('active');
        showNotification('Category added to favorites', 'success');
        
        // Store in localStorage
        addToFavoritesStorage(categoryId);
    } else {
        // Remove from favorites
        icon.className = 'far fa-heart';
        button.classList.remove('active');
        showNotification('Category removed from favorites', 'info');
        
        // Remove from localStorage
        removeFromFavoritesStorage(categoryId);
    }
}

// Add to favorites storage
function addToFavoritesStorage(categoryId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCategories') || '[]');
    
    if (!favorites.includes(categoryId)) {
        favorites.push(categoryId);
        localStorage.setItem('favoriteCategories', JSON.stringify(favorites));
    }
}

// Remove from favorites storage
function removeFromFavoritesStorage(categoryId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCategories') || '[]');
    favorites = favorites.filter(id => id !== categoryId);
    localStorage.setItem('favoriteCategories', JSON.stringify(favorites));
}

// Setup sorting
function setupSorting() {
    const sortSelect = document.getElementById('sort-categories');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        loadCategories(this.value);
    });
}

// Setup tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup brand tabs
function setupBrandTabs() {
    const brandTabButtons = document.querySelectorAll('.brand-tab-btn');
    const brandTabContents = document.querySelectorAll('.brand-tab-content');
    
    brandTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-brand-tab');
            
            // Remove active class from all buttons and contents
            brandTabButtons.forEach(btn => btn.classList.remove('active'));
            brandTabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup category filters
function setupCategoryFilters() {
    // Quick navigation
    document.querySelectorAll('.quick-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Newsletter category checkboxes
    const checkboxes = document.querySelectorAll('.category-checkboxes input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateNewsletterPreferences();
        });
    });
}

// Update newsletter preferences
function updateNewsletterPreferences() {
    const selectedCategories = [];
    document.querySelectorAll('.category-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
        selectedCategories.push(checkbox.parentElement.textContent.trim());
    });
    
    // Store in localStorage
    localStorage.setItem('newsletterCategories', JSON.stringify(selectedCategories));
    
    if (selectedCategories.length > 0) {
        console.log('Subscribed to:', selectedCategories);
    }
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

// Load favorite states
function loadFavoriteStates() {
    const favorites = JSON.parse(localStorage.getItem('favoriteCategories') || '[]');
    
    favorites.forEach(categoryId => {
        const favoriteBtn = document.querySelector(`.add-to-favorites[data-category-id="${categoryId}"]`);
        if (favoriteBtn) {
            const icon = favoriteBtn.querySelector('i');
            icon.className = 'fas fa-heart';
            favoriteBtn.classList.add('active');
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.categories-container')) {
        initCategoriesPage();
        loadFavoriteStates();
    }
});