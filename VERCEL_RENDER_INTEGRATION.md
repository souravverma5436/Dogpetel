# Complete Integration Guide: Vercel Frontend + Render Backend

## 🎯 Overview

This guide connects your:
- **Frontend:** React + Vite on Vercel
- **Backend:** PHP on Render
- **Framework:** Vite (uses `VITE_` prefix for env vars)

---

## 📋 Current Configuration

### Frontend (Vercel)
- **URL:** `https://dogpetel.vercel.app` (or your actual URL)
- **Framework:** React + Vite
- **Env Variable:** `VITE_API_BASE_URL`
- **Config File:** `client/src/config.js`

### Backend (Render)
- **URL:** `https://petel-backend.onrender.com` (or your actual URL)
- **Runtime:** Docker (PHP 8.2 + Apache)
- **Health Check:** `/health`
- **CORS:** Pre-configured in `server/config/cors.php`

---

## ✅ Step 1: Fix Dockerfile and Redeploy Backend

The Dockerfile has been fixed to resolve the Apache ports.conf error.

**Push the fix:**
```bash
git add Dockerfile
git commit -m "Fix Apache ports configuration"
git push origin main
```

**Render will auto-redeploy** (takes 5-10 minutes)

---

## ✅ Step 2: Configure Frontend Environment Variable

### In Vercel Dashboard:

1. Go to your project: https://vercel.com/dashboard
2. Select **"dogpetel"** project
3. Go to **Settings** → **Environment Variables**
4. Add or update:

**Variable Name:**
```
VITE_API_BASE_URL
```

**Value:** (use your actual Render URL)
```
https://petel-backend.onrender.com/api
```

**Important:** NO trailing slash after `/api`

**Environment:** Select **All** (Production, Preview, Development)

5. Click **"Save"**
6. Go to **Deployments** tab
7. Click **"Redeploy"** on the latest deployment

---

## ✅ Step 3: Verify Code Uses Environment Variable

Your `client/src/config.js` already uses it correctly:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

This is perfect! ✅

---

## ✅ Step 4: Test Backend Health

**Open in browser or use curl:**
```bash
curl https://petel-backend.onrender.com/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": 1234567890,
  "service": "PETEL Pet Hotel API",
  "php_version": "8.2.x"
}
```

---

## ✅ Step 5: Test API Endpoint

**Test pricing endpoint:**
```bash
curl https://petel-backend.onrender.com/api/pricing
```

**Expected:** JSON array of pricing packages

---

## ✅ Step 6: Test Frontend → Backend Connection

### Open Browser Console:

1. Go to your Vercel URL: `https://dogpetel.vercel.app`
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Go to **Network** tab
5. Navigate to **Pricing** page

### Check for:

✅ **No CORS errors**  
✅ **API requests show 200 OK**  
✅ **Data loads correctly**

### If you see CORS errors:

Check that `server/config/cors.php` includes:
```php
strpos($origin, '.vercel.app') !== false
```

This is already configured! ✅

---

## 🔧 Common Issues & Fixes

### Issue 1: "Mixed Content" Error

**Problem:** Frontend is HTTPS, backend is HTTP  
**Solution:** Render provides HTTPS automatically ✅

### Issue 2: CORS Error

**Problem:** Backend doesn't allow frontend origin  
**Solution:** Already fixed in `cors.php` ✅

### Issue 3: 404 on API Calls

**Problem:** Wrong base URL or missing `/api` prefix  
**Check:**
- Vercel env var: `VITE_API_BASE_URL` = `https://petel-backend.onrender.com/api`
- No trailing slash
- Includes `/api` at the end

### Issue 4: Render Service Sleeping

**Problem:** Free tier spins down after 15 min  
**Solution:** First request takes 30-60 seconds (normal)  
**Workaround:** Use a service like UptimeRobot to ping `/health` every 5 minutes

### Issue 5: Environment Variable Not Working

**Problem:** Vite requires rebuild after env var change  
**Solution:** Redeploy on Vercel after changing env vars

---

## 📝 Testing Checklist

### Backend Tests:

- [ ] Health endpoint returns 200 OK
- [ ] `/api/pricing` returns data
- [ ] `/api/testimonials` returns data
- [ ] CORS headers present in response

### Frontend Tests:

- [ ] No CORS errors in console
- [ ] Pricing page loads data
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] All API calls show 200 OK in Network tab

### Integration Tests:

- [ ] Frontend can fetch from backend
- [ ] POST requests work (contact form)
- [ ] Error handling works
- [ ] Loading states work

---

## 🎯 Final URLs

### Frontend (Vercel):
```
https://dogpetel.vercel.app
```

### Backend (Render):
```
https://petel-backend.onrender.com
```

### API Base URL:
```
https://petel-backend.onrender.com/api
```

### Example API Endpoints:
```
GET  https://petel-backend.onrender.com/api/pricing
GET  https://petel-backend.onrender.com/api/testimonials
POST https://petel-backend.onrender.com/api/contacts
POST https://petel-backend.onrender.com/api/appointments
POST https://petel-backend.onrender.com/api/admin/login
```

---

## 🔍 Debugging Commands

### Test Backend from Command Line:

```bash
# Health check
curl https://petel-backend.onrender.com/health

# Get pricing
curl https://petel-backend.onrender.com/api/pricing

# Test CORS (from browser console)
fetch('https://petel-backend.onrender.com/api/pricing')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

# Test POST (contact form)
curl -X POST https://petel-backend.onrender.com/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"1234567890","message":"Test"}'
```

### Check Environment Variable in Vercel:

```javascript
// Add this temporarily to your frontend code
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

---

## ⚡ Performance Tips

### Reduce Render Spin-Down:

1. Use UptimeRobot (free) to ping `/health` every 5 minutes
2. This keeps your backend awake
3. Sign up: https://uptimerobot.com

### Optimize API Calls:

1. Cache responses where possible
2. Use loading states
3. Handle errors gracefully
4. Show user-friendly messages during spin-up

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Frontend loads on Vercel  
✅ Backend responds on Render  
✅ Health check returns 200 OK  
✅ No CORS errors in console  
✅ API calls return data  
✅ Forms submit successfully  
✅ Admin login works  
✅ All pages load correctly

---

## 📞 Need Help?

### Check These First:

1. **Vercel Deployment Logs** - Check for build errors
2. **Render Deployment Logs** - Check for Docker build errors
3. **Browser Console** - Check for CORS or network errors
4. **Network Tab** - Check API request/response details

### Common Error Messages:

**"CORS policy blocked"**
→ Check `cors.php` includes `.vercel.app`

**"Failed to fetch"**
→ Check backend URL is correct and HTTPS

**"404 Not Found"**
→ Check API endpoint path is correct

**"500 Internal Server Error"**
→ Check Render logs for PHP errors

---

**Your full-stack app is now deployed and integrated!** 🚀
