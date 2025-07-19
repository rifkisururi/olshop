# Jims Honey Website Recreation - JSON-Based Approach

This project is a recreation of the Jims Honey website using a JSON-based approach, where all content and configuration data are centralized in a single `home.json` file.

## Project Structure

- `home.json` - Contains all content and configuration data
- `index-json.html` - Minimal HTML shell that loads content from home.json
- `js/json-renderer.js` - JavaScript code that fetches and renders the JSON data
- `server.js` - Simple Node.js server for local testing

## Features

- Centralized content management using a single JSON file
- Dynamic content rendering with JavaScript
- Separation of content/data from presentation
- Progressive loading and error handling
- Responsive design using Bootstrap 5

## How to Run

### Option 1: Using Node.js Server (Recommended)

1. Make sure Node.js is installed on your system
2. Open a terminal in the project directory
3. Run the server:
   ```
   node server.js
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000/index-json.html
   ```

### Option 2: Using Python HTTP Server

1. Make sure Python is installed on your system
2. Open a terminal in the project directory
3. Run the server:
   ```
   # For Python 3
   python -m http.server 3000
   
   # For Python 2
   python -m SimpleHTTPServer 3000
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000/index-json.html
   ```

### Option 3: Using Any Other Local Server

You can use any local development server of your choice, such as:
- Live Server extension for VS Code
- http-server npm package
- XAMPP, WAMP, or MAMP

## Browser Compatibility

The application has been tested and works well in:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## Project Architecture

### 1. Data Layer (`home.json`)

A comprehensive JSON file that contains:
- Global configuration (meta tags, styling, header, footer, modals)
- Page-specific content (home page, shop page, etc.)
- Product data
- UI text and translations

### 2. Presentation Layer (`index-json.html`)

A minimal HTML shell that:
- Loads required CSS and JavaScript
- Contains empty containers for dynamic content
- Provides loading and error states

### 3. Logic Layer (`json-renderer.js`)

JavaScript that:
- Fetches the JSON data
- Renders content into the appropriate containers
- Handles user interactions
- Manages error states and loading

## Future Enhancements

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

## Credits

- Bootstrap 5 - https://getbootstrap.com/
- Font Awesome - https://fontawesome.com/
- jQuery - https://jquery.com/