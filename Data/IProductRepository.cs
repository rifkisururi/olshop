using System.Collections.Generic;
using System.Threading.Tasks;
using olshop.Models;

namespace olshop.Data
{
    /// <summary>
    /// Interface for product repository
    /// </summary>
    public interface IProductRepository
    {
        /// <summary>
        /// Gets all products
        /// </summary>
        /// <returns>All products</returns>
        Task<IEnumerable<Product>> GetAllProductsAsync();
        
        /// <summary>
        /// Gets a product by ID
        /// </summary>
        /// <param name="id">The product ID</param>
        /// <returns>The product, or null if not found</returns>
        Task<Product?> GetProductByIdAsync(int id);
        
        /// <summary>
        /// Gets featured products
        /// </summary>
        /// <returns>Featured products</returns>
        Task<IEnumerable<Product>> GetFeaturedProductsAsync();
        
        /// <summary>
        /// Gets best seller products
        /// </summary>
        /// <returns>Best seller products</returns>
        Task<IEnumerable<Product>> GetBestSellerProductsAsync();
        
        /// <summary>
        /// Gets products by category
        /// </summary>
        /// <param name="category">The category name</param>
        /// <returns>Products in the specified category</returns>
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);
        
        /// <summary>
        /// Adds a new product
        /// </summary>
        /// <param name="product">The product to add</param>
        /// <returns>The ID of the new product</returns>
        Task<int> AddProductAsync(Product product);
        
        /// <summary>
        /// Updates an existing product
        /// </summary>
        /// <param name="product">The product to update</param>
        Task UpdateProductAsync(Product product);
        
        /// <summary>
        /// Deletes a product
        /// </summary>
        /// <param name="id">The ID of the product to delete</param>
        Task DeleteProductAsync(int id);
        
        /// <summary>
        /// Gets the total number of products
        /// </summary>
        /// <returns>The total number of products</returns>
        Task<int> GetTotalProductCountAsync();
        
        /// <summary>
        /// Gets the total sales amount
        /// </summary>
        /// <returns>The total sales amount</returns>
        Task<decimal> GetTotalSalesAsync();
        
        /// <summary>
        /// Gets the number of new orders
        /// </summary>
        /// <returns>The number of new orders</returns>
        Task<int> GetNewOrdersCountAsync();
        
        /// <summary>
        /// Gets the number of customers
        /// </summary>
        /// <returns>The number of customers</returns>
        Task<int> GetCustomersCountAsync();
    }
}