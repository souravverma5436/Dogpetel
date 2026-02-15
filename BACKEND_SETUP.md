# PETEL Backend Setup & Troubleshooting

## 🚀 Quick Start

### Easiest Method
```bash
start-backend.bat
```

### Manual Method
```bash
cd server
php -S localhost:8000
```

### Test Backend
Open in browser: http://localhost:8000/api/test.php

Should see:
```json
{
  "success": true,
  "message": "PETEL Backend API is working!",
  "timestamp": "2026-02-11 12:00:00",
  "php_version": "8.x.x",
  "server": "PHP Development Server"
}
```

---

## ✅ Prerequisites

### 1. PHP 8+ Installed
Check version:
```bash
php --version
```

Should show: `PHP 8.x.x` or higher

**If not installed:**
- Download: https://windows.php.net/download/
- Or install XAMPP: https://www.apachefriends.org/

### 2. PHP in System PATH
Test:
```bash
php -v
```

**If command not found:**
1. Find PHP installation (e.g., `C:\php` or `C:\xampp\php`)
2. Add to PATH:
   - Windows: System Properties → Environment Variables → Path
   - Add PHP folder path
   - Restart terminal

### 3. Required PHP Extensions
Check enabled extensions:
```bash
php -m
```

**Required:**
- ✅ pdo
- ✅ pdo_mysql
- ✅ mysqli
- ✅ openssl (for HTTPS/email)
- ✅ curl (for API calls)
- ✅ mbstring
- ✅ json

**Enable in php.ini:**
```ini
extension=pdo_mysql
extension=mysqli
extension=openssl
extension=curl
extension=mbstring
```

---

## 📁 Backend Structure

```
server/
├── api/
│   ├── test.php              ← Test endpoint
│   ├── contacts.php          ← Contact form
│   ├── appointments.php      ← Booking system
│   ├── pricing.php           ← Get pricing
│   ├── testimonials.php      ← Get reviews
│   └── admin/
│       ├── login.php         ← Admin login
│       ├── appointments.php  ← Manage bookings
│       ├── pricing.php       ← Edit prices
│       └── settings.php      ← Settings
├── config/
│   ├── database.php          ← DB connection
│   └── cors.php              ← CORS headers
├── .env                      ← Configuration
├── .env.example              ← Template
└── composer.json             ← Dependencies
```

---

## 🔧 Configuration

### 1. Environment File (.env)

**Location:** `server/.env`

**Default content:**
```env
# Admin
ADMIN_PASSWORD=komal123

# Database
DB_HOST=localhost
DB_NAME=petel_db
DB_USER=root
DB_PASS=

# Email (optional for now)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
ADMIN_EMAIL=komal@petel.com

# Payment (optional for now)
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

**Note:** Email and payment can be configured later. Backend works without them.

### 2. Database Connection

**Default settings:**
- Host: `localhost`
- Database: `petel_db`
- User: `root`
- Password: (empty)

**Change if needed:**
Edit `server/.env`:
```env
DB_HOST=localhost
DB_NAME=petel_db
DB_USER=your_user
DB_PASS=your_password
```

---

## 🗄️ Database Setup

### 1. Start MySQL
```bash
# Windows
net start MySQL80

# Or start via XAMPP Control Panel
```

### 2. Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE petel_db;
exit;
```

### 3. Import Schema
```bash
mysql -u root -p petel_db < database/schema.sql
```

### 4. Verify Tables
```bash
mysql -u root -p petel_db
```

```sql
SHOW TABLES;
```

Should show:
- appointments
- contacts
- pricing
- settings
- testimonials

---

## 🧪 Testing Backend

### 1. Test API Endpoint
```bash
# Start backend
cd server
php -S localhost:8000

# In browser or new terminal:
curl http://localhost:8000/api/test.php
```

**Expected response:**
```json
{
  "success": true,
  "message": "PETEL Backend API is working!"
}
```

### 2. Test Database Connection
```bash
curl http://localhost:8000/api/pricing.php
```

**Expected response:**
```json
{
  "success": true,
  "data": [...]
}
```

### 3. Test Admin Login
```bash
curl -X POST http://localhost:8000/api/admin/login.php \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"komal123\"}"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

---

## 🐛 Common Issues

### Issue 1: "php: command not found"

**Cause:** PHP not in system PATH

**Solution:**
1. Find PHP installation:
   - XAMPP: `C:\xampp\php`
   - Standalone: `C:\php`
2. Add to PATH environment variable
3. Restart terminal
4. Test: `php --version`

### Issue 2: Port 8000 already in use

**Cause:** Another process using port 8000

**Solution 1 - Kill process:**
```bash
# Find process
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Solution 2 - Use different port:**
```bash
php -S localhost:9000
```

Then update `client/src/config.js`:
```javascript
export const API_BASE_URL = 'http://localhost:9000/api';
```

### Issue 3: Database connection failed

**Cause:** MySQL not running or wrong credentials

**Solution:**
1. Start MySQL:
   ```bash
   net start MySQL80
   ```
2. Check credentials in `server/.env`
3. Test connection:
   ```bash
   mysql -u root -p
   ```
4. Verify database exists:
   ```sql
   SHOW DATABASES;
   ```

### Issue 4: CORS errors

**Cause:** Frontend can't access backend

**Solution:**
1. Check `server/config/cors.php` exists
2. Verify headers:
   ```php
   header('Access-Control-Allow-Origin: *');
   ```
3. Restart backend server
4. Clear browser cache

### Issue 5: 404 Not Found

**Cause:** Wrong URL or file doesn't exist

**Solution:**
1. Check URL is correct:
   - ✅ `http://localhost:8000/api/test.php`
   - ❌ `http://localhost:8000/test.php`
2. Verify file exists in `server/api/`
3. Check file permissions
4. Restart server

### Issue 6: Composer dependencies missing

**Cause:** Vendor folder doesn't exist

**Solution:**
```bash
cd server
composer install
```

**If composer not installed:**
- Download: https://getcomposer.org/download/
- Install globally
- Restart terminal
- Run `composer install`

**Note:** Backend works without composer for basic features. Only needed for:
- Email sending (PHPMailer)
- Payment processing (Razorpay)
- SMS notifications (Twilio)

---

## 📊 API Endpoints Reference

### Public Endpoints (No Auth)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test.php` | GET | Test backend |
| `/api/pricing.php` | GET | Get all pricing |
| `/api/testimonials.php` | GET | Get reviews |
| `/api/contacts.php` | POST | Submit contact form |
| `/api/appointments.php` | POST | Book appointment |

### Admin Endpoints (Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login.php` | POST | Admin login |
| `/api/admin/appointments.php` | GET | Get appointments |
| `/api/admin/appointments.php` | PUT | Update appointment |
| `/api/admin/appointments.php` | DELETE | Delete appointment |
| `/api/admin/pricing.php` | PUT | Update pricing |
| `/api/admin/settings.php` | GET/PUT | Manage settings |

---

## 🔒 Security Notes

### Development
- CORS allows all origins (`*`)
- Simple password check
- No rate limiting
- Error messages show details

### Production
**⚠️ Change before deploying:**
1. Restrict CORS to your domain
2. Use password hashing
3. Add rate limiting
4. Hide error details
5. Use HTTPS
6. Enable firewall rules

---

## 📝 Logs & Debugging

### Enable PHP Error Display
Add to top of PHP files:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

### Check PHP Error Log
```bash
# Windows
C:\xampp\php\logs\php_error_log

# Or check php.ini for log location
```

### Browser Console
Press F12 → Console tab to see:
- Network requests
- API responses
- JavaScript errors

### Test with cURL
```bash
# GET request
curl http://localhost:8000/api/test.php

# POST request
curl -X POST http://localhost:8000/api/admin/login.php \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"komal123\"}"
```

---

## ✅ Verification Checklist

Before considering backend "working":
- [ ] PHP 8+ installed and in PATH
- [ ] MySQL running
- [ ] Database `petel_db` created
- [ ] Schema imported (tables exist)
- [ ] `.env` file configured
- [ ] Backend starts: `php -S localhost:8000`
- [ ] Test endpoint works: `/api/test.php`
- [ ] Pricing endpoint works: `/api/pricing.php`
- [ ] Admin login works: `/api/admin/login.php`
- [ ] No CORS errors in browser console

---

## 🚀 Production Deployment

### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName petel.com
    DocumentRoot /var/www/petel/client/dist
    
    <Directory /var/www/petel/client/dist>
        AllowOverride All
        Require all granted
    </Directory>
    
    Alias /api /var/www/petel/server/api
    <Directory /var/www/petel/server/api>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name petel.com;
    root /var/www/petel/client/dist;
    
    location /api {
        alias /var/www/petel/server/api;
        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $request_filename;
        }
    }
}
```

---

## 📞 Support

**Business Owner:** Komal  
**Phone:** +91 82838 83463  
**Email:** komal@petel.com

**Documentation:**
- Main README: `README.md`
- Troubleshooting: `TROUBLESHOOTING.md`
- Admin Access: `ADMIN_ACCESS.md`

---

**Last Updated:** 2026-02-11  
**Version:** 1.0.0  
**Status:** ✅ Working

---

**PETEL - A Pet Hotel**  
Your Dog's Home Away From Home 🐕
