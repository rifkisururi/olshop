/**
 * Product Detail Page Functionality
 * Handles image gallery, performance charts, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize product detail page components
    initImageGallery();
    initPerformanceChart();
    initColorOptions();
    initProductToggles();
});

/**
 * Initialize product image gallery
 */
function initImageGallery() {
    // Set up click handlers for thumbnails if they exist
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    if (thumbnails.length) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image
                const mainImage = document.getElementById('mainProductImage');
                if (mainImage) {
                    mainImage.src = this.src;
                    mainImage.alt = this.alt;
                }
            });
        });
    }
}

/**
 * Change main product image
 * This function is called directly from HTML onclick
 */
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = thumbnail.src;
        mainImage.alt = thumbnail.alt;
    }
    
    // Update active state
    document.querySelectorAll('.product-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

/**
 * Initialize product performance chart
 */
function initPerformanceChart() {
    const ctx = document.getElementById('productPerformanceChart');
    if (!ctx) return;
    
    // Sample data for product performance chart
    const performanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Views',
                data: [150, 220, 180, 250, 300, 280],
                borderColor: 'rgba(13, 110, 253, 1)',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Orders',
                data: [10, 15, 12, 18, 22, 20],
                borderColor: 'rgba(25, 135, 84, 1)',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y1'
            },
            {
                label: 'Revenue ($)',
                data: [900, 1350, 1080, 1620, 1980, 1800],
                borderColor: 'rgba(220, 53, 69, 1)',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y2',
                hidden: true
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
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Views'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Orders'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                y2: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
    
    // Update chart on theme change
    document.addEventListener('themeChanged', function() {
        updateChartTheme(performanceChart);
    });
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
    chart.options.scales.y1.grid.color = gridColor;
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.y1.ticks.color = textColor;
    chart.options.scales.x.title.color = textColor;
    chart.options.scales.y.title.color = textColor;
    chart.options.scales.y1.title.color = textColor;
    
    chart.options.plugins.legend.labels.color = textColor;
    chart.update();
}

/**
 * Initialize color option selection
 */
function initColorOptions() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all color options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // In a real app, this would update the product image or other details
            console.log('Selected color:', this.getAttribute('data-color'));
        });
    });
}

/**
 * Initialize product toggle switches (featured, best seller)
 */
function initProductToggles() {
    const featuredToggle = document.getElementById('featuredToggle');
    const bestSellerToggle = document.getElementById('bestSellerToggle');
    
    if (featuredToggle) {
        featuredToggle.addEventListener('change', function() {
            // In a real app, this would update the product status in the database
            console.log('Featured status changed to:', this.checked);
            
            // Update UI to reflect the change
            const featuredBadge = document.querySelector('.badge.bg-primary');
            if (featuredBadge) {
                featuredBadge.style.display = this.checked ? '' : 'none';
            }
        });
    }
    
    if (bestSellerToggle) {
        bestSellerToggle.addEventListener('change', function() {
            // In a real app, this would update the product status in the database
            console.log('Best Seller status changed to:', this.checked);
            
            // Add or remove best seller badge
            const badgeContainer = document.querySelector('.position-relative');
            if (badgeContainer) {
                let bestSellerBadge = document.querySelector('.badge.bg-warning.text-dark.position-absolute.bottom-0.start-0.m-3');
                
                if (this.checked && !bestSellerBadge) {
                    // Create and add badge if it doesn't exist
                    bestSellerBadge = document.createElement('span');
                    bestSellerBadge.className = 'badge bg-warning text-dark position-absolute bottom-0 start-0 m-3';
                    bestSellerBadge.textContent = 'Best Seller';
                    badgeContainer.appendChild(bestSellerBadge);
                } else if (!this.checked && bestSellerBadge) {
                    // Remove badge if it exists
                    bestSellerBadge.remove();
                }
            }
        });
    }
}

// Listen for dark mode toggle to update charts
document.getElementById('darkModeToggle').addEventListener('change', function() {
    // Dispatch custom event for theme change
    document.dispatchEvent(new Event('themeChanged'));
});