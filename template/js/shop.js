/**
 * Shop Page JavaScript
 * Handles product filtering, sorting, and view modes
 */

(function($) {
    'use strict';

    // Shop variables
    let currentFilters = {
        category: 'all',
        priceMax: 1000000,
        colors: [],
        sizes: [],
        tags: [],
        sort: 'default',
        view: 'grid'
    };

    let allProducts = [];
    let currentPage = 1;
    const productsPerPage = 12;

    // Initialize shop functionality
    $(document).ready(function() {
        initShopFilters();
        initViewModes();
        initPriceRange();
        loadProducts();
        handleURLParams();
        initQuickView();
        updateCartCount();
    });

    // Initialize filters
    function initShopFilters() {
        // Category filter
        $('.category-list a').click(function(e) {
            e.preventDefault();
            $('.category-list a').removeClass('active');
            $(this).addClass('active');
            
            const category = $(this).find('span:first').text().toLowerCase();
            currentFilters.category = category === 'all products' ? 'all' : category;
            filterProducts();
        });

        // Color filter
        $('.color-option').click(function() {
            $(this).toggleClass('active');
            const color = $(this).attr('title').toLowerCase();
            
            if ($(this).hasClass('active')) {
                currentFilters.colors.push(color);
            } else {
                currentFilters.colors = currentFilters.colors.filter(c => c !== color);
            }
            
            filterProducts();
        });

        // Size filter
        $('.size-option').click(function() {
            $(this).toggleClass('active');
            const size = $(this).text();
            
            if ($(this).hasClass('active')) {
                currentFilters.sizes.push(size);
            } else {
                currentFilters.sizes = currentFilters.sizes.filter(s => s !== size);
            }
            
            filterProducts();
        });

        // Tag filter
        $('.tag').click(function(e) {
            e.preventDefault();
            $(this).toggleClass('active');
            const tag = $(this).text().toLowerCase();
            
            if ($(this).hasClass('active')) {
                currentFilters.tags.push(tag);
            } else {
                currentFilters.tags = currentFilters.tags.filter(t => t !== tag);
            }
            
            filterProducts();
        });

        // Sort dropdown
        $('.shop-controls select').change(function() {
            currentFilters.sort = $(this).val();
            sortProducts();
        });
    }

    // Initialize view modes
    function initViewModes() {
        $('#gridView').click(function() {
            $('.view-mode button').removeClass('active');
            $(this).addClass('active');
            currentFilters.view = 'grid';
            $('#productGrid').removeClass('product-list-view');
            // updateProductDisplay();
        });

        $('#listView').click(function() {
            $('.view-mode button').removeClass('active');
            $(this).addClass('active');
            currentFilters.view = 'list';
            $('#productGrid').addClass('product-list-view');
            // updateProductDisplay();
        });
    }

    // Initialize price range slider
    function initPriceRange() {
        const $priceRange = $('#priceRange');
        const $currentPrice = $('#currentPrice');

        $priceRange.on('input', function() {
            const value = parseInt($(this).val());
            $currentPrice.text(`Rp ${value.toLocaleString('id-ID')}`);
            currentFilters.priceMax = value;
        });

        $priceRange.on('change', function() {
            filterProducts();
        });
    }

    // Load products
    function loadProducts() {
        // Show loading state
        $('#productGrid').html(`
            <div class="col-12 product-loading">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading products...</p>
            </div>
        `);

        // Get category from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('Categories');
        
        // Build URL with category parameter if needed
        let url = '../produks.json';
        if (categoryParam) {
            // Set the current filter to match the URL parameter
            currentFilters.category = categoryParam.toLowerCase() === 'all' ? 'all' : categoryParam.toLowerCase();
            
            // Update UI to show the selected category
            $('.category-list a').removeClass('active');
            $(`.category-list a:contains("${categoryParam}")`).addClass('active');
        }

        // Fetch products from JSON file
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Process the data
                allProducts = data.products.map(product => {
                    return {
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        price: product.price,
                        oldPrice: product.oldPrice,
                        image: product.images.primary,
                        gallery: product.images.gallery,
                        colors: product.colors,
                        sizes: product.sizes,
                        tags: product.tags,
                        rating: product.rating,
                        reviews: product.reviewCount,
                        stock: product.stock,
                        description: product.description,
                        specifications: product.specifications,
                        featured: product.featured,
                        bestSeller: product.bestSeller
                    };
                });
                
                // Update category counts in sidebar
                updateCategoryCounts(data.categories);
                
                // Apply filters
                filterProducts();
            },
            error: function(xhr, status, error) {
                console.error('Error loading products:', error);
                $('#productGrid').html(`
                    <div class="col-12 no-products">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error loading products</h3>
                        <p>Please try again later</p>
                    </div>
                `);
            }
        });
    }
    
    // Update category counts in sidebar
    function updateCategoryCounts(categories) {
        if (!categories) return;
        
        categories.forEach(category => {
            const categoryElement = $(`.category-list a span:contains("${category.name}")`).parent().parent();
            if (categoryElement.length) {
                categoryElement.find('.count').text(`(${category.count})`);
            }
        });
    }

    // Filter products
    function filterProducts() {
        let filtered = allProducts;

        // Category filter
        if (currentFilters.category !== 'all') {
            filtered = filtered.filter(p => p.category === currentFilters.category);
        }

        // Price filter
        filtered = filtered.filter(p => p.price <= currentFilters.priceMax);

        // Color filter
        if (currentFilters.colors.length > 0) {
            filtered = filtered.filter(p => 
                p.colors.some(c => currentFilters.colors.includes(c))
            );
        }

        // Size filter
        if (currentFilters.sizes.length > 0) {
            filtered = filtered.filter(p => 
                p.sizes.some(s => currentFilters.sizes.includes(s))
            );
        }

        // Tag filter
        if (currentFilters.tags.length > 0) {
            filtered = filtered.filter(p => 
                p.tags.some(t => currentFilters.tags.includes(t))
            );
        }

        // Sort products
        filtered = sortProductsArray(filtered);

        // Update display
        displayProducts(filtered);
        updateResultCount(filtered.length);
        showActiveFilters();
    }

    // Sort products array
    function sortProductsArray(products) {
        const sorted = [...products];

        switch (currentFilters.sort) {
            case 'Sort by popularity':
                sorted.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'Sort by latest':
                sorted.reverse(); // Assuming higher ID = newer
                break;
            case 'Sort by price: low to high':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'Sort by price: high to low':
                sorted.sort((a, b) => b.price - a.price);
                break;
        }

        return sorted;
    }

    // Display products
    function displayProducts(products) {
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const pageProducts = products.slice(start, end);

        if (pageProducts.length === 0) {
            $('#productGrid').html(`
                <div class="col-12 no-products">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                </div>
            `);
            return;
        }

        const html = pageProducts.map(product => createShopProductCard(product)).join('');
        $('#productGrid').html(html);
        
        // Update pagination
        updatePagination(products.length);
        
        // Animate products
        animateProducts('#productGrid');
    }

    // Create shop product card
    function createShopProductCard(product) {
        const price = formatPrice(product.price);
        const oldPrice = product.oldPrice ? formatPrice(product.oldPrice) : '';
        const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
        
        const cardClass = currentFilters.view === 'list' ? 'col-12' : 'col-lg-4 col-md-6';
        const stockBadge = product.stock.status === 'in_stock'
            ? `<div class="product-badge stock-badge">In Stock</div>`
            : `<div class="product-badge stock-badge out-of-stock">Out of Stock</div>`;
        // <button class="add-to-wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                            //     <i class="far fa-heart"></i>
                            // </button>
        return `
            <div class="${cardClass} mb-4">
                <div class="product-card">
                    ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ''}
                    ${stockBadge}
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <div class="product-actions">
                            <button class="quick-view-btn" data-product-id="${product.id}" title="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                            
                            <button class="add-to-cart-btn" data-product-id="${product.id}" title="Add to Cart">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category.toUpperCase()}</div>
                        <h5 class="product-title">${product.name}</h5>
                        <div class="product-rating mb-2">
                            ${generateStars(product.rating)}
                            <span class="text-muted ms-1">(${product.reviews})</span>
                        </div>
                        <div class="product-price">
                            ${oldPrice ? `<span class="old-price">${oldPrice}</span>` : ''}
                            <span>${price}</span>
                        </div>
                        ${currentFilters.view === 'list' ? `
                            <p class="product-description mt-2">
                                ${product.description.substring(0, 120)}...
                            </p>
                            <div class="product-tags mt-2">
                                ${product.tags.map(tag => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Generate star rating
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star text-warning"></i>';
            } else {
                stars += '<i class="far fa-star text-warning"></i>';
            }
        }
        return stars;
    }

    // Format price
    function formatPrice(price) {
        return `Rp ${price.toLocaleString('id-ID')}`;
    }

    // Update result count
    function updateResultCount(total) {
        const start = Math.min((currentPage - 1) * productsPerPage + 1, total);
        const end = Math.min(currentPage * productsPerPage, total);
        $('.result-count').html(`Showing <strong>${start}-${end}</strong> of <strong>${total}</strong> results`);
    }

    // Update pagination
    function updatePagination(total) {
        const totalPages = Math.ceil(total / productsPerPage);
        let paginationHtml = '';

        // Previous button
        paginationHtml += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                paginationHtml += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
            </li>
        `;

        $('.pagination').html(paginationHtml);

        // Bind pagination clicks
        $('.page-link').click(function(e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'));
            if (page && page !== currentPage) {
                currentPage = page;
                filterProducts();
                $('html, body').animate({ scrollTop: $('.shop-content').offset().top - 100 }, 500);
            }
        });
    }

    // Show active filters
    function showActiveFilters() {
        const activeFilters = [];

        if (currentFilters.category !== 'all') {
            activeFilters.push({ type: 'category', value: currentFilters.category });
        }

        currentFilters.colors.forEach(color => {
            activeFilters.push({ type: 'color', value: color });
        });

        currentFilters.sizes.forEach(size => {
            activeFilters.push({ type: 'size', value: size });
        });

        currentFilters.tags.forEach(tag => {
            activeFilters.push({ type: 'tag', value: tag });
        });

        if (currentFilters.priceMax < 1000000) {
            activeFilters.push({ type: 'price', value: `Max ${formatPrice(currentFilters.priceMax)}` });
        }

        // Display active filters if any
        if (activeFilters.length > 0) {
            let filtersHtml = '<div class="filters-active">';
            filtersHtml += '<span class="me-2">Active Filters:</span>';
            
            activeFilters.forEach(filter => {
                filtersHtml += `
                    <span class="filter-tag">
                        ${filter.value}
                        <span class="remove" data-type="${filter.type}" data-value="${filter.value}">&times;</span>
                    </span>
                `;
            });
            
            filtersHtml += '<a href="#" class="clear-all-filters ms-2">Clear All</a>';
            filtersHtml += '</div>';

            if (!$('.filters-active').length) {
                $('.shop-header').before(filtersHtml);
            } else {
                $('.filters-active').replaceWith(filtersHtml);
            }

            // Bind remove filter clicks
            $('.filter-tag .remove').click(function() {
                removeFilter($(this).data('type'), $(this).data('value'));
            });

            $('.clear-all-filters').click(function(e) {
                e.preventDefault();
                clearAllFilters();
            });
        } else {
            $('.filters-active').remove();
        }
    }

    // Remove filter
    function removeFilter(type, value) {
        switch (type) {
            case 'category':
                currentFilters.category = 'all';
                $('.category-list a').removeClass('active');
                $('.category-list a:first').addClass('active');
                break;
            case 'color':
                currentFilters.colors = currentFilters.colors.filter(c => c !== value);
                $(`.color-option[title="${value}"]`).removeClass('active');
                break;
            case 'size':
                currentFilters.sizes = currentFilters.sizes.filter(s => s !== value);
                $(`.size-option:contains("${value}")`).removeClass('active');
                break;
            case 'tag':
                currentFilters.tags = currentFilters.tags.filter(t => t !== value);
                $(`.tag:contains("${value}")`).removeClass('active');
                break;
            case 'price':
                currentFilters.priceMax = 1000000;
                $('#priceRange').val(1000000);
                $('#currentPrice').text('Rp 1,000,000');
                break;
        }
        
        filterProducts();
    }

    // Clear all filters
    function clearAllFilters() {
        currentFilters = {
            category: 'all',
            priceMax: 1000000,
            colors: [],
            sizes: [],
            tags: [],
            sort: 'default',
            view: currentFilters.view
        };

        // Reset UI
        $('.category-list a').removeClass('active');
        $('.category-list a:first').addClass('active');
        $('.color-option, .size-option, .tag').removeClass('active');
        $('#priceRange').val(1000000);
        $('#currentPrice').text('Rp 1,000,000');
        $('.shop-controls select').val('default');

        filterProducts();
    }

    // Handle URL parameters
    function handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get('search');
        const category = urlParams.get('Categories');
        
        if (search) {
            // Filter products based on search term
            allProducts = allProducts.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase()) ||
                p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            );
            
            // Show search term in header
            $('.shop-header').before(`
                <div class="alert alert-info mb-3">
                    Search results for: <strong>${search}</strong>
                    <a href="shop.html" class="float-end">Clear Search</a>
                </div>
            `);
        }
        
        if (category) {
            // Show category filter in header
            $('.shop-header').before(`
                <div class="alert alert-info mb-3">
                    Category: <strong>${category}</strong>
                    <a href="shop.html" class="float-end">Clear Filter</a>
                </div>
            `);
        }
    }

    // Animate products
    function animateProducts(container) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        $(entry.target).addClass('fade-in');
                    }, index * 50);
                }
            });
        }, { threshold: 0.1 });

        $(container).find('.product-card').each(function() {
            observer.observe(this);
        });
    }

    // Mobile filter toggle
    $(document).on('click', '.mobile-filter-toggle', function() {
        $('.shop-sidebar').addClass('show');
        $('body').css('overflow', 'hidden');
    });

    $(document).on('click', '.sidebar-close', function() {
        $('.shop-sidebar').removeClass('show');
        $('body').css('overflow', '');
    });
    
    // Initialize Quick View functionality
    function initQuickView() {
        // Quick View button click
        $(document).on('click', '.quick-view-btn', function() {
            const productId = $(this).data('product-id');
            const product = allProducts.find(p => p.id === productId);
            
            if (product) {
                populateQuickViewModal(product);
                $('#quickViewModal').modal('show');
            }
        });
        
        // Quantity selector
        $(document).on('click', '.quantity-decrease', function() {
            const input = $(this).siblings('input');
            const currentValue = parseInt(input.val());
            if (currentValue > 1) {
                input.val(currentValue - 1);
            }
        });
        
        $(document).on('click', '.quantity-increase', function() {
            const input = $(this).siblings('input');
            const currentValue = parseInt(input.val());
            const maxStock = parseInt(input.data('max-stock'));
            
            if (!maxStock || currentValue < maxStock) {
                input.val(currentValue + 1);
            }
        });
        
        // Thumbnail click in quick view
        $(document).on('click', '.gallery-thumbnail', function() {
            const mainImage = $(this).closest('.product-gallery').find('.main-image');
            const newSrc = $(this).attr('src');
            
            $('.gallery-thumbnail').removeClass('active');
            $(this).addClass('active');
            
            mainImage.fadeOut(200, function() {
                mainImage.attr('src', newSrc);
                mainImage.fadeIn(200);
            });
        });
        
        // Color selection in quick view
        $(document).on('click', '.quick-view-color', function() {
            $('.quick-view-color').removeClass('active');
            $(this).addClass('active');
        });
        
        // Size selection in quick view
        $(document).on('click', '.quick-view-size', function() {
            $('.quick-view-size').removeClass('active');
            $(this).addClass('active');
        });
        
        // Add to cart from quick view
        $(document).on('click', '#quickViewModal .add-to-cart-btn', function() {
            const productId = $(this).data('product-id');
            const quantity = parseInt($('#quickViewModal .quantity-selector input').val());
            const color = $('#quickViewModal .quick-view-color.active').data('color');
            const size = $('#quickViewModal .quick-view-size.active').data('size');
            
            // Get the product details
            const product = allProducts.find(p => p.id === productId);
            
            if (!product) return;
            
            // Add the product to cart (in a real app, this would store in localStorage or send to server)
            addToCart(product, quantity, color, size);
            
            // Show confirmation message in the modal
            const alertHtml = `
                <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>${product.name}</strong> has been added to your cart!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            // Add the alert to the modal in the right place
            $('#quickViewModal .product-details').append(alertHtml);
            
            // Update the cart count in the header
            updateCartCount();
            
            // Add a view cart button
            const viewCartBtn = `
                <a href="cart.html" class="btn btn-outline-primary mt-3 w-100">
                    <i class="fas fa-shopping-bag me-2"></i>View Cart
                </a>
            `;
            $('#quickViewModal .product-details').append(viewCartBtn);
            
            // Disable the add to cart button to prevent multiple clicks
            $(this).prop('disabled', true).html('<i class="fas fa-check me-2"></i>Added to Cart');
            
            // Close modal after a delay
            setTimeout(() => {
                $('#quickViewModal').modal('hide');
                // Reset the button state for next time
                $(this).prop('disabled', false).html('<i class="fas fa-shopping-cart"></i> Add to Cart');
                // Remove the alert and view cart button for next time
                $('#quickViewModal .alert, #quickViewModal .btn-outline-primary').remove();
            }, 3000);
        });
        
        // Add to cart from product card
        $(document).on('click', '.product-image a', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            const product = allProducts.find(p => p.id === productId);
            
            if (product) {
                if (product.colors && product.colors.length > 1) {
                    // If there are multiple colors, open quick view
                    populateQuickViewModal(product);
                    $('#quickViewModal').modal('show');
                } else {
                    // Otherwise, add to cart directly
                    addToCart(product, 1);
                    showToast(`${product.name} added to cart!`);
                    updateCartCount();
                }
            }
        });
    }
    
    // Populate Quick View modal with product details
    function populateQuickViewModal(product) {
        const modal = $('#quickViewModal');
        
        // Set product details
        modal.find('.product-title').text(product.name);
        modal.find('.product-category').text(product.category);
        
        // Set availability
        const availability = product.stock.status === 'in_stock'
            ? `<span class="text-success">In Stock (${product.stock.quantity} available)</span>`
            : '<span class="text-danger">Out of Stock</span>';
        modal.find('.product-availability').html(availability);
        
        // Set price
        let priceHtml = '';
        if (product.oldPrice) {
            priceHtml += `<span class="old-price">${formatPrice(product.oldPrice)}</span> `;
        }
        priceHtml += `<span class="current-price">${formatPrice(product.price)}</span>`;
        modal.find('.product-price').html(priceHtml);
        
        // Set rating
        modal.find('.product-rating').html(`
            ${generateStars(product.rating)}
            <span class="text-muted ms-1">(${product.reviews} reviews)</span>
        `);
        
        // Set description
        modal.find('.product-description').text(product.description);
        
        // Set main image
        modal.find('.main-image').attr('src', product.image).attr('alt', product.name);
        
        // Set gallery thumbnails
        let thumbnailsHtml = '';
        if (product.gallery && product.gallery.length) {
            thumbnailsHtml += `<img src="${product.image}" class="gallery-thumbnail active" width="60" height="60">`;
            
            product.gallery.forEach(img => {
                thumbnailsHtml += `<img src="${img}" class="gallery-thumbnail" width="60" height="60">`;
            });
        }
        modal.find('.gallery-thumbnails').html(thumbnailsHtml);
        
        // Set color options
        let colorsHtml = '';
        if (product.colors && product.colors.length) {
            product.colors.forEach(color => {
                const colorCode = getColorCode(color);
                colorsHtml += `
                    <button class="quick-view-color"
                            style="background-color: ${colorCode}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid transparent;"
                            data-color="${color}"
                            title="${color.charAt(0).toUpperCase() + color.slice(1)}">
                    </button>
                `;
            });
        } else {
            colorsHtml = '<p>No color options available</p>';
        }
        modal.find('.color-options').html(colorsHtml);
        
        // Set size options
        let sizesHtml = '';
        if (product.sizes && product.sizes.length) {
            product.sizes.forEach(size => {
                sizesHtml += `
                    <button class="quick-view-size btn btn-outline-secondary btn-sm"
                            data-size="${size}">
                        ${size}
                    </button>
                `;
            });
        } else {
            sizesHtml = '<p>No size options available</p>';
        }
        modal.find('.size-options').html(sizesHtml);
        
        // Set quantity max based on stock
        modal.find('.quantity-selector input').attr('data-max-stock', product.stock.quantity);
        
        // Set product ID for add to cart button and ensure it has the icon
        modal.find('.add-to-cart-btn')
            .attr('data-product-id', product.id)
            .html('<i class="fas fa-shopping-cart"></i> Add to Cart')
            .prop('disabled', false)
            .show();
            
        // Initialize the quantity selector
        modal.find('.quantity-selector input').val(1);
        
        // Ensure the button is visible when the modal is shown
        modal.on('shown.bs.modal', function() {
            // Scroll to the add to cart button
            const addToCartBtn = modal.find('.add-to-cart');
            if (addToCartBtn.length) {
                const modalBody = modal.find('.modal-body');
                modalBody.animate({
                    scrollTop: addToCartBtn.offset().top - modalBody.offset().top + modalBody.scrollTop()
                }, 300);
            }
        });
    }
    
    // Add to cart function
    function addToCart(product, quantity, color, size) {
        // Get existing cart from localStorage or initialize empty array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'default');

        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item =>
            item.id === product.id &&
            item.warna === selectedColor
        );
        
        if (existingItemIndex > -1) {
            // Update quantity if product already in cart
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.push({
                id: product.id,
                nama: product.name,
                warna: selectedColor,
                harga: product.price,
                quantity: quantity
            });
        }
        
        // Save cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Update cart count in header
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update the cart count badge
        $('.header-actions .fa-shopping-cart').parent().find('.badge').text(totalItems);
    }
    
    // Show toast notification
    function showToast(message) {
        // Create toast container if it doesn't exist
        if (!$('#toastContainer').length) {
            $('body').append('<div id="toastContainer" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100;"></div>');
        }
        
        // Create unique ID for this toast
        const toastId = 'toast-' + Date.now();
        
        // Create toast HTML
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-shopping-cart me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        // Add toast to container
        $('#toastContainer').append(toastHtml);
        
        // Initialize and show the toast
        const toastElement = new bootstrap.Toast(document.getElementById(toastId), {
            autohide: true,
            delay: 3000
        });
        toastElement.show();
        
        // Remove toast from DOM after it's hidden
        $(`#${toastId}`).on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }
    
    // Get color code from color name
    function getColorCode(colorName) {
        const colorMap = {
            'black': '#000000',
            'white': '#FFFFFF',
            'red': '#FF0000',
            'blue': '#0000FF',
            'pink': '#FFB0CD',
            'brown': '#8B4513',
            'gray': '#808080',
            'navy': '#000080',
            'silver': '#C0C0C0',
            'gold': '#FFD700',
            'rose gold': '#FFC0CB',
            'beige': '#F5F5DC',
            'nude': '#D2B48C'
        };
        
        return colorMap[colorName.toLowerCase()] || '#CCCCCC';
    }

})(jQuery);

// Add product badge styles
const productBadgeStyle = document.createElement('style');
productBadgeStyle.textContent = `
    .product-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: var(--primary-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 12px;
        font-weight: 600;
        z-index: 1;
    }
    
    .stock-badge {
        top: 10px;
        right: 10px;
        left: auto;
        background: #28a745;
    }
    
    .out-of-stock {
        background: #dc3545;
    }
    
    .product-rating {
        font-size: 14px;
    }
    
    .product-description {
        font-size: 14px;
        color: var(--text-light);
        line-height: 1.6;
    }
    
    .product-tags .badge {
        font-size: 11px;
        font-weight: 500;
    }
`;
document.head.appendChild(productBadgeStyle);