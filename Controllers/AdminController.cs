using Microsoft.AspNetCore.Mvc;
using olshop.Models;
using olshop.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace olshop.Controllers
{
    public class AdminController : Controller
    {
        private readonly IProductRepository _productRepository;
        private readonly ILogger<AdminController> _logger;
        public AdminController(IProductRepository productRepository, ILogger<AdminController> logger)
        {
            _productRepository = productRepository;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            ViewBag.TotalProducts = await _productRepository.GetTotalProductCountAsync();
            ViewBag.TotalSales = await _productRepository.GetTotalSalesAsync();
            ViewBag.NewOrders = await _productRepository.GetNewOrdersCountAsync();
            ViewBag.Customers = await _productRepository.GetCustomersCountAsync();
            
            // Get recent products for the dashboard
            var allProducts = await _productRepository.GetAllProductsAsync();
            ViewBag.RecentProducts = allProducts.Take(5);
            
            return View();
        }

        public async Task<IActionResult> Products()
        {
            // Get all products (we'll filter client-side)
            var products = await _productRepository.GetAllProductsAsync();
            
            return View(products);
        }

        public async Task<IActionResult> Product(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            
            return View(product);
        }

        public IActionResult AddProduct()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct(Product product)
        {
            // Debug logging for boolean properties
            _logger.LogInformation($"AddProduct - IsFeatured: {product.IsFeatured}, IsBestSeller: {product.IsBestSeller}");
            
            // Initialize collections if they are null
            product.Features ??= new List<string>();
            product.Colors ??= new List<string>();
            product.Tags ??= new List<string>();
            product.GalleryImages ??= new List<string>();
            
            // Validate collection items (remove empty items)
            product.Features = product.Features.Where(f => !string.IsNullOrWhiteSpace(f)).ToList();
            product.Colors = product.Colors.Where(c => !string.IsNullOrWhiteSpace(c)).ToList();
            product.Tags = product.Tags.Where(t => !string.IsNullOrWhiteSpace(t)).ToList();
            product.GalleryImages = product.GalleryImages.Where(g => !string.IsNullOrWhiteSpace(g)).ToList();
            
            // Remove duplicate items
            product.Features = product.Features.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            product.Colors = product.Colors.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            product.Tags = product.Tags.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            product.GalleryImages = product.GalleryImages.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            
            // Validate required collections
            if (!product.Features.Any())
            {
                ModelState.AddModelError("Features", "At least one feature is required");
            }
            
            if (!product.Colors.Any())
            {
                ModelState.AddModelError("Colors", "At least one color is required");
            }
            
            // Validate item length
            if (product.Features.Any(f => f.Length > 200))
            {
                ModelState.AddModelError("Features", "Feature text cannot exceed 200 characters");
            }
            
            if (product.Colors.Any(c => c.Length > 50))
            {
                ModelState.AddModelError("Colors", "Color name cannot exceed 50 characters");
            }
            
            if (product.Tags.Any(t => t.Length > 50))
            {
                ModelState.AddModelError("Tags", "Tag name cannot exceed 50 characters");
            }
            
            if (product.GalleryImages.Any(g => g.Length > 500))
            {
                ModelState.AddModelError("GalleryImages", "Image URL cannot exceed 500 characters");
            }
            
            if (ModelState.IsValid)
            {
                await _productRepository.AddProductAsync(product);
                return RedirectToAction(nameof(Products));
            }
            
            return View(product);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            // Debug logging for boolean properties
            _logger.LogInformation($"UpdateProduct - IsFeatured: {product.IsFeatured}, IsBestSeller: {product.IsBestSeller}");
            
            // Initialize collections if they are null
            product.Features ??= new List<string>();
            product.Colors ??= new List<string>();
            product.Tags ??= new List<string>();
            product.GalleryImages ??= new List<string>();
            
            // Validate collection items (remove empty items)
            product.Features = product.Features.Where(f => !string.IsNullOrWhiteSpace(f)).ToList();
            product.Colors = product.Colors.Where(c => !string.IsNullOrWhiteSpace(c)).ToList();
            product.Tags = product.Tags.Where(t => !string.IsNullOrWhiteSpace(t)).ToList();
            product.GalleryImages = product.GalleryImages.Where(g => !string.IsNullOrWhiteSpace(g)).ToList();
            
            // Remove duplicate items
            product.Features = product.Features.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            product.Colors = product.Colors.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            product.Tags = product.Tags.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            product.GalleryImages = product.GalleryImages.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            
            // Validate required collections
            if (!product.Features.Any())
            {
                ModelState.AddModelError("Features", "At least one feature is required");
            }
            
            if (!product.Colors.Any())
            {
                ModelState.AddModelError("Colors", "At least one color is required");
            }
            
            // Validate item length
            if (product.Features.Any(f => f.Length > 200))
            {
                ModelState.AddModelError("Features", "Feature text cannot exceed 200 characters");
            }
            
            if (product.Colors.Any(c => c.Length > 50))
            {
                ModelState.AddModelError("Colors", "Color name cannot exceed 50 characters");
            }
            
            if (product.Tags.Any(t => t.Length > 50))
            {
                ModelState.AddModelError("Tags", "Tag name cannot exceed 50 characters");
            }
            
            if (product.GalleryImages.Any(g => g.Length > 500))
            {
                ModelState.AddModelError("GalleryImages", "Image URL cannot exceed 500 characters");
            }
            
            if (ModelState.IsValid)
            {
                product.Id = id; // Ensure the ID is set correctly
                await _productRepository.UpdateProductAsync(product);
                return RedirectToAction(nameof(Products));
            }
            
            return View("Product", product);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _productRepository.DeleteProductAsync(id);
            return RedirectToAction(nameof(Products));
        }
       
    }
}