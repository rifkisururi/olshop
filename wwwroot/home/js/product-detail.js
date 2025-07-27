/**
 * Product Detail Page JavaScript
 * Handles interactive features like image gallery, quantity selection, add to cart, etc.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Image Gallery
    initImageGallery();
    
    // Quantity Selector
    initQuantitySelector();
    
    // Add to Cart
    initAddToCart();
    
    // Rating System
    initRatingSystem();
    
    // Product Tabs
    // Bootstrap handles this automatically
    
    // Load cart count from localStorage
    updateCartCountFromLocalStorage();
});

/**
 * Initialize the product image gallery
 */
function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    if (!thumbnails.length || !mainImage) return;
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            mainImage.src = this.getAttribute('data-image');
            
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Initialize the quantity selector
 */
function initQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-minus');
    const plusBtn = document.querySelector('.quantity-plus');
    const quantityInput = document.querySelector('.quantity-input');
    
    if (!minusBtn || !plusBtn || !quantityInput) return;
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < 99) {
            quantityInput.value = value + 1;
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > 99) {
            this.value = 99;
        }
    });
}

/**
 * Initialize add to cart functionality
 */
function initAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const wishlistBtn = document.querySelector('.add-to-wishlist-btn');
    
    if (!addToCartBtn) return;
    
    // Enable Add to Cart button only when a color is selected
    const colorRadios = document.querySelectorAll('input[name="color"]');
    if (colorRadios.length) {
        colorRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                addToCartBtn.disabled = false;
            });
        });
    } else {
        // If there are no color options, enable the button by default
        addToCartBtn.disabled = false;
    }
    
    addToCartBtn.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        const productName = this.getAttribute('data-product-name');
        const productPrice = this.getAttribute('data-product-price');
        const productImage = this.getAttribute('data-product-image');
        const productCategory = this.getAttribute('data-product-category');
        const quantity = document.querySelector('.quantity-input').value;
        let color = '';
        
        // Get selected color if color options exist
        if (colorRadios.length) {
            colorRadios.forEach(radio => {
                if (radio.checked) {
                    color = radio.value;
                }
            });
            
            // If no color is selected, show an alert and return
            if (!color) {
                alert('Please select a color');
                return;
            }
        }
        
        // Add to cart logic
        addProductToCart(
            productId,
            quantity,
            color,
            productName,
            productPrice,
            productImage,
            productCategory
        );
    });
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addProductToWishlist(productId);
        });
    }
}

/**
 * Add product to cart
 */
function addProductToCart(productId, quantity, color, name, price, image, category) {
    // Create cart item object
    const cartItem = {
        id: productId,
        name: name,
        price: price,
        image: image,
        category: category,
        quantity: parseInt(quantity),
        color: color,
        dateAdded: new Date().toISOString()
    };
    
    // Save to localStorage
    saveCartItem(cartItem);
    
    // Show feedback directly on the button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const feedbackText = document.querySelector('.button-feedback-text');
    
    if (addToCartBtn && feedbackText) {
        // Temporarily disable button and change its appearance
        addToCartBtn.disabled = true;
        addToCartBtn.innerHTML = '<i class="fas fa-check me-2"></i>Added to Cart!';
        addToCartBtn.classList.add('btn-success');
        addToCartBtn.classList.remove('btn-primary');
        
        // Show feedback text
        feedbackText.style.display = 'block';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>Add to Cart';
            addToCartBtn.classList.remove('btn-success');
            addToCartBtn.classList.add('btn-primary');
            
            // Hide feedback text
            feedbackText.style.display = 'none';
        }, 2000);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification alert alert-success alert-dismissible fade show';
    notification.innerHTML = `
        <strong>Success!</strong> Product added to cart.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Update cart count
    updateCartCount(parseInt(quantity));
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    console.log(`Added product ${productId} to cart. Quantity: ${quantity}, Color: ${color}`);
}

/**
 * Save cart item to localStorage
 */
function saveCartItem(cartItem) {
    // Get existing cart items from localStorage
    let cartItems = getCartItems();
    
    // Check if the product already exists in the cart
    const existingItemIndex = cartItems.findIndex(item =>
        item.id === cartItem.id && item.color === cartItem.color
    );
    
    if (existingItemIndex !== -1) {
        // If the product exists, update the quantity
        cartItems[existingItemIndex].quantity += cartItem.quantity;
    } else {
        // If the product doesn't exist, add it to the cart
        cartItems.push(cartItem);
    }
    
    // Save the updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

/**
 * Get cart items from localStorage
 */
function getCartItems() {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
}

/**
 * Update cart count in the UI
 */
function updateCartCount(addedQuantity = 0) {
    const cartCountBadge = document.getElementById('cart-count-badge');
    if (!cartCountBadge) return;
    
    // Calculate total quantity from localStorage
    const cartItems = getCartItems();
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Update the cart count badge
    cartCountBadge.textContent = totalQuantity;
}

/**
 * Update cart count from localStorage on page load
 */
function updateCartCountFromLocalStorage() {
    updateCartCount();
}

/**
 * Add product to wishlist
 */
function addProductToWishlist(productId) {
    // In a real application, this would make an AJAX call to the server
    // For demo purposes, we'll just show a notification
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification alert alert-info alert-dismissible fade show';
    notification.innerHTML = `
        <strong>Success!</strong> Product added to wishlist.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    console.log(`Added product ${productId} to wishlist`);
}

/**
 * Initialize rating system for review form
 */
function initRatingSystem() {
    const ratingStars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('ratingInput');
    
    if (!ratingStars.length || !ratingInput) return;
    
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = parseInt(ratingInput.value);
            highlightStars(currentRating);
        });
        
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            highlightStars(rating);
        });
    });
    
    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
                star.classList.add('active');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
                star.classList.remove('active');
            }
        });
    }
    
    // Submit review
    const submitReviewBtn = document.getElementById('submitReview');
    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', function() {
            const form = document.getElementById('reviewForm');
            if (form.checkValidity()) {
                // In a real application, this would submit the form via AJAX
                alert('Thank you for your review! It will be published after moderation.');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('writeReviewModal'));
                modal.hide();
                
                // Reset form
                form.reset();
                highlightStars(0);
            } else {
                form.reportValidity();
            }
        });
    }
}