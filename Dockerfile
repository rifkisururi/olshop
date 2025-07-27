# =============================================================================
# ASP.NET Core Online Shop Application Dockerfile
# =============================================================================

# ===== STAGE 1: Build the application =====
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies (utilizing Docker layer caching)
COPY ["olshop.csproj", "./"]
RUN dotnet restore "olshop.csproj"

# Copy everything else and build the application
COPY . .
RUN dotnet build "olshop.csproj" -c Release -o /app/build

# ===== STAGE 2: Publish the application =====
FROM build AS publish
RUN dotnet publish "olshop.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ===== STAGE 3: Final runtime image =====
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Create a non-root user for security
RUN adduser --disabled-password --gecos "" appuser

# Install dependencies for database connectivity
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       curl \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Copy the published application
COPY --from=publish /app/publish .

# Set ownership for the application files
RUN chown -R appuser:appuser /app

# Configure volume mount points for persistent data
VOLUME ["/app/data"]

# Switch to non-root user
USER appuser

# Expose the port the app will run on
EXPOSE 8080

# Health check configuration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Set the entry point
ENTRYPOINT ["dotnet", "olshop.dll"]