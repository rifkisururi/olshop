document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showError('No product ID specified. Please select a product from the catalog.');
        return;
    }
    
    // Load product data
    loadProductData(productId);
    
    // Add event listener for retry button
    document.getElementById('retry-btn').addEventListener('click', function() {
        document.getElementById('error-message').classList.add('d-none');
        document.getElementById('loading-indicator').classList.remove('d-none');
        loadProductData(productId);
    });
});

/**
 * Load product data
 * @param {string} productId - The ID of the product to load
 */
function loadProductData(productId) {
    try {
        // Product data embedded directly to avoid CORS issues with file:// protocol
        const data = {
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
                    "tags": ["Luxury", "Women", "Fashion", "Leather", "Trending"],
                    "features": [
                        "Adjustable shoulder strap",
                        "Multiple interior compartments",
                        "Premium metal hardware",
                        "Secure zipper closure",
                        "Dust bag included"
                    ],
                    "performance": {
                        "views": 1245,
                        "orders": 86,
                        "revenue": 7739,
                        "conversion": 6.9
                    }
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
                    "tags": ["Accessories", "Men", "Leather", "Gift"],
                    "features": [
                        "Multiple card slots",
                        "Bill compartment",
                        "ID window",
                        "Compact design"
                    ],
                    "performance": {
                        "views": 980,
                        "orders": 65,
                        "revenue": 2925,
                        "conversion": 6.6
                    }
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
                    "tags": ["Jewelry", "Women", "Fashion", "Gift"],
                    "features": [
                        "Adjustable size",
                        "Hypoallergenic materials",
                        "Tarnish-resistant finish",
                        "Gift box included"
                    ],
                    "performance": {
                        "views": 850,
                        "orders": 48,
                        "revenue": 1439,
                        "conversion": 5.6
                    }
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
                    "tags": ["Accessories", "Eyewear", "Fashion", "Summer"],
                    "features": [
                        "UV400 protection",
                        "Polarized lenses",
                        "Durable frame",
                        "Protective case included"
                    ],
                    "performance": {
                        "views": 720,
                        "orders": 32,
                        "revenue": 1920,
                        "conversion": 4.4
                    }
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
                    "tags": ["Watches", "Luxury", "Men", "Fashion"],
                    "features": [
                        "Japanese quartz movement",
                        "Water-resistant (30m)",
                        "Stainless steel band",
                        "Date display",
                        "2-year warranty"
                    ],
                    "performance": {
                        "views": 950,
                        "orders": 62,
                        "revenue": 8059,
                        "conversion": 6.5
                    }
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
                    "tags": ["Accessories", "Women", "Fashion", "Gift"],
                    "features": [
                        "100% natural silk",
                        "Hand-rolled edges",
                        "Vibrant colors",
                        "Gift box included"
                    ],
                    "performance": {
                        "views": 820,
                        "orders": 58,
                        "revenue": 2087,
                        "conversion": 7.1
                    }
                }
            ]
        };
        
        const product = data.products.find(p => p.id === productId);
        
        if (!product) {
            showError(`Product with ID "${productId}" not found.`);
            return;
        }
        
        // Hide loading indicator and show product container
        document.getElementById('loading-indicator').classList.add('d-none');
        document.getElementById('product-container').classList.remove('d-none');
        
        // Populate product details
        populateProductDetails(product);
        
        // Create performance chart
        createPerformanceChart(product);
        
        // Load related products (excluding current product)
        const relatedProducts = data.products
            .filter(p => p.id !== productId && (p.category === product.category || p.tags.some(tag => product.tags.includes(tag))))
            .slice(0, 4); // Limit to 4 related products
        
        populateRelatedProducts(relatedProducts);
        
    } catch (error) {
        console.error('Error loading product data:', error);
        showError('Failed to load product data. Please try again later.');
    }
}

/**
 * Show error message
 * @param {string} message - The error message to display
 */
function showError(message) {
    document.getElementById('loading-indicator').classList.add('d-none');
    const errorElement = document.getElementById('error-message');
    document.getElementById('error-text').textContent = message;
    errorElement.classList.remove('d-none');
    
    // Add event listener to retry button
    document.getElementById('retry-btn').addEventListener('click', function() {
        location.reload();
    });
}

/**
 * Populate product details in the UI
 * @param {Object} product - The product data object
 */
function populateProductDetails(product) {
    // Update page title
    document.title = `${product.name} - Jim's Honey Admin`;
    
    // Update breadcrumb
    document.getElementById('product-breadcrumb').textContent = product.name;
    
    // Set edit product button link
    document.getElementById('edit-product-btn').href = `add-product.html?id=${product.id}`;
    
    // Basic information
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-id').textContent = `Product ID: ${product.id}`;
    document.getElementById('product-category').textContent = `Category: ${product.category}`;
    
    // Price information
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    if (product.old_price) {
        document.getElementById('product-old-price').textContent = `$${product.old_price.toFixed(2)}`;
    }
    if (product.discount) {
        document.getElementById('product-discount').textContent = `-${product.discount}%`;
    }
    
    // Rating and reviews
    if (product.rating) {
        document.getElementById('product-rating').textContent = product.rating.toFixed(1);
        
        // Create rating stars
        const ratingStars = document.getElementById('rating-stars');
        ratingStars.innerHTML = '';
        
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            if (i < fullStars) {
                star.className = 'bi bi-star-fill text-warning';
            } else if (i === fullStars && hasHalfStar) {
                star.className = 'bi bi-star-half text-warning';
            } else {
                star.className = 'bi bi-star text-warning';
            }
            ratingStars.appendChild(star);
        }
        
        document.getElementById('review-count').textContent = `(${product.review_count} reviews)`;
    }
    
    // Product images
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = product.primary_image;
    mainImage.alt = product.name;
    
    // Thumbnails
    const thumbnailsContainer = document.getElementById('product-thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'product-thumbnail m-1';
        thumbnail.innerHTML = `<img src="${image}" alt="${product.name} ${index + 1}" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;">`;
        
        // Add click event to change main image
        thumbnail.addEventListener('click', function() {
            mainImage.src = image;
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Product status badge
    const statusBadge = document.getElementById('product-status-badge');
    statusBadge.textContent = product.status;
    
    if (product.status === 'In Stock') {
        statusBadge.className = 'badge bg-success position-absolute top-0 end-0 m-3';
    } else if (product.status === 'Low Stock') {
        statusBadge.className = 'badge bg-warning text-dark position-absolute top-0 end-0 m-3';
    } else if (product.status === 'Out of Stock') {
        statusBadge.className = 'badge bg-danger position-absolute top-0 end-0 m-3';
    }
    
    // Featured and bestseller badges
    if (product.featured) {
        document.getElementById('featured-badge').classList.remove('d-none');
        document.getElementById('featuredToggle').checked = true;
    }
    
    if (product.best_seller) {
        document.getElementById('bestseller-badge').classList.remove('d-none');
        document.getElementById('bestSellerToggle').checked = true;
    }
    
    // Colors
    const colorsContainer = document.getElementById('product-colors');
    colorsContainer.innerHTML = '';
    
    product.colors.forEach(color => {
        const colorBadge = document.createElement('span');
        colorBadge.className = 'badge rounded-pill me-1';
        colorBadge.style.backgroundColor = color.toLowerCase();
        colorBadge.style.color = isColorDark(color.toLowerCase()) ? 'white' : 'black';
        colorBadge.textContent = color;
        colorsContainer.appendChild(colorBadge);
    });
    
    // Tags
    const tagsContainer = document.getElementById('product-tags');
    tagsContainer.innerHTML = '';
    
    product.tags.forEach(tag => {
        const tagBadge = document.createElement('span');
        tagBadge.className = 'badge bg-secondary me-1';
        tagBadge.textContent = tag;
        tagsContainer.appendChild(tagBadge);
    });
    
    // Description and details
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-material').textContent = product.material;
    document.getElementById('product-dimensions').textContent = product.dimensions;
    document.getElementById('product-weight').textContent = `${product.weight}g`;
    document.getElementById('product-status').textContent = product.status;
    
    // Features
    const featuresContainer = document.getElementById('product-features');
    featuresContainer.innerHTML = '';
    
    product.features.forEach(feature => {
        const featureItem = document.createElement('li');
        featureItem.className = 'list-group-item';
        featureItem.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2"></i>${feature}`;
        featuresContainer.appendChild(featureItem);
    });
    
    // Performance metrics
    if (product.performance) {
        document.getElementById('performance-views').textContent = product.performance.views.toLocaleString();
        document.getElementById('performance-orders').textContent = product.performance.orders.toLocaleString();
        document.getElementById('performance-revenue').textContent = `$${product.performance.revenue.toLocaleString()}`;
        document.getElementById('performance-conversion').textContent = `${product.performance.conversion}%`;
    }
    
    // Add event listeners for toggle switches
    document.getElementById('featuredToggle').addEventListener('change', function(e) {
        const featured = e.target.checked;
        document.getElementById('featured-badge').classList.toggle('d-none', !featured);
        // In a real application, you would save this change to the server
        console.log(`Product ${product.id} featured status changed to: ${featured}`);
    });
    
    document.getElementById('bestSellerToggle').addEventListener('change', function(e) {
        const bestSeller = e.target.checked;
        document.getElementById('bestseller-badge').classList.toggle('d-none', !bestSeller);
        // In a real application, you would save this change to the server
        console.log(`Product ${product.id} best seller status changed to: ${bestSeller}`);
    });
}

/**
 * Create performance chart using Chart.js
 * @param {Object} product - The product data object
 */
function createPerformanceChart(product) {
    if (!product.performance) return;
    
    const ctx = document.getElementById('productPerformanceChart').getContext('2d');
    
    // Sample data for the last 7 days
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
    
    // Generate some random data based on the current performance
    const viewsData = generateRandomData(product.performance.views, 7);
    const ordersData = generateRandomData(product.performance.orders, 7);
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Views',
                    data: viewsData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Orders',
                    data: ordersData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Populate related products section
 * @param {Array} products - Array of related product objects
 */
function populateRelatedProducts(products) {
    const container = document.getElementById('related-products');
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-3">No related products found.</div>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col';
        
        productCard.innerHTML = `
            <div class="card h-100">
                <div class="position-relative">
                    <img src="${product.primary_image}" class="card-img-top" alt="${product.name}" style="height: 180px; object-fit: cover;">
                    ${product.status === 'Out of Stock' ? '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Out of Stock</span>' : ''}
                    ${product.featured ? '<span class="badge bg-primary position-absolute top-0 start-0 m-2">Featured</span>' : ''}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.category}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="fw-bold text-primary">$${product.price.toFixed(2)}</span>
                            ${product.old_price ? `<span class="text-decoration-line-through text-muted ms-1">$${product.old_price.toFixed(2)}</span>` : ''}
                        </div>
                        <a href="product.html?id=${product.id}" class="btn btn-sm btn-outline-primary">View</a>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

/**
 * Generate random data for chart
 * @param {number} baseValue - The base value to generate data around
 * @param {number} count - Number of data points to generate
 * @returns {Array} Array of random data points
 */
function generateRandomData(baseValue, count) {
    const data = [];
    const variance = baseValue * 0.2; // 20% variance
    
    for (let i = 0; i < count; i++) {
        const randomVariance = Math.random() * variance - (variance / 2);
        const value = Math.max(0, Math.round(baseValue + randomVariance));
        data.push(value);
    }
    
    return data;
}

/**
 * Check if a color is dark (to determine text color)
 * @param {string} color - The color to check
 * @returns {boolean} True if the color is dark
 */
function isColorDark(color) {
    // Simple color darkness detection for common colors
    const darkColors = ['black', 'navy', 'blue', 'darkblue', 'purple', 'darkpurple', 'brown', 'darkbrown', 'green', 'darkgreen'];
    return darkColors.includes(color.toLowerCase());
}