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

        public AdminController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
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