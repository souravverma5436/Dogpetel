# PETEL Troubleshooting Guide

Common issues and solutions for PETEL Pet Hotel website.

---

## 🔧 Installation Issues

### Issue: npm install fails
**Symptoms:** Error during `npm install` in client folder

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

### Issue: composer install fails
**Symptoms:** Error during `composer install` in server folder

**Solutions:**
```bash
# Update composer
composer self-update

# Clear composer cache
composer clear-cache

# Install with verbose output
composer install -vvv

# If memory issues
php -d memory_limit=-1 /path/to/composer install
```

### Issue: PHP version error
**Symptoms:** "PHP version 8.0 or higher required"

**Solutions:**
- Install PHP 8+: https://windows.php.net/download/
- Or use XAMPP with PHP 8+
- Verify: `php --version`
- Update PATH environment variable

---

## 🗄️ Database Issues

### Issue: Cannot connect to database
**Symptoms:** "Database connection failed"

**Solutions:**
1. Check MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Or check in Services
   services.msc
   ```

2. Verify credentials in `server/.env`:
   ```env
   DB_HOST=localhost
   DB_NAME=petel_db
   DB_USER=root
   DB_PASS=your_password
   ```

3. Test connection:
   ```bash
   mysql -u root -p
   ```

4. Create database if missing:
   ```sql
   CREATE DATABASE petel_db;
   ```

### Issue: Schema import fails
**Symptoms:** Error importing schema.sql

**Solutions:**
```bash
# Check file exists
dir database\schema.sql

# Import with error output
mysql -u root -p petel_db < database/schema.sql 2>&1

# Or import via phpMyAdmin
# 1. Open http://localhost/phpmyadmin
# 2. Select database
# 3. Click Import
# 4. Choose schema.sql
```

### Issue: Tables not created
**Symptoms:** "Table doesn't exist" errors

**Solutions:**
1. Verify database selected:
   ```sql
   USE petel_db;
   SHOW TABLES;
   ```

2. Manually run schema.sql in MySQL Workbench or phpMyAdmin

3. Check for SQL errors in import log

---

## 🌐 Server Issues

### Issue: Frontend not loading
**Symptoms:** Blank page or "Cannot GET /"

**Solutions:**
1. Check if Vite dev server is running:
   ```bash
   cd client
   npm run dev
   ```

2. Check port 5173 is not in use:
   ```bash
   netstat -ano | findstr :5173
   ```

3. Try different port:
   ```bash
   npm run dev -- --port 3000
   ```

4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Backend API not responding
**Symptoms:** "Network Error" or 404 on API calls

**Solutions:**
1. Check PHP server is running:
   ```bash
   cd server
   php -S localhost:8000
   ```

2. Test API directly:
   ```
   http://localhost:8000/api/pricing.php
   ```

3. Check CORS configuration in `server/config/cors.php`

4. Verify API_BASE_URL in `client/src/config.js`:
   ```javascript
   export const API_BASE_URL = 'http://localhost:8000/api';
   ```

### Issue: Port already in use
**Symptoms:** "Port 8000 is already in use"

**Solutions:**
```bash
# Find process using port
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
php -S localhost:9000
```

---

## 📧 Email Issues

### Issue: Emails not sending
**Symptoms:** "Failed to send email" error

**Solutions:**
1. Verify Gmail credentials in `server/.env`:
   ```env
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=16_char_password
   ```

2. Check 2FA is enabled on Gmail

3. Generate new App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Generate new password
   - Update .env

4. Test SMTP connection:
   ```php
   // Add to test file
   $mail = new PHPMailer(true);
   $mail->SMTPDebug = 2; // Enable verbose debug output
   ```

5. Check firewall/antivirus blocking port 587

### Issue: Emails going to spam
**Symptoms:** Emails received but in spam folder

**Solutions:**
1. Add SPF record to domain DNS
2. Set up DKIM authentication
3. Use business email instead of personal Gmail
4. Avoid spam trigger words in subject/body
5. Ask recipients to whitelist your email

### Issue: App Password not working
**Symptoms:** "Invalid credentials" error

**Solutions:**
1. Ensure 2FA is enabled first
2. Generate new App Password
3. Copy password without spaces
4. Use 16-character password, not regular password
5. Try different app type (Mail, Other)

---

## 💳 Payment Issues

### Issue: Razorpay not loading
**Symptoms:** Payment button doesn't work

**Solutions:**
1. Verify Razorpay keys in `server/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

2. Check Razorpay SDK installed:
   ```bash
   cd server
   composer show razorpay/razorpay
   ```

3. Use Test keys for development

4. Check browser console for errors

### Issue: Payment fails
**Symptoms:** Payment doesn't complete

**Solutions:**
1. Use Razorpay test cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

2. Check Razorpay dashboard for errors

3. Verify webhook configuration

4. Check payment logs in admin panel

### Issue: Payment status not updating
**Symptoms:** Payment successful but status shows unpaid

**Solutions:**
1. Check `razorpay_payment_id` is being saved
2. Verify payment status update logic
3. Check database appointments table
4. Manually update in admin panel

---

## 🔐 Admin Issues

### Issue: Cannot login to admin
**Symptoms:** "Invalid password" error

**Solutions:**
1. Check password in `server/.env`:
   ```env
   ADMIN_PASSWORD=your_password
   ```

2. Ensure no extra spaces in password

3. Try resetting password in .env

4. Clear browser cookies/cache

5. Check session configuration in PHP

### Issue: Admin page not loading
**Symptoms:** Blank admin page or redirect loop

**Solutions:**
1. Check React Router configuration
2. Clear browser cache
3. Check browser console for errors
4. Verify admin route in App.jsx
5. Check session handling in PHP

### Issue: Appointments not showing
**Symptoms:** Empty appointments list

**Solutions:**
1. Check database has appointments:
   ```sql
   SELECT * FROM appointments;
   ```

2. Verify API endpoint:
   ```
   http://localhost:8000/api/admin/appointments.php
   ```

3. Check admin authentication

4. Look for JavaScript errors in console

---

## 📱 Mobile Issues

### Issue: Layout broken on mobile
**Symptoms:** Elements overlapping or cut off

**Solutions:**
1. Check viewport meta tag in index.html
2. Test responsive breakpoints
3. Clear mobile browser cache
4. Check CSS media queries
5. Test on different devices/browsers

### Issue: Forms not working on mobile
**Symptoms:** Cannot submit forms on mobile

**Solutions:**
1. Check input types (tel, email, date)
2. Verify touch events
3. Test on actual device, not just emulator
4. Check for JavaScript errors
5. Ensure buttons are large enough (min 44px)

---

## 🐛 Common Errors

### Error: "Class 'Dotenv\Dotenv' not found"
**Solution:**
```bash
cd server
composer install
```

### Error: "Call to undefined function mysqli_connect()"
**Solution:**
Enable mysqli extension in php.ini:
```ini
extension=mysqli
```

### Error: "Maximum execution time exceeded"
**Solution:**
Increase in php.ini:
```ini
max_execution_time = 300
```

### Error: "Allowed memory size exhausted"
**Solution:**
Increase in php.ini:
```ini
memory_limit = 256M
```

### Error: "CORS policy blocked"
**Solution:**
Check `server/config/cors.php` has correct headers:
```php
header('Access-Control-Allow-Origin: *');
```

### Error: "Cannot find module 'react'"
**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 Debugging Tips

### Enable Debug Mode

**Frontend (React):**
- Check browser console (F12)
- Use React DevTools extension
- Add console.log() statements

**Backend (PHP):**
```php
// Add to top of PHP files
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

**Database:**
```php
// In database.php
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
```

### Check Logs

**PHP Error Log:**
```bash
# Windows
C:\xampp\php\logs\php_error_log

# Check in php.ini
error_log = "C:/xampp/php/logs/php_error_log"
```

**MySQL Error Log:**
```bash
# Windows
C:\xampp\mysql\data\mysql_error.log
```

**Browser Console:**
- Press F12
- Go to Console tab
- Look for errors (red text)

---

## 🆘 Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Read error messages carefully
3. Check browser console
4. Check PHP error logs
5. Search error message online
6. Try on different browser/device

### Information to Provide

When reporting issues, include:
- Operating system and version
- PHP version (`php --version`)
- Node.js version (`node --version`)
- MySQL version (`mysql --version`)
- Exact error message
- Steps to reproduce
- Screenshots if applicable
- Browser and version

### Contact Support

**Business Owner:** Komal  
**Phone:** +91 82838 83463  
**Email:** komal@petel.com

---

## 📚 Additional Resources

### Documentation
- PHP: https://www.php.net/docs.php
- React: https://react.dev/
- MySQL: https://dev.mysql.com/doc/
- Razorpay: https://razorpay.com/docs/

### Community Help
- Stack Overflow: https://stackoverflow.com/
- PHP Forums: https://www.phpfreaks.com/
- React Community: https://react.dev/community

---

## ✅ Prevention Tips

1. **Regular Backups**
   - Backup database daily
   - Backup files weekly
   - Test restoration process

2. **Keep Updated**
   - Update dependencies regularly
   - Apply security patches
   - Monitor for vulnerabilities

3. **Monitor Logs**
   - Check error logs daily
   - Set up log alerts
   - Review unusual activity

4. **Test Changes**
   - Test in development first
   - Use version control (Git)
   - Have rollback plan

5. **Document Changes**
   - Keep changelog
   - Document custom modifications
   - Note configuration changes

---

**Last Updated:** 2026-02-11  
**Version:** 1.0.0

For additional help, contact Komal at +91 82838 83463
