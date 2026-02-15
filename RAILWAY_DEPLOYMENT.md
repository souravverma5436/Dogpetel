# 🚂 PETEL - Railway Deployment Guide

## Complete Step-by-Step Guide to Deploy on Railway

Railway is perfect for your PETEL project because it supports PHP + MySQL natively!

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Railway account (free to create)
- ✅ Your code pushed to GitHub

---

## STEP 1: Push Your Code to GitHub

### Option A: Use the Batch File (Easiest)
```bash
# Just double-click:
PUSH_TO_GITHUB.bat
```

### Option B: Manual Commands
```bash
git init
git add .
git commit -m "Initial commit - PETEL Pet Hotel"
git branch -M main
git remote add origin https://github.com/souravverma5436/Dogpetel.git
git push -u origin main
```

✅ **Verify:** Go to https://github.com/souravverma5436/Dogpetel and confirm files are uploaded

---

## STEP 2: Sign Up for Railway

1. **Go to:** https://railway.app
2. **Click:** "Start a New Project" or "Login"
3. **Sign up with GitHub** (recommended - makes deployment easier)
4. **Authorize Railway** to access your GitHub repositories

✅ **You're now logged into Railway!**

---

## STEP 3: Create New Project from GitHub

1. **Click:** "New Project" button (top right)
2. **Select:** "Deploy from GitHub repo"
3. **Choose:** `souravverma5436/Dogpetel` from the list
4. **Click:** "Deploy Now"

Railway will start deploying your project automatically!

---

## STEP 4: Add MySQL Database

1. **In your Railway project dashboard**, click **"New"** button
2. **Select:** "Database"
3. **Choose:** "Add MySQL"
4. **Wait** for MySQL to provision (takes ~30 seconds)

✅ **MySQL database is now created!**

### Get Database Credentials:

1. **Click on the MySQL service** in your project
2. **Go to:** "Variables" tab
3. **You'll see these variables:**
   - `MYSQLHOST` (database host)
   - `MYSQLPORT` (usually 3306)
   - `MYSQLDATABASE` (database name)
   - `MYSQLUSER` (database user)
   - `MYSQLPASSWORD` (database password)

**Keep this tab open - you'll need these values!**

---

## STEP 5: Configure Environment Variables

1. **Click on your main service** (the one with your code, not MySQL)
2. **Go to:** "Variables" tab
3. **Click:** "New Variable" and add these one by one:

```
DB_HOST = <copy MYSQLHOST from MySQL service>
DB_NAME = <copy MYSQLDATABASE from MySQL service>
DB_USER = <copy MYSQLUSER from MySQL service>
DB_PASS = <copy MYSQLPASSWORD from MySQL service>
ADMIN_PASSWORD = komal123
```

**Example:**
```
DB_HOST = containers-us-west-123.railway.app
DB_NAME = railway
DB_USER = root
DB_PASS = abc123xyz789
ADMIN_PASSWORD = komal123
```

4. **Click:** "Add" for each variable

✅ **Environment variables configured!**

---

## STEP 6: Import Database Schema

You need to import your database schema into Railway's MySQL.

### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Link to your project:**
   ```bash
   railway link
   ```
   (Select your PETEL project)

4. **Connect to MySQL:**
   ```bash
   railway connect MySQL
   ```

5. **Import schema:**
   ```sql
   source database/schema.sql
   ```
   Or:
   ```bash
   railway run mysql -u root -p < database/schema.sql
   ```

### Option B: Using MySQL Client

1. **Get connection string** from Railway MySQL service
2. **Use any MySQL client** (MySQL Workbench, phpMyAdmin, etc.)
3. **Connect using the credentials** from Step 4
4. **Import** `database/schema.sql` file

### Option C: Using Railway's Web Interface

1. **Click on MySQL service** in Railway
2. **Go to:** "Data" tab
3. **Click:** "Query" button
4. **Copy and paste** contents of `database/schema.sql`
5. **Click:** "Run"

✅ **Database schema imported!**

---

## STEP 7: Configure Frontend API URL

Your frontend needs to know where the backend is deployed.

1. **Get your Railway deployment URL:**
   - Click on your main service
   - Go to "Settings" tab
   - Look for "Domains" section
   - Copy the Railway-provided domain (e.g., `petel-production.up.railway.app`)

2. **Add environment variable for frontend:**
   - In your main service, go to "Variables" tab
   - Add:
     ```
     VITE_API_BASE_URL = https://your-railway-domain.up.railway.app/api
     ```
   
   **Example:**
   ```
   VITE_API_BASE_URL = https://petel-production.up.railway.app/api
   ```

3. **Redeploy** (Railway will automatically redeploy when you add variables)

---

## STEP 8: Update CORS Configuration

Your backend needs to allow requests from your Railway domain.

**Option A: Update via GitHub (Recommended)**

1. **Edit** `server/config/cors.php` in your GitHub repo
2. **Update the origin line:**
   ```php
   $allowed_origins = [
       'http://localhost:5173',
       'https://your-railway-domain.up.railway.app'
   ];
   
   $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
   if (in_array($origin, $allowed_origins)) {
       header("Access-Control-Allow-Origin: $origin");
   }
   ```

3. **Commit and push:**
   ```bash
   git add server/config/cors.php
   git commit -m "Update CORS for Railway deployment"
   git push
   ```

4. **Railway will automatically redeploy!**

**Option B: Allow all origins (for testing only)**

Update `server/config/cors.php`:
```php
header("Access-Control-Allow-Origin: *");
```

---

## STEP 9: Test Your Deployment

1. **Get your Railway URL** from the "Settings" → "Domains" section
2. **Visit your website:** `https://your-railway-domain.up.railway.app`

### Test Checklist:

- [ ] Homepage loads
- [ ] Logo displays
- [ ] All pages accessible (Home, Services, Pricing, About, Contact, Admin)
- [ ] Pricing packages display (should show 33 packages)
- [ ] Contact form works (submit a test message)
- [ ] Admin login works (go to `/admin`, password: `komal123`)
- [ ] Admin dashboard shows contacts
- [ ] WhatsApp link works
- [ ] Phone link works

---

## STEP 10: Add Custom Domain (Optional)

1. **In Railway project**, go to "Settings" → "Domains"
2. **Click:** "Add Domain"
3. **Enter your domain:** `petel.com` or `www.petel.com`
4. **Update DNS records** at your domain registrar:
   - Add CNAME record pointing to Railway's domain
5. **Wait for DNS propagation** (can take up to 48 hours)

✅ **Custom domain configured!**

---

## 🎉 Deployment Complete!

Your PETEL Pet Hotel website is now live on Railway!

**Your URLs:**
- **Website:** https://your-railway-domain.up.railway.app
- **Admin:** https://your-railway-domain.up.railway.app/admin
- **API:** https://your-railway-domain.up.railway.app/api

---

## 💰 Railway Pricing

**Free Tier:**
- $5 credit per month
- ~500 hours of usage
- Perfect for testing and small projects

**Pro Plan:**
- $20/month
- Unlimited usage
- Better performance
- Recommended for production

**Your project will likely use:**
- ~$3-5/month on free tier
- Enough for testing and initial launch

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"
**Solution:**
- Check environment variables in Railway
- Verify DB_HOST, DB_NAME, DB_USER, DB_PASS are correct
- Make sure MySQL service is running

### Issue: "CORS error" in browser console
**Solution:**
- Update `server/config/cors.php` with your Railway domain
- Commit and push changes to GitHub
- Railway will auto-redeploy

### Issue: "Pricing packages not showing"
**Solution:**
- Database schema not imported
- Connect to MySQL and import `database/schema.sql`

### Issue: "Admin login not working"
**Solution:**
- Check ADMIN_PASSWORD environment variable
- Should be set to: `komal123`
- Clear browser cookies and try again

### Issue: "Contact form not saving"
**Solution:**
- Check database connection
- Verify `contacts` table exists in database
- Check Railway logs for PHP errors

---

## 📊 Monitoring Your Deployment

### View Logs:
1. Click on your service in Railway
2. Go to "Deployments" tab
3. Click on latest deployment
4. View logs in real-time

### Check Metrics:
1. Go to "Metrics" tab
2. See CPU, Memory, Network usage
3. Monitor performance

---

## 🔄 Updating Your Deployment

Railway automatically redeploys when you push to GitHub!

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Railway automatically detects and redeploys!
```

---

## 🆘 Need Help?

**Railway Documentation:** https://docs.railway.app
**Railway Discord:** https://discord.gg/railway
**Contact:** +91 82838 83463 (Komal)

---

## ✅ Post-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] MySQL database added
- [ ] Environment variables configured
- [ ] Database schema imported
- [ ] CORS updated
- [ ] Website tested and working
- [ ] Admin dashboard accessible
- [ ] Contact form functional
- [ ] Custom domain added (optional)
- [ ] SSL certificate active (automatic with Railway)

---

## 🎊 Congratulations!

Your PETEL Pet Hotel website is now live on Railway!

Share your website with customers and start accepting bookings! 🐕🏨

**Next Steps:**
1. Test all features thoroughly
2. Set up email notifications (Gmail SMTP)
3. Configure Razorpay for payments
4. Monitor logs regularly
5. Set up database backups
6. Share with customers!

---

**Deployed:** Railway
**Status:** Live
**Admin Password:** komal123
**Contact:** +91 82838 83463
