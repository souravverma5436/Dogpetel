# PETEL Deployment Checklist

Complete checklist for deploying PETEL to production.

---

## 📋 Pre-Deployment Checklist

### ✅ Development Complete
- [ ] All features tested locally
- [ ] No console errors
- [ ] All forms working
- [ ] Email notifications working
- [ ] Payment integration tested
- [ ] Admin dashboard functional
- [ ] Responsive on all devices
- [ ] Cross-browser tested

### ✅ Code Quality
- [ ] Code reviewed
- [ ] No hardcoded credentials
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Input validation working
- [ ] Security best practices followed

### ✅ Documentation
- [ ] README.md complete
- [ ] Installation guide ready
- [ ] API documentation available
- [ ] Admin guide prepared
- [ ] User guide created

---

## 🔧 Server Setup

### 1. Server Requirements
- [ ] PHP 8+ installed
- [ ] MySQL 8+ installed
- [ ] Composer installed
- [ ] SSL certificate obtained
- [ ] Domain configured
- [ ] Web server (Apache/Nginx) configured

### 2. Upload Files
- [ ] Upload `server/` folder
- [ ] Upload built frontend files
- [ ] Set correct file permissions
- [ ] Create `.env` file on server

### 3. Database Setup
- [ ] Create production database
- [ ] Import schema.sql
- [ ] Create database user
- [ ] Grant necessary permissions
- [ ] Test database connection

---

## ⚙️ Configuration

### 1. Environment Variables (server/.env)
```env
# Production Settings
ADMIN_PASSWORD=strong_production_password

# Database
DB_HOST=localhost
DB_NAME=petel_production
DB_USER=petel_user
DB_PASS=secure_database_password

# Email (Gmail SMTP)
GMAIL_USER=your_business_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
ADMIN_EMAIL=komal@petel.com

# Razorpay (LIVE KEYS)
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY
RAZORPAY_KEY_SECRET=your_live_secret

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM=+1234567890
ADMIN_PHONE=+918283883463
```

### 2. Frontend Configuration
Update `client/src/config.js`:
```javascript
export const API_BASE_URL = 'https://yourdomain.com/api';
```

### 3. Build Frontend
```bash
cd client
npm run build
```

---

## 🌐 Web Server Configuration

### Apache (.htaccess)
```apache
# In root directory
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/petel/client/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
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

## 🔒 Security Hardening

### 1. File Permissions
```bash
# Set correct ownership
chown -R www-data:www-data /var/www/petel

# Set directory permissions
find /var/www/petel -type d -exec chmod 755 {} \;

# Set file permissions
find /var/www/petel -type f -exec chmod 644 {} \;

# Protect .env file
chmod 600 /var/www/petel/server/.env
```

### 2. Database Security
- [ ] Use strong database password
- [ ] Create dedicated database user
- [ ] Grant only necessary permissions
- [ ] Disable remote root access
- [ ] Enable MySQL firewall rules

### 3. PHP Security
- [ ] Disable display_errors in production
- [ ] Enable error logging
- [ ] Set appropriate memory limits
- [ ] Disable dangerous functions
- [ ] Keep PHP updated

### 4. SSL/TLS
- [ ] Install SSL certificate
- [ ] Force HTTPS
- [ ] Enable HSTS
- [ ] Configure secure headers

---

## 📧 Email Configuration

### Gmail SMTP Setup
1. [ ] Use business Gmail account
2. [ ] Enable 2-Factor Authentication
3. [ ] Generate App Password
4. [ ] Test email sending
5. [ ] Check spam folder
6. [ ] Whitelist domain if needed

### Email Templates
- [ ] Customer confirmation email tested
- [ ] Admin notification email tested
- [ ] Email formatting correct
- [ ] Links working in emails
- [ ] Unsubscribe option (if required)

---

## 💳 Payment Gateway

### Razorpay Production
1. [ ] Complete KYC verification
2. [ ] Activate live mode
3. [ ] Get live API keys
4. [ ] Update keys in .env
5. [ ] Test live payment
6. [ ] Configure webhooks
7. [ ] Set up payment notifications

### Payment Testing
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test payment cancellation
- [ ] Verify payment status updates
- [ ] Check email notifications

---

## 📱 SMS Configuration (Optional)

### Twilio Setup
1. [ ] Verify phone number
2. [ ] Purchase phone number
3. [ ] Get production credentials
4. [ ] Update .env
5. [ ] Test SMS sending
6. [ ] Monitor SMS logs

---

## 🧪 Production Testing

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Navigation working
- [ ] Forms submitting
- [ ] Booking flow complete
- [ ] Payment processing
- [ ] Email notifications sent
- [ ] Admin login working
- [ ] Admin features functional

### Performance Tests
- [ ] Page load speed < 3 seconds
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] Caching enabled
- [ ] CDN configured (if applicable)

### Security Tests
- [ ] SQL injection tested
- [ ] XSS prevention verified
- [ ] CSRF protection enabled
- [ ] SSL certificate valid
- [ ] Security headers configured

### Mobile Tests
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test on tablets
- [ ] Touch interactions work
- [ ] Forms usable on mobile

---

## 📊 Monitoring Setup

### 1. Error Logging
- [ ] PHP error logs configured
- [ ] JavaScript error tracking
- [ ] Database query logging
- [ ] API request logging

### 2. Analytics
- [ ] Google Analytics installed
- [ ] Conversion tracking setup
- [ ] Goal tracking configured
- [ ] Event tracking implemented

### 3. Uptime Monitoring
- [ ] Uptime monitor configured
- [ ] Alert notifications setup
- [ ] Status page created

### 4. Backup System
- [ ] Database backup scheduled
- [ ] File backup configured
- [ ] Backup restoration tested
- [ ] Off-site backup enabled

---

## 🚀 Launch Checklist

### Pre-Launch
- [ ] All tests passed
- [ ] Backup created
- [ ] DNS configured
- [ ] SSL active
- [ ] Email working
- [ ] Payment working
- [ ] Admin access verified

### Launch Day
- [ ] Deploy to production
- [ ] Verify all features
- [ ] Monitor error logs
- [ ] Test booking flow
- [ ] Check email delivery
- [ ] Verify payment processing

### Post-Launch
- [ ] Monitor traffic
- [ ] Check error logs
- [ ] Verify bookings
- [ ] Test admin functions
- [ ] Collect user feedback
- [ ] Fix any issues

---

## 📝 Post-Deployment Tasks

### Week 1
- [ ] Monitor daily
- [ ] Check all bookings
- [ ] Verify emails sent
- [ ] Review error logs
- [ ] Test all features
- [ ] Collect feedback

### Week 2-4
- [ ] Analyze usage patterns
- [ ] Optimize performance
- [ ] Fix reported issues
- [ ] Update documentation
- [ ] Train staff on admin panel

### Ongoing
- [ ] Regular backups
- [ ] Security updates
- [ ] Performance monitoring
- [ ] Feature improvements
- [ ] User support

---

## 🆘 Rollback Plan

### If Issues Occur
1. [ ] Identify the problem
2. [ ] Check error logs
3. [ ] Restore from backup if needed
4. [ ] Revert to previous version
5. [ ] Fix issue in development
6. [ ] Test thoroughly
7. [ ] Redeploy

### Backup Restoration
```bash
# Restore database
mysql -u username -p database_name < backup.sql

# Restore files
tar -xzf backup.tar.gz -C /var/www/petel
```

---

## 📞 Support Contacts

### Technical Support
- **Hosting Provider:** [Contact Info]
- **Domain Registrar:** [Contact Info]
- **SSL Provider:** [Contact Info]

### Service Providers
- **Razorpay Support:** support@razorpay.com
- **Twilio Support:** help.twilio.com
- **Gmail Support:** support.google.com

### Emergency Contacts
- **Developer:** [Your Contact]
- **Business Owner:** Komal - +91 82838 83463
- **System Admin:** [Contact Info]

---

## ✅ Final Verification

Before marking deployment complete:
- [ ] Website accessible via domain
- [ ] HTTPS working
- [ ] All pages load
- [ ] Booking system works
- [ ] Payments process
- [ ] Emails send
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security measures active
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] Documentation updated
- [ ] Team trained

---

## 🎉 Deployment Complete!

Once all items are checked:
1. Announce launch
2. Monitor closely
3. Provide support
4. Collect feedback
5. Plan improvements

---

**Deployed by:** _______________  
**Date:** _______________  
**Version:** 1.0.0  
**Status:** ✅ LIVE

---

**PETEL - A Pet Hotel**  
Your Dog's Home Away From Home 🐕
