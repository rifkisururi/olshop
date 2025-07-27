using System;
using System.Collections.Generic;

namespace olshop.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Category { get; set; }
        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }
        public string? Description { get; set; }
        public string? Material { get; set; }
        public string? Dimensions { get; set; }
        public int Weight { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> GalleryImages { get; set; }
        public List<string> Colors { get; set; }
        public List<string> Tags { get; set; }
        public List<string> Features { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsBestSeller { get; set; }
        public string? Status { get; set; } // "In Stock", "Low Stock", "Out of Stock"

        public Product()
        {
            GalleryImages = new List<string>();
            Colors = new List<string>();
            Tags = new List<string>();
            Features = new List<string>();
        }
    }
}