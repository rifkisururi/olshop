@echo off
REM Docker Compose run script for the olshop application
REM This script runs the application using Docker Compose

REM Print header
echo =====================================
echo   Olshop Docker Compose Run Script
echo =====================================
echo.

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker Compose is not installed or not in PATH
    exit /b 1
)

REM Check if docker-compose.yml exists
if not exist "docker-compose.yml" (
    echo Error: docker-compose.yml file not found
    exit /b 1
)

REM Prompt user to select database
echo Select database to use:
echo 1) MySQL
echo 2) PostgreSQL
echo 3) SQLite (default)
set /p db_choice="Enter choice [1-3]: "

REM Create a temporary docker-compose file
copy docker-compose.yml docker-compose.temp.yml >nul

REM Configure the selected database
if "%db_choice%"=="1" (
    echo Using MySQL database...
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '# - mysql', '- mysql' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '# - ConnectionStrings__DefaultConnection=Server=mysql', '- ConnectionStrings__DefaultConnection=Server=mysql' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#   mysql:', '  mysql:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     image:', '    image:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     environment:', '    environment:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#       -', '      -' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     volumes:', '    volumes:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     ports:', '    ports:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     restart:', '    restart:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     networks:', '    networks:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '# mysql_data:', 'mysql_data:' | Set-Content docker-compose.temp.yml"
) else if "%db_choice%"=="2" (
    echo Using PostgreSQL database...
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '# - postgres', '- postgres' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '# - ConnectionStrings__DefaultConnection=Host=postgres', '- ConnectionStrings__DefaultConnection=Host=postgres' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#   postgres:', '  postgres:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     image:', '    image:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     environment:', '    environment:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#       -', '      -' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     volumes:', '    volumes:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     ports:', '    ports:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     restart:', '    restart:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '#     networks:', '    networks:' | Set-Content docker-compose.temp.yml"
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '# postgres_data:', 'postgres_data:' | Set-Content docker-compose.temp.yml"
) else (
    echo Using SQLite database...
    powershell -Command "(Get-Content docker-compose.temp.yml) -replace '# - ConnectionStrings__DefaultConnection=Data Source', '- ConnectionStrings__DefaultConnection=Data Source' | Set-Content docker-compose.temp.yml"
)

REM Start the containers
echo Starting containers with Docker Compose...
docker-compose -f docker-compose.temp.yml up -d

REM Check if containers started successfully
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to start containers
    del docker-compose.temp.yml
    exit /b 1
)

REM Clean up temporary file
del docker-compose.temp.yml

echo Containers started successfully!
echo.
echo The application is now running at: http://localhost:8080
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To stop the containers:
echo   docker-compose down
echo.

pause