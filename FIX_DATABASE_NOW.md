# Fix Database - Get Pricing and Login Working

## 🔴 Problem
- Pricing page is empty (no data)
- Admin login doesn't work
- Database tables haven't been created yet

## ✅ Solution

### Step 1: Wait for Render to Redeploy
Render is automatically redeploying with the setup script (2-3 minutes).
Check the "Events" tab in your Render dashboard.

### Step 2: Run Database Setup

Once Render shows "Live", visit this URL in your browser:

```
https://dogpetel.onrender.com/setup.php
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Database setup complete!",
  "tables": ["contacts", "appointments", "pricing", "settings", "testimonials"],
  "counts": {
    "pricing": 33,
    "testimonials": 3
  }
}
```

### Step 3: Verify Database Connection

**Check if environment variables are set in Render:**

1. Go to Render dashboard
2. Click on "Dogpetel" service
3. Go to "Environment" tab
4. Verify these variables exist:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
   - `ADMIN_PASSWORD`

**If missing, add them:**
```
DB_HOST = <your-mysql-host>
DB_PORT = 3306
DB_NAME = railway
DB_USER = root
DB_PASS = <your-mysql-password>
ADMIN_PASSWORD = komal123
```

### Step 4: Test Pricing API

Visit:
```
https://dogpetel.onrender.com/api/pricing
```

Should return JSON array with 33 pricing packages.

### Step 5: Test Admin Login

Visit:
```
https://dogpetel.vercel.app/admin
```

Login with:
- Password: `komal123`

---

## 🔍 Troubleshooting

### If setup.php shows error:

**"Database connection failed"**
→ Environment variables not set in Render
→ Add them in Render dashboard → Environment tab

**"Schema file not found"**
→ Check that `database/schema_railway.sql` exists in repo
→ It should be there already ✓

**"Access denied"**
→ Wrong database password
→ Check DB_PASS in Render environment variables

### If pricing page still empty:

1. Check browser console for errors (F12)
2. Check Network tab - is API call successful?
3. Verify `VITE_API_BASE_URL` in Vercel is set to:
   ```
   https://dogpetel.onrender.com/api
   ```
4. Redeploy Vercel if you just added the env var

### If admin login doesn't work:

1. Check that `ADMIN_PASSWORD=komal123` is set in Render
2. Check browser console for API errors
3. Test login API directly:
   ```bash
   curl -X POST https://dogpetel.onrender.com/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"password":"komal123"}'
   ```

---

## ⚡ Quick Fix Checklist

- [ ] Render shows "Live" status
- [ ] Visit `/setup.php` - shows success
- [ ] Visit `/api/pricing` - returns data
- [ ] Environment variables set in Render
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Vercel redeployed after env var change
- [ ] Pricing page shows 33 packages
- [ ] Admin login works with password: komal123

---

## 🎯 Expected Results

After following these steps:

✅ Pricing page shows 33 packages  
✅ Admin login works  
✅ Contact form saves to database  
✅ All API endpoints return data

---

**Run the setup now and your database will be ready!**
