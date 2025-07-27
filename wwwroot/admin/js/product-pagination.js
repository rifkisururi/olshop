/**
 * Product Pagination and Filtering
 * Handles client-side pagination, filtering, and URL parameter management
 */

// Global instances of our managers
let productManager;
let paginationManager;
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
        paginationManager = new PaginationManager();
        urlManager = new URLManager();
        uiManager = new UIManager();
        
        // Initialize the system
        initialize();
    } catch (error) {
        console.error('Error initializing component managers:', error);
    }
    
    /**
     * Initialize the pagination and filtering system
     */
    function initialize() {
        console.log('Initializing pagination system');
        
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
            
            // Set page size and go to initial page
            console.log('Setting page size and initial page');
            paginationManager.setPageSize(initialFilters.pageSize || 10);
            paginationManager.goToPage(initialFilters.page || 1);
            
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
     * Setup event listeners for filters, pagination, etc.
     */
    function setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Filter sidebar events
        console.log('Setting up filter events');
        setupFilterEvents();
        
        // Pagination events
        console.log('Setting up pagination events');
        setupPaginationEvents();
        
        // Sorting events
        console.log('Setting up sorting events');
        setupSortingEvents();
        
        // Page size events
        console.log('Setting up page size events');
        setupPageSizeEvents();
        
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
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                applyFilters();
            }, 500));
        }
        
        // Category checkboxes
        const categoryCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"][id^="category"]');
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
     * Setup pagination-related event listeners
     */
    function setupPaginationEvents() {
        // Previous page button
        const prevPageBtn = document.getElementById('prevPage');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', function(e) {
                e.preventDefault();
                paginationManager.previousPage();
                updateUI();
            });
        }
        
        // Next page button
        const nextPageBtn = document.getElementById('nextPage');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', function(e) {
                e.preventDefault();
                paginationManager.nextPage();
                updateUI();
            });
        }
        
        // Page number links (delegated event)
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.addEventListener('click', function(e) {
                const pageLink = e.target.closest('a[data-page]');
                if (pageLink) {
                    e.preventDefault();
                    const page = parseInt(pageLink.dataset.page);
                    if (!isNaN(page)) {
                        paginationManager.goToPage(page);
                        updateUI();
                    }
                }
            });
        }
    }
    
    /**
     * Setup sorting-related event listeners
     */
    function setupSortingEvents() {
        const sortOptions = document.getElementById('sortOptions');
        if (sortOptions) {
            sortOptions.addEventListener('change', function() {
                productManager.setSortBy(this.value);
                paginationManager.goToPage(1); // Reset to first page when sorting changes
                updateUI();
            });
        }
    }
    
    /**
     * Setup page size-related event listeners
     */
    function setupPageSizeEvents() {
        console.log('Setting up page size events');
        const pageSizeOptions = document.querySelectorAll('.page-size-option');
        console.log('Found page size options:', pageSizeOptions.length);
        
        pageSizeOptions.forEach(option => {
            console.log('Adding event listener to page size option:', option.dataset.size);
            option.addEventListener('click', function(e) {
                console.log('Page size option clicked:', this.dataset.size);
                e.preventDefault();
                const size = parseInt(this.dataset.size);
                if (!isNaN(size)) {
                    console.log('Setting page size to:', size);
                    paginationManager.setPageSize(size);
                    updateUI();
                    
                    // Update dropdown button text
                    const dropdownButton = document.getElementById('pageSizeDropdown');
                    if (dropdownButton) {
                        console.log('Updating dropdown button text');
                        document.getElementById('currentPageSize').textContent = size;
                    } else {
                        console.warn('pageSizeDropdown element not found');
                    }
                    
                    // Update active state
                    pageSizeOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    /**
     * Apply filters from UI inputs
     */
    function applyFilters() {
        uiManager.showLoading();
        
        try {
            // Get filter values from UI
            const filters = {
                search: document.getElementById('searchInput')?.value || '',
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
                sortBy: document.getElementById('sortOptions')?.value || 'newest',
                page: 1, // Reset to first page when filters change
                pageSize: paginationManager.getPageSize()
            };
            
            // Apply filters
            productManager.applyFilters(filters);
            
            // Update pagination
            paginationManager.goToPage(1);
            
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
            if (priceRange) priceRange.value = 500;
            if (priceMax) priceMax.textContent = '$500';
            
            // Reset color options
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Reset rating
            const rating4 = document.getElementById('rating4');
            if (rating4) rating4.checked = true;
            
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
        uiManager.updateProductDisplay(
            productManager.getFilteredProducts(),
            paginationManager.getCurrentPage(),
            paginationManager.getPageSize()
        );
        
        // Update pagination UI
        uiManager.updatePagination(
            paginationManager.getCurrentPage(),
            paginationManager.getTotalPages(),
            productManager.getFilteredProducts().length
        );
        
        // Update product count
        uiManager.updateProductCount(
            productManager.getVisibleProducts().length,
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
        this.visibleProducts = [];
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
            console.log('Parsed product:', product);
            return product;
        });
        
        this.filteredProducts = [...this.allProducts];
        this.visibleProducts = [...this.allProducts];
         console.log('Initializing products Done. Total products:', this.allProducts.length);
    }
    
    /**
     * Apply filters to products
     */
    applyFilters(filters) {
        this.filters = filters;
        this.sortBy = filters.sortBy || 'newest';
        
        // Filter products
        this.filteredProducts = this.allProducts.filter(product => {
            // Search filter
            if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
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
            
            // Rating filter
            if (filters.rating && product.rating < filters.rating) {
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
    
    /**
     * Get visible products (current page)
     */
    getVisibleProducts() {
        return this.visibleProducts;
    }
    
    /**
     * Set visible products (for current page)
     */
    setVisibleProducts(products) {
        this.visibleProducts = products;
    }
}

/**
 * Pagination Manager
 * Handles pagination logic
 */
class PaginationManager {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
    }
    
    /**
     * Set page size
     */
    setPageSize(size) {
        if (size > 0) {
            this.pageSize = size;
        }
    }
    
    /**
     * Get current page size
     */
    getPageSize() {
        return this.pageSize;
    }
    
    /**
     * Go to specific page
     */
    goToPage(page) {
        if (page > 0 && page <= this.getTotalPages()) {
            this.currentPage = page;
        }
    }
    
    /**
     * Go to previous page
     */
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }
    
    /**
     * Go to next page
     */
    nextPage() {
        if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
        }
    }
    
    /**
     * Get current page
     */
    getCurrentPage() {
        return this.currentPage;
    }
    
    /**
     * Get total number of pages
     */
    getTotalPages() {
        const totalItems = productManager.getFilteredProducts().length;
        return Math.max(1, Math.ceil(totalItems / this.pageSize));
    }
    
    /**
     * Get start index for current page
     */
    getStartIndex() {
        return (this.currentPage - 1) * this.pageSize;
    }
    
    /**
     * Get end index for current page
     */
    getEndIndex() {
        const totalItems = productManager.getFilteredProducts().length;
        return Math.min(this.getStartIndex() + this.pageSize, totalItems);
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
        return {
            search: params.get('search') || '',
            categories: (params.get('categories') || '').split(',').filter(Boolean),
            priceMin: parseFloat(params.get('priceMin')) || 0,
            priceMax: parseFloat(params.get('priceMax')) || 500,
            colors: (params.get('colors') || '').split(',').filter(Boolean),
            rating: parseInt(params.get('rating')) || 0,
            status: params.get('status') || 'all',
            featured: params.get('featured') === 'true',
            bestSeller: params.get('bestSeller') === 'true',
            sortBy: params.get('sortBy') || 'newest',
            page: parseInt(params.get('page')) || 1,
            pageSize: parseInt(params.get('pageSize')) || 10
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
        if (filters.priceMax < 500) params.set('priceMax', filters.priceMax);
        if (filters.colors && filters.colors.length > 0) params.set('colors', filters.colors.join(','));
        if (filters.rating > 0) params.set('rating', filters.rating);
        if (filters.status && filters.status !== 'all') params.set('status', filters.status);
        if (filters.featured) params.set('featured', 'true');
        if (filters.bestSeller) params.set('bestSeller', 'true');
        if (filters.sortBy && filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);
        if (filters.page > 1) params.set('page', filters.page);
        if (filters.pageSize !== 10) params.set('pageSize', filters.pageSize);
        
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
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput && filters.search) {
            searchInput.value = filters.search;
        }
        
        // Category checkboxes
        if (filters.categories && filters.categories.length > 0) {
            const categoryCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"][id^="category"]');
            categoryCheckboxes.forEach(cb => {
                cb.checked = filters.categories.includes(cb.value);
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
        
        // Page size
        if (filters.pageSize) {
            const pageSizeOptions = document.querySelectorAll('.page-size-option');
            pageSizeOptions.forEach(opt => {
                opt.classList.toggle('active', parseInt(opt.dataset.size) === filters.pageSize);
            });
            
            const currentPageSize = document.getElementById('currentPageSize');
            if (currentPageSize) {
                currentPageSize.textContent = filters.pageSize;
            }
        }
    }
    
    /**
     * Update product display based on current page and filters
     */
    updateProductDisplay(filteredProducts, currentPage, pageSize) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;
        
        // Calculate start and end indices for current page
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
        
        // Get visible products for current page
        const visibleProducts = filteredProducts.slice(startIndex, endIndex);
        
        // Update product manager with visible products
        productManager.setVisibleProducts(visibleProducts);
        
        // Show/hide products based on current page
        const allProductElements = document.querySelectorAll('.product-item');
        allProductElements.forEach(el => {
            const productId = parseInt(el.dataset.id);
            const isVisible = visibleProducts.some(p => p.id === productId);
            el.style.display = isVisible ? '' : 'none';
        });
    }
    
    /**
     * Update pagination UI
     */
    updatePagination(currentPage, totalPages, totalItems) {
        // Update current page and total pages text
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('totalPages').textContent = totalPages;
        
        // Update previous/next buttons
        const prevPageItem = document.getElementById('prevPageItem');
        const nextPageItem = document.getElementById('nextPageItem');
        
        if (prevPageItem) {
            prevPageItem.classList.toggle('disabled', currentPage <= 1);
        }
        
        if (nextPageItem) {
            nextPageItem.classList.toggle('disabled', currentPage >= totalPages);
        }
        
        // Update page number links
        this.updatePageNumbers(currentPage, totalPages);
    }
    
    /**
     * Update page number links
     */
    updatePageNumbers(currentPage, totalPages) {
        // Get pagination elements
        const firstPageItem = document.getElementById('firstPageItem');
        const lastPageItem = document.getElementById('lastPageItem');
        const startEllipsis = document.getElementById('startEllipsis');
        const endEllipsis = document.getElementById('endEllipsis');
        const pageTemplate = document.getElementById('pageTemplate');
        
        // Hide all existing page number items (except template)
        const existingPageItems = document.querySelectorAll('.pagination .page-item.page-number');
        existingPageItems.forEach(item => item.remove());
        
        // Update first page item
        if (firstPageItem) {
            firstPageItem.classList.toggle('active', currentPage === 1);
            firstPageItem.classList.toggle('d-none', totalPages <= 1);
        }
        
        // Update last page item
        if (lastPageItem && totalPages > 1) {
            lastPageItem.classList.toggle('active', currentPage === totalPages);
            lastPageItem.classList.toggle('d-none', totalPages <= 1);
            lastPageItem.querySelector('a').dataset.page = totalPages;
            lastPageItem.querySelector('a').textContent = totalPages;
        }
        
        // Determine which page numbers to show
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        // Adjust if we're near the beginning or end
        if (currentPage <= 3) {
            endPage = Math.min(totalPages - 1, 4);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(2, totalPages - 3);
        }
        
        // Show/hide ellipses
        if (startEllipsis) {
            startEllipsis.classList.toggle('d-none', startPage <= 2);
        }
        
        if (endEllipsis) {
            endEllipsis.classList.toggle('d-none', endPage >= totalPages - 1);
        }
        
        // Create page number items
        if (pageTemplate && totalPages > 2) {
            for (let i = startPage; i <= endPage; i++) {
                const pageItem = pageTemplate.cloneNode(true);
                pageItem.id = 'page' + i;
                pageItem.classList.remove('d-none');
                pageItem.classList.add('page-number');
                pageItem.classList.toggle('active', i === currentPage);
                
                const pageLink = pageItem.querySelector('a');
                pageLink.dataset.page = i;
                pageLink.textContent = i;
                
                // Insert before the end ellipsis
                if (endEllipsis) {
                    endEllipsis.parentNode.insertBefore(pageItem, endEllipsis);
                }
            }
        }
    }
    
    /**
     * Update product count display
     */
    updateProductCount(visibleCount, filteredCount, totalCount) {
        const visibleProductCount = document.getElementById('visibleProductCount');
        const totalProductCount = document.getElementById('totalProductCount');
        
        if (visibleProductCount) {
            visibleProductCount.textContent = filteredCount;
        }
        
        if (totalProductCount) {
            totalProductCount.textContent = totalCount;
        }
    }
    
    /**
     * Show loading indicator
     */
    showLoading() {
        // const loadingOverlay = document.getElementById('loadingOverlay');
        // if (loadingOverlay) {
        //     loadingOverlay.style.display = 'flex';
        // }
        console.log('Loading indicator shown');
    }
    
    /**
     * Hide loading indicator
     */
    hideLoading() {
        // const loadingOverlay = document.getElementById('loadingOverlay');
        // if (loadingOverlay) {
        //     loadingOverlay.style.display = 'none';
        // }
        console.log('Loading indicator hidden');
    }
    
    /**
     * Show error message
     */
    showError(message) {
        // For now, just use console.error and alert
        console.error(message);
        alert(message);
        
        // In a real application, you might use a toast or modal
    }
}