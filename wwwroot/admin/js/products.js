/**
 * Product Filtering
 * Handles client-side filtering and URL parameter management
 */

// Global instances of our managers
let productManager;
let urlManager;
let uiManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    // Check if Bootstrap is loaded
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap JavaScript is not loaded!');
    } else {
        console.log('Bootstrap JavaScript is loaded');
    }
    
    // Initialize component managers
    try {
        console.log('Initializing component managers');
        productManager = new ProductManager();
        urlManager = new URLManager();
        uiManager = new UIManager();
        
        // Initialize the system
        initialize();
    } catch (error) {
        console.error('Error initializing component managers:', error);
    }
    
    /**
     * Initialize the filtering system
     */
    function initialize() {
        console.log('Initializing filtering system');
        
        // Show loading indicator
        uiManager.showLoading();
        
        try {
            // Get initial filters from URL
            console.log('Getting filters from URL');
            const initialFilters = urlManager.getFiltersFromURL();
            console.log('Initial filters:', initialFilters);
            
            // Initialize UI with filter values
            console.log('Initializing UI with filter values');
            uiManager.initializeFilters(initialFilters);
            
            // Apply initial filters
            console.log('Applying initial filters');
            productManager.applyFilters(initialFilters);
            
            // Setup event listeners
            console.log('Setting up event listeners');
            setupEventListeners();
            
            // Update UI
            console.log('Updating UI');
            updateUI();
        } catch (error) {
            console.error('Initialization error:', error);
            uiManager.showError('Failed to initialize product listing. Please try refreshing the page.');
        } finally {
            // Hide loading indicator
            uiManager.hideLoading();
        }
    }
    
    /**
     * Setup event listeners for filters, sorting, etc.
     */
    function setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Filter sidebar events
        console.log('Setting up filter events');
        setupFilterEvents();
        
        // Sorting events
        console.log('Setting up sorting events');
        setupSortingEvents();
        
        // Reset filters button
        const resetFilterBtn = document.querySelector('.filter-sidebar .btn-outline-secondary');
        if (resetFilterBtn) {
            resetFilterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                resetFilters();
            });
        }
        
        // Apply filters button
        const applyFilterBtn = document.querySelector('.filter-sidebar .btn-primary');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                applyFilters();
            });
        }
    }
    
    /**
     * Setup filter-related event listeners
     */
    function setupFilterEvents() {
        // First, ensure all category checkboxes are checked by default
        const categoryCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"][id^="category"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Set rating to 0 (show all) by default
        const rating0 = document.createElement('input');
        rating0.type = 'radio';
        rating0.name = 'ratingFilter';
        rating0.id = 'rating0';
        rating0.value = '0';
        rating0.style.display = 'none';
        rating0.checked = true;
        document.body.appendChild(rating0);
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                applyFilters();
            }, 500));
        }
        
        // Category checkboxes
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                applyFilters();
            });
        });
        
        // Price range slider
        const priceRange = document.getElementById('priceRange');
        const priceMax = document.getElementById('priceMax');
        if (priceRange && priceMax) {
            priceRange.addEventListener('input', function() {
                priceMax.textContent = '$' + this.value;
            });
            
            priceRange.addEventListener('change', function() {
                applyFilters();
            });
        }
        
        // Color options
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                this.classList.toggle('selected');
                applyFilters();
            });
        });
        
        // Rating radio buttons
        const ratingRadios = document.querySelectorAll('input[name="ratingFilter"]');
        ratingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                applyFilters();
            });
        });
        
        // Status select
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                applyFilters();
            });
        }
        
        // Featured/Best Seller checkboxes
        const specialCheckboxes = document.querySelectorAll('#featuredFilter, #bestSellerFilter');
        specialCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                applyFilters();
            });
        });
    }
    
    /**
     * Setup sorting-related event listeners
     */
    function setupSortingEvents() {
        const sortOptions = document.getElementById('sortOptions');
        if (sortOptions) {
            sortOptions.addEventListener('change', function() {
                productManager.setSortBy(this.value);
                updateUI();
            });
        }
    }
    
    /**
     * Apply filters from UI inputs
     */
    function applyFilters() {
        uiManager.showLoading();
        
        try {
            // Get filter values from UI
            const searchInput = document.getElementById('searchInput');
            const searchValue = searchInput ? searchInput.value.trim() : '';
            
            const filters = {
                search: searchValue,
                categories: Array.from(document.querySelectorAll('.filter-sidebar input[type="checkbox"][id^="category"]:checked'))
                    .map(cb => cb.value),
                priceMin: 0,
                priceMax: parseInt(document.getElementById('priceRange')?.value || 500),
                colors: Array.from(document.querySelectorAll('.color-option.selected'))
                    .map(opt => opt.dataset.color),
                rating: parseInt(document.querySelector('input[name="ratingFilter"]:checked')?.value || 0),
                status: document.getElementById('statusFilter')?.value || 'all',
                featured: document.getElementById('featuredFilter')?.checked || false,
                bestSeller: document.getElementById('bestSellerFilter')?.checked || false,
                sortBy: document.getElementById('sortOptions')?.value || 'newest'
            };
            
            console.log('Applied filters:', filters);
            console.log('Rating filter:', filters.rating);
            
            // Apply filters
            productManager.applyFilters(filters);
            
            // Update URL
            urlManager.updateURL(filters);
            
            // Update UI
            updateUI();
        } catch (error) {
            console.error('Filter application error:', error);
            uiManager.showError('Failed to apply filters. Please try again.');
        } finally {
            uiManager.hideLoading();
        }
    }
    
    /**
     * Reset all filters to default values
     */
    function resetFilters() {
        uiManager.showLoading();
        
        try {
            // Reset search
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            
            // Reset category checkboxes
            const categoryCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"][id^="category"]');
            categoryCheckboxes.forEach(cb => cb.checked = true);
            
            // Reset price range
            const priceRange = document.getElementById('priceRange');
            const priceMax = document.getElementById('priceMax');
            if (priceRange) priceRange.value = 9999999;
            if (priceMax) priceMax.textContent = '$9999999';
            
            // Reset color options
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Reset rating to show all products
            const rating0 = document.getElementById('rating0');
            if (rating0) rating0.checked = true;
            
            // Reset status
            const statusFilter = document.getElementById('statusFilter');
            if (statusFilter) statusFilter.value = 'all';
            
            // Reset featured/best seller
            const featuredFilter = document.getElementById('featuredFilter');
            const bestSellerFilter = document.getElementById('bestSellerFilter');
            if (featuredFilter) featuredFilter.checked = false;
            if (bestSellerFilter) bestSellerFilter.checked = false;
            
            // Apply reset filters
            applyFilters();
        } catch (error) {
            console.error('Filter reset error:', error);
            uiManager.showError('Failed to reset filters. Please try refreshing the page.');
        } finally {
            uiManager.hideLoading();
        }
    }
    
    /**
     * Update UI based on current state
     */
    function updateUI() {
        // Update product display
        uiManager.updateProductDisplay(productManager.getFilteredProducts());
        
        // Update product count
        uiManager.updateProductCount(
            productManager.getFilteredProducts().length,
            productManager.getAllProducts().length
        );
    }
    
    /**
     * Debounce function to limit how often a function can be called
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
});

/**
 * Product Manager
 * Handles product data and filtering
 */
class ProductManager {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.filters = {};
        this.sortBy = 'newest';
        
        // Initialize with products from the DOM
        this.initializeProducts();
    }
    
    /**
     * Initialize products from DOM elements
     */
    initializeProducts() {
        console.log('Initializing products from DOM');
        const productElements = document.querySelectorAll('.product-item');
        console.log('Found product elements:', productElements.length);
        
        this.allProducts = Array.from(productElements).map(el => {
            const product = {
                element: el,
                id: parseInt(el.dataset.id),
                name: el.dataset.name,
                category: el.dataset.category,
                price: parseFloat(el.dataset.price),
                rating: parseFloat(el.dataset.rating),
                status: el.dataset.status,
                featured: el.dataset.featured === 'true',
                bestseller: el.dataset.bestseller === 'true',
                colors: (el.dataset.colors || '').split(',').filter(Boolean)
            };
            console.log('Loaded product:', product.id, product.name);
            return product;
        });
        
        this.filteredProducts = [...this.allProducts];
        
        // Make sure all products are visible initially
        const allProductElements = document.querySelectorAll('.product-item');
        allProductElements.forEach(el => {
            el.style.display = '';
        });
        
        console.log('Initializing products Done. Total products:', this.allProducts.length);
    }
    
    /**
     * Apply filters to products
     */
    applyFilters(filters) {
        this.filters = filters;
        this.sortBy = filters.sortBy || 'newest';
        
        // Check if any filters are active
        const hasActiveFilters =
            (filters.search && filters.search.trim() !== '') ||
            (filters.categories && filters.categories.length > 0) ||
            (filters.colors && filters.colors.length > 0) ||
            (filters.rating > 0) ||
            (filters.status && filters.status !== 'all') ||
            filters.featured ||
            filters.bestSeller;
        
        // If no active filters, show all products
        if (!hasActiveFilters) {
            this.filteredProducts = [...this.allProducts];
            console.log('No active filters, showing all products:', this.allProducts.length);
            return;
        }
        
        // Filter products if filters are active
        this.filteredProducts = this.allProducts.filter(product => {
            // Search filter
            if (filters.search && filters.search.trim() !== '') {
                const searchTerm = filters.search.toLowerCase().trim();
                const productName = product.name.toLowerCase();
                const isMatch = productName.includes(searchTerm);
                
                console.log(`Search: "${searchTerm}" against product "${productName}" - Match: ${isMatch}`);
                
                console.log('produkLoop', product.name.toLowerCase());
                console.log('filter', filters.search.toLowerCase());
                debugger
                if (!isMatch) {
                    return false;
                }
            }
            
            // Category filter
            if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(product.category)) {
                return false;
            }
            
            // Price range filter
            if (filters.priceMin !== undefined && product.price < filters.priceMin) {
                return false;
            }
            if (filters.priceMax !== undefined && product.price > filters.priceMax) {
                return false;
            }
            
            // Color filter
            if (filters.colors && filters.colors.length > 0 && !product.colors.some(color => filters.colors.includes(color))) {
                return false;
            }
            
            // Rating filter - only apply if rating is greater than 0
            if (filters.rating > 0 && product.rating < filters.rating) {
                return false;
            }
            
            // Status filter
            if (filters.status && filters.status !== 'all' && product.status !== filters.status) {
                return false;
            }
            
            // Featured filter
            if (filters.featured && !product.featured) {
                return false;
            }
            
            // Best seller filter
            if (filters.bestSeller && !product.bestseller) {
                return false;
            }
            
            return true;
        });
        
        console.log('Filtered products:', this.filteredProducts.length);
        
        // Sort products
        this.sortProducts();
    }
    
    /**
     * Sort products based on current sort option
     */
    sortProducts() {
        switch (this.sortBy) {
            case 'price-low-high':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'best-selling':
                this.filteredProducts.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
                break;
            case 'newest':
            default:
                // For demo purposes, we'll keep the original order for "newest"
                this.filteredProducts.sort((a, b) => a.id - b.id);
                break;
        }
    }
    
    /**
     * Set sort option and re-sort products
     */
    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.sortProducts();
    }
    
    /**
     * Get all products
     */
    getAllProducts() {
        return this.allProducts;
    }
    
    /**
     * Get filtered products
     */
    getFilteredProducts() {
        return this.filteredProducts;
    }
}

/**
 * URL Manager
 * Handles URL parameter serialization/deserialization
 */
class URLManager {
    /**
     * Get filters from URL parameters
     */
    getFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        console.log('URL parameters:', Object.fromEntries(params.entries()));
        
        // Read categories from URL parameter
        let categories = [];
        if (params.has('categories')) {
            categories = params.get('categories').split(',').filter(Boolean);
            console.log('Categories from URL:', categories);
        }
        
        // Read colors from URL parameter
        let colors = [];
        if (params.has('colors')) {
            colors = params.get('colors').split(',').filter(Boolean);
        }
        
        // Default to empty filters to show all products if no parameters
        return {
            search: params.get('search') || '',
            categories: categories,
            priceMin: parseFloat(params.get('priceMin')) || 0,
            priceMax: parseFloat(params.get('priceMax')) || 9999999,
            colors: colors,
            rating: parseInt(params.get('rating')) || 0,
            status: params.get('status') || 'all',
            featured: params.get('featured') === 'true',
            bestSeller: params.get('bestSeller') === 'true',
            sortBy: params.get('sortBy') || 'newest'
        };
    }
    
    /**
     * Update URL with current filters
     */
    updateURL(filters) {
        const params = new URLSearchParams();
        
        // Add non-empty parameters
        if (filters.search) params.set('search', filters.search);
        if (filters.categories && filters.categories.length > 0) params.set('categories', filters.categories.join(','));
        if (filters.priceMin > 0) params.set('priceMin', filters.priceMin);
        if (filters.priceMax < 9999999) params.set('priceMax', filters.priceMax);
        if (filters.colors && filters.colors.length > 0) params.set('colors', filters.colors.join(','));
        if (filters.rating > 0) params.set('rating', filters.rating);
        if (filters.status && filters.status !== 'all') params.set('status', filters.status);
        if (filters.featured) params.set('featured', 'true');
        if (filters.bestSeller) params.set('bestSeller', 'true');
        if (filters.sortBy && filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);
        
        // Update URL without reloading page
        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.pushState({}, '', newURL);
    }
}

/**
 * UI Manager
 * Handles UI updates and loading indicator
 */
class UIManager {
    /**
     * Initialize filters from URL parameters
     */
    initializeFilters(filters) {
        console.log('Initializing UI with filters:', filters);
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput && filters.search) {
            searchInput.value = filters.search;
        }
        
        // Category checkboxes - first uncheck all, then check only the selected ones
        const categoryCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"][id^="category"]');
        
        // If categories filter is active, uncheck all first
        if (filters.categories && filters.categories.length > 0) {
            categoryCheckboxes.forEach(cb => {
                cb.checked = false;
            });
            
            // Then check only the selected categories
            categoryCheckboxes.forEach(cb => {
                if (filters.categories.includes(cb.value)) {
                    cb.checked = true;
                }
            });
            
            console.log('Set category checkboxes based on filters:', filters.categories);
        } else {
            // If no categories filter, check all
            categoryCheckboxes.forEach(cb => {
                cb.checked = true;
            });
        }
        
        // Price range
        const priceRange = document.getElementById('priceRange');
        const priceMax = document.getElementById('priceMax');
        if (priceRange && filters.priceMax) {
            priceRange.value = filters.priceMax;
        }
        if (priceMax && filters.priceMax) {
            priceMax.textContent = '$' + filters.priceMax;
        }
        
        // Color options
        if (filters.colors && filters.colors.length > 0) {
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(opt => {
                if (filters.colors.includes(opt.dataset.color)) {
                    opt.classList.add('selected');
                }
            });
        }
        
        // Rating
        if (filters.rating) {
            const ratingRadio = document.getElementById('rating' + filters.rating);
            if (ratingRadio) {
                ratingRadio.checked = true;
            }
        }
        
        // Status
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter && filters.status && filters.status !== 'all') {
            statusFilter.value = filters.status;
        }
        
        // Featured/Best Seller
        const featuredFilter = document.getElementById('featuredFilter');
        const bestSellerFilter = document.getElementById('bestSellerFilter');
        if (featuredFilter && filters.featured) {
            featuredFilter.checked = true;
        }
        if (bestSellerFilter && filters.bestSeller) {
            bestSellerFilter.checked = true;
        }
        
        // Sort options
        const sortOptions = document.getElementById('sortOptions');
        if (sortOptions && filters.sortBy) {
            sortOptions.value = filters.sortBy;
        }
    }
    
    /**
     * Update product display based on filters
     */
    updateProductDisplay(filteredProducts) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;
        
        console.log('Updating product display with', filteredProducts.length, 'products');
        
        // Show/hide products based on filters
        const allProductElements = document.querySelectorAll('.product-item');
        console.log('Total product elements in DOM:', allProductElements.length);
        
        let visibleCount = 0;
        allProductElements.forEach(el => {
            const productId = parseInt(el.dataset.id);
            const isVisible = filteredProducts.some(p => p.id === productId);
            el.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        });
        
        console.log('Visible products after update:', visibleCount);
    }
    
    /**
     * Update product count display
     */
    updateProductCount(filteredCount, totalCount) {
        const totalProductCount = document.getElementById('totalProductCount');
        
        if (totalProductCount) {
            totalProductCount.textContent = filteredCount;
        }
    }
    
    /**
     * Show loading indicator
     */
    showLoading() {
        console.log('Loading indicator shown');
    }
    
    /**
     * Hide loading indicator
     */
    hideLoading() {
        console.log('Loading indicator hidden');
    }
    
    /**
     * Show error message
     */
    showError(message) {
        // For now, just use console.error and alert
        console.error(message);
        alert(message);
    }
}