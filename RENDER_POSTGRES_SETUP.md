# Complete Render Setup with PostgreSQL

## 🎯 What We're Doing

Setting up your PETEL Pet Hotel with:
- **Frontend:** Vercel (already done ✓)
- **Backend:** Render PHP service (already done ✓)
- **Database:** Render PostgreSQL (new - free tier)

---

## 📋 Step-by-Step Guide

### Step 1: Create PostgreSQL Database in Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `petel-database`
   - **Database:** `petel_db`
   - **User:** `petel_user` (auto-generated)
   - **Region:** **Oregon (US West)** (same as your web service)
   - **PostgreSQL Version:** **16** (latest)
   - **Plan:** **Free**
4. Click **"Create Database"**
5. Wait 1-2 minutes for provisioning

### Step 2: Get Database Connection String

Once created, you'll see connection details. Copy the **Internal Database URL**:

```
postgresql://petel_user:xxxxx@dpg-xxxxx/petel_db
```

**Important:** Use the **Internal** URL (faster), not External.

### Step 3: Connect Database to Web Service

1. Go to your **Dogpetel** web service
2. Click **"Environment"** tab (left sidebar)
3. Click **"Add Environment Variable"**
4. Add:

**Name:**
```
DATABASE_URL
```

**Value:** (paste the Internal Database URL you copied)
```
postgresql://petel_user:xxxxx@dpg-xxxxx/petel_db
```

5. Also add:
```
ADMIN_PASSWORD = komal123
```

6. Click **"Save Changes"**

Render will automatically redeploy (takes 3-5 minutes).

### Step 4: Run Database Setup

Once Render shows "Live" status, visit:

```
https://dogpetel.onrender.com/setup-postgres.php
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Database setup complete!",
  "tables": ["contacts", "appointments", "pricing", "settings", "testimonials"],
  "counts": {
    "pricing": 33,
    "testimonials": 3,
    "contacts": 0,
    "appointments": 0,
    "settings": 5
  }
}
```

### Step 5: Test Your Website

**Pricing Page:**
```
https://dogpetel.vercel.app/pricing
```
Should show 33 pricing packages!

**Admin Login:**
```
https://dogpetel.vercel.app/admin
```
Password: `komal123`

**Contact Form:**
```
https://dogpetel.vercel.app/contact
```
Submit a test message - it should save to database!

---

## ✅ Verification Checklist

- [ ] PostgreSQL database created in Render
- [ ] DATABASE_URL added to web service environment
- [ ] Web service redeployed successfully
- [ ] Setup script returns success
- [ ] Pricing page shows 33 packages
- [ ] Admin login works
- [ ] Contact form saves data

---

## 🔍 Troubleshooting

### Setup Script Shows Error

**"DATABASE_URL not set"**
→ Add DATABASE_URL in Render web service → Environment tab

**"Connection failed"**
→ Make sure you used the **Internal** Database URL, not External
→ Check that database and web service are in the same region

**"Schema file not found"**
→ Wait for Render to finish deploying
→ Check deployment logs for errors

### Pricing Page Still Empty

1. Check browser console (F12) for errors
2. Verify `VITE_API_BASE_URL` in Vercel:
   ```
   https://dogpetel.onrender.com/api
   ```
3. Test API directly:
   ```
   https://dogpetel.onrender.com/api/pricing
   ```
4. If API returns empty array, re-run setup script

### Admin Login Doesn't Work

1. Check `ADMIN_PASSWORD=komal123` is set in Render
2. Test login API:
   ```bash
   curl -X POST https://dogpetel.onrender.com/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"password":"komal123"}'
   ```

---

## 📊 What Gets Created

### Database Tables:

1. **contacts** - Contact form submissions
2. **appointments** - Booking requests
3. **pricing** - 33 pricing packages (11 per pet type)
4. **settings** - Site configuration
5. **testimonials** - Customer reviews

### Sample Data:

- **33 pricing packages** (Dogs, Cats, Birds)
- **3 testimonials**
- **5 settings** (site name, contact info, etc.)

---

## 🎉 Success!

Once complete, your full-stack application is live:

✅ **Frontend:** https://dogpetel.vercel.app  
✅ **Backend API:** https://dogpetel.onrender.com/api  
✅ **Database:** Render PostgreSQL  
✅ **Admin Panel:** https://dogpetel.vercel.app/admin

---

## 💡 Important Notes

### Free Tier Limitations:

**Render Web Service:**
- Spins down after 15 min of inactivity
- First request takes 30-60 seconds to wake up
- 750 hours/month (enough for 24/7)

**Render PostgreSQL:**
- 90 days free trial
- 1GB storage
- Shared CPU
- After 90 days, upgrade to paid or migrate data

### Keep Service Awake:

Use a service like **UptimeRobot** (free) to ping your health endpoint every 5 minutes:
```
https://dogpetel.onrender.com/health.php
```

---

## 🚀 Next Steps

1. ✅ Create PostgreSQL database
2. ✅ Add DATABASE_URL to web service
3. ✅ Run setup script
4. ✅ Test all features
5. 📧 Configure email settings (optional)
6. 💳 Configure Razorpay for payments (optional)
7. 📱 Configure Twilio for SMS (optional)

---

**Your pet hotel website is now fully deployed and functional!** 🐕🐈🦜
