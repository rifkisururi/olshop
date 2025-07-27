/**
 * Products Page Functionality
 * Handles loading, filtering, sorting, and search for the products catalog
 */

// Global variable to store all products
let allProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    // Load products data
    loadProductsData();
    
    // Initialize all interactive elements
    initFilters();
    initSorting();
    initViewToggle();
    initColorOptions();
    initPriceRange();
    
    // Add event listener for retry button
    document.getElementById('retry-btn').addEventListener('click', function() {
        document.getElementById('error-message').classList.add('d-none');
        document.getElementById('loading-indicator').classList.remove('d-none');
        loadProductsData();
    });
});

/**
 * Load products data
 * Data is embedded directly to avoid CORS issues with local file access
 */
function loadProductsData() {
    try {
        // Show loading indicator
        document.getElementById('loading-indicator').classList.remove('d-none');
        document.getElementById('error-message').classList.add('d-none');
        document.getElementById('product-grid').innerHTML = '';
        
        // Simulate network delay for demo purposes
        setTimeout(() => {
            // Embedded product data
            const productsData = {
                "products": [
                    {
                        "id": "TB-12345",
                        "name": "Elegant Tote Bag",
                        "category": "Bags",
                        "price": 89.99,
                        "old_price": 120.00,
                        "discount": 25,
                        "primary_image": "https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag",
                        "rating": 4.5,
                        "review_count": 128,
                        "description": "This elegant tote bag is crafted from premium leather with meticulous attention to detail. The spacious interior features multiple compartments for organized storage, while the adjustable strap offers versatile carrying options. Perfect for both casual outings and formal occasions.",
                        "material": "Premium Genuine Leather",
                        "dimensions": "30cm x 20cm x 10cm",
                        "weight": 850,
                        "featured": true,
                        "best_seller": false,
                        "status": "In Stock",
                        "images": [
                            "https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag",
                            "https://placehold.co/400x400/pink/white?text=Tote+Bag+1",
                            "https://placehold.co/400x400/pink/white?text=Tote+Bag+2",
                            "https://placehold.co/400x400/pink/white?text=Tote+Bag+3"
                        ],
                        "colors": ["Black", "Brown", "Blue"],
                        "tags": ["Luxury", "Women", "Fashion", "Leather", "Trending"]
                    },
                    {
                        "id": "WL-67890",
                        "name": "Leather Wallet",
                        "category": "Accessories",
                        "price": 45.00,
                        "old_price": 60.00,
                        "discount": 25,
                        "primary_image": "https://placehold.co/400x400/brown/white?text=Leather+Wallet",
                        "rating": 4.2,
                        "review_count": 95,
                        "description": "A sleek and functional leather wallet with multiple card slots and a spacious bill compartment. Made from genuine leather that develops a beautiful patina over time.",
                        "material": "Genuine Leather",
                        "dimensions": "10cm x 8cm x 1cm",
                        "weight": 120,
                        "featured": false,
                        "best_seller": true,
                        "status": "In Stock",
                        "images": [
                            "https://placehold.co/400x400/brown/white?text=Leather+Wallet",
                            "https://placehold.co/400x400/brown/white?text=Wallet+1",
                            "https://placehold.co/400x400/brown/white?text=Wallet+2"
                        ],
                        "colors": ["Black", "Brown"],
                        "tags": ["Accessories", "Men", "Leather", "Gift"]
                    },
                    {
                        "id": "FB-23456",
                        "name": "Fashion Bracelet",
                        "category": "Jewelry",
                        "price": 29.99,
                        "old_price": 39.99,
                        "discount": 25,
                        "primary_image": "https://placehold.co/400x400/gold/white?text=Fashion+Bracelet",
                        "rating": 4.8,
                        "review_count": 72,
                        "description": "An elegant fashion bracelet that adds a touch of sophistication to any outfit. The delicate design features high-quality materials and expert craftsmanship.",
                        "material": "Gold-plated Brass",
                        "dimensions": "18cm circumference",
                        "weight": 30,
                        "featured": false,
                        "best_seller": false,
                        "status": "Low Stock",
                        "images": [
                            "https://placehold.co/400x400/gold/white?text=Fashion+Bracelet",
                            "https://placehold.co/400x400/gold/white?text=Bracelet+1",
                            "https://placehold.co/400x400/gold/white?text=Bracelet+2"
                        ],
                        "colors": ["Gold", "Silver"],
                        "tags": ["Jewelry", "Women", "Fashion", "Gift"]
                    },
                    {
                        "id": "SG-34567",
                        "name": "Stylish Sunglasses",
                        "category": "Accessories",
                        "price": 59.99,
                        "old_price": 79.99,
                        "discount": 25,
                        "primary_image": "https://placehold.co/400x400/black/white?text=Stylish+Sunglasses",
                        "rating": 4.0,
                        "review_count": 56,
                        "description": "Protect your eyes in style with these fashionable sunglasses. Featuring UV protection and a comfortable fit, these sunglasses are perfect for everyday wear.",
                        "material": "Acetate Frame, Polarized Lenses",
                        "dimensions": "14.5cm width",
                        "weight": 25,
                        "featured": false,
                        "best_seller": false,
                        "status": "Out of Stock",
                        "images": [
                            "https://placehold.co/400x400/black/white?text=Stylish+Sunglasses",
                            "https://placehold.co/400x400/black/white?text=Sunglasses+1",
                            "https://placehold.co/400x400/black/white?text=Sunglasses+2"
                        ],
                        "colors": ["Black", "Brown", "Blue"],
                        "tags": ["Accessories", "Eyewear", "Fashion", "Summer"]
                    },
                    {
                        "id": "DW-45678",
                        "name": "Designer Watch",
                        "category": "Watches",
                        "price": 129.99,
                        "old_price": 159.99,
                        "discount": 19,
                        "primary_image": "https://placehold.co/400x400/silver/black?text=Designer+Watch",
                        "rating": 4.7,
                        "review_count": 108,
                        "description": "A sophisticated designer watch that combines style and functionality. With a premium stainless steel band and precise quartz movement, this watch is a perfect accessory for any occasion.",
                        "material": "Stainless Steel, Mineral Glass",
                        "dimensions": "40mm case diameter",
                        "weight": 120,
                        "featured": true,
                        "best_seller": false,
                        "status": "In Stock",
                        "images": [
                            "https://placehold.co/400x400/silver/black?text=Designer+Watch",
                            "https://placehold.co/400x400/silver/black?text=Watch+1",
                            "https://placehold.co/400x400/silver/black?text=Watch+2"
                        ],
                        "colors": ["Silver", "Gold", "Black"],
                        "tags": ["Watches", "Luxury", "Men", "Fashion"]
                    },
                    {
                        "id": "SS-56789",
                        "name": "Silk Scarf",
                        "category": "Accessories",
                        "price": 35.99,
                        "old_price": 45.99,
                        "discount": 22,
                        "primary_image": "https://placehold.co/400x400/purple/white?text=Silk+Scarf",
                        "rating": 4.5,
                        "review_count": 85,
                        "description": "Add a touch of elegance to any outfit with this luxurious silk scarf. The vibrant colors and intricate patterns make it a versatile accessory for all seasons.",
                        "material": "100% Silk",
                        "dimensions": "90cm x 90cm",
                        "weight": 50,
                        "featured": false,
                        "best_seller": true,
                        "status": "In Stock",
                        "images": [
                            "https://placehold.co/400x400/purple/white?text=Silk+Scarf",
                            "https://placehold.co/400x400/purple/white?text=Scarf+1",
                            "https://placehold.co/400x400/purple/white?text=Scarf+2"
                        ],
                        "colors": ["Red", "Blue", "Green", "Purple"],
                        "tags": ["Accessories", "Women", "Fashion", "Gift"]
                    }
                ]
            };
            
            // Store products data globally
            allProducts = productsData.products;
            
            // Render products
            renderProducts(allProducts);
            
            // Hide loading indicator
            document.getElementById('loading-indicator').classList.add('d-none');
            
            // Initialize product actions after products are loaded
            setupProductActions();
        }, 500); // 500ms delay to simulate network request
    } catch (error) {
        console.error('Error loading products data:', error);
        document.getElementById('loading-indicator').classList.add('d-none');
        document.getElementById('error-message').classList.remove('d-none');
        document.getElementById('error-text').textContent = 'Failed to load products data. Please try again later.';
    }
}

/**
 * Render products to the product grid
 * @param {Array} products - Array of product objects
 */
function renderProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    // Update product count using our dedicated function
    updateProductCount(products);
    
    // If no products match filters
    if (products.length === 0) {
        productGrid.innerHTML = '<div class="col-12 text-center py-5"><p>No products match your filters. Try adjusting your criteria.</p></div>';
        return;
    }
    
    // Create product cards
    products.forEach(product => {
        const productCol = document.createElement('div');
        productCol.className = 'col';
        
        // Determine status badge class
        let statusBadgeClass = 'bg-success';
        if (product.status === 'Low Stock') {
            statusBadgeClass = 'bg-warning text-dark';
        } else if (product.status === 'Out of Stock') {
            statusBadgeClass = 'bg-danger';
        }
        
        // Create product card HTML
        productCol.innerHTML = `
            <div class="card product-card h-100">
                <div class="position-relative">
                    <div class="product-img-container">
                        <img src="${product.primary_image}" class="product-img" alt="${product.name}" loading="lazy">
                    </div>
                    <span class="badge ${statusBadgeClass} product-badge">${product.status}</span>
                    ${product.featured ? '<span class="badge bg-primary position-absolute bottom-0 start-0 m-2">Featured</span>' : ''}
                    ${product.best_seller ? '<span class="badge bg-warning text-dark position-absolute bottom-0 start-0 m-2">Best Seller</span>' : ''}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small">${product.category}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <span class="fw-bold">$${product.price.toFixed(2)}</span>
                            ${product.old_price ? `<span class="text-decoration-line-through text-muted ms-2">$${product.old_price.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="me-1">${product.rating.toFixed(1)}</span>
                            <i class="bi bi-star-fill text-warning"></i>
                        </div>
                    </div>
                    <div class="product-colors mb-3">
                        ${product.colors.map(color => `<span style="background-color: ${getColorHex(color)};"></span>`).join('')}
                    </div>
                    <div class="d-grid gap-2">
                        <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm">View Details</a>
                        <div class="btn-group" role="group">
                            <a href="add-product.html?id=${product.id}" class="btn btn-outline-secondary btn-sm">Edit</a>
                            <button class="btn btn-outline-danger btn-sm" data-product-id="${product.id}">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCol);
    });
    
    // Check if we need to apply list view
    const isListView = document.querySelector('.btn-group[role="group"] .btn.active .bi-list') !== null;
    if (isListView) {
        toggleViewMode(true);
    }
}

/**
 * Convert color name to hex code
 * @param {string} colorName - Name of the color
 * @returns {string} - Hex code for the color
 */
function getColorHex(colorName) {
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Yellow': '#FFFF00',
        'Green': '#008000',
        'Pink': '#FFC0CB',
        'Brown': '#A52A2A',
        'Gold': '#FFD700',
        'Silver': '#C0C0C0',
        'Purple': '#800080'
    };
    
    return colorMap[colorName] || '#CCCCCC';
}

/**
 * Initialize filter functionality
 */
function initFilters() {
    // Get filter elements
    const searchInput = document.getElementById('searchInput');
    const categoryCheckboxes = document.querySelectorAll('input[id^="category"]');
    const colorOptions = document.querySelectorAll('.color-option');
    const ratingOptions = document.querySelectorAll('input[name="ratingFilter"]');
    const statusFilter = document.getElementById('statusFilter');
    const featuredFilter = document.getElementById('featuredFilter');
    const bestSellerFilter = document.getElementById('bestSellerFilter');
    
    // Apply filters button
    const applyFiltersBtn = document.querySelector('.btn-primary');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    // Reset filters button
    const resetFiltersBtn = document.querySelector('.btn-outline-secondary');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
    
    // Search input - filter as you type
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Debounce search to avoid too many filter operations
            clearTimeout(searchInput.timer);
            searchInput.timer = setTimeout(function() {
                applyFilters();
            }, 300);
        });
    }
    
    // Category checkboxes
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            applyFilters();
        });
    });
    
    // Color options
    colorOptions.forEach(colorOption => {
        colorOption.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });
    
    // Rating options
    ratingOptions.forEach(radio => {
        radio.addEventListener('change', function() {
            applyFilters();
        });
    });
    
    // Status filter
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Featured and Best Seller filters
    if (featuredFilter) {
        featuredFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    if (bestSellerFilter) {
        bestSellerFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
}

/**
 * Apply all selected filters to product list
 */
function applyFilters() {
    // Get all filter values
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('input[id^="category"]:checked')).map(cb => cb.value);
    const selectedColors = Array.from(document.querySelectorAll('.color-option.active')).map(color => color.getAttribute('data-color'));
    const minRating = parseFloat(document.querySelector('input[name="ratingFilter"]:checked').value);
    const status = document.getElementById('statusFilter').value;
    const isFeatured = document.getElementById('featuredFilter').checked;
    const isBestSeller = document.getElementById('bestSellerFilter').checked;
    const maxPrice = parseFloat(document.getElementById('priceRange').value);
    
    // Filter products from the global allProducts array
    const filteredProducts = allProducts.filter(product => {
        // Apply search filter
        if (searchTerm &&
            !product.name.toLowerCase().includes(searchTerm) &&
            !product.category.toLowerCase().includes(searchTerm) &&
            !product.description.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Apply category filter
        if (selectedCategories.length > 0 &&
            !selectedCategories.some(cat => product.category.toLowerCase().includes(cat.toLowerCase()))) {
            return false;
        }
        
        // Apply color filter
        if (selectedColors.length > 0 &&
            !selectedColors.some(color => product.colors.includes(color))) {
            return false;
        }
        
        // Apply rating filter
        if (product.rating < minRating) {
            return false;
        }
        
        // Apply price filter
        if (product.price > maxPrice) {
            return false;
        }
        
        // Apply status filter
        if (status !== 'all') {
            if (status === 'in-stock' && product.status !== 'In Stock') {
                return false;
            } else if (status === 'low-stock' && product.status !== 'Low Stock') {
                return false;
            } else if (status === 'out-of-stock' && product.status !== 'Out of Stock') {
                return false;
            }
        }
        
        // Apply featured filter
        if (isFeatured && !product.featured) {
            return false;
        }
        
        // Apply best seller filter
        if (isBestSeller && !product.best_seller) {
            return false;
        }
        
        // Product passed all filters
        return true;
    });
    
    // Render filtered products
    renderProducts(filteredProducts);
}

/**
 * Reset all filters to default values
 */
function resetFilters() {
    // Reset search
    document.getElementById('searchInput').value = '';
    
    // Reset categories
    document.querySelectorAll('input[id^="category"]').forEach(cb => {
        cb.checked = true;
    });
    
    // Reset colors
    document.querySelectorAll('.color-option').forEach(color => {
        color.classList.remove('active');
    });
    
    // Reset rating
    document.getElementById('rating4').checked = true;
    
    // Reset price range
    const priceRange = document.getElementById('priceRange');
    priceRange.value = priceRange.max;
    document.getElementById('priceMax').textContent = '$' + priceRange.max;
    
    // Reset status
    document.getElementById('statusFilter').value = 'all';
    
    // Reset featured and best seller
    document.getElementById('featuredFilter').checked = false;
    document.getElementById('bestSellerFilter').checked = false;
    
    // Render all products
    renderProducts(allProducts);
}

/**
 * Initialize sorting functionality
 */
function initSorting() {
    const sortSelect = document.getElementById('sortOptions');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

/**
 * Sort products based on selected option
 */
function sortProducts(sortOption) {
    // Get currently visible products (either all products or filtered products)
    const visibleProducts = [...document.querySelectorAll('.product-card')].map(card => {
        const productId = card.querySelector('[data-product-id]').getAttribute('data-product-id');
        return allProducts.find(p => p.id.toString() === productId);
    }).filter(p => p); // Filter out any undefined products
    
    // Sort the products array based on the selected option
    visibleProducts.sort((a, b) => {
        if (sortOption === 'price-low-high') {
            return a.price - b.price;
        }
        else if (sortOption === 'price-high-low') {
            return b.price - a.price;
        }
        else if (sortOption === 'rating') {
            return b.rating - a.rating;
        }
        else if (sortOption === 'best-selling') {
            return (b.best_seller ? 1 : 0) - (a.best_seller ? 1 : 0);
        }
        else {
            // Default: newest (no actual date in our demo, so just use the original order)
            return allProducts.indexOf(a) - allProducts.indexOf(b);
        }
    });
    
    // Re-render the sorted products
    renderProducts(visibleProducts);
}

/**
 * Initialize view toggle (grid/list)
 */
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.btn-group[role="group"] .btn');
    if (viewButtons.length) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Toggle view mode
                const isList = this.querySelector('.bi-list') !== null;
                toggleViewMode(isList);
            });
        });
    }
}

/**
 * Toggle between grid and list view
 */
function toggleViewMode(isList) {
    const productGrid = document.querySelector('.row.row-cols-1.row-cols-sm-2');
    
    if (isList) {
        productGrid.classList.remove('row-cols-sm-2', 'row-cols-lg-3');
        productGrid.classList.add('row-cols-1');
        
        // Adjust card layout for list view
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.add('flex-row');
            const imgContainer = card.querySelector('.product-img-container');
            if (imgContainer) {
                imgContainer.style.width = '150px';
                imgContainer.style.height = '150px';
                imgContainer.style.paddingTop = '0';
            }
        });
    } else {
        productGrid.classList.add('row-cols-sm-2', 'row-cols-lg-3');
        
        // Reset card layout for grid view
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('flex-row');
            const imgContainer = card.querySelector('.product-img-container');
            if (imgContainer) {
                imgContainer.style.width = '';
                imgContainer.style.height = '';
                imgContainer.style.paddingTop = '100%';
            }
        });
    }
}

/**
 * Initialize color option selection
 */
function initColorOptions() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

/**
 * Initialize price range slider
 */
function initPriceRange() {
    const priceRange = document.getElementById('priceRange');
    const priceMax = document.getElementById('priceMax');
    
    if (priceRange && priceMax) {
        priceRange.addEventListener('input', function() {
            priceMax.textContent = '$' + this.value;
        });
    }
}

/**
 * Update product count display
 * @param {Array} filteredProducts - Optional array of filtered products
 */
function updateProductCount(filteredProducts) {
    const totalCount = allProducts.length;
    const shownCount = filteredProducts ? filteredProducts.length : totalCount;
    
    const countDisplay = document.querySelector('.text-muted');
    if (countDisplay) {
        if (shownCount === 0) {
            countDisplay.textContent = `No products match your filters (${totalCount} total products)`;
        } else {
            countDisplay.textContent = `Showing 1-${shownCount} of ${totalCount} products`;
        }
    }
}

/**
 * Setup product action buttons (view, edit, delete)
 */
function setupProductActions() {
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-outline-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            
            if (confirm('Are you sure you want to delete this product?')) {
                // In a real app, this would send a delete request to the server
                // For demo, just remove the product from the array
                const productIndex = allProducts.findIndex(p => p.id.toString() === productId);
                
                if (productIndex !== -1) {
                    // Remove product from array
                    allProducts.splice(productIndex, 1);
                    
                    // Re-render products
                    renderProducts(allProducts);
                    
                    // In a real app, you would also update the server
                    console.log(`Product ${productId} deleted successfully`);
                }
            }
        });
    });
}