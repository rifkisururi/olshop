@echo off
REM Build and run script for the olshop application
REM This script builds the Docker image and runs the container

REM Set variables
set IMAGE_NAME=olshop
set CONTAINER_NAME=olshop-app
set PORT=8080

REM Print header
echo =====================================
echo   Olshop Docker Build ^& Run Script
echo =====================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not installed or not in PATH
    exit /b 1
)

REM Build the Docker image
echo Building Docker image...
docker build -t %IMAGE_NAME%:latest .

REM Check if build was successful
if %ERRORLEVEL% neq 0 (
    echo Error: Docker build failed
    exit /b 1
)

echo Docker image built successfully!

REM Check if the container is already running
docker ps -a | findstr %CONTAINER_NAME% >nul
if %ERRORLEVEL% equ 0 (
    echo Stopping and removing existing container...
    docker stop %CONTAINER_NAME% >nul
    docker rm %CONTAINER_NAME% >nul
)

REM Run the container
echo Starting container...
docker run -d ^
    --name %CONTAINER_NAME% ^
    -p %PORT%:8080 ^
    -e ASPNETCORE_ENVIRONMENT=Production ^
    %IMAGE_NAME%:latest

REM Check if container started successfully
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to start container
    exit /b 1
)

echo Container started successfully!
echo.
echo The application is now running at: http://localhost:%PORT%
echo.
echo To view logs:
echo   docker logs %CONTAINER_NAME%
echo.
echo To stop the container:
echo   docker stop %CONTAINER_NAME%
echo.
echo To start the container again:
echo   docker start %CONTAINER_NAME%
echo.

pause