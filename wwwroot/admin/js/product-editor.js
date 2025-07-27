/**
 * Product Editor JavaScript
 * Handles the editing of Features, Colors, and Tags for the product edit page
 */

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the collection managers
    initializeFeatureManager();
    initializeColorManager();
    initializeTagManager();
    initializeGalleryImageManager();
    
    // Handle form submission
    document.querySelector('form').addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
    });
    
    // Add window resize handler to adjust UI based on screen size
    window.addEventListener('resize', function() {
        adjustUIForScreenSize();
    });
});

/**
 * Initialize the feature manager
 */
function initializeFeatureManager() {
    // Get DOM elements
    const featuresList = document.getElementById('features-list');
    const featureInput = document.getElementById('new-feature-input');
    const addFeatureBtn = document.getElementById('add-feature-btn');
    
    // Add event listener for adding new features
    addFeatureBtn.addEventListener('click', function() {
        addFeature(featureInput.value);
        featureInput.value = '';
    });
    
    // Add event listener for Enter key in input
    featureInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFeatureBtn.click();
        }
    });
    
    // Add event listeners for existing edit and delete buttons
    document.querySelectorAll('.edit-feature-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listItem = btn.closest('li');
            const featureText = listItem.querySelector('.feature-text').textContent;
            editFeature(listItem, featureText);
        });
    });
    
    document.querySelectorAll('.delete-feature-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            btn.closest('li').remove();
        });
    });
    
    // Function to add a new feature
    function addFeature(featureText) {
        if (!validateFeature(featureText)) return;
        
        const featureItem = createFeatureListItem(featureText);
        featuresList.appendChild(featureItem);
    }
    
    // Function to validate a feature
    function validateFeature(featureText) {
        if (!featureText.trim()) {
            showValidationError(featureInput, 'Feature cannot be empty');
            return false;
        }
        
        if (featureText.length > 200) {
            showValidationError(featureInput, 'Feature text cannot exceed 200 characters');
            return false;
        }
        
        // Check for duplicates
        const existingFeatures = Array.from(document.querySelectorAll('#features-list input[type="hidden"]'))
            .map(input => input.value.toLowerCase());
            
        if (existingFeatures.includes(featureText.toLowerCase())) {
            showValidationError(featureInput, 'This feature already exists');
            return false;
        }
        
        return true;
    }
    
    // Function to create a feature list item
    function createFeatureListItem(featureText) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';
        
        const featureContent = document.createElement('span');
        featureContent.className = 'feature-text me-auto';
        featureContent.textContent = featureText;
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'feature-actions mt-2 mt-sm-0';
        
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn btn-sm btn-outline-primary me-1 edit-feature-btn';
        editBtn.innerHTML = '<i class="bi bi-pencil"></i> Edit';
        editBtn.addEventListener('click', function() {
            editFeature(li, featureText);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-sm btn-outline-danger delete-feature-btn';
        deleteBtn.innerHTML = '<i class="bi bi-x"></i>';
        deleteBtn.addEventListener('click', function() {
            li.remove();
        });
        
        buttonsContainer.appendChild(editBtn);
        buttonsContainer.appendChild(deleteBtn);
        
        li.appendChild(featureContent);
        li.appendChild(buttonsContainer);
        
        // Add a hidden input for form submission
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'Features';
        hiddenInput.value = featureText;
        li.appendChild(hiddenInput);
        
        return li;
    }
    
    // Function to edit a feature
    function editFeature(listItem, currentText) {
        const span = listItem.querySelector('.feature-text');
        const actionsDiv = listItem.querySelector('.feature-actions');
        const hiddenInput = listItem.querySelector('input[type="hidden"]');
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.value = currentText;
        
        // Replace the span with the input
        span.replaceWith(input);
        
        // Hide the actions div
        actionsDiv.style.display = 'none';
        
        // Create save button
        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'btn btn-sm btn-success ms-2';
        saveBtn.innerHTML = 'Save';
        saveBtn.addEventListener('click', saveEdit);
        
        // Create cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-sm btn-outline-secondary ms-2';
        cancelBtn.innerHTML = 'Cancel';
        cancelBtn.addEventListener('click', cancelEdit);
        
        // Create a container for the buttons
        const btnContainer = document.createElement('div');
        btnContainer.className = 'edit-buttons mt-2 mt-sm-0';
        btnContainer.appendChild(saveBtn);
        btnContainer.appendChild(cancelBtn);
        
        // Add the button container after the input
        input.parentNode.insertBefore(btnContainer, input.nextSibling);
        
        // Focus the input
        input.focus();
        
        // Function to save the edit
        function saveEdit() {
            const newText = input.value.trim();
            
            if (!newText) {
                showValidationError(input, 'Feature cannot be empty');
                return;
            }
            
            if (newText.length > 200) {
                showValidationError(input, 'Feature text cannot exceed 200 characters');
                return;
            }
            
            // Check for duplicates (excluding the current feature)
            const existingFeatures = Array.from(document.querySelectorAll('#features-list input[type="hidden"]'))
                .filter(inp => inp !== hiddenInput)
                .map(inp => inp.value.toLowerCase());
                
            if (existingFeatures.includes(newText.toLowerCase())) {
                showValidationError(input, 'This feature already exists');
                return;
            }
            
            // Create a new span with the updated text
            const newSpan = document.createElement('span');
            newSpan.className = 'feature-text me-auto';
            newSpan.textContent = newText;
            
            // Update the hidden input value
            hiddenInput.value = newText;
            
            // Replace the input with the span
            input.replaceWith(newSpan);
            
            // Remove the button container
            btnContainer.remove();
            
            // Show the actions div
            actionsDiv.style.display = '';
        }
        
        // Function to cancel the edit
        function cancelEdit() {
            // Create a new span with the original text
            const newSpan = document.createElement('span');
            newSpan.className = 'feature-text me-auto';
            newSpan.textContent = currentText;
            
            // Replace the input with the span
            input.replaceWith(newSpan);
            
            // Remove the button container
            btnContainer.remove();
            
            // Show the actions div
            actionsDiv.style.display = '';
        }
        
        // Add event listener for Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
        
        // Add event listener for Escape key
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        });
    }
}

/**
 * Initialize the color manager
 */
function initializeColorManager() {
    // Get DOM elements
    const colorsContainer = document.getElementById('colors-container');
    const colorInput = document.getElementById('new-color-input');
    const colorPicker = document.getElementById('color-picker');
    const addColorBtn = document.getElementById('add-color-btn');
    
    // Add event listener for adding new colors
    addColorBtn.addEventListener('click', function() {
        addColor(colorInput.value, colorPicker.value);
        colorInput.value = '';
    });
    
    // Add event listener for Enter key in input
    colorInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addColorBtn.click();
        }
    });
    
    // Add event listeners for existing remove buttons
    document.querySelectorAll('#colors-container .btn-close').forEach(btn => {
        btn.addEventListener('click', function() {
            btn.closest('span.badge').remove();
        });
    });
    
    // Function to add a new color
    function addColor(colorName, colorCode) {
        if (!validateColor(colorName)) return;
        
        // Check for duplicates
        const existingColors = Array.from(colorsContainer.querySelectorAll('input[type="hidden"]'))
            .map(input => input.value.toLowerCase());
            
        if (existingColors.includes(colorName.toLowerCase())) {
            showValidationError(colorInput, 'This color already exists');
            return;
        }
        
        const colorBadge = createColorBadge(colorName, colorCode);
        colorsContainer.appendChild(colorBadge);
    }
    
    // Function to validate a color
    function validateColor(colorName) {
        if (!colorName.trim()) {
            showValidationError(colorInput, 'Color name cannot be empty');
            return false;
        }
        
        if (colorName.length > 50) {
            showValidationError(colorInput, 'Color name cannot exceed 50 characters');
            return false;
        }
        
        return true;
    }
    
    // Function to create a color badge
    function createColorBadge(colorName, colorCode) {
        const badge = document.createElement('span');
        badge.className = 'badge rounded-pill me-1 mb-1';
        badge.style.backgroundColor = colorCode || colorName.toLowerCase();
        badge.style.color = isColorDark(colorCode || colorName.toLowerCase()) ? 'white' : 'black';
        
        badge.innerHTML = `${colorName} <button type="button" class="btn-close btn-close-white ms-1" aria-label="Remove"></button>`;
        
        // Add event listener for remove button
        badge.querySelector('.btn-close').addEventListener('click', function() {
            badge.remove();
        });
        
        // Add a hidden input for form submission
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'Colors';
        hiddenInput.value = colorName;
        badge.appendChild(hiddenInput);
        
        return badge;
    }
    
    // Function to determine if a color is dark (for text contrast)
    function isColorDark(color) {
        // Simple implementation - can be enhanced
        const darkColors = ['black', 'navy', 'blue', 'darkblue', 'purple', 'darkpurple', 'brown', 'darkbrown', 'green', 'darkgreen'];
        return darkColors.includes(color.toLowerCase());
    }
}

/**
 * Initialize the tag manager
 */
function initializeTagManager() {
    // Get DOM elements
    const tagsContainer = document.getElementById('tags-container');
    const tagInput = document.getElementById('new-tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');
    
    // Add event listener for adding new tags
    addTagBtn.addEventListener('click', function() {
        addTag(tagInput.value);
        tagInput.value = '';
    });
    
    // Add event listener for Enter key in input
    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTagBtn.click();
        }
    });
    
    // Add event listeners for existing remove buttons
    document.querySelectorAll('#tags-container .btn-close').forEach(btn => {
        btn.addEventListener('click', function() {
            btn.closest('span.badge').remove();
        });
    });
    
    // Function to add a new tag
    function addTag(tagText) {
        if (!validateTag(tagText)) return;
        
        // Check for duplicates
        const existingTags = Array.from(tagsContainer.querySelectorAll('input[type="hidden"]'))
            .map(input => input.value.toLowerCase());
            
        if (existingTags.includes(tagText.toLowerCase())) {
            showValidationError(tagInput, 'This tag already exists');
            return;
        }
        
        const tagBadge = createTagBadge(tagText);
        tagsContainer.appendChild(tagBadge);
    }
    
    // Function to validate a tag
    function validateTag(tagText) {
        if (!tagText.trim()) {
            showValidationError(tagInput, 'Tag cannot be empty');
            return false;
        }
        
        if (tagText.length > 50) {
            showValidationError(tagInput, 'Tag name cannot exceed 50 characters');
            return false;
        }
        
        return true;
    }
    
    // Function to create a tag badge
    function createTagBadge(tagText) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-info text-dark me-1 mb-1';
        
        badge.innerHTML = `${tagText} <button type="button" class="btn-close btn-close-white ms-1" aria-label="Remove"></button>`;
        
        // Add event listener for remove button
        badge.querySelector('.btn-close').addEventListener('click', function() {
            badge.remove();
        });
        
        // Add a hidden input for form submission
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'Tags';
        hiddenInput.value = tagText;
        badge.appendChild(hiddenInput);
        
        return badge;
    }
}

/**
 * Show validation errors
 * @param {HTMLElement} inputElement - The input element
 * @param {string} message - The error message
 */
function showValidationError(inputElement, message) {
    // Find or create validation feedback element
    let feedback = document.getElementById(`${inputElement.id}-validation-feedback`);
    if (!feedback) {
        feedback = inputElement.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.id = `${inputElement.id}-validation-feedback`;
            inputElement.parentNode.appendChild(feedback);
        }
    }
    
    feedback.textContent = message;
    feedback.style.display = 'block';
    inputElement.classList.add('is-invalid');
    
    // Remove the error after a short delay or on input
    setTimeout(() => {
        inputElement.classList.remove('is-invalid');
        feedback.style.display = 'none';
    }, 3000);
    
    inputElement.addEventListener('input', function() {
        inputElement.classList.remove('is-invalid');
        feedback.style.display = 'none';
    }, { once: true });
}

/**
 * Validate the form before submission
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
    let isValid = true;
    
    // Validate Features (at least one feature required)
    const features = document.querySelectorAll('#features-list input[type="hidden"]');
    if (features.length === 0) {
        showValidationError(document.getElementById('new-feature-input'), 'At least one feature is required');
        isValid = false;
    }
    
    // Validate Colors (at least one color required)
    const colors = document.querySelectorAll('#colors-container input[type="hidden"]');
    if (colors.length === 0) {
        showValidationError(document.getElementById('new-color-input'), 'At least one color is required');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Adjust UI based on screen size
 */
function adjustUIForScreenSize() {
    const isMobile = window.innerWidth < 576;
    
    // Adjust feature list items
    const featureItems = document.querySelectorAll('#features-list .list-group-item');
    featureItems.forEach(item => {
        const featureText = item.querySelector('.feature-text');
        const featureActions = item.querySelector('.feature-actions');
        
        if (isMobile) {
            featureText.style.width = '100%';
            featureActions.style.width = '100%';
            featureActions.style.justifyContent = 'flex-end';
        } else {
            featureText.style.width = '';
            featureActions.style.width = '';
            featureActions.style.justifyContent = '';
        }
    });
    
    // Adjust input groups
    const inputGroups = document.querySelectorAll('.input-group');
    inputGroups.forEach(group => {
        if (isMobile) {
            group.classList.add('flex-wrap');
        } else {
            group.classList.remove('flex-wrap');
        }
    });
}

/**
 * Determine if a color is dark (for text contrast)
 * @param {string} color - The color to check
 * @returns {boolean} - Whether the color is dark
 */
function isColorDark(color) {
    // Simple implementation - can be enhanced
    const darkColors = ['black', 'navy', 'blue', 'darkblue', 'purple', 'darkpurple', 'brown', 'darkbrown', 'green', 'darkgreen'];
    return darkColors.includes(color.toLowerCase());
}

/**
 * Initialize the gallery image manager
 */
function initializeGalleryImageManager() {
    // Get DOM elements
    const galleryContainer = document.getElementById('gallery-images-container');
    const imageInput = document.getElementById('new-gallery-image-input');
    const addImageBtn = document.getElementById('add-gallery-image-btn');
    
    // If elements don't exist, return early (might be on a different page)
    if (!galleryContainer || !imageInput || !addImageBtn) return;
    
    // Add event listener for adding new gallery images
    addImageBtn.addEventListener('click', function() {
        addGalleryImage(imageInput.value);
        imageInput.value = '';
    });
    
    // Add event listener for Enter key in input
    imageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addImageBtn.click();
        }
    });
    
    // Add event listeners for existing remove buttons
    document.querySelectorAll('.remove-gallery-image').forEach(btn => {
        btn.addEventListener('click', function() {
            btn.closest('.gallery-image-item').remove();
        });
    });
    
    // Function to add a new gallery image
    function addGalleryImage(imageUrl) {
        if (!validateGalleryImage(imageUrl)) return;
        
        const imageItem = createGalleryImageItem(imageUrl);
        galleryContainer.appendChild(imageItem);
    }
    
    // Function to validate a gallery image URL
    function validateGalleryImage(imageUrl) {
        if (!imageUrl.trim()) {
            showValidationError(imageInput, 'Image URL cannot be empty');
            return false;
        }
        
        // Simple URL validation
        if (!imageUrl.match(/^https?:\/\/.+\..+/)) {
            showValidationError(imageInput, 'Please enter a valid URL');
            return false;
        }
        
        if (imageUrl.length > 500) {
            showValidationError(imageInput, 'Image URL cannot exceed 500 characters');
            return false;
        }
        
        return true;
    }
    
    // Function to create a gallery image item
    function createGalleryImageItem(imageUrl) {
        const container = document.createElement('div');
        container.className = 'gallery-image-item me-2 mb-2 position-relative';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Gallery Image';
        img.className = 'img-thumbnail';
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0';
        removeBtn.innerHTML = '<i class="bi bi-x"></i>';
        removeBtn.addEventListener('click', function() {
            container.remove();
        });
        
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'GalleryImages';
        hiddenInput.value = imageUrl;
        
        container.appendChild(img);
        container.appendChild(removeBtn);
        container.appendChild(hiddenInput);
        
        return container;
    }
}