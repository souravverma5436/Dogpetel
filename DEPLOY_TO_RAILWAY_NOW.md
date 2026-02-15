# 🚀 Deploy PETEL to Railway - Complete Checklist

## ✅ Everything is Ready!

Your project is now configured for Railway deployment with:
- ✅ `nixpacks.toml` - Railway build configuration
- ✅ `Procfile` - Start command
- ✅ `railway.json` - Railway settings
- ✅ Updated CORS to auto-allow Railway domains
- ✅ Environment variable support

---

## 📋 Deployment Checklist

### ☐ STEP 1: Push to GitHub (5 min)

**Run this command:**
```bash
# Double-click this file:
PUSH_TO_GITHUB.bat

# Or manually:
git init
git add .
git commit -m "Initial commit - PETEL Pet Hotel"
git branch -M main
git remote add origin https://github.com/souravverma5436/Dogpetel.git
git push -u origin main
```

**Verify:** https://github.com/souravverma5436/Dogpetel

---

### ☐ STEP 2: Create Railway Account (2 min)

1. Go to: **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. **Sign up with GitHub** (easiest!)
4. Authorize Railway

---

### ☐ STEP 3: Deploy from GitHub (3 min)

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **souravverma5436/Dogpetel**
4. Click **"Deploy Now"**
5. Wait for deployment (~2-3 minutes)

---

### ☐ STEP 4: Add MySQL Database (2 min)

1. In Railway dashboard, click **"New"**
2. Select **"Database"** → **"Add MySQL"**
3. Wait ~30 seconds
4. Click on **MySQL service** → **"Variables"** tab
5. **Copy these values** (you'll need them):
   - MYSQLHOST
   - MYSQLDATABASE
   - MYSQLUSER
   - MYSQLPASSWORD

---

### ☐ STEP 5: Set Environment Variables (3 min)

Click on your **main service** (not MySQL) → **"Variables"** tab

**Add these variables:**

| Variable | Value |
|----------|-------|
| `DB_HOST` | (paste MYSQLHOST from MySQL service) |
| `DB_NAME` | (paste MYSQLDATABASE from MySQL service) |
| `DB_USER` | (paste MYSQLUSER from MySQL service) |
| `DB_PASS` | (paste MYSQLPASSWORD from MySQL service) |
| `ADMIN_PASSWORD` | `komal123` |

Click **"Add"** for each variable.

---

### ☐ STEP 6: Import Database Schema (5 min)

**Option A: Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Connect to MySQL
railway connect MySQL

# In MySQL prompt, run:
source database/schema.sql
```

**Option B: Railway Web Interface**
1. Click **MySQL service** → **"Data"** tab
2. Click **"Query"**
3. Copy/paste contents of `database/schema.sql`
4. Click **"Run"**

---

### ☐ STEP 7: Get Deployment URL (1 min)

1. Click on **main service** → **"Settings"** tab
2. Look for **"Domains"** section
3. Copy the Railway URL (e.g., `petel-production.up.railway.app`)

**This is your live website URL!**

---

### ☐ STEP 8: Configure Frontend API (2 min)

In Railway, add one more environment variable:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://your-railway-domain.up.railway.app/api` |

**Example:**
```
VITE_API_BASE_URL = https://petel-production.up.railway.app/api
```

Railway will automatically redeploy!

---

### ☐ STEP 9: Test Your Website (5 min)

Visit: `https://your-railway-domain.up.railway.app`

**Test Checklist:**
- [ ] Homepage loads
- [ ] Logo displays
- [ ] All pages work (Home, Services, Pricing, About, Contact, Admin)
- [ ] Pricing shows 33 packages
- [ ] Contact form works (submit test message)
- [ ] Admin login works (`/admin`, password: `komal123`)
- [ ] Admin dashboard shows contacts
- [ ] WhatsApp link works
- [ ] Phone link works

---

## 🎉 You're Live!

**Your URLs:**
- **Website:** https://your-railway-domain.up.railway.app
- **Admin:** https://your-railway-domain.up.railway.app/admin
- **API:** https://your-railway-domain.up.railway.app/api

**Admin Credentials:**
- Password: `komal123`

---

## 💰 Railway Pricing

**Free Tier:**
- $5 credit per month
- ~500 hours of usage
- Perfect for your project!

**Pro Plan:**
- $20/month
- Unlimited usage
- Better performance

**Your project will use ~$3-5/month** (fits in free tier!)

---

## 🔄 Updating Your Site

Railway auto-deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Railway automatically redeploys!
```

---

## 🆘 Troubleshooting

### Database connection failed
- Check environment variables match MySQL credentials
- Verify MySQL service is running

### CORS error
- Already configured to auto-allow Railway domains!
- If issues persist, check browser console

### Pricing not showing
- Import `database/schema.sql` into MySQL
- Check database connection

### Admin login fails
- Verify `ADMIN_PASSWORD = komal123` in variables
- Clear browser cookies

### Contact form not saving
- Check database connection
- Verify `contacts` table exists
- Check Railway logs for errors

---

## 📊 Monitoring

**View Logs:**
1. Click on service → **"Deployments"** tab
2. Click latest deployment
3. View real-time logs

**Check Metrics:**
- Go to **"Metrics"** tab
- Monitor CPU, Memory, Network

---

## 📚 Documentation

- **Quick Start:** `RAILWAY_QUICK_START.txt`
- **Detailed Guide:** `RAILWAY_DEPLOYMENT.md`
- **Troubleshooting:** `TROUBLESHOOTING.md`

---

## 🎊 Next Steps After Deployment

1. ✅ Test all features
2. ✅ Set up email notifications (Gmail SMTP)
3. ✅ Configure Razorpay for payments
4. ✅ Add custom domain (optional)
5. ✅ Set up database backups
6. ✅ Monitor logs regularly
7. ✅ Share with customers!

---

## 📞 Support

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**PETEL:**
- Contact: +91 82838 83463 (Komal)

---

## ⏱️ Total Time: ~25 Minutes

From code to live website in under 30 minutes!

**Ready? Start with STEP 1!** 🚀

---

**Status:** Ready to Deploy
**Platform:** Railway
**Cost:** Free tier ($5/month credit)
**Time:** 25 minutes
**Difficulty:** Easy

Good luck with your PETEL Pet Hotel deployment! 🐕🏨
