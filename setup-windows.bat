@echo off
echo ========================================
echo PETEL - Pet Hotel Setup Script
echo ========================================
echo.

echo Step 1: Setting up Client (React)
echo ----------------------------------------
cd client
if not exist "node_modules" (
    echo Installing client dependencies...
    call npm install
) else (
    echo Client dependencies already installed.
)
cd ..
echo.

echo Step 2: Setting up Server (PHP)
echo ----------------------------------------
cd server
if not exist "vendor" (
    echo Installing server dependencies...
    call composer install
) else (
    echo Server dependencies already installed.
)

if not exist ".env" (
    echo Creating .env file from example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit server/.env and configure:
    echo - Database credentials
    echo - Gmail SMTP credentials
    echo - Razorpay API keys
    echo - Admin password
    echo.
) else (
    echo .env file already exists.
)
cd ..
echo.

echo Step 3: Database Setup
echo ----------------------------------------
echo Please run the following command in MySQL:
echo mysql -u root -p petel_db ^< database/schema.sql
echo.
echo Or manually:
echo 1. Create database: CREATE DATABASE petel_db;
echo 2. Import schema: mysql -u root -p petel_db ^< database/schema.sql
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Configure server/.env with your credentials
echo 2. Import database/schema.sql into MySQL
echo 3. Place your PETEL logo in client/public/
echo.
echo To start the application:
echo.
echo Terminal 1 - Frontend:
echo   cd client
echo   npm run dev
echo.
echo Terminal 2 - Backend:
echo   cd server
echo   php -S localhost:8000
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo Admin: http://localhost:5173/admin
echo.
pause
