using System;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace olshop.Data
{
    /// <summary>
    /// Provider for database-agnostic SQL queries
    /// </summary>
    public class SqlQueryProvider : ISqlQueryProvider
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;
        
        public SqlQueryProvider(IDatabaseConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }
        
        /// <summary>
        /// Gets a pagination query for the specified base query
        /// </summary>
        /// <param name="baseQuery">The base SQL query</param>
        /// <param name="page">The page number (1-based)</param>
        /// <param name="pageSize">The page size</param>
        /// <returns>A SQL query with pagination</returns>
        public string GetPaginationQuery(string baseQuery, int page, int pageSize)
        {
            string dbDriver = _connectionFactory.GetDatabaseProvider();
            
            // All three database systems support this syntax for pagination
            return $"{baseQuery} LIMIT {pageSize} OFFSET {(page - 1) * pageSize}";
        }
        
        /// <summary>
        /// Gets an insert query for the specified table and columns
        /// </summary>
        /// <param name="tableName">The table name</param>
        /// <param name="columns">The column names</param>
        /// <returns>A SQL insert query that returns the inserted ID</returns>
        public string GetInsertQuery(string tableName, string[] columns)
        {
            string dbDriver = _connectionFactory.GetDatabaseProvider();
            string columnList = string.Join(", ", columns);
            string parameterList = string.Join(", ", columns.Select(c => $"@{c}"));
            
            return dbDriver.ToLower() switch
            {
                "mysql" => $"INSERT INTO {tableName} ({columnList}) VALUES ({parameterList}); SELECT LAST_INSERT_ID();",
                "postgresql" => $"INSERT INTO {tableName} ({columnList}) VALUES ({parameterList}) RETURNING Id;",
                "sqlite" => $"INSERT INTO {tableName} ({columnList}) VALUES ({parameterList}); SELECT last_insert_rowid();",
                _ => throw new NotSupportedException($"Database provider {dbDriver} is not supported.")
            };
        }
        
        /// <summary>
        /// Gets a query to retrieve the last inserted ID
        /// </summary>
        /// <returns>A SQL query to get the last inserted ID</returns>
        public string GetLastInsertIdQuery()
        {
            string dbDriver = _connectionFactory.GetDatabaseProvider();
            
            return dbDriver.ToLower() switch
            {
                "mysql" => "SELECT LAST_INSERT_ID();",
                "postgresql" => "SELECT lastval();",
                "sqlite" => "SELECT last_insert_rowid();",
                _ => throw new NotSupportedException($"Database provider {dbDriver} is not supported.")
            };
        }
    }
}