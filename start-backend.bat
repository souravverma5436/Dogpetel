@echo off
echo ========================================
echo Starting PETEL Backend Server
echo ========================================
echo.
echo Backend will run on: http://localhost:8000
echo API Test: http://localhost:8000/api/test.php
echo.
echo Press Ctrl+C to stop the server
echo.
cd server
php -S localhost:8000
