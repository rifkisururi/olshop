/**
 * Jims Honey - Main JavaScript
 * Author: Recreation Project
 * Version: 1.0
 */

(function($) {
    'use strict';

    // Global variables
    const CURRENCY_RATES = {
        'IDR': 1,
        'USD': 0.000065
    };

    let currentCurrency = 'IDR';
    let cart = [];
    let wishlist = [];

    // Initialize when DOM is ready
    $(document).ready(function() {
        initPreloader();
        initNavigation();
        initProductCards();
        initBackToTop();
        initModals();
        initNewsletter();
        initLanguageSelector();
        initCurrencySelector();
        loadFeaturedProducts();
        loadBestSellingProducts();
    });

    // Preloader
    function initPreloader() {
        $(window).on('load', function() {
            $('#preloader').fadeOut('slow', function() {
                $(this).remove();
            });
        });
    }

    // Navigation
    function initNavigation() {
        // Sticky header on scroll
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.header-area').addClass('sticky');
            } else {
                $('.header-area').removeClass('sticky');
            }
        });

        // Mobile menu enhancements
        $('.navbar-toggler').click(function() {
            $('body').toggleClass('mobile-menu-active');
        });

        // Close mobile menu when clicking outside
        $(document).click(function(e) {
            if (!$(e.target).closest('.navbar').length) {
                $('.navbar-collapse').collapse('hide');
                $('body').removeClass('mobile-menu-active');
            }
        });

        // Smooth scroll for anchor links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            const target = $(this.hash);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 800);
            }
        });
    }

    // Product Cards
    function initProductCards() {
        // Quick view button
        $(document).on('click', '.quick-view-btn', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            showProductModal(productId);
        });

        // Add to cart button
        $(document).on('click', '.add-to-cart-btn', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            addToCart(productId);
        });

        // Add to wishlist button
        $(document).on('click', '.add-to-wishlist-btn', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            toggleWishlist(productId);
        });
    }

    // Back to Top
    function initBackToTop() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300) {
                $('#backToTop').addClass('show');
            } else {
                $('#backToTop').removeClass('show');
            }
        });

        $('#backToTop').click(function(e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, 800);
        });
    }

    // Modals
    function initModals() {
        // Search modal focus
        $('#searchModal').on('shown.bs.modal', function() {
            $(this).find('input[type="search"]').focus();
        });

        // Search functionality
        $('.search-form').on('submit', function(e) {
            e.preventDefault();
            const searchTerm = $(this).find('input').val();
            if (searchTerm.trim()) {
                window.location.href = `pages/shop.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // Newsletter
    function initNewsletter() {
        $('.newsletter-form').on('submit', function(e) {
            e.preventDefault();
            const email = $(this).find('input[type="email"]').val();
            
            // Show loading state
            const $btn = $(this).find('button');
            const originalText = $btn.text();
            $btn.html('<span class="loading-spinner"></span> Subscribing...').prop('disabled', true);

            // Simulate API call
            setTimeout(() => {
                showNotification('success', 'Successfully subscribed to newsletter!');
                $(this).find('input[type="email"]').val('');
                $btn.html(originalText).prop('disabled', false);
            }, 1500);
        });
    }

    // Language Selector
    function initLanguageSelector() {
        $('.dropdown-menu a[data-lang]').click(function(e) {
            e.preventDefault();
            const lang = $(this).data('lang');
            // In a real application, this would change the site language
            console.log('Language changed to:', lang);
            location.reload(); // Simulate language change
        });
    }

    // Currency Selector
    function initCurrencySelector() {
        $('.dropdown-menu a[data-currency]').click(function(e) {
            e.preventDefault();
            currentCurrency = $(this).data('currency');
            updateCurrencyDisplay();
            showNotification('info', `Currency changed to ${currentCurrency}`);
        });
    }

    // Load Featured Products
    function loadFeaturedProducts() {
        const products = generateSampleProducts(8);
        const html = products.map(product => createProductCard(product)).join('');
        $('#featuredProducts').html(html);
        animateProducts('#featuredProducts');
    }

    // Load Best Selling Products
    function loadBestSellingProducts() {
        const products = generateSampleProducts(8, true);
        const html = products.map(product => createProductCard(product)).join('');
        $('#bestSellingProducts').html(html);
        animateProducts('#bestSellingProducts');
    }

    // Create Product Card HTML
    function createProductCard(product) {
        const price = formatPrice(product.price);
        const oldPrice = product.oldPrice ? formatPrice(product.oldPrice) : '';
        
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <div class="product-actions">
                            <button class="quick-view-btn" data-product-id="${product.id}" title="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="add-to-wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="add-to-cart-btn" data-product-id="${product.id}" title="Add to Cart">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h5 class="product-title">${product.name}</h5>
                        <div class="product-price">
                            ${oldPrice ? `<span class="old-price">${oldPrice}</span>` : ''}
                            <span>${price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate Sample Products
    function generateSampleProducts(count, isBestSelling = false) {
        const categories = ['BAG', 'WALLET', 'WATCH', 'HEELS'];
        const products = [];
        
        for (let i = 1; i <= count; i++) {
            const hasDiscount = Math.random() > 0.5;
            const basePrice = Math.floor(Math.random() * 500000) + 100000;
            
            products.push({
                id: `${isBestSelling ? 'best' : 'feat'}-${i}`,
                name: `${isBestSelling ? 'Best Seller' : 'Featured'} Product ${i}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                price: hasDiscount ? basePrice * 0.8 : basePrice,
                oldPrice: hasDiscount ? basePrice : null,
                image: `images/products/product-${i}.jpg`
            });
        }
        
        return products;
    }

    // Format Price
    function formatPrice(price) {
        if (currentCurrency === 'USD') {
            const usdPrice = price * CURRENCY_RATES.USD;
            return `$${usdPrice.toFixed(2)}`;
        }
        return `Rp ${price.toLocaleString('id-ID')}`;
    }

    // Update Currency Display
    function updateCurrencyDisplay() {
        $('.product-price span').each(function() {
            const text = $(this).text();
            // This is a simplified version - in reality, you'd store the original price
            // and recalculate based on the selected currency
            if (currentCurrency === 'USD' && text.startsWith('Rp')) {
                const price = parseInt(text.replace(/[^\d]/g, ''));
                const usdPrice = price * CURRENCY_RATES.USD;
                $(this).text(`$${usdPrice.toFixed(2)}`);
            } else if (currentCurrency === 'IDR' && text.startsWith('$')) {
                const price = parseFloat(text.replace('$', ''));
                const idrPrice = price / CURRENCY_RATES.USD;
                $(this).text(`Rp ${Math.round(idrPrice).toLocaleString('id-ID')}`);
            }
        });
    }

    // Show Product Modal
    function showProductModal(productId) {
        // In a real application, this would fetch product details from an API
        const product = {
            id: productId,
            name: 'Sample Product',
            category: 'BAG',
            price: 250000,
            description: 'This is a high-quality product from Jims Honey collection.',
            images: ['images/products/product-1.jpg', 'images/products/product-2.jpg']
        };

        const modalHtml = `
            <div class="row">
                <div class="col-md-6">
                    <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${product.images.map((img, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${img}" class="d-block w-100" alt="${product.name}">
                                </div>
                            `).join('')}
                        </div>
                        ${product.images.length > 1 ? `
                            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="col-md-6">
                    <h3>${product.name}</h3>
                    <p class="text-muted">${product.category}</p>
                    <h4 class="text-primary mb-3">${formatPrice(product.price)}</h4>
                    <p>${product.description}</p>
                    <div class="mt-4">
                        <div class="input-group mb-3" style="max-width: 150px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="decreaseQuantity()">-</button>
                            <input type="number" class="form-control text-center" value="1" min="1" id="productQuantity">
                            <button class="btn btn-outline-secondary" type="button" onclick="increaseQuantity()">+</button>
                        </div>
                        <button class="btn btn-primary" onclick="addToCartFromModal('${product.id}')">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-primary ms-2" onclick="toggleWishlist('${product.id}')">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        $('#addToCartModal .modal-body').html(modalHtml);
        $('#addToCartModal').modal('show');
    }

    // Add to Cart
    function addToCart(productId, quantity = 1) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity: quantity });
        }
        
        updateCartCount();
        showNotification('success', 'Product added to cart!');
    }

    // Toggle Wishlist
    function toggleWishlist(productId) {
        const index = wishlist.indexOf(productId);
        
        if (index > -1) {
            wishlist.splice(index, 1);
            showNotification('info', 'Product removed from wishlist');
        } else {
            wishlist.push(productId);
            showNotification('success', 'Product added to wishlist!');
        }
        
        updateWishlistCount();
    }

    // Update Cart Count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        $('.header-actions .fa-shopping-cart').siblings('.badge').text(totalItems);
    }

    // Update Wishlist Count
    function updateWishlistCount() {
        $('.header-actions .fa-heart').siblings('.badge').text(wishlist.length);
    }

    // Show Notification
    function showNotification(type, message) {
        const alertClass = type === 'success' ? 'alert-success' : 
                          type === 'error' ? 'alert-danger' : 
                          type === 'info' ? 'alert-info' : 'alert-warning';
        
        const notification = $(`
            <div class="alert ${alertClass} alert-dismissible fade show notification" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Position the notification
        notification.css({
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 9999,
            minWidth: '300px'
        });
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            notification.alert('close');
        }, 3000);
    }

    // Animate Products on Scroll
    function animateProducts(container) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('fade-in');
                }
            });
        }, { threshold: 0.1 });

        $(container).find('.product-card').each(function() {
            observer.observe(this);
        });
    }

    // Global functions for modal
    window.increaseQuantity = function() {
        const input = $('#productQuantity');
        input.val(parseInt(input.val()) + 1);
    };

    window.decreaseQuantity = function() {
        const input = $('#productQuantity');
        const currentVal = parseInt(input.val());
        if (currentVal > 1) {
            input.val(currentVal - 1);
        }
    };

    window.addToCartFromModal = function(productId) {
        const quantity = parseInt($('#productQuantity').val());
        addToCart(productId, quantity);
        $('#addToCartModal').modal('hide');
    };

})(jQuery);

// Additional CSS for sticky header
const style = document.createElement('style');
style.textContent = `
    .header-area.sticky {
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .notification {
        animation: slideInRight 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);