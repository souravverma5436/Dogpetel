@echo off
echo ========================================
echo PETEL - Import Database to Railway
echo ========================================
echo.

echo Checking if MySQL client exists...
if not exist "C:\xampp\mysql\bin\mysql.exe" (
    echo ERROR: MySQL client not found at C:\xampp\mysql\bin\mysql.exe
    echo Please check your XAMPP installation
    pause
    exit /b 1
)

echo Checking if schema file exists...
if not exist "database\schema_railway.sql" (
    echo ERROR: Schema file not found at database\schema_railway.sql
    echo Please make sure you're running this from the project root
    pause
    exit /b 1
)

echo.
echo Importing schema to Railway MySQL...
echo This may take 30-60 seconds...
echo.

C:\xampp\mysql\bin\mysql -h nozomi.proxy.rlwy.net -u root -pbJAYXAWosDimtjepRwNXOGsaIXSCtKRmzZm --port 19782 railway < database\schema_railway.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database schema imported to Railway
    echo Go to Railway and refresh the Data tab
    echo You should see 5 tables with data!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERROR! Import failed with error code %ERRORLEVEL%
    echo.
    echo Possible issues:
    echo - Network connection problem
    echo - Wrong credentials
    echo - Railway MySQL not accessible
    echo ========================================
)

echo.
pause
