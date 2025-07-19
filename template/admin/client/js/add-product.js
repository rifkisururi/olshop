/**
 * Add Product Page Functionality
 * Handles form validation, image uploads, and performance preview
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initFormValidation();
    initImageUpload();
    initColorTagFeatureManagement();
    initPriceCalculation();
    initPerformancePreviewChart();
    initProductIdGenerator();
});

/**
 * Initialize form validation
 */
function initFormValidation() {
    const form = document.getElementById('addProductForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Check if form is valid
            if (!form.checkValidity()) {
                event.stopPropagation();
                // Add Bootstrap's was-validated class to show validation feedback
                form.classList.add('was-validated');
                return;
            }
            
            // Collect form data
            const formData = collectFormData();
            
            // In a real app, this would send the data to the server
            // For demo, just show a success message
            showSuccessMessage(formData);
        });
    }
}

/**
 * Collect all form data into a structured object
 */
function collectFormData() {
    const formData = {
        id: document.getElementById('productId').value,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        oldPrice: parseFloat(document.getElementById('productOldPrice').value) || 0,
        discount: parseInt(document.getElementById('productDiscount').value) || 0,
        material: document.getElementById('productMaterial').value,
        dimensions: document.getElementById('productDimensions').value,
        weight: parseInt(document.getElementById('productWeight').value) || 0,
        rating: parseFloat(document.getElementById('productRating').value) || 0,
        reviewCount: parseInt(document.getElementById('productReviewCount').value) || 0,
        primaryImage: document.getElementById('primaryImage').files[0] ? document.getElementById('primaryImage').files[0].name : '',
        featured: document.getElementById('featuredToggle').checked,
        bestSeller: document.getElementById('bestSellerToggle').checked,
        stockStatus: document.getElementById('stockStatus').value,
        colors: [],
        tags: [],
        features: []
    };
    
    // Collect colors
    document.querySelectorAll('#colorContainer .color-badge').forEach(colorBadge => {
        formData.colors.push(colorBadge.getAttribute('data-color'));
    });
    
    // Collect tags
    document.querySelectorAll('#tagContainer .badge').forEach(tagBadge => {
        formData.tags.push(tagBadge.textContent.replace(/×/g, '').trim());
    });
    
    // Collect features
    document.querySelectorAll('#featureContainer .feature-item span').forEach(featureItem => {
        formData.features.push(featureItem.textContent);
    });
    
    // Collect gallery images
    formData.galleryImages = [];
    if (document.getElementById('galleryImages').files.length) {
        for (let i = 0; i < document.getElementById('galleryImages').files.length; i++) {
            formData.galleryImages.push(document.getElementById('galleryImages').files[i].name);
        }
    }
    
    return formData;
}

/**
 * Show success message after form submission
 */
function showSuccessMessage(formData) {
    // Create a success alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <strong>Success!</strong> Product "${formData.name}" has been added.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insert alert before the form
    const form = document.getElementById('addProductForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    // Reset form
    form.reset();
    form.classList.remove('was-validated');
    
    // Clear dynamic elements
    document.getElementById('colorContainer').innerHTML = '';
    document.getElementById('tagContainer').innerHTML = '';
    document.getElementById('featureContainer').innerHTML = '';
    document.getElementById('imagePreviewContainer').innerHTML = '';
    
    // Auto-dismiss alert after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
    
    // Generate new product ID
    generateProductId();
}

/**
 * Initialize image upload functionality
 */
function initImageUpload() {
    // Primary image preview
    const primaryImageInput = document.getElementById('primaryImage');
    if (primaryImageInput) {
        primaryImageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Create preview element
                    const previewContainer = document.getElementById('imagePreviewContainer');
                    previewContainer.innerHTML = '';
                    
                    const previewCol = document.createElement('div');
                    previewCol.className = 'col-md-3 col-sm-4 col-6 mb-3';
                    
                    const previewCard = document.createElement('div');
                    previewCard.className = 'card h-100';
                    
                    const previewImg = document.createElement('img');
                    previewImg.src = e.target.result;
                    previewImg.className = 'card-img-top';
                    previewImg.alt = 'Primary Image';
                    
                    const cardBody = document.createElement('div');
                    cardBody.className = 'card-body p-2';
                    
                    const cardText = document.createElement('p');
                    cardText.className = 'card-text small text-center mb-0';
                    cardText.textContent = 'Primary Image';
                    
                    cardBody.appendChild(cardText);
                    previewCard.appendChild(previewImg);
                    previewCard.appendChild(cardBody);
                    previewCol.appendChild(previewCard);
                    previewContainer.appendChild(previewCol);
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Gallery images preview
    const galleryImagesInput = document.getElementById('galleryImages');
    if (galleryImagesInput) {
        galleryImagesInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                const previewContainer = document.getElementById('imagePreviewContainer');
                
                // Keep primary image if it exists
                const primaryPreview = previewContainer.querySelector('.col-md-3:first-child');
                if (primaryPreview && primaryPreview.querySelector('.card-text').textContent === 'Primary Image') {
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(primaryPreview);
                } else {
                    previewContainer.innerHTML = '';
                }
                
                // Add gallery images
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const previewCol = document.createElement('div');
                        previewCol.className = 'col-md-3 col-sm-4 col-6 mb-3';
                        
                        const previewCard = document.createElement('div');
                        previewCard.className = 'card h-100';
                        
                        const previewImg = document.createElement('img');
                        previewImg.src = e.target.result;
                        previewImg.className = 'card-img-top';
                        previewImg.alt = 'Gallery Image ' + (i + 1);
                        
                        const cardBody = document.createElement('div');
                        cardBody.className = 'card-body p-2';
                        
                        const cardText = document.createElement('p');
                        cardText.className = 'card-text small text-center mb-0';
                        cardText.textContent = 'Gallery Image ' + (i + 1);
                        
                        cardBody.appendChild(cardText);
                        previewCard.appendChild(previewImg);
                        previewCard.appendChild(cardBody);
                        previewCol.appendChild(previewCard);
                        previewContainer.appendChild(previewCol);
                    };
                    
                    reader.readAsDataURL(file);
                }
            }
        });
    }
    
    // Dropzone functionality
    const dropzone = document.getElementById('imageDropzone');
    if (dropzone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight dropzone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, highlight, false);
        });
        
        // Remove highlight when item is dragged out or dropped
        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        dropzone.addEventListener('drop', handleDrop, false);
        
        // Handle click to browse
        dropzone.addEventListener('click', function() {
            document.getElementById('galleryImages').click();
        });
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropzone.classList.add('border-primary');
    }
    
    function unhighlight() {
        dropzone.classList.remove('border-primary');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        // Update the file input with the dropped files
        if (files.length > 0) {
            // Create a new DataTransfer object
            const dataTransfer = new DataTransfer();
            
            // Add the dropped files
            for (let i = 0; i < files.length; i++) {
                dataTransfer.items.add(files[i]);
            }
            
            // Set the files to the input
            document.getElementById('galleryImages').files = dataTransfer.files;
            
            // Trigger change event to update preview
            const event = new Event('change');
            document.getElementById('galleryImages').dispatchEvent(event);
        }
    }
}

/**
 * Initialize color, tag, and feature management
 */
function initColorTagFeatureManagement() {
    // Color management
    const addColorBtn = document.getElementById('addColorBtn');
    const colorInput = document.getElementById('colorInput');
    const colorContainer = document.getElementById('colorContainer');
    
    if (addColorBtn && colorInput && colorContainer) {
        // Add color when button is clicked
        addColorBtn.addEventListener('click', function() {
            addColor(colorInput.value);
        });
        
        // Add color when Enter key is pressed
        colorInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addColor(this.value);
            }
        });
        
        // Remove color when close button is clicked
        colorContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-close')) {
                e.target.closest('.color-badge').remove();
            }
        });
    }
    
    // Tag management
    const addTagBtn = document.getElementById('addTagBtn');
    const tagInput = document.getElementById('tagInput');
    const tagContainer = document.getElementById('tagContainer');
    
    if (addTagBtn && tagInput && tagContainer) {
        // Add tag when button is clicked
        addTagBtn.addEventListener('click', function() {
            addTag(tagInput.value);
        });
        
        // Add tag when Enter key is pressed
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag(this.value);
            }
        });
        
        // Remove tag when close button is clicked
        tagContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-close')) {
                e.target.closest('.badge').remove();
            }
        });
    }
    
    // Feature management
    const addFeatureBtn = document.getElementById('addFeatureBtn');
    const featureInput = document.getElementById('featureInput');
    const featureContainer = document.getElementById('featureContainer');
    
    if (addFeatureBtn && featureInput && featureContainer) {
        // Add feature when button is clicked
        addFeatureBtn.addEventListener('click', function() {
            addFeature(featureInput.value);
        });
        
        // Add feature when Enter key is pressed
        featureInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addFeature(this.value);
            }
        });
        
        // Remove feature when close button is clicked
        featureContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-close')) {
                e.target.closest('.feature-item').remove();
            }
        });
    }
    
    // Helper functions
    function addColor(colorName) {
        if (!colorName.trim()) return;
        
        // Get color hex code (simplified)
        let colorHex = '#000000';
        const colorMap = {
            'black': '#000000',
            'white': '#FFFFFF',
            'red': '#FF0000',
            'blue': '#0000FF',
            'green': '#008000',
            'yellow': '#FFFF00',
            'purple': '#800080',
            'pink': '#FFC0CB',
            'orange': '#FFA500',
            'brown': '#A52A2A',
            'gray': '#808080',
            'silver': '#C0C0C0',
            'gold': '#FFD700'
        };
        
        const lowerColorName = colorName.toLowerCase();
        if (colorMap[lowerColorName]) {
            colorHex = colorMap[lowerColorName];
        }
        
        // Create color badge
        const colorBadge = document.createElement('div');
        colorBadge.className = 'color-badge me-2 mb-2';
        colorBadge.setAttribute('data-color', colorName);
        colorBadge.innerHTML = `
            <span class="color-dot" style="background-color: ${colorHex};"></span>
            <span class="color-name">${colorName}</span>
            <button type="button" class="btn-close btn-close-white"></button>
        `;
        
        // Add to container
        colorContainer.appendChild(colorBadge);
        
        // Clear input
        colorInput.value = '';
        colorInput.focus();
    }
    
    function addTag(tagName) {
        if (!tagName.trim()) return;
        
        // Create tag badge
        const tagBadge = document.createElement('span');
        tagBadge.className = 'badge bg-secondary me-1 mb-1';
        tagBadge.innerHTML = `${tagName}<button type="button" class="btn-close btn-close-white ms-1"></button>`;
        
        // Add to container
        tagContainer.appendChild(tagBadge);
        
        // Clear input
        tagInput.value = '';
        tagInput.focus();
    }
    
    function addFeature(featureText) {
        if (!featureText.trim()) return;
        
        // Create feature item
        const featureItem = document.createElement('div');
        featureItem.className = 'feature-item d-flex align-items-center mb-2';
        featureItem.innerHTML = `
            <i class="bi bi-check-circle-fill text-success me-2"></i>
            <span>${featureText}</span>
            <button type="button" class="btn-close ms-auto"></button>
        `;
        
        // Add to container
        featureContainer.appendChild(featureItem);
        
        // Clear input
        featureInput.value = '';
        featureInput.focus();
    }
}

/**
 * Initialize price calculation
 */
function initPriceCalculation() {
    const priceInput = document.getElementById('productPrice');
    const oldPriceInput = document.getElementById('productOldPrice');
    const discountInput = document.getElementById('productDiscount');
    
    if (priceInput && oldPriceInput && discountInput) {
        // Calculate discount when price and old price change
        [priceInput, oldPriceInput].forEach(input => {
            input.addEventListener('input', function() {
                calculateDiscount();
            });
        });
        
        // Calculate old price when price and discount change
        discountInput.addEventListener('input', function() {
            calculateOldPrice();
        });
    }
    
    function calculateDiscount() {
        const price = parseFloat(priceInput.value) || 0;
        const oldPrice = parseFloat(oldPriceInput.value) || 0;
        
        if (price > 0 && oldPrice > price) {
            const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
            discountInput.value = discount;
        }
    }
    
    function calculateOldPrice() {
        const price = parseFloat(priceInput.value) || 0;
        const discount = parseInt(discountInput.value) || 0;
        
        if (price > 0 && discount > 0 && discount < 100) {
            const oldPrice = Math.round(price / (1 - discount / 100));
            oldPriceInput.value = oldPrice;
        }
    }
}

/**
 * Initialize performance preview chart
 */
function initPerformancePreviewChart() {
    const ctx = document.getElementById('performancePreviewChart');
    if (!ctx) return;
    
    // Sample data for performance preview chart
    const performanceData = {
        labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
        datasets: [
            {
                label: 'Estimated Views',
                data: [800, 900, 950, 1000, 1100, 1200],
                borderColor: 'rgba(13, 110, 253, 1)',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Estimated Orders',
                data: [40, 45, 48, 50, 55, 60],
                borderColor: 'rgba(25, 135, 84, 1)',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    };
    
    // Chart configuration
    const performanceChart = new Chart(ctx, {
        type: 'line',
        data: performanceData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time Period'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
    
    // Update chart when category changes
    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            updatePerformanceChart(performanceChart, this.value);
        });
    }
    
    // Update chart on theme change
    document.addEventListener('themeChanged', function() {
        updateChartTheme(performanceChart);
    });
}

/**
 * Update performance chart based on selected category
 */
function updatePerformanceChart(chart, category) {
    // Different performance data for different categories
    const categoryData = {
        'Bags': {
            views: [800, 900, 950, 1000, 1100, 1200],
            orders: [40, 45, 48, 50, 55, 60]
        },
        'Accessories': {
            views: [1000, 1100, 1150, 1200, 1250, 1300],
            orders: [50, 55, 58, 60, 63, 65]
        },
        'Jewelry': {
            views: [600, 650, 700, 750, 800, 850],
            orders: [30, 33, 35, 38, 40, 42]
        },
        'Watches': {
            views: [400, 450, 500, 550, 600, 650],
            orders: [20, 22, 25, 28, 30, 32]
        },
        'Clothing': {
            views: [1200, 1300, 1400, 1500, 1600, 1700],
            orders: [60, 65, 70, 75, 80, 85]
        }
    };
    
    // Default data if category not found
    const defaultData = {
        views: [800, 900, 950, 1000, 1100, 1200],
        orders: [40, 45, 48, 50, 55, 60]
    };
    
    // Get data for selected category or use default
    const data = categoryData[category] || defaultData;
    
    // Update chart data
    chart.data.datasets[0].data = data.views;
    chart.data.datasets[1].data = data.orders;
    chart.update();
    
    // Update estimated metrics
    updateEstimatedMetrics(data);
}

/**
 * Update estimated metrics based on chart data
 */
function updateEstimatedMetrics(data) {
    // Calculate average values
    const avgViews = Math.round(data.views.reduce((a, b) => a + b, 0) / data.views.length);
    const avgOrders = Math.round(data.orders.reduce((a, b) => a + b, 0) / data.orders.length);
    
    // Calculate ranges (±20%)
    const viewsMin = Math.round(avgViews * 0.8);
    const viewsMax = Math.round(avgViews * 1.2);
    const ordersMin = Math.round(avgOrders * 0.8);
    const ordersMax = Math.round(avgOrders * 1.2);
    
    // Get price for revenue calculation
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const revenueMin = Math.round(ordersMin * price);
    const revenueMax = Math.round(ordersMax * price);
    
    // Calculate conversion rate
    const conversionMin = Math.round((ordersMin / viewsMax) * 100);
    const conversionMax = Math.round((ordersMax / viewsMin) * 100);
    
    // Update UI
    document.querySelector('.card-body h3:nth-of-type(1)').textContent = `${viewsMin.toLocaleString()}-${viewsMax.toLocaleString()}`;
    document.querySelector('.card-body h3:nth-of-type(2)').textContent = `${ordersMin}-${ordersMax}`;
    document.querySelector('.card-body h3:nth-of-type(3)').textContent = `$${revenueMin.toLocaleString()}-${revenueMax.toLocaleString()}`;
    document.querySelector('.card-body h3:nth-of-type(4)').textContent = `${conversionMin}-${conversionMax}%`;
}

/**
 * Update chart theme based on current theme
 */
function updateChartTheme(chart) {
    const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    
    // Update text color based on theme
    const textColor = isDarkMode ? '#f8f9fa' : '#212529';
    
    // Update grid color based on theme
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Apply theme to chart
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.x.title.color = textColor;
    chart.options.scales.y.title.color = textColor;
    
    chart.options.plugins.legend.labels.color = textColor;
    chart.update();
}

/**
 * Initialize product ID generator
 */
function initProductIdGenerator() {
    const generateIdBtn = document.getElementById('generateIdBtn');
    if (generateIdBtn) {
        generateIdBtn.addEventListener('click', generateProductId);
        
        // Generate initial ID
        generateProductId();
    }
}

/**
 * Generate a random product ID
 */
function generateProductId() {
    const productIdInput = document.getElementById('productId');
    if (productIdInput) {
        // Get selected category prefix or use default
        const categorySelect = document.getElementById('productCategory');
        let prefix = 'PRD';
        
        if (categorySelect && categorySelect.value) {
            prefix = categorySelect.value.substring(0, 3).toUpperCase();
        }
        
        // Generate random number
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        
        // Set product ID
        productIdInput.value = `${prefix}-${randomNum}`;
    }
}

// Listen for dark mode toggle to update charts
document.getElementById('darkModeToggle').addEventListener('change', function() {
    // Dispatch custom event for theme change
    document.dispatchEvent(new Event('themeChanged'));
});

// Add custom styles for color badges
document.head.insertAdjacentHTML('beforeend', `
<style>
.color-badge {
    display: inline-flex;
    align-items: center;
    background-color: #6c757d;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
}

.color-dot {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.color-name {
    margin-right: 0.5rem;
}
</style>
`);