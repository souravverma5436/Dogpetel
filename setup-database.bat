@echo off
echo ========================================
echo PETEL Database Setup
echo ========================================
echo.

echo Step 1: Creating database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS petel_db;"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database
    echo Make sure MySQL is running in XAMPP
    pause
    exit /b 1
)
echo Database created successfully!
echo.

echo Step 2: Importing schema and data...
mysql -u root -p petel_db < database\schema.sql
if %errorlevel% neq 0 (
    echo ERROR: Failed to import schema
    pause
    exit /b 1
)
echo Schema imported successfully!
echo.

echo Step 3: Verifying setup...
mysql -u root -p petel_db -e "SELECT COUNT(*) as total_packages FROM pricing;"
echo.

echo ========================================
echo Database Setup Complete!
echo ========================================
echo.
echo Database: petel_db
echo Tables: 5 (appointments, contacts, pricing, settings, testimonials)
echo Pricing Packages: 33
echo.
echo Next steps:
echo 1. Start backend: start-backend.bat
echo 2. Start frontend: start-frontend.bat
echo 3. Open: http://localhost:5173/pricing
echo.
pause
