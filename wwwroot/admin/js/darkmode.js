/**
 * Dark Mode Toggle Functionality
 * Handles switching between light and dark themes
 */

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Toggle dark mode on checkbox change
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });
    
    // Function to enable dark mode
    function enableDarkMode() {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        darkModeToggle.checked = true;
        localStorage.setItem('theme', 'dark');
        updateDarkModeIcon(true);
    }
    
    // Function to disable dark mode
    function disableDarkMode() {
        htmlElement.setAttribute('data-bs-theme', 'light');
        darkModeToggle.checked = false;
        localStorage.setItem('theme', 'light');
        updateDarkModeIcon(false);
    }
    
    // Update the dark mode toggle icon
    function updateDarkModeIcon(isDarkMode) {
        const darkModeLabel = darkModeToggle.nextElementSibling;
        const icon = darkModeLabel.querySelector('i');
        
        if (isDarkMode) {
            icon.classList.remove('bi-moon-stars');
            icon.classList.add('bi-sun');
        } else {
            icon.classList.remove('bi-sun');
            icon.classList.add('bi-moon-stars');
        }
    }
});