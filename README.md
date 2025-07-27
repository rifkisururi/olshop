# OLShop - Online Shopping Platform

![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-9.0-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, feature-rich e-commerce platform built with ASP.NET Core 9.0, supporting multiple database providers and Docker containerization.

## 📋 Description

OLShop is a comprehensive online shopping application designed to provide a seamless shopping experience for users and a powerful management interface for administrators. The application features a responsive design, product catalog, shopping cart functionality, user session management, and an admin dashboard for product management.

### Key Features

- **Multi-database support**: Works with SQLite, MySQL, or PostgreSQL
- **Responsive design**: Optimized for desktop, tablet, and mobile devices
- **Product catalog**: Browse products by category, tags, and search
- **Product details**: Comprehensive product information with image gallery
- **Shopping cart**: Add products to cart with quantity selection
- **Admin dashboard**: Manage products, categories, and orders
- **Docker support**: Easy deployment with Docker and Docker Compose
- **Health checks**: Built-in health monitoring for the application and database

## 🚀 Installation

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download) or later
- One of the following databases:
  - SQLite (included)
  - MySQL 8.0+
  - PostgreSQL 15+
- [Docker](https://www.docker.com/get-started) (optional, for containerized deployment)

### Standard Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/olshop.git
   cd olshop
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Set up the database (see [Database Setup](#database-setup))

4. Run the application:
   ```bash
   dotnet run
   ```

5. Access the application at `https://localhost:5001` or `http://localhost:5000`

### Docker Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/olshop.git
   cd olshop
   ```

2. Build and run using Docker Compose:
   
   #### For Windows:
   ```bash
   docker-compose-run.bat
   ```
   
   #### For Linux/macOS:
   ```bash
   chmod +x docker-compose-run.sh
   ./docker-compose-run.sh
   ```

3. Access the application at `http://localhost:8080`

## 💾 Database Setup

The application supports multiple database providers. Choose one of the following options:

### SQLite (Default)

1. Create a directory for the database:
   ```bash
   mkdir -p db
   ```

2. Run the SQLite schema script:
   ```bash
   sqlite3 db/olshop.db < db/sqlite_schema.sql
   ```

3. Run the SQLite seed script:
   ```bash
   sqlite3 db/olshop.db < db/sqlite_seed.sql
   ```

### MySQL

1. Create a database:
   ```sql
   CREATE DATABASE olshop;
   ```

2. Run the MySQL schema script:
   ```bash
   mysql -u root -p olshop < db/mysql_schema.sql
   ```

3. Run the MySQL seed script:
   ```bash
   mysql -u root -p olshop < db/mysql_seed.sql
   ```

4. Update the connection string in `appsettings.json`:
   ```json
   "Database": {
     "DbDriver": "mysql",
     "ConnectionStrings": {
       "mysql": "Server=localhost;Database=olshop;User=root;Password=your_password;"
     }
   }
   ```

### PostgreSQL

1. Create a database:
   ```sql
   CREATE DATABASE olshop;
   ```

2. Run the PostgreSQL schema script:
   ```bash
   psql -U postgres -d olshop -f db/postgresql_schema.sql
   ```

3. Run the PostgreSQL seed script:
   ```bash
   psql -U postgres -d olshop -f db/postgresql_seed.sql
   ```

4. Update the connection string in `appsettings.json`:
   ```json
   "Database": {
     "DbDriver": "postgresql",
     "ConnectionStrings": {
       "postgresql": "Host=localhost;Database=olshop;Username=postgres;Password=your_password;"
     }
   }
   ```

## 🐳 Docker Deployment

The application includes Docker support for easy deployment. The Docker configuration includes:

- Multi-stage build for optimized image size
- Support for multiple database providers
- Health checks for application monitoring
- Non-root user for security
- Volume mounts for data persistence

### Using Docker Compose

1. Edit the `docker-compose.yml` file to uncomment your preferred database service.

2. Configure the connection string in the environment variables.

3. Start the services:
   ```bash
   docker-compose up -d
   ```

4. Access the application at `http://localhost:8080`

### Manual Docker Commands

Build the Docker image:
```bash
docker build -t olshop:latest .
```

Run the container:
```bash
docker run -d -p 8080:8080 --name olshop olshop:latest
```

With volume mounting for data persistence:
```bash
docker run -d -p 8080:8080 -v /path/on/host:/app/data --name olshop olshop:latest
```

## 🔧 Configuration

### Application Settings

The application settings are stored in the `appsettings.json` file:

```json
{
  "Database": {
    "DbDriver": "sqlite",
    "ConnectionStrings": {
      "sqlite": "Data Source=db/olshop.db;",
      "mysql": "Server=localhost;Database=olshop;User=root;Password=password;",
      "postgresql": "Host=localhost;Database=olshop;Username=postgres;Password=password;"
    }
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Environment Variables

When running with Docker, you can configure the application using environment variables:

- `ASPNETCORE_ENVIRONMENT`: Set to `Development`, `Staging`, or `Production`
- `ConnectionStrings__DefaultConnection`: Database connection string
- `ASPNETCORE_URLS`: URL to listen on (default: `http://+:8080`)

## 📱 Usage

### User Interface

1. **Home Page**: Browse featured and best-selling products
2. **Product Catalog**: View all products with filtering and sorting options
3. **Product Details**: View detailed product information, image gallery, specifications, and reviews
4. **Shopping Cart**: Add products to cart, update quantities, and proceed to checkout

### Admin Interface

1. **Dashboard**: View sales statistics and recent orders
2. **Products**: Manage products (add, edit, delete)
3. **Orders**: View and manage customer orders
4. **Settings**: Configure application settings

## 🏗️ Architecture

The application follows a clean architecture pattern with the following components:

### Data Access Layer

- **Repository Pattern**: Abstracts database operations
- **Dapper ORM**: Lightweight data access with high performance
- **Multiple Database Support**: SQLite, MySQL, PostgreSQL

### Business Logic Layer

- **Service Layer**: Implements business logic
- **Validation**: Input validation and business rule enforcement
- **Session Management**: User session handling

### Presentation Layer

- **MVC Pattern**: Model-View-Controller architecture
- **Responsive Design**: Bootstrap-based responsive UI
- **JavaScript Enhancements**: Dynamic UI interactions

## 🧩 Dependencies

- **ASP.NET Core 9.0**: Web framework
- **Dapper**: Micro-ORM for data access
- **Bootstrap 5**: Front-end framework
- **Font Awesome**: Icon library
- **jQuery**: JavaScript library
- **SQLite/MySQL/PostgreSQL**: Database providers

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

### Coding Standards

- Follow the [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/inside-a-program/coding-conventions)
- Write unit tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core)
- [Dapper](https://github.com/DapperLib/Dapper)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [Docker](https://www.docker.com/)

## 📞 Contact

For questions or support, please open an issue on the GitHub repository or contact the maintainers directly.

---

Made with ❤️ by Your Team