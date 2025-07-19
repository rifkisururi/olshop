# JSON-Based Web Application Implementation Guide

This guide provides detailed instructions and code for implementing a comprehensive web application where all assets, content, and configuration data are centralized in a single `home.json` file.

## Overview

The implementation consists of three main components:

1. **home.json** - The centralized data file containing all content and configuration
2. **index.html** - A minimal shell that loads and renders content from home.json
3. **json-renderer.js** - JavaScript code that fetches and renders the JSON data

## 1. home.json

Create a file named `home.json` in the root directory with the following structure:

```json
{
  "version": "1.0",
  "global": {
    "meta": {
      "defaultTitle": "Jims Honey Official | You Deserve The Best",
      "defaultDescription": "Jims Honey Official Indonesia merupakan brand fashion lokal yang memproduksi tas, dompet, dan juga jam tangan dewasa untuk pria dan wanita.",
      "defaultKeywords": "fashion, Jims Honey, supplier tas, join reseller jimshoney, reseller jimshoney, supplier jimshoney, jimshoney pusat, tas wanita, dompet wanita, powerbank, jam tangan, supplier jam tangan, supplier jam, supplier powerbank, grosir jimshoney, jimshoney official, jimshoney indonesia, supplier dompet, wholesale, jualan grosir, join reseller, dropship jimshoney, dropship, retail, fashion bags, style, lokal brand indonesia, dropshipper, belajar bisnis",
      "favicon": "images/favicon.ico",
      "openGraph": {
        "title": "Jims Honey Official | Supplier Tas No 1 di Indonesia",
        "type": "website",
        "url": "https://jimshoneyofficial.co.id",
        "description": "Jims Honey Official Indonesia merupakan brand fashion lokal yang memproduksi tas, dompet, dan juga jam tangan dewasa untuk pria dan wanita.",
        "siteName": "JIMS HONEY OFFICIAL"
      },
      "twitterCard": {
        "card": "product",
        "title": "Jims Honey Official | Supplier Tas No 1 di Indonesia",
        "description": "Jims Honey Official Indonesia merupakan brand fashion lokal yang memproduksi tas, dompet, dan juga jam tangan dewasa untuk pria dan wanita."
      }
    },
    "styling": {
      "colors": {
        "primary": "#FFB0CD",
        "primaryHover": "#ffc0cb",
        "primarySoft": "rgba(255, 176, 205, 0.15)",
        "secondary": "#FB97A7",
        "textDark": "#333333",
        "textLight": "#666666",
        "borderColor": "#e0e0e0",
        "bgLight": "#f8f9fa",
        "white": "#ffffff",
        "black": "#000000"
      },
      "typography": {
        "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        "fontSize": "14px",
        "lineHeight": "1.6"
      },
      "spacing": {
        "containerPadding": "30px"
      },
      "transitions": {
        "default": "all 0.3s ease"
      }
    },
    "header": {
      "logo": {
        "src": "images/logo/jimshoney-logo.png",
        "alt": "Jims Honey",
        "height": 50
      },
      "topBar": {
        "languages": [
          {
            "code": "en",
            "name": "English",
            "flag": "images/flags/en.png"
          },
          {
            "code": "id",
            "name": "Indonesia",
            "flag": "images/flags/id.png"
          }
        ],
        "currencies": [
          {
            "code": "USD",
            "name": "U.S. Dollar ($)",
            "symbol": "$",
            "rate": 0.000065
          },
          {
            "code": "IDR",
            "name": "Indonesia (Rp)",
            "symbol": "Rp",
            "rate": 1
          }
        ],
        "links": [
          {
            "text": "Login",
            "url": "#"
          },
          {
            "text": "Registration",
            "url": "#"
          }
        ]
      },
      "navigation": [
        {
          "text": "Home",
          "url": "index.html",
          "active": true
        },
        {
          "text": "Shop",
          "url": "pages/shop.html"
        },
        {
          "text": "MAN",
          "url": "#",
          "dropdown": [
            {
              "text": "WATCH",
              "url": "#"
            }
          ]
        },
        {
          "text": "WOMAN",
          "url": "#",
          "dropdown": [
            {
              "text": "WATCH",
              "url": "#"
            },
            {
              "text": "WALLET",
              "url": "#"
            },
            {
              "text": "BAG",
              "url": "#"
            },
            {
              "text": "HEELS",
              "url": "#"
            }
          ]
        },
        {
          "text": "TOOLS",
          "url": "#",
          "dropdown": [
            {
              "text": "POWERBANK",
              "url": "#"
            },
            {
              "text": "TUMBLER",
              "url": "#"
            },
            {
              "text": "PACKAGING",
              "url": "#"
            },
            {
              "text": "HOMEWARES",
              "url": "#"
            }
          ]
        },
        {
          "text": "E-Catalog",
          "url": "#",
          "target": "_blank"
        },
        {
          "text": "Become Reseller",
          "url": "#",
          "target": "_blank"
        }
      ],
      "actions": [
        {
          "type": "search",
          "icon": "fas fa-search",
          "modal": "searchModal"
        },
        {
          "type": "wishlist",
          "icon": "far fa-heart",
          "url": "#",
          "badge": 0
        },
        {
          "type": "user",
          "icon": "far fa-user",
          "dropdown": [
            {
              "text": "Login",
              "url": "#"
            },
            {
              "text": "Registration",
              "url": "#"
            }
          ]
        }
      ]
    },
    "footer": {
      "companyInfo": {
        "logo": "images/logo/jimshoney-logo.png",
        "description": "JIMS HONEY was established in Indonesia since 2014, started as a trading company providing daily fashion item such as bag, wallet and timepiece with the company name as the brand itself.",
        "contactHeading": "Got Questions? Call us 24/7!",
        "contactPhone": "+62 851-5507-7299"
      },
      "contactInfo": {
        "address": "Ruko Grand Galaxy City RGK 582, Jaka Setia, Bekasi Selatan, West Java 17141",
        "phone": "+62 851-5507-7299",
        "email": "jimshoneypartnership@gmail.com"
      },
      "socialMedia": [
        {
          "platform": "Instagram",
          "icon": "fab fa-instagram",
          "url": "https://www.instagram.com/jimshoney.jakarta/"
        },
        {
          "platform": "Tiktok",
          "icon": "fab fa-tiktok",
          "url": "https://www.tiktok.com/@jims_honey_indonesia"
        }
      ],
      "mapEmbed": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15863.816452209454!2d106.9715267!3d-6.2697653!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x317b90e53eb362ef!2sJims%20Honey%20Official%20Store!5e0!3m2!1sen!2sid!4v1652869066752!5m2!1sen!2sid",
      "copyright": "Copyright © 2024 JIMS HONEY OFFICIAL",
      "paymentMethods": [
        {
          "name": "BCA",
          "image": "images/payment/bca.png"
        },
        {
          "name": "BRI",
          "image": "images/payment/bri.png"
        },
        {
          "name": "Mandiri",
          "image": "images/payment/mandiri.png"
        }
      ]
    },
    "modals": {
      "search": {
        "id": "searchModal",
        "title": "Search",
        "placeholder": "Search Entire Store..."
      },
      "addToCart": {
        "id": "addToCartModal",
        "title": "Product Details"
      }
    }
  },
  "pages": {
    "home": {
      "meta": {
        "title": "Jims Honey Official | You Deserve The Best",
        "description": "Jims Honey Official Indonesia merupakan brand fashion lokal yang memproduksi tas, dompet, dan juga jam tangan dewasa untuk pria dan wanita."
      },
      "heroSlider": {
        "items": [
          {
            "image": "images/sliders/slide1.jpg",
            "alt": "Slide 1",
            "link": "#"
          },
          {
            "image": "images/sliders/slide2.jpg",
            "alt": "Slide 2",
            "link": "#"
          },
          {
            "image": "images/sliders/slide3.jpg",
            "alt": "Slide 3",
            "link": "#"
          },
          {
            "image": "images/sliders/slide4.jpg",
            "alt": "Slide 4",
            "link": "#"
          },
          {
            "image": "images/sliders/slide5.jpg",
            "alt": "Slide 5",
            "link": "#"
          }
        ],
        "autoplay": true,
        "interval": 5000
      },
      "bannerSection": {
        "items": [
          {
            "image": "images/banners/bags-banner.jpg",
            "alt": "Bags",
            "link": "#"
          },
          {
            "image": "images/banners/wallets-banner.jpg",
            "alt": "Wallets",
            "link": "#"
          },
          {
            "image": "images/banners/heels-banner.jpg",
            "alt": "Heels",
            "link": "#"
          },
          {
            "image": "images/banners/watches-banner.jpg",
            "alt": "Watches",
            "link": "#"
          }
        ]
      },
      "featuredProducts": {
        "title": "Featured Products",
        "subtitle": "Check out our featured products",
        "count": 8,
        "items": [
          {
            "id": "feat-1",
            "name": "Featured Product 1",
            "category": "BAG",
            "price": 250000,
            "oldPrice": 300000,
            "image": "images/products/product-1.jpg",
            "colors": ["black", "brown"],
            "sizes": [],
            "tags": ["new", "featured"]
          },
          {
            "id": "feat-2",
            "name": "Featured Product 2",
            "category": "WALLET",
            "price": 150000,
            "oldPrice": null,
            "image": "images/products/product-2.jpg",
            "colors": ["black", "pink"],
            "sizes": [],
            "tags": ["featured"]
          },
          {
            "id": "feat-3",
            "name": "Featured Product 3",
            "category": "WATCH",
            "price": 350000,
            "oldPrice": 400000,
            "image": "images/products/product-3.jpg",
            "colors": ["silver", "gold"],
            "sizes": [],
            "tags": ["new", "featured"]
          },
          {
            "id": "feat-4",
            "name": "Featured Product 4",
            "category": "HEELS",
            "price": 280000,
            "oldPrice": null,
            "image": "images/products/product-4.jpg",
            "colors": ["black"],
            "sizes": ["37", "38", "39"],
            "tags": ["featured"]
          }
        ]
      },
      "bestSellingProducts": {
        "title": "Best Selling",
        "subtitle": "Our most popular products",
        "count": 8,
        "items": [
          {
            "id": "best-1",
            "name": "Best Seller Product 1",
            "category": "WALLET",
            "price": 180000,
            "oldPrice": null,
            "image": "images/products/product-5.jpg",
            "colors": ["pink", "blue"],
            "sizes": [],
            "tags": ["bestseller"]
          },
          {
            "id": "best-2",
            "name": "Best Seller Product 2",
            "category": "BAG",
            "price": 320000,
            "oldPrice": 380000,
            "image": "images/products/product-6.jpg",
            "colors": ["brown", "black"],
            "sizes": [],
            "tags": ["bestseller"]
          },
          {
            "id": "best-3",
            "name": "Best Seller Product 3",
            "category": "WATCH",
            "price": 450000,
            "oldPrice": null,
            "image": "images/products/product-7.jpg",
            "colors": ["gold"],
            "sizes": [],
            "tags": ["bestseller"]
          },
          {
            "id": "best-4",
            "name": "Best Seller Product 4",
            "category": "HEELS",
            "price": 270000,
            "oldPrice": 320000,
            "image": "images/products/product-8.jpg",
            "colors": ["black", "red"],
            "sizes": ["36", "37", "38", "39"],
            "tags": ["bestseller"]
          }
        ]
      },
      "infoBanners": {
        "items": [
          {
            "image": "images/banners/info1.jpg",
            "alt": "Info 1",
            "link": "#"
          },
          {
            "image": "images/banners/info2.jpg",
            "alt": "Info 2",
            "link": "#"
          },
          {
            "image": "images/banners/info3.jpg",
            "alt": "Info 3",
            "link": "#"
          }
        ]
      },
      "newsletter": {
        "title": "Newsletter",
        "subtitle": "Subscribe here for get every single updates",
        "placeholder": "Your Email Address",
        "buttonText": "Subscribe Now"
      }
    },
    "shop": {
      "meta": {
        "title": "Shop - Jims Honey Official",
        "description": "Shop the latest collection of bags, wallets, watches, and heels from Jims Honey Official Indonesia."
      }
    }
  }
}
```

## 2. index.html

Replace the content of your `index.html` file with the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- Dynamic Meta Tags will be inserted here -->
    <div id="meta-container"></div>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    
    <!-- Dynamic Styles will be inserted here -->
    <style id="dynamic-styles"></style>
</head>
<body>
    <!-- Preloader -->
    <div id="preloader">
        <div class="preloader-inner">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    
    <!-- Error Container -->
    <div id="error-container" class="d-none"></div>
    
    <!-- Header will be dynamically inserted here -->
    <header id="header-container"></header>
    
    <!-- Main Content -->
    <main id="main-content">
        <!-- Content will be dynamically inserted here -->
    </main>
    
    <!-- Footer will be dynamically inserted here -->
    <footer id="footer-container"></footer>
    
    <!-- Modals will be dynamically inserted here -->
    <div id="modals-container"></div>
    
    <!-- Back to Top -->
    <a href="#" class="back-to-top" id="backToTop">
        <i class="fas fa-chevron-up"></i>
    </a>
    
    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- Main JS for JSON fetching and rendering -->
    <script src="js/json-renderer.js"></script>
</body>
</html>
```

## 3. json-renderer.js

Create a new file named `json-renderer.js` in the `js` directory with the following code:

```javascript
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
    async function fetchSiteData() {
        try {
            // Show loading state
            $('#preloader').show();
            
            // Fetch the JSON file
            const response = await fetch('home.json');
            
            // Check if the response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Parse the JSON data
            const data = await response.json();
            
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
            
        } catch (error) {
            // Handle errors
            handleFetchError(error);
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
                                if (action.type === 'search') {
                                    return `
                                        <button class="btn btn-link p-2" data-bs-toggle="modal" data-bs-target="#${action.modal}">
                                            <i class="${action.icon}"></i>
                                        </button>
                                    `;
                                } else if (action.type === 'wishlist') {
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
                    <div class="