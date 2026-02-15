@echo off
echo ========================================
echo PETEL - Push to GitHub
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Creating first commit...
git commit -m "Initial commit - PETEL Pet Hotel Website"

echo.
echo Step 4: Renaming branch to main...
git branch -M main

echo.
echo Step 5: Adding remote repository...
git remote add origin https://github.com/souravverma5436/Dogpetel.git

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Done! Your code is now on GitHub
echo Visit: https://github.com/souravverma5436/Dogpetel
echo ========================================
echo.
pause
