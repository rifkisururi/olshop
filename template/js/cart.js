document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const orderSummary = document.querySelector('.col-lg-4 .card');
    const cartSubtotalElem = document.getElementById('cart-subtotal');
    const cartGrandTotalElem = document.getElementById('cart-grand-total');
    const cartCountBadge = document.getElementById('cart-count-badge');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Ensure all cart items have a 'selected' property, defaulting to true
    cart.forEach(item => {
        if (item.selected === undefined) {
            item.selected = true;
        }
    });

    const checkoutBtn = document.getElementById('checkout-btn');

    /**
     * Formats a number as Indonesian Rupiah (IDR).
     * @param {number} number - The number to format.
     * @returns {string} - The formatted currency string.
     */
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    /**
     * Renders all items in the cart to the DOM.
     */
    const renderCart = () => {
        const existingTable = cartItemsContainer.querySelector('table');
        if (existingTable) {
            existingTable.remove();
        }

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            if(orderSummary) orderSummary.style.display = 'none';
            updateTotals();
            updateCartBadge();
            return;
        }

        emptyCartMessage.style.display = 'none';
        if(orderSummary) orderSummary.style.display = 'block';

        const table = document.createElement('table');
        table.classList.add('table', 'align-middle');
        table.innerHTML = `
            <thead>
                <tr>
                    <th scope="col" class="text-center">
                        <input class="form-check-input" type="checkbox" id="select-all-checkbox">
                    </th>
                    <th scope="col">Produk</th>
                    <th scope="col">Harga</th>
                    <th scope="col">Kuantitas</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');

        cart.forEach(item => {
            const itemRow = document.createElement('tr');
            itemRow.dataset.id = item.id;
            itemRow.dataset.warna = item.warna;

            const subtotal = item.harga * item.quantity;

            itemRow.innerHTML = `
                <td class="text-center">
                    <input class="form-check-input item-checkbox" type="checkbox" ${item.selected ? 'checked' : ''}>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="https://via.placeholder.com/80" alt="${item.nama}" class="img-fluid rounded" style="width: 80px;">
                        <div class="ms-3">
                            <h6 class="mb-0">${item.nama}</h6>
                            <small class="text-muted">Warna: ${item.warna}</small>
                        </div>
                    </div>
                </td>
                <td>${formatCurrency(item.harga)}</td>
                <td>
                    <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" style="width: 70px;">
                </td>
                <td class="item-subtotal">${formatCurrency(subtotal)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger remove-item-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(itemRow);
        });

        cartItemsContainer.appendChild(table);
        updateTotals();
        updateCartBadge();
        addEventListeners();
    };

    /**
     * Updates the subtotal and grand total in the order summary.
     */
    const updateTotals = () => {
        const selectedItems = cart.filter(item => item.selected);
        const subtotal = selectedItems.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
        
        cartSubtotalElem.textContent = formatCurrency(subtotal);
        cartGrandTotalElem.textContent = formatCurrency(subtotal); // Assuming grand total is same as subtotal for now

        if (checkoutBtn) {
            if (selectedItems.length > 0) {
                checkoutBtn.classList.remove('disabled');
            } else {
                checkoutBtn.classList.add('disabled');
            }
        }
    };

    /**
     * Updates the cart item count in the header badge.
     */
    const updateCartBadge = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
        }
    };

    /**
     * Saves the current cart state to localStorage.
     */
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    /**
     * Adds event listeners to quantity inputs and remove buttons.
     */
    const addEventListeners = () => {
        // Event listener for "Select All" checkbox
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                cart.forEach(item => item.selected = isChecked);
                saveCart();
                renderCart();
            });
            // Set the state of the "Select All" checkbox
            selectAllCheckbox.checked = cart.length > 0 && cart.every(item => item.selected);
        }


        // Event listeners for individual item checkboxes
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const row = e.target.closest('tr');
                const id = row.dataset.id;
                const warna = row.dataset.warna;
                const isChecked = e.target.checked;

                const itemIndex = cart.findIndex(item => item.id === id && item.warna === warna);
                if (itemIndex > -1) {
                    cart[itemIndex].selected = isChecked;
                    saveCart();
                    updateTotals(); // Only update totals, no need to re-render the whole cart
                    // Update the "Select All" checkbox state
                    if (selectAllCheckbox) {
                         selectAllCheckbox.checked = cart.length > 0 && cart.every(item => item.selected);
                    }
                }
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const quantity = parseInt(e.target.value);
                const row = e.target.closest('tr');
                const id = row.dataset.id;
                const warna = row.dataset.warna;

                updateQuantity(id, warna, quantity);
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const id = row.dataset.id;
                const warna = row.dataset.warna;
                
                removeItem(id, warna);
            });
        });
    };

    /**
     * Updates the quantity of a specific item in the cart.
     * @param {string} id - The product ID.
     * @param {string} warna - The product color.
     * @param {number} quantity - The new quantity.
     */
    const updateQuantity = (id, warna, quantity) => {
        const itemIndex = cart.findIndex(item => item.id === id && item.warna === warna);

        if (itemIndex > -1 && quantity > 0) {
            cart[itemIndex].quantity = quantity;
            saveCart();
            renderCart(); // Re-render to update subtotals and totals
        }
    };

    /**
     * Removes an item from the cart.
     * @param {string} id - The product ID.
     * @param {string} warna - The product color.
     */
    const removeItem = (id, warna) => {
        cart = cart.filter(item => !(item.id === id && item.warna === warna));
        saveCart();
        renderCart(); // Re-render the cart
    };

    // Initial render on page load
    renderCart();
});