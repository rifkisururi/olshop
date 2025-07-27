using System.Collections.Generic;

namespace olshop.Models
{
    /// <summary>
    /// Model for product filtering and pagination parameters
    /// </summary>
    public class ProductFilterModel
    {
        /// <summary>
        /// Search term for filtering products
        /// </summary>
        public string? Search { get; set; }
        
        /// <summary>
        /// List of categories to filter by
        /// </summary>
        public List<string> Categories { get; set; } = new List<string>();
        
        /// <summary>
        /// Minimum price for price range filter
        /// </summary>
        public decimal? PriceMin { get; set; }
        
        /// <summary>
        /// Maximum price for price range filter
        /// </summary>
        public decimal? PriceMax { get; set; }
        
        /// <summary>
        /// List of colors to filter by
        /// </summary>
        public List<string> Colors { get; set; } = new List<string>();
        
        /// <summary>
        /// Minimum rating to filter by
        /// </summary>
        public int? MinRating { get; set; }
        
        /// <summary>
        /// Product status to filter by (In Stock, Low Stock, Out of Stock)
        /// </summary>
        public string? Status { get; set; }
        
        /// <summary>
        /// Filter by featured products
        /// </summary>
        public bool? IsFeatured { get; set; }
        
        /// <summary>
        /// Filter by best seller products
        /// </summary>
        public bool? IsBestSeller { get; set; }
        
        /// <summary>
        /// Field to sort by (newest, price-low-high, price-high-low, best-selling, rating)
        /// </summary>
        public string? SortBy { get; set; }
        
        /// <summary>
        /// Current page number (1-based)
        /// </summary>
        public int Page { get; set; } = 1;
        
        /// <summary>
        /// Number of items per page
        /// </summary>
        public int PageSize { get; set; } = 10;
        
        /// <summary>
        /// Valid page size options
        /// </summary>
        public static readonly int[] ValidPageSizes = { 10, 25, 50, 100 };
    }
}