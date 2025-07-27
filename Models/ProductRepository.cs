using System;
using System.Collections.Generic;
using System.Linq;

namespace olshop.Models
{
    public class ProductRepository
    {
        private readonly List<Product> _products;

        public ProductRepository()
        {
            // Initialize with hardcoded product data
            _products = new List<Product>
            {
                new Product
                {
                    Id = 1,
                    Name = "Elegant Tote Bag",
                    Category = "Bags",
                    Price = 89.99m,
                    OldPrice = 99.99m,
                    Description = "A stylish and elegant tote bag perfect for everyday use. Made with premium materials and designed for durability and fashion.",
                    Material = "Premium Leather",
                    Dimensions = "30cm x 40cm x 10cm",
                    Weight = 800,
                    Rating = 4.5,
                    ReviewCount = 128,
                    ImageUrl = "https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag",
                    GalleryImages = new List<string>
                    {
                        "https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag+1",
                        "https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag+2",
                        "https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag+3"
                    },
                    Colors = new List<string> { "Black", "Brown", "Pink" },
                    Tags = new List<string> { "Luxury", "Fashion", "Trending" },
                    Features = new List<string>
                    {
                        "Premium quality materials",
                        "Adjustable straps",
                        "Multiple compartments",
                        "Waterproof lining"
                    },
                    IsFeatured = true,
                    IsBestSeller = true,
                    Status = "In Stock"
                },
                new Product
                {
                    Id = 2,
                    Name = "Leather Wallet",
                    Category = "Accessories",
                    Price = 45.00m,
                    OldPrice = 55.00m,
                    Description = "A premium leather wallet with multiple card slots and compartments. Slim design fits perfectly in your pocket.",
                    Material = "Genuine Leather",
                    Dimensions = "10cm x 8cm x 1cm",
                    Weight = 150,
                    Rating = 4.2,
                    ReviewCount = 85,
                    ImageUrl = "https://via.placeholder.com/400?text=Wallet",
                    GalleryImages = new List<string>
                    {
                        "https://via.placeholder.com/400?text=Wallet+1",
                        "https://via.placeholder.com/400?text=Wallet+2"
                    },
                    Colors = new List<string> { "Black", "Brown" },
                    Tags = new List<string> { "Accessories", "Men", "Gift" },
                    Features = new List<string>
                    {
                        "Genuine leather",
                        "Multiple card slots",
                        "Bill compartment",
                        "RFID protection"
                    },
                    IsFeatured = false,
                    IsBestSeller = false,
                    Status = "In Stock"
                },
                new Product
                {
                    Id = 3,
                    Name = "Fashion Bracelet",
                    Category = "Jewelry",
                    Price = 29.99m,
                    Description = "A beautiful fashion bracelet that adds elegance to any outfit. Perfect for daily wear or special occasions.",
                    Material = "Stainless Steel, Cubic Zirconia",
                    Dimensions = "Adjustable",
                    Weight = 50,
                    Rating = 4.8,
                    ReviewCount = 64,
                    ImageUrl = "https://via.placeholder.com/400?text=Bracelet",
                    GalleryImages = new List<string>
                    {
                        "https://via.placeholder.com/400?text=Bracelet+1",
                        "https://via.placeholder.com/400?text=Bracelet+2"
                    },
                    Colors = new List<string> { "Silver", "Gold", "Rose Gold" },
                    Tags = new List<string> { "Jewelry", "Fashion", "Gift", "Women" },
                    Features = new List<string>
                    {
                        "Hypoallergenic materials",
                        "Adjustable size",
                        "Tarnish resistant",
                        "Gift box included"
                    },
                    IsFeatured = true,
                    IsBestSeller = false,
                    Status = "Low Stock"
                },
                new Product
                {
                    Id = 4,
                    Name = "Stylish Sunglasses",
                    Category = "Accessories",
                    Price = 59.99m,
                    OldPrice = 79.99m,
                    Description = "Trendy sunglasses with UV protection. Lightweight frame and polarized lenses for maximum comfort.",
                    Material = "Acetate Frame, Polarized Lenses",
                    Dimensions = "Standard Size",
                    Weight = 120,
                    Rating = 4.0,
                    ReviewCount = 42,
                    ImageUrl = "https://via.placeholder.com/400?text=Sunglasses",
                    GalleryImages = new List<string>
                    {
                        "https://via.placeholder.com/400?text=Sunglasses+1",
                        "https://via.placeholder.com/400?text=Sunglasses+2"
                    },
                    Colors = new List<string> { "Black", "Tortoise", "Blue" },
                    Tags = new List<string> { "Accessories", "Summer", "UV Protection" },
                    Features = new List<string>
                    {
                        "UV400 protection",
                        "Polarized lenses",
                        "Lightweight frame",
                        "Includes case and cleaning cloth"
                    },
                    IsFeatured = false,
                    IsBestSeller = false,
                    Status = "Out of Stock"
                },
                new Product
                {
                    Id = 5,
                    Name = "Designer Watch",
                    Category = "Watches",
                    Price = 129.99m,
                    Description = "Elegant designer watch with premium materials. Water-resistant and perfect for any occasion.",
                    Material = "Stainless Steel, Mineral Glass",
                    Dimensions = "40mm Case",
                    Weight = 180,
                    Rating = 4.7,
                    ReviewCount = 93,
                    ImageUrl = "https://via.placeholder.com/400",
                    GalleryImages = new List<string>
                    {
                        "https://via.placeholder.com/400?text=Watch+1",
                        "https://via.placeholder.com/400?text=Watch+2",
                        "https://via.placeholder.com/400?text=Watch+3"
                    },
                    Colors = new List<string> { "Silver", "Gold", "Black" },
                    Tags = new List<string> { "Watches", "Luxury", "Gift" },
                    Features = new List<string>
                    {
                        "Japanese quartz movement",
                        "Water resistant to 50m",
                        "Scratch-resistant glass",
                        "2-year warranty"
                    },
                    IsFeatured = true,
                    IsBestSeller = true,
                    Status = "In Stock"
                }
            };
        }

        public IEnumerable<Product> GetAllProducts()
        {
            return _products;
        }

        public Product? GetProductById(int id)
        {
            return _products.FirstOrDefault(p => p.Id == id);
        }

        public IEnumerable<Product> GetFeaturedProducts()
        {
            return _products.Where(p => p.IsFeatured);
        }

        public IEnumerable<Product> GetBestSellerProducts()
        {
            return _products.Where(p => p.IsBestSeller);
        }

        public IEnumerable<Product> GetProductsByCategory(string category)
        {
            return _products.Where(p => p.Category != null && p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }

        public void AddProduct(Product product)
        {
            // Generate a new ID (in a real app, this would be handled by the database)
            int newId = _products.Max(p => p.Id) + 1;
            product.Id = newId;
            _products.Add(product);
        }

        public void UpdateProduct(Product product)
        {
            var existingProduct = _products.FirstOrDefault(p => p.Id == product.Id);
            if (existingProduct != null)
            {
                int index = _products.IndexOf(existingProduct);
                _products[index] = product;
            }
        }

        public void DeleteProduct(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product != null)
            {
                _products.Remove(product);
            }
        }

        // Statistics for dashboard
        public int GetTotalProductCount()
        {
            return _products.Count;
        }

        public decimal GetTotalSales()
        {
            // This would normally come from an orders repository
            // For demo purposes, we'll return a hardcoded value
            return 12456.00m;
        }

        public int GetNewOrdersCount()
        {
            // This would normally come from an orders repository
            // For demo purposes, we'll return a hardcoded value
            return 43;
        }

        public int GetCustomersCount()
        {
            // This would normally come from a customers repository
            // For demo purposes, we'll return a hardcoded value
            return 1258;
        }
    }
}