# Render Deployment Guide - PETEL PHP Backend

## ✅ Configuration Complete

- **Platform:** Render (Free Tier)
- **Runtime:** Docker (PHP 8.2 + Apache)
- **GitHub Repo:** https://github.com/souravverma5436/Dogpetel
- **Backend Path:** `server/`
- **Health Check:** `/health`
- **CORS:** Auto-configured for Vercel, Railway, and Render domains

---

## 📦 Files Created

✅ `Dockerfile` - PHP 8.2 + Apache with all dependencies  
✅ `server/.htaccess` - Apache rewrite rules and CORS  
✅ `server/health.php` - Health check endpoint  
✅ Updated `server/config/cors.php` - Added Vercel and Render support

---

## 🚀 Deployment Steps

### Step 1: Push Files to GitHub

```bash
git add Dockerfile server/.htaccess server/health.php server/config/cors.php
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Connect"** next to **souravverma5436/Dogpetel**

### Step 4: Configure Service Settings

**Basic Settings:**
- **Name:** `petel-backend` (or any name you prefer)
- **Region:** Choose closest to you (e.g., Oregon USA)
- **Branch:** `main`
- **Root Directory:** Leave empty (Dockerfile is in root)

**Build & Deploy:**
- **Runtime:** `Docker`
- **Dockerfile Path:** `./Dockerfile` (auto-detected)

**Instance Type:**
- Select **"Free"** plan

### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
DB_HOST = <your-mysql-host>
DB_PORT = 3306
DB_NAME = railway
DB_USER = root
DB_PASS = <your-mysql-password>
ADMIN_PASSWORD = komal123
ADMIN_EMAIL = komal@petel.com
ADMIN_PHONE = +918283883463
```

**Note:** If using Railway MySQL, use the connection details from Railway.

### Step 6: Configure Health Check

In **"Advanced"** section:

- **Health Check Path:** `/health`

### Step 7: Deploy!

1. Click **"Create Web Service"**
2. Render will start building (5-10 minutes for first deploy)
3. Watch the logs for any errors
4. Once deployed, you'll get a URL like: `https://petel-backend.onrender.com`

---

## 🔗 Your Backend URLs

After deployment, your API will be available at:

**Base URL:**
```
https://petel-backend.onrender.com
```

**Health Check:**
```
https://petel-backend.onrender.com/health
```

**API Endpoints:**
```
https://petel-backend.onrender.com/api/pricing
https://petel-backend.onrender.com/api/contacts
https://petel-backend.onrender.com/api/appointments
https://petel-backend.onrender.com/api/testimonials
https://petel-backend.onrender.com/api/admin/login
```

---

## 🔧 Update Frontend to Use Render Backend

### Option 1: Update Vercel Environment Variable

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_BASE_URL` to:
   ```
   https://petel-backend.onrender.com/api
   ```
5. Redeploy frontend

### Option 2: Update config.js (if not using env var)

In `client/src/config.js`:
```javascript
export const API_BASE_URL = 'https://petel-backend.onrender.com/api';
```

---

## 📊 Deployment Summary

| Setting | Value |
|---------|-------|
| **Platform** | Render (Free Tier) |
| **Runtime** | Docker (PHP 8.2 + Apache) |
| **Repository** | souravverma5436/Dogpetel |
| **Root Directory** | `/` (Dockerfile in root) |
| **Health Check** | `/health` |
| **Port** | Auto (uses $PORT from Render) |
| **CORS** | Enabled for all domains |
| **Composer** | Auto-installed |
| **PHP Extensions** | pdo_mysql, mysqli, mbstring, gd |

---

## 🔍 Testing Your Deployment

### Test Health Endpoint
```bash
curl https://petel-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": 1234567890,
  "service": "PETEL Pet Hotel API",
  "php_version": "8.2.x",
  "database": "connected"
}
```

### Test API Endpoint
```bash
curl https://petel-backend.onrender.com/api/pricing
```

---

## ⚠️ Important Notes

### Free Tier Limitations

1. **Spin Down:** Free services spin down after 15 minutes of inactivity
   - First request after spin down takes 30-60 seconds
   - Subsequent requests are fast

2. **Build Time:** Docker builds take 5-10 minutes
   - Cached builds are faster (2-3 minutes)

3. **Monthly Limits:**
   - 750 hours/month (enough for 1 service running 24/7)
   - Automatic HTTPS included

### Database Connection

- If using external MySQL (Railway, PlanetScale, etc.), add connection details in environment variables
- The health endpoint will show database status
- CORS is pre-configured to allow your frontend domain

---

## 🐛 Troubleshooting

### Build Fails

**Check Dockerfile syntax:**
```bash
docker build -t petel-test .
```

**Check logs in Render:**
- Go to service → Logs tab
- Look for error messages

### Health Check Fails

- Verify `/health` endpoint returns 200 OK
- Check if Apache is listening on correct port
- Review deploy logs for startup errors

### API Returns 404

- Check `.htaccess` is being read
- Verify `mod_rewrite` is enabled (it is in Dockerfile)
- Check file paths in API directory

### CORS Errors

- Verify frontend domain is allowed in `cors.php`
- Check browser console for exact error
- Test with curl to isolate issue

### Database Connection Fails

- Verify environment variables are set correctly
- Check if MySQL host is accessible from Render
- Test connection with health endpoint

---

## 🎯 Next Steps

1. ✅ Push Dockerfile and configs to GitHub
2. ✅ Create Render web service
3. ✅ Add environment variables
4. ✅ Deploy and wait for build
5. ✅ Test health endpoint
6. ✅ Update frontend API URL
7. ✅ Test full application

---

## 📞 Support

If you encounter issues:

1. Check Render logs (Service → Logs)
2. Test health endpoint
3. Verify environment variables
4. Check CORS configuration
5. Test API endpoints with curl

---

**Ready to deploy!** Follow the steps above and your PHP backend will be live on Render.
