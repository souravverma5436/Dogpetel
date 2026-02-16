@echo off
echo ========================================
echo PETEL - Push Database Setup to GitHub
echo ========================================
echo.

echo Adding database setup files...
git add server/setup-database.php server/api/setup.php database/schema_railway.sql

echo.
echo Committing changes...
git commit -m "Add automatic database setup for Railway"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
echo Done! Railway will automatically redeploy
echo Wait 2-3 minutes, then visit:
echo https://web-production-463ec.up.railway.app/api/setup.php
echo ========================================
echo.
pause
