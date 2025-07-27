using System.Data;

namespace olshop.Data
{
    /// <summary>
    /// Interface for database connection factory
    /// </summary>
    public interface IDatabaseConnectionFactory
    {
        /// <summary>
        /// Creates a database connection based on the configured provider
        /// </summary>
        /// <returns>An open database connection</returns>
        IDbConnection CreateConnection();
        
        /// <summary>
        /// Gets the current database provider name
        /// </summary>
        /// <returns>The database provider name (sqlite, mysql, or postgresql)</returns>
        string GetDatabaseProvider();
    }
}