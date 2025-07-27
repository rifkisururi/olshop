using Microsoft.AspNetCore.Mvc;
using olshop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace olshop.Controllers
{
    public class AdminController : Controller
    {
        private readonly ProductRepository _productRepository;

        public AdminController()
        {
            _productRepository = new ProductRepository();
        }

        public IActionResult Index()
        {
            ViewBag.TotalProducts = _productRepository.GetTotalProductCount();
            ViewBag.TotalSales = _productRepository.GetTotalSales();
            ViewBag.NewOrders = _productRepository.GetNewOrdersCount();
            ViewBag.Customers = _productRepository.GetCustomersCount();
            
            // Get recent products for the dashboard
            ViewBag.RecentProducts = _productRepository.GetAllProducts().Take(5);
            
            return View();
        }

        public IActionResult Products()
        {
            var products = _productRepository.GetAllProducts();
            return View(products);
        }

        public IActionResult Product(int id)
        {
            var product = _productRepository.GetProductById(id);
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
        public IActionResult AddProduct(Product product)
        {
            if (ModelState.IsValid)
            {
                _productRepository.AddProduct(product);
                return RedirectToAction(nameof(Products));
            }
            
            return View(product);
        }

        [HttpPost]
        public IActionResult UpdateProduct(int id, Product product)
        {
            if (ModelState.IsValid)
            {
                product.Id = id; // Ensure the ID is set correctly
                _productRepository.UpdateProduct(product);
                return RedirectToAction(nameof(Products));
            }
            
            return View("Product", product);
        }

        [HttpPost]
        public IActionResult DeleteProduct(int id)
        {
            _productRepository.DeleteProduct(id);
            return RedirectToAction(nameof(Products));
        }
    }
}