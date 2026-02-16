@echo off
echo ========================================
echo PETEL - Push Railway Fix to GitHub
echo ========================================
echo.

echo Adding fixed files...
git add server/index.php start.sh nixpacks.toml Dockerfile Procfile railway.json .railwayignore RAILWAY_FIX.md RAILWAY_404_FIX.txt RAILWAY_ASSETS_FIX.txt

echo.
echo Committing changes...
git commit -m "Fix Railway assets 404 - serve static files correctly"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
echo Done! Railway will automatically redeploy
echo Check your Railway dashboard in 2-3 minutes
echo Your website should be FULLY WORKING now!
echo ========================================
echo.
pause
