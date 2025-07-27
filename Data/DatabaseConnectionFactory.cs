using System;
using System.Data;
using System.Data.SQLite;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Npgsql;

namespace olshop.Data
{
    /// <summary>
    /// Factory for creating database connections based on the configured provider
    /// </summary>
    public class DatabaseConnectionFactory : IDatabaseConnectionFactory
    {
        private readonly IConfiguration _configuration;
        
        public DatabaseConnectionFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        
        /// <summary>
        /// Creates a database connection based on the configured provider
        /// </summary>
        /// <returns>A database connection (not yet opened)</returns>
        public IDbConnection CreateConnection()
        {
            string dbDriver = GetDatabaseProvider();
            string connectionString = _configuration[$"Database:ConnectionStrings:{dbDriver}"];
            
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException($"Connection string for {dbDriver} is not configured.");
            }
            
            IDbConnection connection = dbDriver.ToLower() switch
            {
                "mysql" => new MySqlConnection(connectionString),
                "postgresql" => new NpgsqlConnection(connectionString),
                "sqlite" => new SQLiteConnection(connectionString),
                _ => throw new NotSupportedException($"Database provider {dbDriver} is not supported.")
            };
            
            return connection;
        }
        
        /// <summary>
        /// Gets the current database provider name
        /// </summary>
        /// <returns>The database provider name (sqlite, mysql, or postgresql)</returns>
        public string GetDatabaseProvider()
        {
            return _configuration["Database:DbDriver"] ?? "sqlite";
        }
    }
}