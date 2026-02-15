# PETEL - GitHub & Deployment Guide

## Step 1: Push to GitHub

Run these commands in your project root directory:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - PETEL Pet Hotel Website"

# Rename branch to main
git branch -M main

# Add remote repository
git remote add origin https://github.com/souravverma5436/Dogpetel.git

# Push to GitHub
git push -u origin main
```

## Step 2: Verify on GitHub

1. Go to https://github.com/souravverma5436/Dogpetel
2. Check that all files are uploaded
3. Verify `.env` files are NOT uploaded (they should be in .gitignore)

## Step 3: Choose Deployment Platform

### ⚠️ Important: Vercel Limitations

**Vercel does NOT fully support PHP backends.** Your PETEL project uses PHP for the backend API, so you have these options:

### Option A: Split Deployment (Recommended for Vercel)

**Frontend on Vercel + Backend on PHP Hosting**

1. **Deploy Frontend to Vercel:**
   - Connect your GitHub repo to Vercel
   - Set build command: `cd client && npm install && npm run build`
   - Set output directory: `client/dist`
   - Deploy

2. **Deploy Backend to PHP Hosting:**
   - Choose: Hostinger (₹149/month), Bluehost, or SiteGround
   - Upload `server/` folder via FTP
   - Create MySQL database
   - Import `database/schema.sql`
   - Configure `server/.env` with database credentials
   - Update `client/src/config.js` with your backend URL

### Option B: Full Stack on Railway (Best Option)

Railway supports both React and PHP with MySQL:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add MySQL database from Railway dashboard

# Set environment variables
railway variables set DB_HOST=<mysql-host>
railway variables set DB_NAME=petel_db
railway variables set DB_USER=<mysql-user>
railway variables set DB_PASS=<mysql-password>
railway variables set ADMIN_PASSWORD=komal123

# Deploy
railway up
```

### Option C: Heroku (Free Tier Available)

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create petel-pet-hotel

# Add MySQL
heroku addons:create jawsdb:kitefin

# Get database credentials
heroku config:get JAWSDB_URL

# Deploy
git push heroku main
```

### Option D: Traditional PHP Hosting (Easiest)

**Recommended Providers for India:**
- **Hostinger** - ₹149/month, great support
- **Bluehost** - ₹199/month
- **SiteGround** - ₹329/month

**Steps:**
1. Purchase hosting plan with PHP 8+ and MySQL
2. Upload entire project via FTP or File Manager
3. Create MySQL database from cPanel
4. Import `database/schema.sql`
5. Configure `server/.env` file
6. Point domain to your hosting
7. Done!

## Step 4: Environment Variables

### For Vercel (Frontend Only):
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### For Backend (Railway/Heroku/Hosting):
```
DB_HOST=your-database-host
DB_NAME=petel_db
DB_USER=your-database-user
DB_PASS=your-database-password
ADMIN_PASSWORD=komal123
```

## Step 5: Update API URL

After deploying backend, update `client/src/config.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.com/api'
```

## Step 6: Database Setup

On your hosting/Railway/Heroku:

```bash
# Import database schema
mysql -u username -p database_name < database/schema.sql
```

Or use phpMyAdmin:
1. Login to phpMyAdmin
2. Select your database
3. Click "Import"
4. Upload `database/schema.sql`
5. Click "Go"

## Step 7: Test Deployment

Test these features:
- ✅ Homepage loads
- ✅ Logo displays correctly
- ✅ All pages accessible (Home, Services, Pricing, About, Contact, Admin)
- ✅ Pricing packages display
- ✅ Contact form submission works
- ✅ Admin login works (password: komal123)
- ✅ Admin can view contacts and appointments
- ✅ WhatsApp and phone links work

## Step 8: Custom Domain (Optional)

### For Vercel:
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

### For Traditional Hosting:
1. Point domain nameservers to hosting provider
2. Wait 24-48 hours for DNS propagation
3. Enable SSL certificate (free with Let's Encrypt)

## Troubleshooting

### Frontend not connecting to backend:
- Check CORS settings in `server/config/cors.php`
- Verify API_BASE_URL in `client/src/config.js`
- Check browser console for errors

### Database connection failed:
- Verify database credentials in `server/.env`
- Ensure database exists
- Check if MySQL is running

### Admin login not working:
- Check ADMIN_PASSWORD in `server/.env`
- Clear browser cookies
- Check PHP session configuration

### Contact form not saving:
- Check database connection
- Verify `contacts` table exists
- Check PHP error logs

## Cost Comparison

| Platform | Cost | PHP Support | MySQL | Best For |
|----------|------|-------------|-------|----------|
| Vercel | Free | ❌ No | ❌ No | Frontend only |
| Railway | Free tier | ✅ Yes | ✅ Yes | Full stack |
| Heroku | Free tier | ✅ Yes | ✅ Yes | Full stack |
| Hostinger | ₹149/mo | ✅ Yes | ✅ Yes | Production |
| DigitalOcean | $5/mo | ✅ Yes | ✅ Yes | Advanced users |

## Recommended Approach

**For Quick Testing:**
- Use Railway (free tier, easy setup)

**For Production:**
- Use Hostinger or traditional PHP hosting
- More reliable, better support
- Easier to manage for non-technical users

## Need Help?

Contact: +91 82838 83463 (Komal)

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Set up email notifications (Gmail SMTP)
3. ✅ Configure Razorpay for payments
4. ✅ Add SSL certificate (HTTPS)
5. ✅ Set up regular database backups
6. ✅ Monitor error logs
7. ✅ Share website link with customers!

---

**Your website will be live at:**
- GitHub: https://github.com/souravverma5436/Dogpetel
- Deployed URL: (after deployment)

Good luck with your PETEL Pet Hotel website! 🐕🏨
