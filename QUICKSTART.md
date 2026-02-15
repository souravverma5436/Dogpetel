# PETEL Quick Start Guide

Get PETEL up and running in 5 minutes!

---

## Prerequisites Check

Ensure you have installed:
- ✅ Node.js (v16+)
- ✅ PHP 8+
- ✅ MySQL
- ✅ Composer

---

## 5-Minute Setup

### 1. Run Setup Script (30 seconds)
```bash
setup-windows.bat
```

### 2. Configure Environment (2 minutes)

Edit `server/.env`:
```env
ADMIN_PASSWORD=admin123
DB_PASS=your_mysql_password
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
ADMIN_EMAIL=komal@petel.com
```

### 3. Setup Database (1 minute)
```bash
mysql -u root -p -e "CREATE DATABASE petel_db;"
mysql -u root -p petel_db < database/schema.sql
```

### 4. Start Application (30 seconds)

**Terminal 1:**
```bash
cd client
npm run dev
```

**Terminal 2:**
```bash
cd server
php -S localhost:8000
```

### 5. Open Browser (30 seconds)
- Website: http://localhost:5173
- Admin: http://localhost:5173/admin

### 6. Add Your Logo (Optional)
- Save logo as `client/public/logo.png`
- Logo appears automatically in header and hero section

---

## Default Credentials

**Admin Dashboard:**
- URL: http://localhost:5173/admin
- Password: (from your .env ADMIN_PASSWORD)

---

## Quick Test

1. ✅ Homepage loads
2. ✅ Services page shows 4 services
3. ✅ Pricing page displays prices in ₹
4. ✅ Contact form works
5. ✅ Admin login successful

---

## What's Included

✅ Complete responsive website
✅ Appointment booking system
✅ Online payment integration (Razorpay)
✅ Email notifications
✅ SMS notifications (optional)
✅ Admin dashboard
✅ Late pickup charge calculator
✅ Dynamic pricing management

---

## Need Help?

📖 Full guide: See INSTALLATION.md
📞 Contact: +91 82838 83463

---

Happy pet caring! 🐕
