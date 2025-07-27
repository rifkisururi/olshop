using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Logging;
using olshop.Models;

namespace olshop.Data
{
    /// <summary>
    /// Repository for product data using Dapper
    /// </summary>
    public class ProductRepository : IProductRepository
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;
        private readonly ISqlQueryProvider _sqlQueryProvider;
        private readonly ILogger<ProductRepository> _logger;
        
        public ProductRepository(
            IDatabaseConnectionFactory connectionFactory,
            ISqlQueryProvider sqlQueryProvider,
            ILogger<ProductRepository> logger)
        {
            _connectionFactory = connectionFactory;
            _sqlQueryProvider = sqlQueryProvider;
            _logger = logger;
        }
        
        /// <summary>
        /// Gets all products
        /// </summary>
        /// <returns>All products</returns>
        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                
                var products = await connection.QueryAsync<Product>("SELECT * FROM Products");
                
                // Load related collections for each product
                foreach (var product in products)
                {
                    await LoadProductCollectionsAsync(connection, product);
                }
                
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all products");
                throw;
            }
        }
        
        /// <summary>
        /// Gets a product by ID
        /// </summary>
        /// <param name="id">The product ID</param>
        /// <returns>The product, or null if not found</returns>
        public async Task<Product?> GetProductByIdAsync(int id)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                
                var product = await connection.QueryFirstOrDefaultAsync<Product>(
                    "SELECT * FROM Products WHERE Id = @Id", 
                    new { Id = id });
                
                if (product == null)
                    return null;
                
                await LoadProductCollectionsAsync(connection, product);
                
                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product with ID {ProductId}", id);
                throw;
            }
        }
        
        /// <summary>
        /// Gets featured products
        /// </summary>
        /// <returns>Featured products</returns>
        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                
                var products = await connection.QueryAsync<Product>(
                    "SELECT * FROM Products WHERE IsFeatured = @IsFeatured", 
                    new { IsFeatured = true });
                
                foreach (var product in products)
                {
                    await LoadProductCollectionsAsync(connection, product);
                }
                
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving featured products");
                throw;
            }
        }
        
        /// <summary>
        /// Gets best seller products
        /// </summary>
        /// <returns>Best seller products</returns>
        public async Task<IEnumerable<Product>> GetBestSellerProductsAsync()
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                
                var products = await connection.QueryAsync<Product>(
                    "SELECT * FROM Products WHERE IsBestSeller = @IsBestSeller", 
                    new { IsBestSeller = true });
                
                foreach (var product in products)
                {
                    await LoadProductCollectionsAsync(connection, product);
                }
                
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving best seller products");
                throw;
            }
        }
        
        /// <summary>
        /// Gets products by category
        /// </summary>
        /// <param name="category">The category name</param>
        /// <returns>Products in the specified category</returns>
        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                
                var products = await connection.QueryAsync<Product>(
                    "SELECT * FROM Products WHERE Category = @Category", 
                    new { Category = category });
                
                foreach (var product in products)
                {
                    await LoadProductCollectionsAsync(connection, product);
                }
                
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products by category {Category}", category);
                throw;
            }
        }
        
        /// <summary>
        /// Adds a new product
        /// </summary>
        /// <param name="product">The product to add</param>
        /// <returns>The ID of the new product</returns>
        public async Task<int> AddProductAsync(Product product)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                using var transaction = connection.BeginTransaction();
                
                try
                {
                    // Insert product
                    string insertProductQuery = _sqlQueryProvider.GetInsertQuery("Products", new[] {
                        "Name", "Category", "Price", "OldPrice", "Description", "Material", 
                        "Dimensions", "Weight", "Rating", "ReviewCount", "ImageUrl", 
                        "IsFeatured", "IsBestSeller", "Status"
                    });
                    
                    int productId = await connection.ExecuteScalarAsync<int>(insertProductQuery, new {
                        product.Name,
                        product.Category,
                        product.Price,
                        product.OldPrice,
                        product.Description,
                        product.Material,
                        product.Dimensions,
                        product.Weight,
                        product.Rating,
                        product.ReviewCount,
                        product.ImageUrl,
                        product.IsFeatured,
                        product.IsBestSeller,
                        product.Status
                    }, transaction);
                    
                    // Insert gallery images
                    if (product.GalleryImages != null && product.GalleryImages.Any())
                    {
                        string insertGalleryImageQuery = "INSERT INTO GalleryImages (ProductId, ImageUrl) VALUES (@ProductId, @ImageUrl)";
                        foreach (var imageUrl in product.GalleryImages)
                        {
                            await connection.ExecuteAsync(insertGalleryImageQuery, new { ProductId = productId, ImageUrl = imageUrl }, transaction);
                        }
                    }
                    
                    // Insert colors
                    if (product.Colors != null && product.Colors.Any())
                    {
                        string insertColorQuery = "INSERT INTO ProductColors (ProductId, Color) VALUES (@ProductId, @Color)";
                        foreach (var color in product.Colors)
                        {
                            await connection.ExecuteAsync(insertColorQuery, new { ProductId = productId, Color = color }, transaction);
                        }
                    }
                    
                    // Insert tags
                    if (product.Tags != null && product.Tags.Any())
                    {
                        string insertTagQuery = "INSERT INTO ProductTags (ProductId, Tag) VALUES (@ProductId, @Tag)";
                        foreach (var tag in product.Tags)
                        {
                            await connection.ExecuteAsync(insertTagQuery, new { ProductId = productId, Tag = tag }, transaction);
                        }
                    }
                    
                    // Insert features
                    if (product.Features != null && product.Features.Any())
                    {
                        string insertFeatureQuery = "INSERT INTO ProductFeatures (ProductId, Feature) VALUES (@ProductId, @Feature)";
                        foreach (var feature in product.Features)
                        {
                            await connection.ExecuteAsync(insertFeatureQuery, new { ProductId = productId, Feature = feature }, transaction);
                        }
                    }
                    
                    transaction.Commit();
                    return productId;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding product {ProductName}", product.Name);
                throw;
            }
        }
        
        /// <summary>
        /// Updates an existing product
        /// </summary>
        /// <param name="product">The product to update</param>
        public async Task UpdateProductAsync(Product product)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                using var transaction = connection.BeginTransaction();
                
                try
                {
                    // Update product
                    string updateProductQuery = @"
                        UPDATE Products 
                        SET Name = @Name, 
                            Category = @Category, 
                            Price = @Price, 
                            OldPrice = @OldPrice, 
                            Description = @Description, 
                            Material = @Material, 
                            Dimensions = @Dimensions, 
                            Weight = @Weight, 
                            Rating = @Rating, 
                            ReviewCount = @ReviewCount, 
                            ImageUrl = @ImageUrl, 
                            IsFeatured = @IsFeatured, 
                            IsBestSeller = @IsBestSeller, 
                            Status = @Status 
                        WHERE Id = @Id";
                    
                    await connection.ExecuteAsync(updateProductQuery, product, transaction);
                    
                    // Delete existing related collections
                    await connection.ExecuteAsync("DELETE FROM GalleryImages WHERE ProductId = @Id", new { product.Id }, transaction);
                    await connection.ExecuteAsync("DELETE FROM ProductColors WHERE ProductId = @Id", new { product.Id }, transaction);
                    await connection.ExecuteAsync("DELETE FROM ProductTags WHERE ProductId = @Id", new { product.Id }, transaction);
                    await connection.ExecuteAsync("DELETE FROM ProductFeatures WHERE ProductId = @Id", new { product.Id }, transaction);
                    
                    // Insert gallery images
                    if (product.GalleryImages != null && product.GalleryImages.Any())
                    {
                        string insertGalleryImageQuery = "INSERT INTO GalleryImages (ProductId, ImageUrl) VALUES (@ProductId, @ImageUrl)";
                        foreach (var imageUrl in product.GalleryImages)
                        {
                            await connection.ExecuteAsync(insertGalleryImageQuery, new { ProductId = product.Id, ImageUrl = imageUrl }, transaction);
                        }
                    }
                    
                    // Insert colors
                    if (product.Colors != null && product.Colors.Any())
                    {
                        string insertColorQuery = "INSERT INTO ProductColors (ProductId, Color) VALUES (@ProductId, @Color)";
                        foreach (var color in product.Colors)
                        {
                            await connection.ExecuteAsync(insertColorQuery, new { ProductId = product.Id, Color = color }, transaction);
                        }
                    }
                    
                    // Insert tags
                    if (product.Tags != null && product.Tags.Any())
                    {
                        string insertTagQuery = "INSERT INTO ProductTags (ProductId, Tag) VALUES (@ProductId, @Tag)";
                        foreach (var tag in product.Tags)
                        {
                            await connection.ExecuteAsync(insertTagQuery, new { ProductId = product.Id, Tag = tag }, transaction);
                        }
                    }
                    
                    // Insert features
                    if (product.Features != null && product.Features.Any())
                    {
                        string insertFeatureQuery = "INSERT INTO ProductFeatures (ProductId, Feature) VALUES (@ProductId, @Feature)";
                        foreach (var feature in product.Features)
                        {
                            await connection.ExecuteAsync(insertFeatureQuery, new { ProductId = product.Id, Feature = feature }, transaction);
                        }
                    }
                    
                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product with ID {ProductId}", product.Id);
                throw;
            }
        }
        
        /// <summary>
        /// Deletes a product
        /// </summary>
        /// <param name="id">The ID of the product to delete</param>
        public async Task DeleteProductAsync(int id)
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                using var transaction = connection.BeginTransaction();
                
                try
                {
                    // Delete related collections first
                    await connection.ExecuteAsync("DELETE FROM GalleryImages WHERE ProductId = @Id", new { Id = id }, transaction);
                    await connection.ExecuteAsync("DELETE FROM ProductColors WHERE ProductId = @Id", new { Id = id }, transaction);
                    await connection.ExecuteAsync("DELETE FROM ProductTags WHERE ProductId = @Id", new { Id = id }, transaction);
                    await connection.ExecuteAsync("DELETE FROM ProductFeatures WHERE ProductId = @Id", new { Id = id }, transaction);
                    
                    // Delete product
                    await connection.ExecuteAsync("DELETE FROM Products WHERE Id = @Id", new { Id = id }, transaction);
                    
                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product with ID {ProductId}", id);
                throw;
            }
        }
        
        /// <summary>
        /// Gets the total number of products
        /// </summary>
        /// <returns>The total number of products</returns>
        public async Task<int> GetTotalProductCountAsync()
        {
            try
            {
                using var connection = _connectionFactory.CreateConnection();
                connection.Open();
                
                return await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Products");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total product count");
                throw;
            }
        }
        
        /// <summary>
        /// Gets the total sales amount
        /// </summary>
        /// <returns>The total sales amount</returns>
        public async Task<decimal> GetTotalSalesAsync()
        {
            // This would normally come from an orders repository
            // For demo purposes, we'll return a hardcoded value
            return await Task.FromResult(12456.00m);
        }
        
        /// <summary>
        /// Gets the number of new orders
        /// </summary>
        /// <returns>The number of new orders</returns>
        public async Task<int> GetNewOrdersCountAsync()
        {
            // This would normally come from an orders repository
            // For demo purposes, we'll return a hardcoded value
            return await Task.FromResult(43);
        }
        
        /// <summary>
        /// Gets the number of customers
        /// </summary>
        /// <returns>The number of customers</returns>
        public async Task<int> GetCustomersCountAsync()
        {
            // This would normally come from a customers repository
            // For demo purposes, we'll return a hardcoded value
            return await Task.FromResult(1258);
        }
        
        /// <summary>
        /// Loads the related collections for a product
        /// </summary>
        /// <param name="connection">The database connection</param>
        /// <param name="product">The product</param>
        private async Task LoadProductCollectionsAsync(IDbConnection connection, Product product)
        {
            // Load gallery images
            var galleryImages = await connection.QueryAsync<string>(
                "SELECT ImageUrl FROM GalleryImages WHERE ProductId = @ProductId",
                new { ProductId = product.Id });
            product.GalleryImages = galleryImages.ToList();
            
            // Load colors
            var colors = await connection.QueryAsync<string>(
                "SELECT Color FROM ProductColors WHERE ProductId = @ProductId",
                new { ProductId = product.Id });
            product.Colors = colors.ToList();
            
            // Load tags
            var tags = await connection.QueryAsync<string>(
                "SELECT Tag FROM ProductTags WHERE ProductId = @ProductId",
                new { ProductId = product.Id });
            product.Tags = tags.ToList();
            
            // Load features
            var features = await connection.QueryAsync<string>(
                "SELECT Feature FROM ProductFeatures WHERE ProductId = @ProductId",
                new { ProductId = product.Id });
            product.Features = features.ToList();
        }
    }
}