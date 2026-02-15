@echo off
echo ========================================
echo Starting PETEL - Pet Hotel Website
echo ========================================
echo.
echo This will open TWO terminal windows:
echo 1. Backend Server (PHP) - http://localhost:8000
echo 2. Frontend Server (React) - http://localhost:5173
echo.
echo Admin Login: http://localhost:5173/admin
echo Password: komal123
echo.
pause
echo.
echo Starting servers...
echo.

REM Start backend in new window
start "PETEL Backend" cmd /k "cd server && echo Backend running on http://localhost:8000 && echo API Test: http://localhost:8000/api/test.php && echo. && php -S localhost:8000"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start frontend in new window
start "PETEL Frontend" cmd /k "cd client && echo Frontend running on http://localhost:5173 && echo Admin: http://localhost:5173/admin && echo Password: komal123 && echo. && npm run dev"

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo Admin: http://localhost:5173/admin
echo Password: komal123
echo.
echo Close this window or press any key to exit
echo (Servers will continue running in separate windows)
echo.
pause
