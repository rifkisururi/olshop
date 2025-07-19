# JSON-Based Web Application Implementation Guide (Part 2)

This is a continuation of the implementation guide for our JSON-based web application.

## 3. json-renderer.js (continued)

Continuing from where we left off in the previous document, here's the complete code for the `json-renderer.js` file:

```javascript
                <section class="featured-products py-5">
                    <div class="container-fluid">
                        <div class="section-heading text-center mb-4">
                            <h2>${pageData.featuredProducts.title}</h2>
                            <p>${pageData.featuredProducts.subtitle}</p>
                        </div>
                        <div class="row g-4">
                            ${pageData.featuredProducts.items.map(product => renderProductCard(product)).join('')}
                        </div>
                    </div>
                </section>
            `;
            
            // Best Selling Products
            mainHTML += `
                <section class="best-selling-products py-5 bg-light">
                    <div class="container-fluid">
                        <div class="section-heading text-center mb-4">
                            <h2>${pageData.bestSellingProducts.title}</h2>
                            <p>${pageData.bestSellingProducts.subtitle}</p>
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
                                <div class="col-md-4">
                                    <div class="info-banner">
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
                <section class="newsletter-section py-5 bg-light">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-8 text-center">
                                <div class="newsletter-content">
                                    <h2>${pageData.newsletter.title}</h2>
                                    <p>${pageData.newsletter.subtitle}</p>
                                    <form class="newsletter-form mt-4">
                                        <div class="input-group">
                                            <input type="email" class="form-control" placeholder="${pageData.newsletter.placeholder}" required>
                                            <button class="btn btn-primary" type="submit">${pageData.newsletter.buttonText}</button>
                                        </div>
                                    </form>
                                </div>
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
            <div class="col-6 col-md-4 col-lg-3">
                <div class="product-card">
                    <div class="product-image position-relative">
                        <a href="#" class="d-block" data-product-id="${product.id}">
                            <img src="${product.image}" class="img-fluid" alt="${product.name}">
                        </a>
                        ${product.oldPrice ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">Sale</span>` : ''}
                        ${product.tags.includes('new') ? `<span class="badge bg-success position-absolute top-0 end-0 m-2">New</span>` : ''}
                        <div class="product-actions position-absolute bottom-0 start-0 end-0 d-flex justify-content-center mb-2">
                            <button class="btn btn-sm btn-primary mx-1 quick-view" data-product-id="${product.id}" data-bs-toggle="modal" data-bs-target="#addToCartModal">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-primary mx-1 add-to-wishlist" data-product-id="${product.id}">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info p-3 text-center">
                        <div class="product-category small text-muted">${product.category}</div>
                        <h5 class="product-title mt-1">
                            <a href="#" class="text-decoration-none text-dark">${product.name}</a>
                        </h5>
                        <div class="product-price">
                            ${product.oldPrice ? `<span class="text-decoration-line-through text-muted me-2">Rp ${formatPrice(product.oldPrice)}</span>` : ''}
                            <span class="fw-bold">Rp ${formatPrice(product.price)}</span>
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
            <div class="footer-area pt-5">
                <div class="container-fluid">
                    <div class="row">
                        <!-- Company Info -->
                        <div class="col-lg-4 mb-4">
                            <div class="footer-widget">
                                <div class="footer-logo mb-3">
                                    <img src="${footer.companyInfo.logo}" alt="Jims Honey" class="img-fluid" style="max-height: 50px;">
                                </div>
                                <p>${footer.companyInfo.description}</p>
                                <div class="footer-contact mt-4">
                                    <h5>${footer.companyInfo.contactHeading}</h5>
                                    <h4><a href="tel:${footer.contactInfo.phone}" class="text-decoration-none">${footer.companyInfo.contactPhone}</a></h4>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Contact Info -->
                        <div class="col-lg-4 mb-4">
                            <div class="footer-widget">
                                <h4 class="footer-widget-title">Contact Information</h4>
                                <ul class="footer-contact-info list-unstyled">
                                    <li class="d-flex mb-3">
                                        <i class="fas fa-map-marker-alt me-3 mt-1"></i>
                                        <span>${footer.contactInfo.address}</span>
                                    </li>
                                    <li class="d-flex mb-3">
                                        <i class="fas fa-phone-alt me-3 mt-1"></i>
                                        <span><a href="tel:${footer.contactInfo.phone}" class="text-decoration-none">${footer.contactInfo.phone}</a></span>
                                    </li>
                                    <li class="d-flex mb-3">
                                        <i class="fas fa-envelope me-3 mt-1"></i>
                                        <span><a href="mailto:${footer.contactInfo.email}" class="text-decoration-none">${footer.contactInfo.email}</a></span>
                                    </li>
                                </ul>
                                
                                <!-- Social Media -->
                                <div class="footer-social mt-4">
                                    <h5>Follow Us</h5>
                                    <div class="social-icons">
                                        ${footer.socialMedia.map(social => `
                                            <a href="${social.url}" class="me-3" target="_blank">
                                                <i class="${social.icon}"></i>
                                            </a>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Map -->
                        <div class="col-lg-4 mb-4">
                            <div class="footer-widget">
                                <h4 class="footer-widget-title">Find Us</h4>
                                <div class="footer-map">
                                    <iframe src="${footer.mapEmbed}" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer Bottom -->
                <div class="footer-bottom py-3 mt-4 bg-light">
                    <div class="container-fluid">
                        <div class="row align-items-center">
                            <div class="col-md-6 text-center text-md-start">
                                <p class="mb-md-0">${footer.copyright}</p>
                            </div>
                            <div class="col-md-6 text-center text-md-end">
                                <div class="payment-methods">
                                    ${footer.paymentMethods.map(payment => `
                                        <img src="${payment.image}" alt="${payment.name}" class="me-2" height="30">
                                    `).join('')}
                                </div>
                            </div>
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
            <div class="modal fade" id="${modals.search.id}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${modals.search.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form class="search-form">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="${modals.search.placeholder}" required>
                                    <button class="btn btn-primary" type="submit">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to Cart Modal
        modalsHTML += `
            <div class="modal fade" id="${modals.addToCart.id}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${modals.addToCart.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div id="quickViewImage" class="product-image">
                                        <!-- Product image will be inserted here -->
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div id="quickViewDetails" class="product-details">
                                        <!-- Product details will be inserted here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#modals-container').html(modalsHTML);
    }
    
    // Initialize functionality
    function initFunctionality() {
        // Quick View functionality
        $(document).on('click', '.quick-view', function() {
            const productId = $(this).data('product-id');
            
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
                // Populate the quick view modal
                $('#quickViewImage').html(`
                    <img src="${product.image}" class="img-fluid" alt="${product.name}">
                `);
                
                $('#quickViewDetails').html(`
                    <h4 class="product-title">${product.name}</h4>
                    <div class="product-category mb-2">${product.category}</div>
                    <div class="product-price mb-3">
                        ${product.oldPrice ? `<span class="text-decoration-line-through text-muted me-2">Rp ${formatPrice(product.oldPrice)}</span>` : ''}
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
                                    <div class="color-option me-2" style="background-color: ${color};" data-color="${color}"></div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${product.sizes.length > 0 ? `
                        <div class="product-sizes mb-3">
                            <h6>Sizes:</h6>
                            <div class="d-flex">
                                ${product.sizes.map(size => `
                                    <div class="size-option me-2 border px-3 py-1" data-size="${size}">${size}</div>
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
                    
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart me-2"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline-primary ms-2 add-to-wishlist" data-product-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                `);
            }
        });
        
        // Quantity buttons
        $(document).on('click', '.quantity-plus', function() {
            const input = $(this).siblings('.quantity-input');
            let value = parseInt(input.val());
            input.val(value + 1);
        });
        
        $(document).on('click', '.quantity-minus', function() {
            const input = $(this).siblings('.quantity-input');
            let value = parseInt(input.val());
            if (value > 1) {
                input.val(value - 1);
            }
        });
        
        // Back to top button
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300) {
                $('#backToTop').fadeIn();
            } else {
                $('#backToTop').fadeOut();
            }
        });
        
        $('#backToTop').click(function(e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, 300);
        });
    }
    
    // Helper function to format price
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Handle fetch error
    function handleFetchError(error) {
        console.error('Error fetching site data:', error);
        
        // Hide preloader
        $('#preloader').hide();
        
        // Show error message
        $('#error-container').removeClass('d-none').addClass('alert alert-danger m-3').html(`
            <h4>Error Loading Content</h4>
            <p>${error.message}</p>
            <p>Please try refreshing the page or contact support if the problem persists.</p>
        `);
    }
    
})(jQuery);
```

## 4. Testing and Deployment

### Testing the Implementation

1. **Local Testing**:
   - Place all files in your web server directory
   - Open `index.html` in a browser
   - Verify that all content loads correctly from `home.json`
   - Test responsive behavior on different screen sizes
   - Test navigation and interactive elements

2. **Browser Compatibility**:
   - Test in Chrome, Firefox, Safari, and Edge
   - Ensure consistent rendering across browsers

3. **Performance Testing**:
   - Use browser developer tools to check load times
   - Optimize images if necessary
   - Consider minifying JavaScript and CSS for production

### Deployment

1. **Prepare for Production**:
   - Minify JavaScript and CSS files
   - Optimize images
   - Validate HTML, CSS, and JavaScript

2. **Upload to Server**:
   - Upload all files to your web hosting server
   - Ensure proper file permissions
   - Test the live site

3. **Monitoring**:
   - Set up error logging
   - Monitor performance
   - Gather user feedback

## 5. Future Enhancements

1. **Additional Pages**:
   - Extend the JSON structure to include more pages
   - Implement routing for multi-page navigation

2. **Performance Optimizations**:
   - Implement lazy loading for images
   - Add caching for the JSON file
   - Consider using a CDN for assets

3. **Advanced Features**:
   - Add a shopping cart functionality
   - Implement user authentication
   - Add product filtering and sorting

## 6. Conclusion

This implementation provides a solid foundation for a JSON-based web application. By centralizing all content and configuration in a single JSON file, we've created a flexible system that can be easily maintained and extended.

The separation of content from presentation allows for easier updates and modifications without changing the core HTML structure. This approach also facilitates future expansion to multiple pages and additional features.

By following this guide, you should now have a fully functional web application that loads all its content dynamically from a JSON file while maintaining the visual design and functionality of the original site.