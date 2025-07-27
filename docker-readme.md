# Docker Configuration for Online Shop Application

This document explains the Docker configuration for the ASP.NET Core online shop application and provides guidance on how to build, run, and customize the Docker image.

## Dockerfile Overview

The `Dockerfile` uses a multi-stage build approach to create an optimized container image:

1. **Build Stage**: Uses the .NET SDK image to restore dependencies and build the application
2. **Publish Stage**: Publishes the application in Release configuration
3. **Final Stage**: Creates a minimal runtime image with only the necessary components

## Base Images

- **Build/Publish**: `mcr.microsoft.com/dotnet/sdk:9.0` - Official Microsoft .NET SDK image
- **Runtime**: `mcr.microsoft.com/dotnet/aspnet:9.0` - Official Microsoft ASP.NET runtime image

These images are version-pinned to ensure consistency and stability.

## Security Considerations

The Dockerfile implements several security best practices:

- **Non-root User**: The application runs as a non-privileged `appuser` instead of root
- **Minimal Dependencies**: Only essential packages are installed
- **Clean-up**: Package manager caches are removed to reduce image size
- **Minimal Permissions**: File ownership is properly set for the application user

## Layer Caching Strategy

The Dockerfile is optimized for Docker layer caching:

1. Project file (`olshop.csproj`) is copied and restored separately
2. Source code is copied and built in a subsequent layer
3. Only the published application is included in the final image

This approach significantly speeds up rebuilds when only source code changes.

## Docker Ignore Configuration

A `.dockerignore` file is included to optimize the Docker build process by excluding unnecessary files from the build context:

```
# Git
.git
.gitignore
.gitattributes

# Docker
Dockerfile
docker-compose.yml
.dockerignore
...
```

Benefits of the `.dockerignore` file:
- **Faster builds**: Reduces the amount of data sent to the Docker daemon
- **Smaller context**: Prevents unnecessary files from being included in the build context
- **Prevents secrets leakage**: Excludes sensitive files from being copied into the image
- **Cleaner builds**: Avoids including development artifacts and temporary files

## Volume Configuration

The Dockerfile defines a volume mount point for persistent data:

```
VOLUME ["/app/data"]
```

This allows you to persist data across container restarts and updates. You can mount a host directory to this volume when running the container.

## Port Configuration

The application exposes port 8080:

```
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
```

## Health Check Implementation

The application includes a comprehensive health check system that integrates with Docker's health check mechanism:

### Application Health Checks

1. **Basic Health Check**: The application exposes a `/health` endpoint that returns the overall health status
2. **Database Health Check**: A custom health check that verifies database connectivity

The health checks are implemented using ASP.NET Core's built-in health check system:

```csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database_health_check");

// Map the health check endpoint
app.MapHealthChecks("/health");
```

### Docker Health Check Configuration

The Dockerfile includes a health check configuration that periodically checks the application's health:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

This configuration:
- Checks the `/health` endpoint every 30 seconds
- Allows 3 seconds for the health check to complete
- Waits 5 seconds after container startup before the first check
- Requires 3 consecutive failures to mark the container as unhealthy

### Benefits of Health Checks

- **Automatic recovery**: Docker can automatically restart unhealthy containers
- **Load balancer integration**: Load balancers can use health checks to route traffic only to healthy instances
- **Monitoring**: Health status can be monitored and alerted on
- **Deployment validation**: Ensures the application is fully functional after deployment

## Environment Variables

The Dockerfile sets default environment variables that can be overridden at runtime:

- `ASPNETCORE_URLS`: Sets the URL the application listens on
- `ASPNETCORE_ENVIRONMENT`: Sets the application environment (Production by default)

## Building the Docker Image

To build the Docker image:

```bash
docker build -t olshop:latest .
```

## Running the Container

Basic run command:

```bash
docker run -d -p 8080:8080 --name olshop olshop:latest
```

With volume mounting for data persistence:

```bash
docker run -d -p 8080:8080 -v /path/on/host:/app/data --name olshop olshop:latest
```

With custom environment variables:

```bash
docker run -d -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ConnectionStrings__DefaultConnection="Server=db;Database=olshop;User=user;Password=password;" \
  --name olshop olshop:latest
```

## Database Configuration

The Dockerfile includes support for multiple database providers (MySQL, PostgreSQL, SQLite) by installing the necessary dependencies. Configure your database connection using environment variables when running the container.

## Production Considerations

For production deployments:

1. Consider using Docker Compose or Kubernetes for orchestration
2. Implement proper logging configuration
3. Set up a reverse proxy (like Nginx) for SSL termination
4. Use Docker secrets or a secure vault for sensitive information
5. Configure appropriate resource limits for the container

## Quick Start Scripts

For convenience, this project includes scripts to build and run the Docker container:

### For Linux/macOS Users

```bash
# Make the script executable
chmod +x build-and-run.sh

# Run the script
./build-and-run.sh
```

The script will:
1. Build the Docker image
2. Stop and remove any existing container with the same name
3. Start a new container
4. Display information about how to view logs and manage the container

### For Windows Users

```
# Run the script
build-and-run.bat
```

The batch file performs the same operations as the shell script but is compatible with Windows command prompt.

### Script Customization

You can customize the scripts by editing the following variables at the top:
- `IMAGE_NAME`: The name of the Docker image
- `CONTAINER_NAME`: The name of the Docker container
- `PORT`: The port to expose on the host machine

## Docker Compose Helper Scripts

This project also includes helper scripts for running the application with Docker Compose:

### For Linux/macOS Users

```bash
# Make the script executable
chmod +x docker-compose-run.sh

# Run the script
./docker-compose-run.sh
```

### For Windows Users

```
# Run the script
docker-compose-run.bat
```

### Features of the Docker Compose Scripts

These scripts provide an interactive way to configure and run the application:

1. **Database Selection**: Choose between MySQL, PostgreSQL, or SQLite
2. **Automatic Configuration**: The script modifies the docker-compose.yml file based on your selection
3. **Container Management**: Starts all necessary containers and provides commands for viewing logs and stopping containers

The scripts create a temporary modified version of the docker-compose.yml file with the appropriate services uncommented based on your database selection.

## Customizing the Image

To customize the image for specific needs:

1. Modify the Dockerfile and rebuild
2. Use build arguments for customization during build time
3. Override environment variables at runtime
4. Use volume mounts for configuration files

## Troubleshooting

If you encounter issues:

1. Check container logs: `docker logs olshop`
2. Verify the health check status: `docker inspect olshop | grep -A 10 Health`
3. Ensure database connectivity from within the container
4. Verify volume permissions if using mounted volumes

## Using Docker Compose

A `docker-compose.yml` file is provided for easy deployment of the application with its dependencies. The file includes:

1. The ASP.NET Core application service
2. Commented-out database services (MySQL, PostgreSQL)
3. Volume configurations for data persistence
4. Network configuration
5. Environment variables for database connections

### Getting Started with Docker Compose

1. Choose your preferred database by uncommenting the relevant service in `docker-compose.yml`
2. Configure the connection string in the app service's environment variables
3. Start the services:

```bash
docker-compose up -d
```

4. Stop the services:

```bash
docker-compose down
```

### Database Options

The `docker-compose.yml` file includes configurations for:

- **MySQL**: Uncomment the MySQL service and related volumes/dependencies
- **PostgreSQL**: Uncomment the PostgreSQL service and related volumes/dependencies
- **SQLite**: No separate service needed, just use the app_data volume

Each database option includes:
- Automatic schema initialization using the SQL files in the `db` directory
- Volume configuration for data persistence
- Appropriate environment variables

### Customizing Docker Compose

You can customize the `docker-compose.yml` file to:

1. Change port mappings
2. Modify environment variables
3. Add additional services (e.g., Redis for caching)
4. Configure resource limits
5. Set up custom networks

For production deployments, consider creating a separate `docker-compose.prod.yml` file with production-specific configurations.