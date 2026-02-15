# PETEL Admin Access Guide

## 🔐 Admin Login Credentials

**Admin URL:** http://localhost:5173/admin  
**Password:** `komal123`

---

## 🚀 Quick Access

### From Website Header
1. Open the website: http://localhost:5173
2. Click **"🔐 Admin"** link in the navigation menu
3. Enter password: `komal123`
4. Click "Login"

### Direct Access
1. Go directly to: http://localhost:5173/admin
2. Enter password: `komal123`
3. Click "Login"

---

## 📍 Admin Link Location

The Admin link appears in the header navigation on all pages:
- **Desktop:** Top navigation bar (right side)
- **Mobile:** Hamburger menu
- **Style:** Orange button with lock icon (🔐)

---

## 🎯 Admin Dashboard Features

Once logged in, you can:

### Appointments Management
- ✅ View all bookings
- ✅ Search by name, email, phone, booking ID
- ✅ Filter by status (pending/confirmed/completed/cancelled)
- ✅ Update booking status
- ✅ Update payment status
- ✅ Mark actual pickup time
- ✅ Calculate late charges automatically
- ✅ Delete bookings

### Pricing Management
- ✅ View all service prices
- ✅ Edit prices inline
- ✅ Changes reflect immediately on website

### Real-time Updates
- ✅ Auto-refresh every 20 seconds
- ✅ See new bookings instantly
- ✅ Track payment status

---

## 🔧 Changing Admin Password

### Method 1: Edit .env file
1. Open `server/.env`
2. Find line: `ADMIN_PASSWORD=komal123`
3. Change to your desired password
4. Save file
5. Restart backend server

### Method 2: Edit .env.example (for new setups)
1. Open `server/.env.example`
2. Update `ADMIN_PASSWORD=your_new_password`
3. Copy to `.env` during setup

---

## 🛡️ Security Notes

### Current Setup
- Password: `komal123` (default for development)
- Session-based authentication
- No password encryption (simple comparison)

### For Production
**⚠️ IMPORTANT:** Change the password before deploying to production!

1. Use a strong password (12+ characters)
2. Mix uppercase, lowercase, numbers, symbols
3. Don't share the password
4. Consider implementing:
   - Password hashing (bcrypt)
   - Two-factor authentication
   - Session timeout
   - Login attempt limits

---

## 🔄 Session Management

### Session Duration
- Sessions persist until browser is closed
- Or until you click "Logout"

### Logout
Click the **"Logout"** button in the admin dashboard header

### Session Timeout
Currently no automatic timeout. Consider adding for production:
```php
// In admin APIs, add:
if (time() - $_SESSION['admin_login_time'] > 3600) {
    session_destroy();
    // Redirect to login
}
```

---

## 🧪 Testing Admin Access

### Test Login
1. Start servers:
   ```bash
   start-petel.bat
   ```

2. Open: http://localhost:5173/admin

3. Try correct password: `komal123`
   - Should see: "Login successful"
   - Redirected to dashboard

4. Try wrong password: `wrong123`
   - Should see: "Invalid password" error
   - Stays on login page

### Test Dashboard
1. Login successfully
2. Check all tabs work:
   - Appointments tab
   - Pricing Management tab
3. Try search and filters
4. Test logout button

---

## 🐛 Troubleshooting

### Cannot Access Admin Page
**Problem:** Page not loading

**Solutions:**
1. Check frontend is running: http://localhost:5173
2. Check URL is correct: `/admin` (not `/Admin`)
3. Clear browser cache
4. Try incognito mode

### Invalid Password Error
**Problem:** Password not working

**Solutions:**
1. Verify password is exactly: `komal123` (lowercase)
2. Check for extra spaces
3. Check `server/.env` file exists
4. Verify `ADMIN_PASSWORD=komal123` in .env
5. Restart backend server

### Backend Not Responding
**Problem:** Login button does nothing

**Solutions:**
1. Check backend is running: http://localhost:8000
2. Test API: http://localhost:8000/api/test.php
3. Check browser console for errors (F12)
4. Verify CORS is enabled
5. Restart backend server

### Session Issues
**Problem:** Logged out unexpectedly

**Solutions:**
1. Check PHP session configuration
2. Ensure cookies are enabled
3. Check browser privacy settings
4. Try different browser

---

## 📱 Mobile Access

The admin dashboard works on mobile devices:
1. Open website on mobile
2. Tap hamburger menu (☰)
3. Tap "🔐 Admin"
4. Enter password
5. Use dashboard (optimized for mobile)

---

## 🔗 API Endpoints

### Admin Login
```
POST http://localhost:8000/api/admin/login.php
Body: {"password": "komal123"}
```

### Check Login Status
```
GET http://localhost:8000/api/admin/login.php
```

### Get Appointments
```
GET http://localhost:8000/api/admin/appointments.php
Headers: Cookie with session
```

---

## 📊 Admin Dashboard URLs

- **Login:** http://localhost:5173/admin
- **Dashboard:** http://localhost:5173/admin (after login)
- **Appointments Tab:** Default view
- **Pricing Tab:** Click "Pricing Management"

---

## ⚙️ Configuration

### Default Settings
```env
# In server/.env
ADMIN_PASSWORD=komal123
```

### Custom Password
```env
# Change to your password
ADMIN_PASSWORD=your_secure_password_here
```

### Session Settings
```php
// In server/api/admin/login.php
session_start();
$_SESSION['admin_logged_in'] = true;
$_SESSION['admin_login_time'] = time();
```

---

## 📞 Support

**Business Owner:** Komal  
**Phone:** +91 82838 83463  
**Email:** komal@petel.com

For technical issues:
- Check `TROUBLESHOOTING.md`
- Check browser console (F12)
- Check backend logs

---

## ✅ Quick Reference

| Item | Value |
|------|-------|
| Admin URL | http://localhost:5173/admin |
| Password | komal123 |
| Location | Header navigation (all pages) |
| Icon | 🔐 Admin |
| Color | Orange button |
| Session | Until logout or browser close |

---

**Last Updated:** 2026-02-11  
**Version:** 1.0.0  
**Status:** ✅ Active

---

**PETEL - A Pet Hotel**  
Your Dog's Home Away From Home 🐕
