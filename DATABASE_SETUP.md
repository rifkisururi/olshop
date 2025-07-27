# Database Setup and Configuration

This document provides instructions for setting up and configuring the database for the olshop application.

## Supported Database Providers

The application supports the following database providers:

- SQLite (default)
- MySQL
- PostgreSQL

## Configuration

The database configuration is stored in the `appsettings.json` file. You can change the database provider by modifying the `DbDriver` setting.

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

## Database Setup

### SQLite

1. Create a directory named `db` in the root of the application.
2. Run the SQLite schema script to create the database:

```bash
sqlite3 db/olshop.db < db/sqlite_schema.sql
```

3. Run the SQLite seed script to populate the database with initial data:

```bash
sqlite3 db/olshop.db < db/sqlite_seed.sql
```

### MySQL

1. Create a database named `olshop`:

```sql
CREATE DATABASE olshop;
```

2. Run the MySQL schema script to create the tables:

```bash
mysql -u root -p olshop < db/mysql_schema.sql
```

3. Run the MySQL seed script to populate the database with initial data:

```bash
mysql -u root -p olshop < db/mysql_seed.sql
```

### PostgreSQL

1. Create a database named `olshop`:

```sql
CREATE DATABASE olshop;
```

2. Run the PostgreSQL schema script to create the tables:

```bash
psql -U postgres -d olshop -f db/postgresql_schema.sql
```

3. Run the PostgreSQL seed script to populate the database with initial data:

```bash
psql -U postgres -d olshop -f db/postgresql_seed.sql
```

## Switching Database Providers

To switch to a different database provider:

1. Update the `DbDriver` setting in `appsettings.json` to one of the following values:
   - `sqlite`
   - `mysql`
   - `postgresql`

2. Ensure the connection string for the selected provider is correctly configured.

3. Restart the application.

## Database Schema

The database schema consists of the following tables:

- `Products`: Stores the main product information.
- `GalleryImages`: Stores the gallery images for each product.
- `ProductColors`: Stores the available colors for each product.
- `ProductTags`: Stores the tags associated with each product.
- `ProductFeatures`: Stores the features of each product.

### Entity Relationship Diagram

```
Products 1 --- * GalleryImages
Products 1 --- * ProductColors
Products 1 --- * ProductTags
Products 1 --- * ProductFeatures
```

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify that the database server is running.
2. Check that the connection string is correct.
3. Ensure that the user has the necessary permissions to access the database.

### Migration Issues

If you need to update the database schema:

1. Create a new SQL script with the necessary changes.
2. Run the script against your database.

## Additional Resources

- [Dapper Documentation](https://github.com/DapperLib/Dapper)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)