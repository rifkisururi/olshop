/**
 * Shopping Cart JavaScript
 * Handles cart functionality including displaying cart items, updating quantities, and removing items
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initCart();
    
    // Update cart count from localStorage
    updateCartCountFromLocalStorage();
});

/**
 * Initialize cart functionality
 */
function initCart() {
    // Check if we're on the cart page
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        displayCartItems(cartContainer);
    }
    
    // Add event listener for cart icon to show mini-cart
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMiniCart();
        });
    }
}

/**
 * Display cart items in the specified container
 */
function displayCartItems(container) {
    const cartItems = getCartItems();
    
    if (cartItems.length === 0) {
        container.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        return;
    }
    
    let cartHtml = '<div class="cart-items">';
    let totalPrice = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.quantity * parseFloat(item.price);
        totalPrice += itemTotal;
        
        cartHtml += `
            <div class="cart-item" data-id="${item.id}" data-color="${item.color}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid">
                </div>
                <div class="cart-item-details">
                    <h5 class="cart-item-title">${item.name}</h5>
                    <div class="cart-item-meta">
                        ${item.color ? `<span class="cart-item-color">Color: ${item.color}</span>` : ''}
                        <span class="cart-item-price">Rp ${parseFloat(item.price).toLocaleString('id-ID')}</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${item.id}" data-color="${item.color}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${item.id}" data-color="${item.color}">+</button>
                    </div>
                </div>
                <div class="cart-item-subtotal">
                    Rp ${itemTotal.toLocaleString('id-ID')}
                </div>
                <div class="cart-item-remove">
                    <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}" data-color="${item.color}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartHtml += '</div>';
    
    // Add cart summary
    cartHtml += `
        <div class="cart-summary">
            <div class="cart-total">
                <span class="cart-total-label">Total:</span>
                <span class="cart-total-value">Rp ${totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div class="cart-actions">
                <button class="btn btn-primary checkout-btn">Proceed to Checkout</button>
                <button class="btn btn-outline-secondary clear-cart-btn">Clear Cart</button>
            </div>
        </div>
    `;
    
    container.innerHTML = cartHtml;
    
    // Add event listeners for cart actions
    addCartEventListeners(container);
}

/**
 * Add event listeners for cart actions
 */
function addCartEventListeners(container) {
    // Increase quantity
    const increaseButtons = container.querySelectorAll('.increase-quantity');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const color = this.getAttribute('data-color');
            updateCartItemQuantity(id, color, 1);
            displayCartItems(container);
        });
    });
    
    // Decrease quantity
    const decreaseButtons = container.querySelectorAll('.decrease-quantity');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const color = this.getAttribute('data-color');
            updateCartItemQuantity(id, color, -1);
            displayCartItems(container);
        });
    });
    
    // Remove item
    const removeButtons = container.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const color = this.getAttribute('data-color');
            removeCartItem(id, color);
            displayCartItems(container);
        });
    });
    
    // Clear cart
    const clearCartBtn = container.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            clearCart();
            displayCartItems(container);
        });
    }
    
    // Checkout
    const checkoutBtn = container.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // In a real application, this would redirect to the checkout page
            alert('Proceeding to checkout...');
        });
    }
}

/**
 * Update cart item quantity
 */
function updateCartItemQuantity(id, color, change) {
    const cartItems = getCartItems();
    
    const itemIndex = cartItems.findIndex(item => 
        item.id === id && item.color === color
    );
    
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        
        // Save updated cart
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update cart count
        updateCartCount();
    }
}

/**
 * Remove cart item
 */
function removeCartItem(id, color) {
    const cartItems = getCartItems();
    
    const updatedItems = cartItems.filter(item => 
        !(item.id === id && item.color === color)
    );
    
    // Save updated cart
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Update cart count
    updateCartCount();
}

/**
 * Clear cart
 */
function clearCart() {
    localStorage.removeItem('cartItems');
    updateCartCount();
}

/**
 * Toggle mini-cart display
 */
function toggleMiniCart() {
    let miniCart = document.getElementById('mini-cart');
    
    if (!miniCart) {
        // Create mini-cart if it doesn't exist
        miniCart = document.createElement('div');
        miniCart.id = 'mini-cart';
        miniCart.className = 'mini-cart';
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mini-cart-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            miniCart.classList.remove('show');
        });
        
        // Add cart container
        const cartContainer = document.createElement('div');
        cartContainer.id = 'mini-cart-items';
        
        miniCart.appendChild(closeBtn);
        miniCart.appendChild(cartContainer);
        document.body.appendChild(miniCart);
        
        // Display cart items
        displayCartItems(cartContainer);
    }
    
    // Toggle mini-cart visibility
    miniCart.classList.toggle('show');
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
function updateCartCount() {
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