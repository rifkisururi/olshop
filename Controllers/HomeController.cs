using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using olshop.Models;
using olshop.Data;
using olshop.Extensions;

namespace olshop.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IProductRepository _productRepository;

    public HomeController(ILogger<HomeController> logger, IProductRepository productRepository)
    {
        _logger = logger;
        _productRepository = productRepository;
    }

    public async Task<IActionResult> Index()
    {
        try
        {
            // Retrieve featured products (limited to a reasonable number)
            var featuredProducts = await _productRepository.GetFeaturedProductsAsync();
            ViewData["FeaturedProducts"] = featuredProducts.Take(4);
            
            // Retrieve best-selling products (limited to a reasonable number)
            var bestSellingProducts = await _productRepository.GetBestSellerProductsAsync();
            ViewData["BestSellingProducts"] = bestSellingProducts.Take(4);
            
            return View();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products for home page");
            // Return empty collections to avoid breaking the view
            ViewData["FeaturedProducts"] = Enumerable.Empty<Product>();
            ViewData["BestSellingProducts"] = Enumerable.Empty<Product>();
            return View();
        }
    }

    public async Task<IActionResult> DetailProduk(int id)
    {
        var product = await _productRepository.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        
        // Get related products (same category)
        var relatedProducts = await _productRepository.GetProductsByCategoryAsync(product.Category);
        ViewData["RelatedProducts"] = relatedProducts.Where(p => p.Id != id).Take(4);
        
        // Handle recently viewed products (using session)
        var recentlyViewed = HttpContext.Session.Get<List<int>>("RecentlyViewed") ?? new List<int>();
        if (!recentlyViewed.Contains(id))
        {
            recentlyViewed.Insert(0, id);
            if (recentlyViewed.Count > 4)
            {
                recentlyViewed = recentlyViewed.Take(4).ToList();
            }
        }
        HttpContext.Session.Set("RecentlyViewed", recentlyViewed);
        
        if (recentlyViewed.Count > 1) // Don't include current product
        {
            var recentProducts = new List<Product>();
            foreach (var recentId in recentlyViewed.Where(rid => rid != id).Take(4))
            {
                var recentProduct = await _productRepository.GetProductByIdAsync(recentId);
                if (recentProduct != null)
                {
                    recentProducts.Add(recentProduct);
                }
            }
            ViewData["RecentlyViewed"] = recentProducts;
        }
        
        return View(product);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
