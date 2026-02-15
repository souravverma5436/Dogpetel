# PETEL - Vercel Deployment Guide

## Important Note About PHP on Vercel

⚠️ **Vercel has limited PHP support and is primarily designed for Node.js applications.**

For a PHP backend like PETEL, consider these better alternatives:
- **Heroku** (supports PHP + MySQL)
- **Railway** (supports PHP + MySQL)
- **DigitalOcean App Platform** (supports PHP + MySQL)
- **Traditional hosting** (Hostinger, Bluehost, SiteGround)

## Alternative: Deploy Frontend on Vercel, Backend Elsewhere

### Option 1: Frontend on Vercel + Backend on Traditional Hosting

1. **Deploy Frontend to Vercel:**
   ```bash
   cd client
   npm install
   npm run build
   vercel --prod
   ```

2. **Deploy Backend to PHP Hosting:**
   - Upload `server/` folder to your PHP hosting
   - Import `database/schema.sql` to MySQL
   - Configure `.env` file with database credentials
   - Update `client/src/config.js` with your backend URL

### Option 2: Full Stack on Railway (Recommended)

Railway supports PHP and MySQL natively:

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Project:**
   ```bash
   railway init
   ```

4. **Add MySQL Database:**
   - Go to Railway dashboard
   - Add MySQL plugin
   - Copy database credentials

5. **Configure Environment Variables:**
   ```bash
   railway variables set DB_HOST=<mysql-host>
   railway variables set DB_NAME=petel_db
   railway variables set DB_USER=<mysql-user>
   railway variables set DB_PASS=<mysql-password>
   railway variables set ADMIN_PASSWORD=komal123
   ```

6. **Deploy:**
   ```bash
   railway up
   ```

### Option 3: Deploy on Heroku

1. **Install Heroku CLI**
2. **Create Heroku App:**
   ```bash
   heroku create petel-app
   ```

3. **Add MySQL:**
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

## GitHub Setup (Already Done)

Your commands will push to GitHub:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/souravverma5436/Dogpetel.git
git push -u origin main
```

## Environment Variables for Deployment

Make sure to set these on your hosting platform:

```
DB_HOST=your-database-host
DB_NAME=petel_db
DB_USER=your-database-user
DB_PASS=your-database-password
ADMIN_PASSWORD=komal123
```

## Post-Deployment Steps

1. Import database schema:
   ```sql
   mysql -u username -p database_name < database/schema.sql
   ```

2. Update frontend API URL in `client/src/config.js`:
   ```javascript
   export const API_BASE_URL = 'https://your-backend-url.com/api'
   ```

3. Test all features:
   - Contact form submission
   - Appointment booking
   - Admin login
   - Pricing display

## Recommended Hosting Providers

### For Full Stack (PHP + MySQL):
- **Hostinger** - ₹149/month (best for India)
- **Railway** - Free tier available
- **DigitalOcean** - $5/month
- **Heroku** - Free tier (limited)

### For Frontend Only (Vercel):
- Free tier available
- Automatic deployments from GitHub
- Great for React apps

## Need Help?

Contact: +91 82838 83463
