@echo off
echo ========================================
echo PETEL - Push Updates to GitHub
echo ========================================
echo.

echo Adding changes...
git add .

echo.
echo Committing changes...
git commit -m "Fix appointment service dropdown to show package names"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
echo Done! Vercel will auto-deploy in 1-2 minutes
echo Check: https://dogpetel.vercel.app
echo ========================================
echo.
pause
