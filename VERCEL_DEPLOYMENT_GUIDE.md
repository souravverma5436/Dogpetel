# Vercel Deployment Guide - PETEL Pet Hotel

## ✅ Framework Detection Complete

- **Framework:** React + Vite
- **GitHub Repo:** https://github.com/souravverma5436/Dogpetel
- **Frontend Location:** `client/` folder
- **Build Output:** `dist/`
- **Environment Variable:** `VITE_API_BASE_URL`

---

## 🚀 Step-by-Step Deployment

### Step 1: Go to Vercel

1. Visit: https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Find **"souravverma5436/Dogpetel"** in the list
4. Click **"Import"**

### Step 3: Configure Project Settings

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
client
```
(Click "Edit" next to Root Directory and type `client`)

**Build & Development Settings:**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `dist` (auto-detected)
- Install Command: `npm install` (auto-detected)

### Step 4: Add Environment Variable

In the **"Environment Variables"** section:

**Name:**
```
VITE_API_BASE_URL
```

**Value:**
```
https://web-production-463ec.up.railway.app/api
```

(Replace with your actual Railway backend URL if different)

**Environment:** All (Production, Preview, Development)

### Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. Vercel will show you the live URL

---

## 📝 Configuration Files Added

✅ `client/vercel.json` - Added for SPA routing (already pushed to GitHub)

This ensures that refreshing on routes like `/about` or `/services` works correctly.

---

## 🔗 After Deployment

### Your Vercel URL will be:
```
https://dogpetel.vercel.app
```
(or similar - Vercel will show you the exact URL)

### Test These Pages:
- Home: `/`
- Services: `/services`
- Pricing: `/pricing`
- About: `/about`
- Contact: `/contact`
- Admin: `/admin`

### Update Backend CORS

After deployment, update your Railway backend CORS to allow the Vercel domain:

In `server/config/cors.php`, the code already auto-allows Vercel domains:
```php
if (strpos($origin, '.vercel.app') !== false) {
    header("Access-Control-Allow-Origin: $origin");
}
```

---

## 🎯 Deployment Summary

| Setting | Value |
|---------|-------|
| **Platform** | Vercel (Free Tier) |
| **Framework** | React + Vite |
| **Root Directory** | `client/` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist/` |
| **Environment Variable** | `VITE_API_BASE_URL` |
| **Backend API** | Railway (already deployed) |
| **Database** | Railway MySQL |

---

## 🔧 Troubleshooting

### If build fails:
- Check that `client/` folder is set as root directory
- Verify `VITE_API_BASE_URL` is set correctly

### If routes don't work (404 on refresh):
- Verify `client/vercel.json` exists (already added)
- Redeploy if needed

### If API calls fail:
- Check CORS settings in backend
- Verify `VITE_API_BASE_URL` points to correct Railway URL
- Check browser console for errors

---

## 🎉 Next Steps

1. Deploy to Vercel following steps above
2. Get your Vercel URL
3. Test all pages and features
4. Update any hardcoded URLs if needed
5. Share your live website!

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set
4. Test backend API directly

---

**Ready to deploy!** Follow the steps above and your website will be live in minutes.
