# Quick Deployment Steps for PETEL

## 🚀 Push to GitHub (Do This First)

```bash
git init
git add .
git commit -m "Initial commit - PETEL Pet Hotel"
git branch -M main
git remote add origin https://github.com/souravverma5436/Dogpetel.git
git push -u origin main
```

✅ **Done!** Your code is now on GitHub: https://github.com/souravverma5436/Dogpetel

---

## 🌐 Deploy to Production

### ⚠️ IMPORTANT: Vercel Doesn't Support PHP!

Your project uses PHP backend, so **Vercel alone won't work** for the full application.

### Choose ONE of these options:

---

## Option 1: Railway (Easiest Full-Stack) ⭐ RECOMMENDED

**Why Railway?**
- ✅ Supports PHP + MySQL
- ✅ Free tier available
- ✅ Easy setup
- ✅ Automatic deployments from GitHub

**Steps:**

1. **Go to Railway:** https://railway.app
2. **Sign up** with GitHub
3. **New Project** → Deploy from GitHub repo
4. **Select:** souravverma5436/Dogpetel
5. **Add MySQL database:**
   - Click "New" → Database → MySQL
   - Copy connection details
6. **Set environment variables:**
   - Go to your service → Variables
   - Add:
     ```
     DB_HOST=<from MySQL service>
     DB_NAME=petel_db
     DB_USER=<from MySQL service>
     DB_PASS=<from MySQL service>
     ADMIN_PASSWORD=komal123
     ```
7. **Import database:**
   - Connect to MySQL
   - Import `database/schema.sql`
8. **Deploy!**

**Cost:** Free tier (500 hours/month)

---

## Option 2: Hostinger (Best for India) ⭐ PRODUCTION READY

**Why Hostinger?**
- ✅ Cheap (₹149/month)
- ✅ Full PHP + MySQL support
- ✅ Easy cPanel interface
- ✅ Great support
- ✅ Free SSL certificate

**Steps:**

1. **Buy hosting:** https://www.hostinger.in
   - Choose "Premium Web Hosting" or higher
   - Select plan (₹149/month)

2. **Upload files:**
   - Login to cPanel
   - Go to File Manager
   - Upload entire project OR use FTP

3. **Create database:**
   - cPanel → MySQL Databases
   - Create database: `petel_db`
   - Create user and assign to database
   - Note credentials

4. **Import database:**
   - cPanel → phpMyAdmin
   - Select `petel_db`
   - Import → Choose `database/schema.sql`

5. **Configure .env:**
   - Edit `server/.env` file
   - Update database credentials
   - Set ADMIN_PASSWORD=komal123

6. **Point domain:**
   - If you have domain, point it to hosting
   - Or use free subdomain from Hostinger

7. **Enable SSL:**
   - cPanel → SSL/TLS
   - Install free Let's Encrypt certificate

**Cost:** ₹149/month (₹1,788/year)

---

## Option 3: Split Deployment (Advanced)

**Frontend on Vercel + Backend on PHP Hosting**

### Deploy Frontend to Vercel:

1. **Go to:** https://vercel.com
2. **Import project** from GitHub
3. **Configure:**
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add environment variable:**
   - `VITE_API_BASE_URL` = your backend URL
5. **Deploy!**

### Deploy Backend to PHP Hosting:

1. Buy PHP hosting (Hostinger, Bluehost, etc.)
2. Upload `server/` folder
3. Create MySQL database
4. Import `database/schema.sql`
5. Configure `server/.env`
6. Update CORS in `server/config/cors.php` to allow Vercel domain

**Cost:** Vercel Free + Hosting ₹149/month

---

## Option 4: Heroku (Free Tier)

1. **Install Heroku CLI**
2. **Login:** `heroku login`
3. **Create app:** `heroku create petel-app`
4. **Add MySQL:** `heroku addons:create jawsdb:kitefin`
5. **Set config vars** in Heroku dashboard
6. **Deploy:** `git push heroku main`

**Cost:** Free tier available

---

## 📋 After Deployment Checklist

- [ ] Website loads correctly
- [ ] Logo displays
- [ ] All pages work (Home, Services, Pricing, About, Contact, Admin)
- [ ] Pricing packages display
- [ ] Contact form works
- [ ] Admin login works (password: komal123)
- [ ] Admin dashboard shows data
- [ ] WhatsApp link works
- [ ] Phone link works
- [ ] SSL certificate installed (HTTPS)
- [ ] Database backup configured

---

## 🔧 Update After Deployment

If you deployed backend separately, update this file:

**File:** `client/src/config.js`

```javascript
export const API_BASE_URL = 'https://your-backend-url.com/api'
```

Then rebuild and redeploy frontend.

---

## 💰 Cost Summary

| Option | Monthly Cost | Setup Difficulty | Best For |
|--------|--------------|------------------|----------|
| Railway | Free (limited) | Easy | Testing |
| Hostinger | ₹149 | Easy | Production |
| Vercel + Hosting | ₹149 | Medium | Split stack |
| Heroku | Free (limited) | Medium | Testing |

---

## 🆘 Need Help?

**Contact Komal:** +91 82838 83463

**Common Issues:**
- Database connection error → Check credentials in `.env`
- CORS error → Update `server/config/cors.php` with your domain
- Admin login fails → Check ADMIN_PASSWORD in `.env`
- Contact form not working → Check database connection

---

## 📚 Documentation Files

- `GITHUB_DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- `VERCEL_DEPLOYMENT.md` - Vercel-specific instructions
- `README.md` - Project overview and setup
- `INSTALLATION.md` - Local installation guide
- `TROUBLESHOOTING.md` - Common issues and fixes

---

**Good luck with your deployment! 🐕🏨**

Your PETEL Pet Hotel website will be live soon!
