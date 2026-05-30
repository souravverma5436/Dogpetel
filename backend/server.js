require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { getDbStatus } = require('./services/emailService');

const app = express();

// Connect to MongoDB (non-blocking - app runs even if DB is down)
connectDB();

// Security
app.use(helmet());

// CORS
const allowedOrigins = [
  'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
  'http://localhost:3000', 'https://dogpetel.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com'))
      return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15*60*1000, max: 100, message: { error: 'Too many requests' } }));
app.use('/api/admin/login', rateLimit({ windowMs: 15*60*1000, max: 10, message: { error: 'Too many login attempts' } }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Email Test Endpoint (admin only) ────────────────────────────────────────
app.get('/api/test-email', async (req, res) => {
  const { sendEmail } = require('./services/emailService');
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!gmailUser || !gmailPass) {
    return res.json({
      success: false,
      error: 'Gmail not configured',
      GMAIL_USER: gmailUser ? 'SET' : 'NOT SET',
      GMAIL_APP_PASSWORD: gmailPass ? 'SET' : 'NOT SET',
      ADMIN_EMAIL: adminEmail || 'NOT SET'
    });
  }

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass }
  });

  try {
    await transporter.sendMail({
      from: `"PETEL Test" <${gmailUser}>`,
      to: adminEmail || gmailUser,
      subject: '✅ PETEL Email Test from Render',
      html: `<h2>Email is working on Render!</h2><p>Time: ${new Date().toISOString()}</p>`
    });
    res.json({ success: true, message: `Test email sent to ${adminEmail || gmailUser}` });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'PETEL Backend API is working!',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas',
    version: '2.0.0'
  });
});

app.get('/api/system/health', (req, res) => {
  const dbState = getDbStatus();
  res.json({
    server: 'running',
    database: dbState,
    email: process.env.GMAIL_USER ? 'configured' : 'not configured',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// ─── Public Routes ────────────────────────────────────────────────────────────
app.use('/api/contacts',     require('./routes/contacts'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/pricing',      require('./routes/pricing'));
app.use('/api/testimonials', require('./routes/testimonials'));

// ─── Admin Auth ───────────────────────────────────────────────────────────────
app.use('/api/admin', require('./routes/auth'));

// ─── Admin Protected Routes ───────────────────────────────────────────────────
const auth = require('./middleware/auth');
const contactCtrl     = require('./controllers/contactController');
const appointmentCtrl = require('./controllers/appointmentController');
const pricingCtrl     = require('./controllers/pricingController');

// Contacts
app.get('/api/admin/contacts',     auth, contactCtrl.getContacts);
app.delete('/api/admin/contacts/:id', auth, contactCtrl.deleteContact);

// Appointments
app.get('/api/admin/appointments',     auth, appointmentCtrl.getAppointments);
app.put('/api/admin/appointments/:id', auth, appointmentCtrl.updateAppointment);
app.delete('/api/admin/appointments/:id', auth, appointmentCtrl.deleteAppointment);

// Pricing
app.get('/api/admin/pricing',     auth, pricingCtrl.getAdminPricing);
app.put('/api/admin/pricing/:id', auth, pricingCtrl.updatePrice);

// ─── Seed (run once) ──────────────────────────────────────────────────────────
app.get('/api/seed', async (req, res) => {
  try {
    const PricingPlan = require('./models/PricingPlan');
    const Testimonial = require('./models/Testimonial');
    const results = {};

    const pricingCount = await PricingPlan.countDocuments();
    if (pricingCount === 0) {
      await PricingPlan.insertMany([
        { packageName:'Basic Care',       petType:'dog', duration:'Per Day',   price:500,   features:'Daily walks,Basic grooming,Regular feeding,Clean accommodation', isPopular:false, displayOrder:1 },
        { packageName:'Standard Care',    petType:'dog', duration:'Per Day',   price:800,   features:'Multiple walks,Basic grooming,Premium food,Spacious room,Play time', isPopular:true,  displayOrder:2 },
        { packageName:'Premium Care',     petType:'dog', duration:'Per Day',   price:1200,  features:'Unlimited walks,Full grooming,Gourmet meals,Luxury suite,Personal attention', isPopular:false, displayOrder:3 },
        { packageName:'Weekly Basic',     petType:'dog', duration:'Per Week',  price:3000,  features:'All Basic Care features,7 days accommodation,Weekly health check', isPopular:false, displayOrder:4 },
        { packageName:'Weekly Standard',  petType:'dog', duration:'Per Week',  price:5000,  features:'All Standard Care features,7 days accommodation,Vet consultation,Photo updates', isPopular:true,  displayOrder:5 },
        { packageName:'Weekly Premium',   petType:'dog', duration:'Per Week',  price:7500,  features:'All Premium Care features,7 days accommodation,Daily vet check,Spa treatment', isPopular:false, displayOrder:6 },
        { packageName:'Monthly Basic',    petType:'dog', duration:'Per Month', price:12000, features:'All Basic Care features,30 days accommodation,Bi-weekly health check', isPopular:false, displayOrder:7 },
        { packageName:'Monthly Standard', petType:'dog', duration:'Per Month', price:18000, features:'All Standard Care features,30 days accommodation,Weekly vet visits,Training program', isPopular:true,  displayOrder:8 },
        { packageName:'Monthly Premium',  petType:'dog', duration:'Per Month', price:28000, features:'All Premium Care features,30 days accommodation,Daily health monitoring,Spa package', isPopular:false, displayOrder:9 },
        { packageName:'Daycare',          petType:'dog', duration:'Per Day',   price:400,   features:'Drop-off and pick-up,Supervised play,Feeding,Basic care', isPopular:false, displayOrder:10 },
      ]);
      results.pricing = '10 dog packages inserted';
    } else {
      results.pricing = `Already has ${pricingCount} plans`;
    }

    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany([
        { customerName:'Priya Sharma', petName:'Bruno', rating:5, review:'Excellent service! My dog was so happy and well taken care of. Highly recommended!', isFeatured:true },
        { customerName:'Rahul Verma',  petName:'Max',   rating:5, review:'Best pet hotel! My dog received amazing care and I got daily photo updates.', isFeatured:true },
        { customerName:'Anjali Patel', petName:'Milo',  rating:5, review:'Outstanding facility and caring staff. My pet was treated like family!', isFeatured:true },
      ]);
      results.testimonials = '3 testimonials inserted';
    } else {
      results.testimonials = `Already has ${testCount} testimonials`;
    }

    res.json({ success: true, message: 'Database seeded!', results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 404 & Error Handler ──────────────────────────────────────────────────────
app.use('*', (req, res) => res.status(404).json({ error: `Route ${req.originalUrl} not found` }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PETEL Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Email: ${process.env.GMAIL_USER ? 'configured' : 'not configured'}`);
});

module.exports = app;
