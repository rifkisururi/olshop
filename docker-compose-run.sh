#!/bin/bash

# Docker Compose run script for the olshop application
# This script runs the application using Docker Compose

# Print header
echo "====================================="
echo "  Olshop Docker Compose Run Script"
echo "====================================="
echo

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed or not in PATH"
    exit 1
fi

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: docker-compose.yml file not found"
    exit 1
fi

# Prompt user to select database
echo "Select database to use:"
echo "1) MySQL"
echo "2) PostgreSQL"
echo "3) SQLite (default)"
read -p "Enter choice [1-3]: " db_choice

# Create a temporary docker-compose file
cp docker-compose.yml docker-compose.temp.yml

# Configure the selected database
case $db_choice in
    1)
        echo "Using MySQL database..."
        sed -i 's/# - mysql/- mysql/g' docker-compose.temp.yml
        sed -i 's/# - ConnectionStrings__DefaultConnection=Server=mysql/- ConnectionStrings__DefaultConnection=Server=mysql/g' docker-compose.temp.yml
        sed -i 's/#   mysql:/  mysql:/g' docker-compose.temp.yml
        sed -i 's/#     image:/    image:/g' docker-compose.temp.yml
        sed -i 's/#     environment:/    environment:/g' docker-compose.temp.yml
        sed -i 's/#       -/      -/g' docker-compose.temp.yml
        sed -i 's/#     volumes:/    volumes:/g' docker-compose.temp.yml
        sed -i 's/#       -/      -/g' docker-compose.temp.yml
        sed -i 's/#     ports:/    ports:/g' docker-compose.temp.yml
        sed -i 's/#       -/      -/g' docker-compose.temp.yml
        sed -i 's/#     restart:/    restart:/g' docker-compose.temp.yml
        sed -i 's/#     networks:/    networks:/g' docker-compose.temp.yml
        sed -i 's/#       -/      -/g' docker-compose.temp.yml
        sed -i 's/# mysql_data:/mysql_data:/g' docker-compose.temp.yml
        ;;
    2)
        echo "Using PostgreSQL database..."
        sed -i 's/# - postgres/- postgres/g' docker-compose.temp.yml
        sed -i 's/# - ConnectionStrings__DefaultConnection=Host=postgres/- ConnectionStrings__DefaultConnection=Host=postgres/g' docker-compose.temp.yml
        sed -i 's/#   postgres:/  postgres:/g' docker-compose.temp.yml
        sed -i 's/#     image:/    image:/g' docker-compose.temp.yml
        sed -i 's/#     environment:/    environment:/g' docker-compose.temp.yml
        sed -i 's/#       -/      -/g' docker-compose.temp.yml
        sed -i 's/#     volumes:/    volumes:/g' docker-compose.temp.yml
        sed -i 's/#       -/      -/g' docker-compose.temp.yml
        sed -i 's/#     ports:/    ports:/g' docker-compose.temp.yml
        sed -i 's/#       -/      -/g' docker-compose.temp.yml
        sed -i 's/#     restart:/    restart:/g' docker-compose.temp.yml
        sed -i 's/#     networks:/    networks:/g' docker-compose.temp.yml
        sed -i 's/#       -/      -/g' docker-compose.temp.yml
        sed -i 's/# postgres_data:/postgres_data:/g' docker-compose.temp.yml
        ;;
    *)
        echo "Using SQLite database..."
        sed -i 's/# - ConnectionStrings__DefaultConnection=Data Source/- ConnectionStrings__DefaultConnection=Data Source/g' docker-compose.temp.yml
        ;;
esac

# Start the containers
echo "Starting containers with Docker Compose..."
docker-compose -f docker-compose.temp.yml up -d

# Check if containers started successfully
if [ $? -ne 0 ]; then
    echo "Error: Failed to start containers"
    rm docker-compose.temp.yml
    exit 1
fi

# Clean up temporary file
rm docker-compose.temp.yml

echo "Containers started successfully!"
echo
echo "The application is now running at: http://localhost:8080"
echo
echo "To view logs:"
echo "  docker-compose logs -f"
echo
echo "To stop the containers:"
echo "  docker-compose down"
echo