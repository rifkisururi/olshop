/**
 * Dashboard Charts and Functionality
 * Initializes and manages all dashboard charts and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    try {
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded!');
            return;
        }
        
        console.log('Chart.js is loaded successfully');
        
        // Check if canvas elements exist
        const salesChartCanvas = document.getElementById('salesChart');
        const categoryChartCanvas = document.getElementById('categoryChart');
        
        if (!salesChartCanvas) {
            console.error('Sales chart canvas element not found!');
        } else {
            console.log('Sales chart canvas found');
        }
        
        if (!categoryChartCanvas) {
            console.error('Category chart canvas element not found!');
        } else {
            console.log('Category chart canvas found');
        }
        
        // Initialize charts
        initSalesChart();
        initCategoryChart();
        
        // Add event listeners for dashboard interactions
        setupDashboardInteractions();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
});

/**
 * Initialize Sales Overview Chart
 */
function initSalesChart() {
    try {
        console.log('Initializing sales chart...');
        const canvas = document.getElementById('salesChart');
        if (!canvas) {
            console.error('Sales chart canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2D context from sales chart canvas');
            return;
        }
        
        console.log('Got 2D context for sales chart');
        
        // Sample data for sales chart
        const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Sales 2023',
                data: [1800, 2200, 1900, 2400, 2800, 2600, 3000, 3200, 3500, 3800, 4200, 4500],
                borderColor: 'rgba(13, 110, 253, 1)',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Sales 2022',
                data: [1500, 1800, 1600, 2000, 2200, 2100, 2500, 2800, 3000, 3300, 3600, 3900],
                borderColor: 'rgba(108, 117, 125, 1)',
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    };
    
    // Chart configuration
    const salesChart = new Chart(ctx, {
        type: 'line',
        data: salesData,
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
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
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
    
    console.log('Sales chart initialized successfully');
    
    // Update chart on theme change
    document.addEventListener('themeChanged', function() {
        updateChartTheme(salesChart);
    });
    } catch (error) {
        console.error('Error initializing sales chart:', error);
    }
}

/**
 * Initialize Category Chart
 */
function initCategoryChart() {
    try {
        console.log('Initializing category chart...');
        const canvas = document.getElementById('categoryChart');
        if (!canvas) {
            console.error('Category chart canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2D context from category chart canvas');
            return;
        }
        
        console.log('Got 2D context for category chart');
        
        // Sample data for category chart
        const categoryData = {
        labels: ['Bags', 'Accessories', 'Jewelry', 'Watches', 'Clothing'],
        datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
                'rgba(13, 110, 253, 0.8)',
                'rgba(25, 135, 84, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(220, 53, 69, 0.8)',
                'rgba(108, 117, 125, 0.8)'
            ],
            borderColor: [
                'rgba(13, 110, 253, 1)',
                'rgba(25, 135, 84, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(220, 53, 69, 1)',
                'rgba(108, 117, 125, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Chart configuration
    const categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: categoryData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return label + ': ' + value + '%';
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
    
    // Update chart on theme change
    document.addEventListener('themeChanged', function() {
        updateChartTheme(categoryChart);
    });
    
    console.log('Category chart initialized successfully');
    } catch (error) {
        console.error('Error initializing category chart:', error);
    }
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
    if (chart.config.type === 'line' || chart.config.type === 'bar') {
        chart.options.scales.x.grid.color = gridColor;
        chart.options.scales.y.grid.color = gridColor;
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.y.ticks.color = textColor;
    }
    
    chart.options.plugins.legend.labels.color = textColor;
    chart.update();
}

/**
 * Setup dashboard interactions
 */
function setupDashboardInteractions() {
    // Example: Add click event for export button
    const exportBtn = document.querySelector('button.btn-outline-secondary:nth-child(2)');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Export functionality would be implemented here');
        });
    }
    
    // Example: Add click event for date range dropdown
    const dateRangeBtn = document.querySelector('button.dropdown-toggle');
    if (dateRangeBtn) {
        dateRangeBtn.addEventListener('click', function() {
            // This would typically toggle a dropdown menu
            console.log('Date range dropdown clicked');
        });
    }
}

// Listen for dark mode toggle to update charts
document.getElementById('darkModeToggle').addEventListener('change', function() {
    // Dispatch custom event for theme change
    document.dispatchEvent(new Event('themeChanged'));
});