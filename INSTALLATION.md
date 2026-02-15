# PETEL Installation Guide

Complete step-by-step installation guide for Windows.

---

## Prerequisites

Before starting, ensure you have the following installed:

### 1. Node.js (v16 or higher)
- Download from: https://nodejs.org/
- Verify installation: `node --version` and `npm --version`

### 2. PHP 8+
- Download from: https://windows.php.net/download/
- Or use XAMPP: https://www.apachefriends.org/
- Verify installation: `php --version`

### 3. MySQL
- Download from: https://dev.mysql.com/downloads/mysql/
- Or included in XAMPP
- Verify installation: `mysql --version`

### 4. Composer (PHP Package Manager)
- Download from: https://getcomposer.org/download/
- Verify installation: `composer --version`

---

## Quick Setup (Automated)

Run the setup script:
```bash
setup-windows.bat
```

This will:
- Install client dependencies (npm)
- Install server dependencies (composer)
- Create .env file from example

---

## Manual Setup

### Step 1: Install Client Dependencies

```bash
cd client
npm install
```

### Step 2: Install Server Dependencies

```bash
cd server
composer install
```

### Step 3: Configure Environment

1. Copy `.env.example` to `.env` in the `server` folder:
```bash
cd server
copy .env.example .env
```

2. Edit `server/.env` and configure:

```env
# Admin Password (choose a strong password)
ADMIN_PASSWORD=your_secure_password

# Database (update if different)
DB_HOST=localhost
DB_NAME=petel_db
DB_USER=root
DB_PASS=your_mysql_password

# Gmail SMTP (for sending emails)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
ADMIN_EMAIL=komal@petel.com

# Razorpay (for online payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Twilio SMS (optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
ADMIN_PHONE=+918283883463
```

### Step 4: Setup Gmail SMTP

1. Enable 2-Factor Authentication on your Gmail account
2. Go to: https://myaccount.google.com/security
3. Click "2-Step Verification" → "App passwords"
4. Generate app password for "Mail"
5. Copy the 16-character password to `GMAIL_APP_PASSWORD` in .env

### Step 5: Setup Razorpay

1. Sign up at: https://razorpay.com
2. Go to Dashboard → Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID and Key Secret to .env

### Step 6: Setup Database

#### Option A: Using MySQL Command Line
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE petel_db;"

# Import schema
mysql -u root -p petel_db < database/schema.sql
```

#### Option B: Using phpMyAdmin (XAMPP)
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create new database: `petel_db`
3. Select the database
4. Click "Import" tab
5. Choose file: `database/schema.sql`
6. Click "Go"

### Step 7: Add Your Logo

1. Save your PETEL logo as: `client/public/logo.png`
2. The logo will automatically appear in:
   - Header (all pages)
   - Hero section (home page)
3. Supported formats: PNG (recommended), JPG, SVG
4. Recommended size: 60-80px height for header, 400px max width for hero
5. For detailed instructions: See `client/public/LOGO_INSTRUCTIONS.md`

**Note:** The code is already configured to display the logo. Just add the file!

---

## Running the Application

### Development Mode

Open TWO terminal windows:

#### Terminal 1 - Frontend (React)
```bash
cd client
npm run dev
```
Frontend will run on: http://localhost:5173

#### Terminal 2 - Backend (PHP)
```bash
cd server
php -S localhost:8000
```
Backend API will run on: http://localhost:8000

### Access the Application

- **Website**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
- **API**: http://localhost:8000/api

---

## Testing the Setup

### 1. Test Frontend
- Open http://localhost:5173
- You should see the PETEL homepage

### 2. Test Backend API
- Open http://localhost:8000/api/pricing.php
- You should see JSON response with pricing data

### 3. Test Email (Optional)
- Fill out contact form on website
- Check if email is received

### 4. Test Admin Dashboard
- Go to http://localhost:5173/admin
- Login with password from .env
- View appointments and manage pricing

---

## Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

The built files will be in `client/dist/`

### Deploy to Web Server
1. Upload `client/dist/` contents to web root
2. Upload `server/` folder
3. Configure web server (Apache/Nginx) to:
   - Serve frontend from web root
   - Route API requests to `server/api/`
4. Update database credentials in production .env
5. Use production Razorpay keys

---

## Troubleshooting

### Port Already in Use
If port 5173 or 8000 is already in use:

Frontend:
```bash
cd client
npm run dev -- --port 3000
```

Backend:
```bash
cd server
php -S localhost:9000
```

Update `client/src/config.js` with new backend port.

### Database Connection Error
- Verify MySQL is running
- Check database credentials in .env
- Ensure database `petel_db` exists

### Composer Install Fails
- Ensure PHP is in system PATH
- Run as Administrator
- Check internet connection

### Email Not Sending
- Verify Gmail App Password (16 characters, no spaces)
- Check GMAIL_USER and GMAIL_APP_PASSWORD in .env
- Ensure 2FA is enabled on Gmail account

### Payment Integration Issues
- Verify Razorpay keys are correct
- Use Test keys for development
- Check Razorpay dashboard for errors

---

## Support

For issues or questions:
- Check README.md for additional information
- Contact: +91 82838 83463
- Email: komal@petel.com

---

## Security Notes

1. Never commit .env file to version control
2. Use strong admin password
3. Keep dependencies updated
4. Use HTTPS in production
5. Regularly backup database
6. Use production API keys only in production

---

## Next Steps

After successful installation:
1. Customize content and styling
2. Add your business logo
3. Test all features thoroughly
4. Configure email templates
5. Set up automated backups
6. Deploy to production server

Enjoy using PETEL! 🐕
