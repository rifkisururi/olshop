# Data Access Layer Implementation

This document provides an overview of the data access layer implementation for the olshop application.

## Overview

The data access layer has been refactored to use Dapper as a micro-ORM for database access. The implementation supports multiple database providers (SQLite, MySQL, and PostgreSQL) and uses a repository pattern for data access.

## Key Components

### Database Connection Factory

The `DatabaseConnectionFactory` class is responsible for creating database connections based on the configured provider. It supports SQLite, MySQL, and PostgreSQL.

```csharp
public class DatabaseConnectionFactory : IDatabaseConnectionFactory
{
    private readonly IConfiguration _configuration;
    
    public DatabaseConnectionFactory(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public IDbConnection CreateConnection()
    {
        string dbDriver = GetDatabaseProvider();
        string connectionString = _configuration[$"Database:ConnectionStrings:{dbDriver}"];
        
        IDbConnection connection = dbDriver.ToLower() switch
        {
            "mysql" => new MySqlConnection(connectionString),
            "postgresql" => new NpgsqlConnection(connectionString),
            "sqlite" => new SQLiteConnection(connectionString),
            _ => throw new NotSupportedException($"Database provider {dbDriver} is not supported.")
        };
        
        return connection;
    }
    
    public string GetDatabaseProvider()
    {
        return _configuration["Database:DbDriver"] ?? "sqlite";
    }
}
```

### SQL Query Provider

The `SqlQueryProvider` class generates database-agnostic SQL queries that work across all supported database providers.

```csharp
public class SqlQueryProvider : ISqlQueryProvider
{
    private readonly IDatabaseConnectionFactory _connectionFactory;
    
    public SqlQueryProvider(IDatabaseConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }
    
    public string GetPaginationQuery(string baseQuery, int page, int pageSize)
    {
        // All three database systems support this syntax for pagination
        return $"{baseQuery} LIMIT {pageSize} OFFSET {(page - 1) * pageSize}";
    }
    
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
```

### Product Repository

The `ProductRepository` class implements the `IProductRepository` interface and uses Dapper for data access. It includes methods for retrieving, adding, updating, and deleting products, as well as loading related collections.

```csharp
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
    
    // Implementation of IProductRepository methods...
}
```

## Database Schema

The database schema consists of the following tables:

- `Products`: Stores the main product information.
- `GalleryImages`: Stores the gallery images for each product.
- `ProductColors`: Stores the available colors for each product.
- `ProductTags`: Stores the tags associated with each product.
- `ProductFeatures`: Stores the features of each product.

## Configuration

The database configuration is stored in the `appsettings.json` file:

```json
{
  "Database": {
    "DbDriver": "sqlite",
    "ConnectionStrings": {
      "sqlite": "Data Source=db/olshop.db;",
      "mysql": "Server=localhost;Database=olshop;User=root;Password=password;",
      "postgresql": "Host=localhost;Database=olshop;Username=postgres;Password=password;"
    }
  }
}
```

## Service Registration

The services are registered in the `Program.cs` file:

```csharp
// Register database services
builder.Services.AddSingleton<olshop.Data.IDatabaseConnectionFactory, olshop.Data.DatabaseConnectionFactory>();
builder.Services.AddSingleton<olshop.Data.ISqlQueryProvider, olshop.Data.SqlQueryProvider>();
builder.Services.AddScoped<olshop.Data.IProductRepository, olshop.Data.ProductRepository>();
```

## Controller Updates

The `AdminController` has been updated to use dependency injection and async/await with the new repository:

```csharp
public class AdminController : Controller
{
    private readonly IProductRepository _productRepository;

    public AdminController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }
    
    // Async controller methods...
}
```

## Benefits

- **Multiple Database Support**: The application can now use SQLite, MySQL, or PostgreSQL as the database provider.
- **Database-Agnostic Queries**: SQL queries are generated in a way that works across all supported database providers.
- **Proper Connection Management**: Database connections are properly managed and disposed.
- **Parameter Handling**: Dapper handles parameter binding to prevent SQL injection.
- **Exception Handling**: Comprehensive error handling with logging.
- **Transaction Management**: Proper transaction management for operations that modify multiple tables.

## Setup

See the `DATABASE_SETUP.md` file for instructions on setting up and configuring the database.