using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using olshop.Data;

namespace olshop.HealthChecks
{
    public class DatabaseHealthCheck : IHealthCheck
    {
        private readonly IDatabaseConnectionFactory _connectionFactory;

        public DatabaseHealthCheck(IDatabaseConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                // Get a database connection
                using var connection = _connectionFactory.CreateConnection();
                
                // Open the connection
                connection.Open();
                
                // Execute a simple query to verify the connection works
                using var command = connection.CreateCommand();
                command.CommandText = "SELECT 1";
                command.ExecuteScalar();
                
                return Task.FromResult(HealthCheckResult.Healthy("Database connection is healthy"));
            }
            catch (Exception ex)
            {
                return Task.FromResult(HealthCheckResult.Unhealthy("Database connection failed", ex));
            }
        }
    }
}