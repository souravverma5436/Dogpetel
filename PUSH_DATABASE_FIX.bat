@echo off
echo ========================================
echo PETEL - Push Database Connection Fix
echo ========================================
echo.
echo This will:
echo 1. Fix database connection to work with Railway
echo 2. Push changes to GitHub
echo 3. Railway will auto-deploy
echo.
pause

echo.
echo Adding files to git...
git add server/config/database.php
git add server/setup-database.php
git add server/api/setup.php

echo.
echo Committing changes...
git commit -m "Fix database connection for Railway - connect without dbname first"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Railway will now redeploy automatically.
echo.
echo NEXT STEPS:
echo 1. Wait 2-3 minutes for Railway to redeploy
echo 2. Visit: https://web-production-463ec.up.railway.app/api/setup.php
echo 3. You should see: "Database setup complete"
echo 4. Then test your website!
echo.
echo ========================================
pause
