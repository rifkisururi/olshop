/**
 * JSON Renderer - Fetches and renders content from home.json
 * Author: Recreation Project
 * Version: 1.0
 */

(function($) {
    'use strict';
    
    // Global variables
    let siteData = null;
    let currentPage = 'home';
    let currentLanguage = 'en';
    let currentCurrency = 'IDR';
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        fetchSiteData();
    });
    
    // Fetch site data from home.json
    function fetchSiteData() {
        // Show loading state
        $('#preloader').show();
        
        // Check if we're running from a file:// URL
        const isLocalFile = window.location.protocol === 'file:';
        
        if (isLocalFile) {
            // Use jQuery's $.getJSON for local files
            $.getJSON('home.json')
                .done(function(data) {
                    // Store the data globally
                    siteData = data;
                    
                    // Render the content
                    renderContent();
                    
                    // Initialize functionality
                    initFunctionality();
                    
                    // Hide preloader
                    setTimeout(() => {
                        $('#preloader').fadeOut('slow');
                    }, 500);
                })
                .fail(function(jqxhr, textStatus, error) {
                    // If jQuery method fails, show a more helpful error message
                    const errorMsg = `
                        <p>Failed to load the JSON file due to browser security restrictions when running from the file system.</p>
                        <p>To fix this, you can:</p>
                        <ol>
                            <li>Use a local web server to serve the files. For example:
                                <ul>
                                    <li>With Node.js: Install http-server (<code>npm install -g http-server</code>) and run <code>http-server</code> in the project directory</li>
                                    <li>With Python: Run <code>python -m http.server</code> in the project directory</li>
                                </ul>
                            </li>
                            <li>Or open the site in a browser that allows local file access (some browsers have flags to enable this)</li>
                        </ol>
                    `;
                    handleFetchError(new Error(errorMsg), true);
                });
        } else {
            // Use fetch API for HTTP/HTTPS
            fetch('home.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Store the data globally
                    siteData = data;
                    
                    // Render the content
                    renderContent();
                    
                    // Initialize functionality
                    initFunctionality();
                    
                    // Hide preloader
                    setTimeout(() => {
                        $('#preloader').fadeOut('slow');
                    }, 500);
                })
                .catch(error => {
                    // Handle errors
                    handleFetchError(error);
                });
        }
    }
    
    // Render content based on the JSON data
    function renderContent() {
        if (!siteData) return;
        
        // Render meta information
        renderMetaInfo();
        
        // Apply dynamic styles
        applyDynamicStyles();
        
        // Render header
        renderHeader();
        
        // Render main content
        renderMainContent();
        
        // Render footer
        renderFooter();
        
        // Render modals
        renderModals();
    }
    
    // Render meta information
    function renderMetaInfo() {
        const globalMeta = siteData.global.meta;
        const pageMeta = siteData.pages[currentPage].meta;
        
        // Set title and meta tags
        document.title = pageMeta.title || globalMeta.defaultTitle;
        
        let metaHTML = `
            <meta name="description" content="${pageMeta.description || globalMeta.defaultDescription}">
            <meta name="keywords" content="${globalMeta.defaultKeywords}">
            <meta name="robots" content="index, follow">
            
            <!-- Open Graph Meta Tags -->
            <meta property="og:title" content="${globalMeta.openGraph.title}">
            <meta property="og:type" content="${globalMeta.openGraph.type}">
            <meta property="og:url" content="${globalMeta.openGraph.url}">
            <meta property="og:description" content="${globalMeta.openGraph.description}">
            <meta property="og:site_name" content="${globalMeta.openGraph.siteName}">
            
            <!-- Twitter Card Meta Tags -->
            <meta name="twitter:card" content="${globalMeta.twitterCard.card}">
            <meta name="twitter:title" content="${globalMeta.twitterCard.title}">
            <meta name="twitter:description" content="${globalMeta.twitterCard.description}">
            
            <!-- Favicon -->
            <link rel="icon" type="image/x-icon" href="${globalMeta.favicon}">
        `;
        
        $('#meta-container').html(metaHTML);
    }
    
    // Apply dynamic styles from JSON
    function applyDynamicStyles() {
        const colors = siteData.global.styling.colors;
        
        let stylesCSS = `
            :root {
                --primary-color: ${colors.primary};
                --primary-hover: ${colors.primaryHover};
                --primary-soft: ${colors.primarySoft};
                --secondary-color: ${colors.secondary};
                --text-dark: ${colors.textDark};
                --text-light: ${colors.textLight};
                --border-color: ${colors.borderColor};
                --bg-light: ${colors.bgLight};
                --white: ${colors.white};
                --black: ${colors.black};
                --transition: ${siteData.global.styling.transitions.default};
            }
            
            /* General Styles */
            body {
                padding-top: 120px;
            }
            
            /* Back to Top Button */
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 40px;
                height: 40px;
                background-color: var(--primary-color);
                color: var(--white);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: var(--transition);
                z-index: 999;
            }
            
            .back-to-top.show {
                opacity: 1;
                visibility: visible;
            }
            
            /* Header Styles */
            .header-area.sticky {
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            /* Notification Styles */
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
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
            
            /* Product Card Styles */
            .product-card {
                transition: var(--transition);
                border-radius: 8px;
                overflow: hidden;
                height: 100%;
                background-color: var(--white);
                margin-bottom: 20px;
            }
            
            .product-card:hover {
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                transform: translateY(-5px);
            }
            
            .product-image {
                position: relative;
                overflow: hidden;
                background-color: #f9f9f9;
            }
            
            .product-image img {
                transition: transform 0.5s ease;
                height: 250px;
                object-fit: cover;
            }
            
            .product-card:hover .product-image img {
                transform: scale(1.05);
            }
            
            .product-actions {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                padding: 10px;
                background-color: rgba(255,255,255,0.9);
                transition: var(--transition);
                opacity: 0;
            }
            
            .product-card:hover .product-actions {
                opacity: 1;
            }
            
            .product-actions button {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0 5px;
                transition: var(--transition);
            }
            
            .product-actions button:hover {
                background-color: var(--primary-hover);
                transform: translateY(-3px);
            }
            
            .product-info {
                padding: 15px;
                text-align: center;
            }
            
            .product-category {
                color: var(--text-light);
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .product-title {
                margin: 8px 0;
                font-weight: 500;
                font-size: 16px;
                line-height: 1.4;
            }
            
            .product-title a:hover {
                color: var(--primary-color) !important;
            }
            
            .product-price {
                font-weight: 600;
                margin-top: 10px;
            }
            
            .old-price {
                text-decoration: line-through;
                color: var(--text-light);
                margin-right: 10px;
                font-size: 14px;
            }
            
            /* Badge Styles */
            .badge {
                font-size: 11px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 5px 10px;
                border-radius: 4px;
            }
        `;
        
        $('#dynamic-styles').html(stylesCSS);
    }
    
    // Render header
    function renderHeader() {
        const header = siteData.global.header;
        
        // Build top bar HTML
        let topBarHTML = `
            <div class="header-top bg-light py-2">
                <div class="container-fluid">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <div class="d-flex align-items-center">
                                <!-- Language Selector -->
                                <div class="dropdown me-3">
                                    <button class="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                        <img src="${header.topBar.languages.find(lang => lang.code === currentLanguage).flag}" alt="${currentLanguage}" width="20" class="me-1">
                                        ${header.topBar.languages.find(lang => lang.code === currentLanguage).name}
                                    </button>
                                    <ul class="dropdown-menu">
                                        ${header.topBar.languages.map(lang => `
                                            <li><a class="dropdown-item ${lang.code === currentLanguage ? 'active' : ''}" href="#" data-lang="${lang.code}">
                                                <img src="${lang.flag}" alt="${lang.name}" width="20" class="me-2">${lang.name}
                                            </a></li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <!-- Currency Selector -->
                                <div class="dropdown">
                                    <button class="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                        ${header.topBar.currencies.find(curr => curr.code === currentCurrency).name}
                                    </button>
                                    <ul class="dropdown-menu">
                                        ${header.topBar.currencies.map(curr => `
                                            <li><a class="dropdown-item ${curr.code === currentCurrency ? 'active' : ''}" href="#" data-currency="${curr.code}">${curr.name}</a></li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 text-end d-none d-md-block">
                            ${header.topBar.links.map(link => `
                                <a href="${link.url}" class="text-decoration-none me-3">${link.text}</a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Build navigation HTML
        let navHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div class="container-fluid">
                    <!-- Logo -->
                    <a class="navbar-brand" href="index.html">
                        <img src="${header.logo.src}" alt="${header.logo.alt}" height="${header.logo.height}">
                    </a>

                    <!-- Mobile Toggle -->
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <!-- Navigation -->
                    <div class="collapse navbar-collapse" id="navbarMain">
                        <ul class="navbar-nav mx-auto">
                            ${header.navigation.map(item => {
                                if (item.dropdown) {
                                    return `
                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle ${item.active ? 'active' : ''}" href="${item.url}" data-bs-toggle="dropdown">${item.text}</a>
                                            <ul class="dropdown-menu">
                                                ${item.dropdown.map(dropItem => `
                                                    <li><a class="dropdown-item" href="${dropItem.url}">${dropItem.text}</a></li>
                                                `).join('')}
                                            </ul>
                                        </li>
                                    `;
                                } else {
                                    return `
                                        <li class="nav-item">
                                            <a class="nav-link ${item.active ? 'active' : ''}" href="${item.url}" ${item.target ? `target="${item.target}"` : ''}>${item.text}</a>
                                        </li>
                                    `;
                                }
                            }).join('')}
                        </ul>

                        <!-- Header Actions -->
                        <div class="header-actions d-flex align-items-center">
                            ${header.actions.map(action => {
                                if (action.type === 'wishlist') {
                                    return `
                                        <a href="${action.url}" class="btn btn-link p-2 position-relative">
                                            <i class="${action.icon}"></i>
                                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">${action.badge}</span>
                                        </a>
                                    `;
                                } else if (action.type === 'user') {
                                    return `
                                        <div class="dropdown">
                                            <button class="btn btn-link p-2" data-bs-toggle="dropdown">
                                                <i class="${action.icon}"></i>
                                            </button>
                                            <ul class="dropdown-menu dropdown-menu-end">
                                                ${action.dropdown.map(item => `
                                                    <li><a class="dropdown-item" href="${item.url}">${item.text}</a></li>
                                                `).join('')}
                                            </ul>
                                        </div>
                                    `;
                                }
                            }).join('')}
                        </div>
                    </div>
                </div>
            </nav>
        `;
        
        // Combine and insert into header container
        $('#header-container').html(`
            <div class="header-area fixed-top">
                ${topBarHTML}
                ${navHTML}
            </div>
        `);
    }
    
    // Render main content
    function renderMainContent() {
        const pageData = siteData.pages[currentPage];
        
        // For home page
        if (currentPage === 'home') {
            let mainHTML = '';
            
            // Hero Slider
            mainHTML += `
                <section class="hero-slider">
                    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${pageData.heroSlider.items.map((slide, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${slide.image}" class="d-block w-100" alt="${slide.alt}">
                                </div>
                            `).join('')}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </section>
            `;
            
            // Banner Section
            mainHTML += `
                <section class="banner-section py-5">
                    <div class="container-fluid">
                        <div class="row g-4">
                            ${pageData.bannerSection.items.map(banner => `
                                <div class="col-lg-6">
                                    <div class="banner-item">
                                        <a href="${banner.link}">
                                            <img src="${banner.image}" class="img-fluid rounded" alt="${banner.alt}">
                                        </a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>
            `;
            
            // Featured Products
            mainHTML += `
                <section class="featured-products py-5">
                    <div class="container-fluid">
                        <div class="section-header text-center mb-5">
                            <h2 class="section-title">${pageData.featuredProducts.title}</h2>
                            <p class="section-subtitle">${pageData.featuredProducts.subtitle}</p>
                        </div>
                        <div class="row g-4">
                            ${pageData.featuredProducts.items.map(product => renderProductCard(product)).join('')}
                        </div>
                    </div>
                </section>
            `;
            
            // Best Selling Products
            mainHTML += `
                <section class="best-selling py-5 bg-light">
                    <div class="container-fluid">
                        <div class="section-header text-center mb-5">
                            <h2 class="section-title">${pageData.bestSellingProducts.title}</h2>
                            <p class="section-subtitle">${pageData.bestSellingProducts.subtitle}</p>
                        </div>
                        <div class="row g-4">
                            ${pageData.bestSellingProducts.items.map(product => renderProductCard(product)).join('')}
                        </div>
                    </div>
                </section>
            `;
            
            // Info Banners
            mainHTML += `
                <section class="info-banners py-5">
                    <div class="container-fluid">
                        <div class="row g-4">
                            ${pageData.infoBanners.items.map(banner => `
                                <div class="col-lg-4">
                                    <div class="info-banner text-center">
                                        <a href="${banner.link}">
                                            <img src="${banner.image}" class="img-fluid rounded" alt="${banner.alt}">
                                        </a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>
            `;
            
            // Newsletter
            mainHTML += `
                <section class="newsletter py-5 bg-primary text-white">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-5">
                                <div class="newsletter-content">
                                    <h3>${pageData.newsletter.title}</h3>
                                    <p>${pageData.newsletter.subtitle}</p>
                                </div>
                            </div>
                            <div class="col-lg-7">
                                <form class="newsletter-form">
                                    <div class="input-group">
                                        <input type="email" class="form-control" placeholder="${pageData.newsletter.placeholder}" required>
                                        <button class="btn btn-light" type="submit">${pageData.newsletter.buttonText}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            `;
            
            // Insert into main content container
            $('#main-content').html(mainHTML);
        }
        
        // For other pages, implement similar rendering logic
        // ...
    }
    
    // Helper function to render a product card
    function renderProductCard(product) {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="product-card shadow-sm rounded overflow-hidden">
                    <div class="product-image position-relative">
                    
                        <a class="mx-1 quick-view-btn" data-product-id="${product.id}" data-bs-toggle="modal" data-bs-target="#addToCartModal" title="Quick View">
                            <img src="${product.image}" alt="${product.name}" class="img-fluid w-100" loading="lazy">
                        </a>
                        ${product.oldPrice ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2 px-2 py-1">Sale</span>` : ''}
                        ${product.tags.includes('new') ? `<span class="badge bg-success position-absolute top-0 end-0 m-2 px-2 py-1">New</span>` : ''}
                        
                    </div>
                    <div class="product-info p-3 bg-white">
                        <div class="product-category text-muted small mb-1">${product.category}</div>
                        <h5 class="product-title mb-2">
                            <a href="#" class="text-decoration-none text-dark">${product.name}</a>
                        </h5>
                        <div class="product-price">
                            ${product.oldPrice ? `<span class="old-price text-decoration-line-through text-muted me-2">Rp ${formatPrice(product.oldPrice)}</span>` : ''}
                            <span class="fw-bold text-primary">Rp ${formatPrice(product.price)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render footer
    function renderFooter() {
        const footer = siteData.global.footer;
        
        let footerHTML = `
            <div class="footer-area pt-5 pb-3">
                <div class="container-fluid">
                    <div class="row">
                        <!-- Company Info -->
                        <div class="col-lg-3 col-md-6 mb-4">
                            <div class="footer-widget">
                                <img src="${footer.companyInfo.logo}" alt="Jims Honey" height="50" class="mb-3">
                                <p>${footer.companyInfo.description}</p>
                                <div class="contact-info mt-4">
                                    <h5>${footer.companyInfo.contactHeading}</h5>
                                    <h4 class="text-primary">${footer.companyInfo.contactPhone}</h4>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Contact Info -->
                        <div class="col-lg-3 col-md-6 mb-4">
                            <div class="footer-widget">
                                <h4>Contact Info</h4>
                                <ul class="list-unstyled">
                                    <li class="mb-3">
                                        <strong>Address:</strong><br>
                                        ${footer.contactInfo.address}
                                    </li>
                                    <li class="mb-3">
                                        <strong>Phone:</strong><br>
                                        ${footer.contactInfo.phone}
                                    </li>
                                    <li class="mb-3">
                                        <strong>Email:</strong><br>
                                        <a href="mailto:${footer.contactInfo.email}">${footer.contactInfo.email}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Social Media -->
                        <div class="col-lg-2 col-md-6 mb-4">
                            <div class="footer-widget">
                                <h4>Social Media</h4>
                                <ul class="list-unstyled">
                                    ${footer.socialMedia.map(social => `
                                        <li class="mb-2">
                                            <a href="${social.url}" target="_blank">
                                                <i class="${social.icon}"></i> ${social.platform}
                                            </a>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Map -->
                        <div class="col-lg-4 col-md-6 mb-4">
                            <div class="footer-widget">
                                <iframe src="${footer.mapEmbed}" 
                                        width="100%" 
                                        height="300" 
                                        style="border:0;" 
                                        allowfullscreen="" 
                                        loading="lazy">
                                </iframe>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Copyright -->
                    <div class="row mt-4 pt-4 border-top">
                        <div class="col-md-6">
                            <p class="mb-0">${footer.copyright}</p>
                        </div>
                        <div class="col-md-6 text-md-end">
                            ${footer.paymentMethods.map(payment => `
                                <img src="${payment.image}" alt="${payment.name}" height="30" class="me-2">
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#footer-container').html(footerHTML);
    }
    
    // Render modals
    function renderModals() {
        const modals = siteData.global.modals;
        let modalsHTML = '';
        
        // Search Modal
        modalsHTML += `
            <div class="modal fade" id="${modals.search.id}" tabindex="-1">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${modals.search.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body d-flex align-items-center justify-content-center">
                            <form class="search-form w-75">
                                <input type="search" class="form-control form-control-lg" placeholder="${modals.search.placeholder}">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to Cart Modal
        modalsHTML += `
            <div class="modal fade" id="${modals.addToCart.id}" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${modals.addToCart.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Product details will be loaded dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#modals-container').html(modalsHTML);
    }
    
    // Initialize functionality
    function initFunctionality() {
        // Quick view button
        $(document).on('click', '.quick-view-btn', function() {
            const productId = $(this).data('product-id');
            showProductModal(productId);
        });
        
        // Add to cart button
        $(document).on('click', '.add-to-cart-btn', function() {
            const productId = $(this).data('product-id');
            addToCart(productId);
        });
        
        // Add to wishlist button
        $(document).on('click', '.add-to-wishlist-btn', function() {
            const productId = $(this).data('product-id');
            toggleWishlist(productId);
        });
        
        // Language selector
        $(document).on('click', '.dropdown-menu a[data-lang]', function(e) {
            e.preventDefault();
            currentLanguage = $(this).data('lang');
            renderContent();
            showNotification('info', `Language changed to ${currentLanguage}`);
        });
        
        // Currency selector
        $(document).on('click', '.dropdown-menu a[data-currency]', function(e) {
            e.preventDefault();
            currentCurrency = $(this).data('currency');
            renderContent();
            showNotification('info', `Currency changed to ${currentCurrency}`);
        });
        
        // Newsletter form
        $(document).on('submit', '.newsletter-form', function(e) {
            e.preventDefault();
            const email = $(this).find('input[type="email"]').val();
            
            // Show loading state
            const $btn = $(this).find('button');
            const originalText = $btn.text();
            $btn.html('<span class="spinner-border spinner-border-sm me-2"></span> Subscribing...').prop('disabled', true);
            
            // Simulate API call
            setTimeout(() => {
                showNotification('success', 'Successfully subscribed to newsletter!');
                $(this).find('input[type="email"]').val('');
                $btn.html(originalText).prop('disabled', false);
            }, 1500);
        });
        
        // Search form
        $(document).on('submit', '.search-form', function(e) {
            e.preventDefault();
            const searchTerm = $(this).find('input').val();
            if (searchTerm.trim()) {
                window.location.href = `pages/shop.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
        
        // Back to top button
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
        
        // Sticky header
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.header-area').addClass('sticky');
            } else {
                $('.header-area').removeClass('sticky');
            }
        });
    }
    
    // Show product modal
    function showProductModal(productId) {
        // Find the product in the data
        let product = null;
        const pages = Object.keys(siteData.pages);
        
        for (const page of pages) {
            const pageData = siteData.pages[page];
            
            // Check in featured products
            if (pageData.featuredProducts && pageData.featuredProducts.items) {
                const found = pageData.featuredProducts.items.find(item => item.id === productId);
                if (found) {
                    product = found;
                    break;
                }
            }
            
            // Check in best selling products
            if (pageData.bestSellingProducts && pageData.bestSellingProducts.items) {
                const found = pageData.bestSellingProducts.items.find(item => item.id === productId);
                if (found) {
                    product = found;
                    break;
                }
            }
        }
        
        if (product) {
            const modalHtml = `
                <div class="row">
                    <div class="col-md-6">
                        <img src="${product.image}" class="img-fluid" alt="${product.name}">
                    </div>
                    <div class="col-md-6">
                        <h3>${product.name}</h3>
                        <p class="text-muted">${product.category}</p>
                        <div class="product-price mb-3">
                            ${product.oldPrice ? `<span class="old-price">Rp ${formatPrice(product.oldPrice)}</span>` : ''}
                            <span class="fw-bold fs-4">Rp ${formatPrice(product.price)}</span>
                        </div>
                        
                        <div class="product-description mb-3">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        
                        ${product.colors.length > 0 ? `
                            <div class="product-colors mb-3">
                                <h6>Colors:</h6>
                                <div class="d-flex">
                                    ${product.colors.map(color => `
                                        <div class="color-option me-2" style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;" data-color="${color}"></div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${product.sizes.length > 0 ? `
                            <div class="product-sizes mb-3">
                                <h6>Sizes:</h6>
                                <div class="d-flex">
                                    ${product.sizes.map(size => `
                                        <div class="size-option me-2 border px-3 py-1" style="cursor: pointer;" data-size="${size}">${size}</div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="product-quantity mb-3">
                            <h6>Quantity:</h6>
                            <div class="input-group" style="width: 130px;">
                                <button class="btn btn-outline-secondary quantity-minus" type="button">-</button>
                                <input type="text" class="form-control text-center quantity-input" value="1">
                                <button class="btn btn-outline-secondary quantity-plus" type="button">+</button>
                            </div>
                        </div>
                        
                        <div class="product-quantity mb-4">
                            <div class="d-flex flex-wrap gap-2">
                                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                                    <i class="fas fa-shopping-cart me-2"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                        
                        <!-- Original buttons removed to avoid duplication -->
                    </div>
                </div>
            `;
            
            $(`#${siteData.global.modals.addToCart.id} .modal-body`).html(modalHtml);
        }
    }
    
    // Add to cart
    function addToCart(productId, quantity = 1) {
        // In a real application, this would add the product to the cart
        showNotification('success', 'Product added to cart!');
    }
    
    // Toggle wishlist
    function toggleWishlist(productId) {
        // In a real application, this would toggle the product in the wishlist
        showNotification('success', 'Product added to wishlist!');
    }
    
    // Show notification
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
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            notification.alert('close');
        }, 3000);
    }
    
    // Format price
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Handle fetch error
    function handleFetchError(error, isHTML = false) {
        console.error('Error fetching site data:', error);
        
        // Hide preloader
        $('#preloader').hide();
        
        // Show error message
        $('#error-container').removeClass('d-none').addClass('alert alert-danger m-3');
        
        if (isHTML) {
            $('#error-container').html(`
                <h4>Error Loading Content</h4>
                ${error.message}
            `);
        } else {
            $('#error-container').html(`
                <h4>Error Loading Content</h4>
                <p>${error.message}</p>
                <p>Please try refreshing the page or contact support if the problem persists.</p>
            `);
        }
    }
    
})(jQuery);