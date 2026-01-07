// ===== PRODUCTS PAGE FUNCTIONALITY =====

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const productsList = document.getElementById('products-list');
const productsLoading = document.getElementById('products-loading');
const noResults = document.getElementById('no-results');
const resultsCount = document.getElementById('results-count');
const activeFiltersContainer = document.getElementById('active-filters');
const paginationContainer = document.getElementById('pagination');
const filterToggle = document.getElementById('filter-toggle');
const filtersContainer = document.getElementById('filters-container');
const viewButtons = document.querySelectorAll('.view-btn');
const perPageSelect = document.getElementById('per-page');
const sortSelect = document.getElementById('sort-by');
const clearAllFiltersBtn = document.getElementById('clear-all-filters');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');

// State
let currentView = 'grid';
let currentPage = 1;
let productsPerPage = 12;
let totalProducts = 0;
let totalPages = 0;
let filters = {
    minPrice: 0,
    maxPrice: 1000,
    categories: [],
    brands: [],
    rating: null,
    availability: [],
    sortBy: 'featured'
};

// Initialize Products Page
window.initProductsPage = function() {
    loadProducts();
    setupEventListeners();
    setupFilterListeners();
    updateResultsCount();
};

// Load products
function loadProducts() {
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        const filteredProducts = filterProducts();
        totalProducts = filteredProducts.length;
        totalPages = Math.ceil(totalProducts / productsPerPage);
        
        displayProducts(filteredProducts);
        setupPagination();
        updateResultsCount();
        
        hideLoading();
    }, 500);
}

// Filter products based on current filters
function filterProducts() {
    let filtered = [...window.productsData];
    
    // Apply price filter
    filtered = filtered.filter(product => 
        product.price >= filters.minPrice && 
        product.price <= filters.maxPrice
    );
    
    // Apply category filter
    if (filters.categories.length > 0) {
        filtered = filtered.filter(product => 
            filters.categories.includes(product.category)
        );
    }
    
    // Apply brand filter
    if (filters.brands.length > 0) {
        filtered = filtered.filter(product => 
            filters.brands.includes(product.brand)
        );
    }
    
    // Apply rating filter
    if (filters.rating) {
        filtered = filtered.filter(product => 
            product.rating >= parseInt(filters.rating)
        );
    }
    
    // Apply availability filter
    if (filters.availability.includes('in-stock')) {
        filtered = filtered.filter(product => product.stock > 0);
    }
    if (filters.availability.includes('out-of-stock')) {
        filtered = filtered.filter(product => product.stock === 0);
    }
    
    // Apply sorting
    filtered = sortProducts(filtered, filters.sortBy);
    
    return filtered;
}

// Sort products
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        case 'price-high':
            return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.reverse();
        case 'popular':
            return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        case 'discount':
            return sorted.sort((a, b) => {
                const discountA = a.discountPrice ? ((a.price - a.discountPrice) / a.price) * 100 : 0;
                const discountB = b.discountPrice ? ((b.price - b.discountPrice) / b.price) * 100 : 0;
                return discountB - discountA;
            });
        default: // featured
            return sorted.filter(p => p.featured).concat(sorted.filter(p => !p.featured));
    }
}

// Display products
function displayProducts(products) {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = products.slice(startIndex, endIndex);
    
    // Clear existing products
    productsGrid.innerHTML = '';
    productsList.innerHTML = '';
    
    if (pageProducts.length === 0) {
        noResults.style.display = 'block';
        productsGrid.style.display = 'none';
        productsList.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Create product cards
    pageProducts.forEach(product => {
        const productCard = createProductCard(product);
        const productListItem = createProductListItem(product);
        
        productsGrid.appendChild(productCard);
        productsList.appendChild(productListItem);
    });
    
    // Show current view
    if (currentView === 'grid') {
        productsGrid.style.display = 'grid';
        productsList.style.display = 'none';
    } else {
        productsGrid.style.display = 'none';
        productsList.style.display = 'flex';
    }
}

// Create product card for grid view
function createProductCard(product) {
    const discountPercentage = product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
        : 0;
    
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.discountPrice ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">$${product.discountPrice || product.price}</span>
                ${product.discountPrice ? `<span class="original-price">$${product.price}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">
                    ${generateStarRating(product.rating)}
                </div>
                <span class="rating-count">(${product.reviewCount})</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.discountPrice || product.price}, '${product.image}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-outline" onclick="addToWishlist(${product.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Create product item for list view
function createProductListItem(product) {
    const discountPercentage = product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
        : 0;
    
    const item = document.createElement('div');
    item.className = 'product-item-list';
    item.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.discountPrice ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">$${product.discountPrice || product.price}</span>
                ${product.discountPrice ? `<span class="original-price">$${product.price}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">
                    ${generateStarRating(product.rating)}
                </div>
                <span class="rating-count">${product.rating} (${product.reviewCount} reviews)</span>
            </div>
            <div class="stock-status">
                ${product.stock > 0 
                    ? `<span class="in-stock"><i class="fas fa-check-circle"></i> In Stock</span>` 
                    : `<span class="out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>`}
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.discountPrice || product.price}, '${product.image}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-outline" onclick="addToWishlist(${product.id})">
                    <i class="far fa-heart"></i> Add to Wishlist
                </button>
                <button class="btn btn-outline" onclick="quickView(${product.id})">
                    <i class="fas fa-eye"></i> Quick View
                </button>
            </div>
        </div>
    `;
    
    return item;
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Setup event listeners
function setupEventListeners() {
    // View toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            displayProducts(filterProducts());
        });
    });
    
    // Products per page
    if (perPageSelect) {
        perPageSelect.addEventListener('change', (e) => {
            productsPerPage = parseInt(e.target.value);
            currentPage = 1;
            loadProducts();
        });
    }
    
    // Sort by
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            filters.sortBy = e.target.value;
            currentPage = 1;
            loadProducts();
        });
    }
    
    // Clear all filters
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Filter toggle for mobile
    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            filtersContainer.classList.toggle('show');
        });
    }
    
    // Apply filters (mobile)
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            updateFiltersFromUI();
            currentPage = 1;
            loadProducts();
            filtersContainer.classList.remove('show');
        });
    }
    
    // Reset filters (mobile)
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Setup filter listeners
function setupFilterListeners() {
    // Price inputs
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceSliderMin = document.getElementById('price-slider-min');
    const priceSliderMax = document.getElementById('price-slider-max');
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.addEventListener('change', updatePriceFilter);
        maxPriceInput.addEventListener('change', updatePriceFilter);
    }
    
    if (priceSliderMin && priceSliderMax) {
        priceSliderMin.addEventListener('input', updatePriceSlider);
        priceSliderMax.addEventListener('input', updatePriceSlider);
    }
    
    // Category checkboxes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateCategoryFilter);
    });
    
    // Brand checkboxes
    document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateBrandFilter);
    });
    
    // Rating radio buttons
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', updateRatingFilter);
    });
    
    // Availability checkboxes
    document.querySelectorAll('input[name="availability"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateAvailabilityFilter);
    });
    
    // Clear filter buttons
    document.querySelectorAll('.filter-clear').forEach(button => {
        button.addEventListener('click', (e) => {
            const filterType = e.target.dataset.filter;
            clearFilter(filterType);
        });
    });
}

// Update price filter
function updatePriceFilter() {
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (minPriceInput && maxPriceInput) {
        filters.minPrice = parseFloat(minPriceInput.value) || 0;
        filters.maxPrice = parseFloat(maxPriceInput.value) || 1000;
        currentPage = 1;
        loadProducts();
        updateActiveFilters();
    }
}

// Update price slider
function updatePriceSlider() {
    const priceSliderMin = document.getElementById('price-slider-min');
    const priceSliderMax = document.getElementById('price-slider-max');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (priceSliderMin && priceSliderMax && minPriceInput && maxPriceInput) {
        minPriceInput.value = priceSliderMin.value;
        maxPriceInput.value = priceSliderMax.value;
        updatePriceFilter();
    }
}

// Update category filter
function updateCategoryFilter() {
    const selectedCategories = [];
    document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });
    
    filters.categories = selectedCategories;
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
}

// Update brand filter
function updateBrandFilter() {
    const selectedBrands = [];
    document.querySelectorAll('input[name="brand"]:checked').forEach(checkbox => {
        selectedBrands.push(checkbox.value);
    });
    
    filters.brands = selectedBrands;
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
}

// Update rating filter
function updateRatingFilter() {
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    filters.rating = selectedRating ? selectedRating.value : null;
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
}

// Update availability filter
function updateAvailabilityFilter() {
    const selectedAvailability = [];
    document.querySelectorAll('input[name="availability"]:checked').forEach(checkbox => {
        selectedAvailability.push(checkbox.value);
    });
    
    filters.availability = selectedAvailability;
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
}

// Update filters from UI (for mobile)
function updateFiltersFromUI() {
    // Update all filters from UI
    updatePriceFilter();
    updateCategoryFilter();
    updateBrandFilter();
    updateRatingFilter();
    updateAvailabilityFilter();
    
    // Update sort
    if (sortSelect) {
        filters.sortBy = sortSelect.value;
    }
}

// Clear specific filter
function clearFilter(filterType) {
    switch(filterType) {
        case 'price':
            filters.minPrice = 0;
            filters.maxPrice = 1000;
            const minPriceInput = document.getElementById('min-price');
            const maxPriceInput = document.getElementById('max-price');
            const priceSliderMin = document.getElementById('price-slider-min');
            const priceSliderMax = document.getElementById('price-slider-max');
            
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            if (priceSliderMin) priceSliderMin.value = 0;
            if (priceSliderMax) priceSliderMax.value = 1000;
            break;
            
        case 'category':
            filters.categories = [];
            document.querySelectorAll('input[name="category"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            break;
            
        case 'brand':
            filters.brands = [];
            document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            break;
            
        case 'rating':
            filters.rating = null;
            document.querySelectorAll('input[name="rating"]').forEach(radio => {
                radio.checked = false;
            });
            break;
            
        case 'availability':
            filters.availability = [];
            document.querySelectorAll('input[name="availability"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            break;
    }
    
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
}

// Clear all filters
function clearAllFilters() {
    // Reset all filter values
    filters = {
        minPrice: 0,
        maxPrice: 1000,
        categories: [],
        brands: [],
        rating: null,
        availability: [],
        sortBy: 'featured'
    };
    
    // Reset UI elements
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceSliderMin = document.getElementById('price-slider-min');
    const priceSliderMax = document.getElementById('price-slider-max');
    
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';
    if (priceSliderMin) priceSliderMin.value = 0;
    if (priceSliderMax) priceSliderMax.value = 1000;
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    if (sortSelect) {
        sortSelect.value = 'featured';
    }
    
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
    
    if (filtersContainer) {
        filtersContainer.classList.remove('show');
    }
}

// Update active filters display
function updateActiveFilters() {
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    // Price filter
    if (filters.minPrice > 0 || filters.maxPrice < 1000) {
        const filterElement = createActiveFilter('Price', `$${filters.minPrice} - $${filters.maxPrice}`, 'price');
        activeFiltersContainer.appendChild(filterElement);
    }
    
    // Category filters
    filters.categories.forEach(category => {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        const filterElement = createActiveFilter('Category', categoryName, 'category', category);
        activeFiltersContainer.appendChild(filterElement);
    });
    
    // Brand filters
    filters.brands.forEach(brand => {
        const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
        const filterElement = createActiveFilter('Brand', brandName, 'brand', brand);
        activeFiltersContainer.appendChild(filterElement);
    });
    
    // Rating filter
    if (filters.rating) {
        const stars = '★'.repeat(filters.rating) + '☆'.repeat(5 - filters.rating);
        const filterElement = createActiveFilter('Rating', stars, 'rating');
        activeFiltersContainer.appendChild(filterElement);
    }
    
    // Availability filters
    filters.availability.forEach(availability => {
        const availabilityName = availability.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        const filterElement = createActiveFilter('Availability', availabilityName, 'availability', availability);
        activeFiltersContainer.appendChild(filterElement);
    });
}

// Create active filter element
function createActiveFilter(type, value, filterType, filterValue = null) {
    const element = document.createElement('div');
    element.className = 'active-filter';
    element.innerHTML = `
        <span class="filter-type">${type}:</span>
        <span class="filter-value">${value}</span>
        <span class="remove" onclick="removeActiveFilter('${filterType}', '${filterValue}')">
            <i class="fas fa-times"></i>
        </span>
    `;
    return element;
}

// Remove active filter (global function)
window.removeActiveFilter = function(filterType, filterValue) {
    switch(filterType) {
        case 'price':
            clearFilter('price');
            break;
        case 'category':
            filters.categories = filters.categories.filter(cat => cat !== filterValue);
            document.querySelector(`input[name="category"][value="${filterValue}"]`).checked = false;
            break;
        case 'brand':
            filters.brands = filters.brands.filter(brand => brand !== filterValue);
            document.querySelector(`input[name="brand"][value="${filterValue}"]`).checked = false;
            break;
        case 'rating':
            clearFilter('rating');
            break;
        case 'availability':
            filters.availability = filters.availability.filter(avail => avail !== filterValue);
            document.querySelector(`input[name="availability"][value="${filterValue}"]`).checked = false;
            break;
    }
    
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
};

// Setup pagination
function setupPagination() {
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const pagination = document.createElement('ul');
    pagination.className = 'pagination';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></a>`;
    pagination.appendChild(prevLi);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(pageLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></a>`;
    pagination.appendChild(nextLi);
    
    paginationContainer.appendChild(pagination);
}

// Change page (global function)
window.changePage = function(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    loadProducts();
    
    // Scroll to top of products
    const productsView = document.getElementById('products-view');
    if (productsView) {
        productsView.scrollIntoView({ behavior: 'smooth' });
    }
};

// Update results count
function updateResultsCount() {
    if (resultsCount) {
        resultsCount.textContent = totalProducts;
    }
    
    // Update total products in header
    const totalProductsElement = document.getElementById('total-products');
    if (totalProductsElement) {
        totalProductsElement.textContent = totalProducts.toLocaleString() + '+';
    }
}

// Show loading state
function showLoading() {
    if (productsLoading) {
        productsLoading.style.display = 'flex';
    }
    if (productsGrid) {
        productsGrid.style.opacity = '0.5';
    }
    if (productsList) {
        productsList.style.opacity = '0.5';
    }
}

// Hide loading state
function hideLoading() {
    if (productsLoading) {
        productsLoading.style.display = 'none';
    }
    if (productsGrid) {
        productsGrid.style.opacity = '1';
    }
    if (productsList) {
        productsList.style.opacity = '1';
    }
}

// Add to wishlist (global function)
window.addToWishlist = function(productId) {
    const product = window.productsData.find(p => p.id === productId);
    if (product) {
        showNotification(`${product.name} added to wishlist!`);
        // Save to localStorage
        let wishlist = JSON.parse(localStorage.getItem('shopWishlist')) || [];
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem('shopWishlist', JSON.stringify(wishlist));
        }
    }
};

// Quick view modal (global function)
window.quickView = function(productId) {
    const product = window.productsData.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;
    
    const discountPercentage = product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
        : 0;
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeQuickView()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeQuickView()"><i class="fas fa-times"></i></button>
            <div class="quick-view-container">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.discountPrice ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <div class="product-meta">
                        <span class="brand">${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</span>
                        <div class="rating">
                            ${generateStarRating(product.rating)}
                            <span>(${product.reviewCount} reviews)</span>
                        </div>
                    </div>
                    <p class="description">${product.description}</p>
                    <div class="price">
                        <span class="current">$${product.discountPrice || product.price}</span>
                        ${product.discountPrice ? `<span class="original">$${product.price}</span>` : ''}
                    </div>
                    <div class="stock">
                        ${product.stock > 0 
                            ? `<span class="in-stock"><i class="fas fa-check-circle"></i> In Stock (${product.stock} available)</span>` 
                            : `<span class="out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>`}
                    </div>
                    <div class="actions">
                        <div class="quantity-selector">
                            <button class="qty-btn minus" onclick="updateQuantity('minus')"><i class="fas fa-minus"></i></button>
                            <input type="number" class="qty-input" value="1" min="1" max="${product.stock}">
                            <button class="qty-btn plus" onclick="updateQuantity('plus')"><i class="fas fa-plus"></i></button>
                        </div>
                        <button class="btn btn-primary" onclick="addToCartFromQuickView(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline" onclick="addToWishlist(${product.id})">
                            <i class="far fa-heart"></i> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add modal styles if not present
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .quick-view-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
                overflow-y: auto;
            }
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .modal-content {
                position: relative;
                background: white;
                margin: 2rem auto;
                max-width: 900px;
                border-radius: 10px;
                padding: 2rem;
                animation: modalFadeIn 0.3s ease;
            }
            @keyframes modalFadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #666;
                cursor: pointer;
            }
            .quick-view-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }
            .quick-view-image {
                position: relative;
            }
            .quick-view-image img {
                width: 100%;
                height: auto;
                border-radius: 10px;
            }
            .quick-view-details h2 {
                margin-bottom: 1rem;
                color: #333;
            }
            .product-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #eee;
            }
            .brand {
                background: #f0f0f0;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            .rating {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .description {
                margin-bottom: 1.5rem;
                color: #666;
                line-height: 1.6;
            }
            .price {
                margin-bottom: 1.5rem;
            }
            .price .current {
                font-size: 2rem;
                font-weight: 700;
                color: #6a11cb;
            }
            .price .original {
                font-size: 1.2rem;
                color: #999;
                text-decoration: line-through;
                margin-left: 0.5rem;
            }
            .stock {
                margin-bottom: 1.5rem;
                padding: 0.8rem;
                border-radius: 5px;
                background: #f8f9fa;
            }
            .in-stock {
                color: #28a745;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .out-of-stock {
                color: #ff4757;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .actions {
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            .quantity-selector {
                display: flex;
                align-items: center;
                border: 1px solid #ddd;
                border-radius: 5px;
                overflow: hidden;
            }
            .qty-btn {
                width: 40px;
                height: 40px;
                background: none;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .qty-input {
                width: 60px;
                height: 40px;
                border: none;
                text-align: center;
                font-size: 1rem;
                outline: none;
            }
        `;
        document.head.appendChild(styles);
    }
};

// Close quick view (global function)
window.closeQuickView = function() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Update quantity in quick view (global function)
window.updateQuantity = function(action) {
    const qtyInput = document.querySelector('.qty-input');
    if (!qtyInput) return;
    
    let qty = parseInt(qtyInput.value);
    const max = parseInt(qtyInput.max);
    
    if (action === 'plus' && qty < max) {
        qtyInput.value = qty + 1;
    } else if (action === 'minus' && qty > 1) {
        qtyInput.value = qty - 1;
    }
};

// Add to cart from quick view (global function)
window.addToCartFromQuickView = function(productId) {
    const product = window.productsData.find(p => p.id === productId);
    const qtyInput = document.querySelector('.qty-input');
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
    
    if (product) {
        for (let i = 0; i < quantity; i++) {
            window.addToCart(product.id, product.name, product.discountPrice || product.price, product.image);
        }
        closeQuickView();
    }
};

// Show notification (global function from main.js)
function showNotification(message, type = 'success') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback if not in main.js
        alert(message);
    }
}

// Load recently viewed products
function loadRecentlyViewed() {
    const recentProductsContainer = document.getElementById('recent-products');
    if (!recentProductsContainer) return;
    
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    if (recentlyViewed.length === 0) {
        recentProductsContainer.innerHTML = '<p class="text-center">No recently viewed products</p>';
        return;
    }
    
    // Get last 4 recently viewed products
    const recentProductIds = recentlyViewed.slice(-4).reverse();
    
    recentProductsContainer.innerHTML = '';
    
    recentProductIds.forEach(productId => {
        const product = window.productsData.find(p => p.id === productId);
        if (product) {
            const productCard = createProductCard(product);
            productCard.classList.add('recent-product-card');
            recentProductsContainer.appendChild(productCard);
        }
    });
}

// Track product view
function trackProductView(productId) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to end
    recentlyViewed.push(productId);
    
    // Keep only last 10
    if (recentlyViewed.length > 10) {
        recentlyViewed = recentlyViewed.slice(-10);
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('products.html')) {
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = sessionStorage.getItem('searchQuery');
        
        if (searchQuery) {
            // Implement search functionality
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = searchQuery;
                // You can add search filter logic here
            }
            sessionStorage.removeItem('searchQuery');
        }
        
        // Load recently viewed
        loadRecentlyViewed();
    }
});