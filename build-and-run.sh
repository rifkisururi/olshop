#!/bin/bash

# Build and run script for the olshop application
# This script builds the Docker image and runs the container

# Set variables
IMAGE_NAME="olshop"
CONTAINER_NAME="olshop-app"
PORT=8080

# Print header
echo "====================================="
echo "  Olshop Docker Build & Run Script"
echo "====================================="
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH"
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME:latest .

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed"
    exit 1
fi

echo "Docker image built successfully!"

# Check if the container is already running
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "Stopping and removing existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Run the container
echo "Starting container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:8080 \
    -e ASPNETCORE_ENVIRONMENT=Production \
    $IMAGE_NAME:latest

# Check if container started successfully
if [ $? -ne 0 ]; then
    echo "Error: Failed to start container"
    exit 1
fi

echo "Container started successfully!"
echo
echo "The application is now running at: http://localhost:$PORT"
echo
echo "To view logs:"
echo "  docker logs $CONTAINER_NAME"
echo
echo "To stop the container:"
echo "  docker stop $CONTAINER_NAME"
echo
echo "To start the container again:"
echo "  docker start $CONTAINER_NAME"
echo