# Railway Deployment Fix

## Issue
Railway's Nixpacks couldn't find `npm` because Node.js wasn't included in the setup phase.

## Solution Applied

### Option 1: Updated nixpacks.toml (Recommended)
Added `nodejs_20` to the nixPkgs list:

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "php82", "php82Extensions.pdo", "php82Extensions.pdo_mysql", "php82Extensions.mysqli"]
```

### Option 2: Custom Dockerfile (Alternative)
Created a `Dockerfile` that:
1. Uses PHP 8.2 CLI base image
2. Installs Node.js 20.x
3. Installs PHP extensions
4. Builds the frontend
5. Serves everything with PHP

## How to Deploy Now

### Method 1: Push Updated Files to GitHub

```bash
git add nixpacks.toml Dockerfile
git commit -m "Fix Railway deployment - add Node.js"
git push
```

Railway will automatically redeploy with the fixes!

### Method 2: Use Dockerfile Instead

If nixpacks still has issues:

1. In Railway dashboard, go to your service
2. Click "Settings" tab
3. Scroll to "Build Configuration"
4. Change "Builder" from "Nixpacks" to "Dockerfile"
5. Save changes
6. Railway will redeploy using the Dockerfile

## Expected Build Process

With the fix, Railway will:
1. ✅ Install PHP 8.2 + extensions
2. ✅ Install Node.js 20
3. ✅ Run `cd client && npm install`
4. ✅ Run `cd client && npm run build`
5. ✅ Start PHP server: `php -S 0.0.0.0:$PORT -t server`

## Verification

After redeployment, check the build logs. You should see:
- ✅ "Installing nodejs_20" or "Installing Node.js"
- ✅ "npm install" completing successfully
- ✅ "npm run build" completing successfully
- ✅ PHP server starting

## If Still Having Issues

### Alternative: Deploy Backend Only

If the full-stack deployment continues to fail, you can:

1. **Build frontend locally:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Copy built files to server/public:**
   ```bash
   mkdir server/public
   cp -r client/dist/* server/public/
   ```

3. **Update start command in Railway:**
   - Go to Settings → Deploy
   - Change start command to: `php -S 0.0.0.0:$PORT -t .`

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy with pre-built frontend"
   git push
   ```

This way, Railway only needs to run PHP, not build the frontend.

## Next Steps

1. Push the fixes to GitHub
2. Wait for Railway to redeploy (2-3 minutes)
3. Check deployment logs
4. Test your website

If successful, continue with:
- Adding MySQL database
- Setting environment variables
- Importing database schema

## Contact

Need help? Contact: +91 82838 83463 (Komal)
