using System;

namespace olshop.Data
{
    /// <summary>
    /// Interface for providing database-agnostic SQL queries
    /// </summary>
    public interface ISqlQueryProvider
    {
        /// <summary>
        /// Gets a pagination query for the specified base query
        /// </summary>
        /// <param name="baseQuery">The base SQL query</param>
        /// <param name="page">The page number (1-based)</param>
        /// <param name="pageSize">The page size</param>
        /// <returns>A SQL query with pagination</returns>
        string GetPaginationQuery(string baseQuery, int page, int pageSize);
        
        /// <summary>
        /// Gets an insert query for the specified table and columns
        /// </summary>
        /// <param name="tableName">The table name</param>
        /// <param name="columns">The column names</param>
        /// <returns>A SQL insert query that returns the inserted ID</returns>
        string GetInsertQuery(string tableName, string[] columns);
        
        /// <summary>
        /// Gets a query to retrieve the last inserted ID
        /// </summary>
        /// <returns>A SQL query to get the last inserted ID</returns>
        string GetLastInsertIdQuery();
    }
}