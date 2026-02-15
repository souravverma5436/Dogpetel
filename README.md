# PETEL - A Pet Hotel
## Your Dog's Home Away From Home

Complete full-stack website for pet care business with appointment booking, payment integration, and admin dashboard.

---

## Tech Stack

### Frontend
- ReactJS
- HTML5
- CSS3 (Mobile-first responsive)
- JavaScript
- Axios
- React Router DOM

### Backend
- PHP 8+
- MySQL
- REST API
- PHPMailer (Gmail SMTP)
- Razorpay PHP SDK
- Twilio SMS (Optional)
- Dotenv

---

## Windows Setup Instructions

### Prerequisites
- Node.js (v16+)
- PHP 8+
- MySQL
- Composer

### Client Setup
```bash
cd client
npm install
npm run dev
```

### Server Setup
```bash
cd server
composer install
```

### Database Setup
1. Create MySQL database named `petel_db`
2. Import schema:
```bash
mysql -u root -p petel_db < database/schema.sql
```

### Logo Setup
1. Save your PETEL logo as `logo.png`
2. Place it in `client/public/` folder
3. Logo will automatically appear in header and hero section
4. See `client/public/LOGO_INSTRUCTIONS.md` for details

### Environment Configuration
1. Copy `.env.example` to `.env` in server folder
2. Configure all variables:

```env
# Admin
ADMIN_PASSWORD=your_secure_password

# Database
DB_HOST=localhost
DB_NAME=petel_db
DB_USER=root
DB_PASS=your_mysql_password

# Email (Gmail SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
ADMIN_EMAIL=komal@petel.com

# Razorpay (India Payment Gateway)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Twilio SMS (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_FROM=+1234567890
ADMIN_PHONE=+918283883463
```

### Gmail App Password Setup
1. Enable 2FA on Gmail
2. Go to Google Account → Security → 2-Step Verification → App Passwords
3. Generate app password for "Mail"
4. Use 16-character password in GMAIL_APP_PASSWORD

### Razorpay Setup
1. Sign up at https://razorpay.com
2. Get API keys from Dashboard → Settings → API Keys
3. Use Test keys for development

---

## Running the Application

### Quick Start (Easiest)
Double-click `start-petel.bat` to start both servers automatically.

Or run:
```bash
start-petel.bat
```

### Manual Start

**Option 1 - Use startup scripts:**
```bash
# Terminal 1 - Backend
start-backend.bat

# Terminal 2 - Frontend  
start-frontend.bat
```

**Option 2 - Manual commands:**
```bash
# Terminal 1 - Frontend (http://localhost:5173)
cd client
npm run dev

# Terminal 2 - Backend (http://localhost:8000)
cd server
php -S localhost:8000
```

### Access the Application
- **Website:** http://localhost:5173
- **Admin Dashboard:** http://localhost:5173/admin
- **Admin Password:** `komal123`
- **Backend API:** http://localhost:8000/api
- **API Test:** http://localhost:8000/api/test.php

### Production Build
```bash
cd client
npm run build
```

---

## Features

### Customer Features
- Browse services (Boarding, Daycare, Grooming, Pick-up & Drop)
- View pricing in INR (₹)
- Book appointments with date/time picker
- Online payment via Razorpay or Cash at Pickup
- Email confirmations
- WhatsApp & Phone quick contact
- 24/7 availability badge

### Admin Dashboard
- Login at `/admin`
- View all appointments
- Search & filter bookings
- Update booking status
- Track payment status
- Calculate late pickup charges automatically
- Edit pricing dynamically
- Manage late penalty rules
- Real-time notifications

### Late Pickup Policy
- Automatic calculation of extra days
- Late charges = extra_days × price_per_day
- Clearly displayed to customers before booking
- Admin can edit penalty rules

---

## Contact Information

**Founder:** Komal  
**Phone:** +91 82838 83463  
**Availability:** 24/7  
**WhatsApp:** https://wa.me/918283883463

---

## Project Structure
```
petel/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                 # PHP backend
│   ├── api/
│   ├── config/
│   ├── vendor/
│   └── composer.json
├── database/
│   └── schema.sql
└── README.md
```

---

## Deployment

### GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit - PETEL Pet Hotel"
git branch -M main
git remote add origin https://github.com/souravverma5436/Dogpetel.git
git push -u origin main
```

### Vercel Deployment (Frontend Only)
⚠️ **Note:** Vercel doesn't fully support PHP. For full-stack deployment, use Railway, Heroku, or traditional PHP hosting.

**Option 1: Frontend on Vercel + Backend on PHP Hosting**
```bash
cd client
npm run build
vercel --prod
```

**Option 2: Full Stack on Railway (Recommended)**
See `VERCEL_DEPLOYMENT.md` for detailed instructions.

### Recommended Hosting
- **Hostinger** - ₹149/month (best for India, supports PHP + MySQL)
- **Railway** - Free tier, supports PHP + MySQL
- **DigitalOcean** - $5/month
- **Heroku** - Free tier available

For detailed deployment instructions, see `VERCEL_DEPLOYMENT.md`

---

## Support

For issues or questions, contact Komal at +91 82838 83463

---

## License

© 2026 PETEL - A Pet Hotel. All rights reserved.
