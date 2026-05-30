require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://dogpetel.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Stricter limit for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again later.' }
});
app.use('/api/admin/login', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'PETEL Backend API is working!',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas',
    version: '2.0.0'
  });
});

// Routes
app.use('/api/admin', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));

// Admin routes (mapped to match frontend expectations)
app.get('/api/admin/contacts', require('./middleware/auth'), require('./controllers/contactController').getContacts);
app.delete('/api/admin/contacts/:id', require('./middleware/auth'), require('./controllers/contactController').deleteContact);

app.get('/api/admin/appointments', require('./middleware/auth'), require('./controllers/appointmentController').getAppointments);
app.put('/api/admin/appointments', require('./middleware/auth'), (req, res) => {
  req.params.id = req.body.id;
  require('./controllers/appointmentController').updateAppointment(req, res);
});
app.delete('/api/admin/appointments', require('./middleware/auth'), (req, res) => {
  req.params.id = req.body.id;
  require('./controllers/appointmentController').deleteAppointment(req, res);
});

app.get('/api/admin/pricing', require('./middleware/auth'), require('./controllers/pricingController').getAdminPricing);
app.put('/api/admin/pricing', require('./middleware/auth'), (req, res) => {
  req.params.id = req.body.id;
  require('./controllers/pricingController').updatePrice(req, res);
});

app.get('/api/admin/gallery', require('./middleware/auth'), require('./controllers/galleryController').getAdminGallery);
app.post('/api/admin/gallery', require('./middleware/auth'), require('./controllers/galleryController').addImage);
app.put('/api/admin/gallery', require('./middleware/auth'), (req, res) => {
  req.params.id = req.body.id;
  require('./controllers/galleryController').updateImage(req, res);
});
app.delete('/api/admin/gallery', require('./middleware/auth'), (req, res) => {
  req.params.id = req.body.id;
  require('./controllers/galleryController').deleteImage(req, res);
});

// Seed endpoint (run once to populate MongoDB)
app.get('/api/seed', async (req, res) => {
  try {
    const PricingPlan = require('./models/PricingPlan');
    const Testimonial = require('./models/Testimonial');
    const GalleryImage = require('./models/GalleryImage');

    const results = {};

    // Seed pricing
    const pricingCount = await PricingPlan.countDocuments();
    if (pricingCount === 0) {
      const plans = [
        { packageName: 'Basic Care',       petType: 'dog', duration: 'Per Day',   price: 500,   features: 'Daily walks,Basic grooming,Regular feeding,Clean accommodation', isPopular: false, displayOrder: 1 },
        { packageName: 'Standard Care',    petType: 'dog', duration: 'Per Day',   price: 800,   features: 'Multiple walks,Basic grooming,Premium food,Spacious room,Play time', isPopular: true,  displayOrder: 2 },
        { packageName: 'Premium Care',     petType: 'dog', duration: 'Per Day',   price: 1200,  features: 'Unlimited walks,Full grooming,Gourmet meals,Luxury suite,Personal attention', isPopular: false, displayOrder: 3 },
        { packageName: 'Weekly Basic',     petType: 'dog', duration: 'Per Week',  price: 3000,  features: 'All Basic Care features,7 days accommodation,Weekly health check', isPopular: false, displayOrder: 4 },
        { packageName: 'Weekly Standard',  petType: 'dog', duration: 'Per Week',  price: 5000,  features: 'All Standard Care features,7 days accommodation,Vet consultation,Photo updates', isPopular: true,  displayOrder: 5 },
        { packageName: 'Weekly Premium',   petType: 'dog', duration: 'Per Week',  price: 7500,  features: 'All Premium Care features,7 days accommodation,Daily vet check,Spa treatment', isPopular: false, displayOrder: 6 },
        { packageName: 'Monthly Basic',    petType: 'dog', duration: 'Per Month', price: 12000, features: 'All Basic Care features,30 days accommodation,Bi-weekly health check', isPopular: false, displayOrder: 7 },
        { packageName: 'Monthly Standard', petType: 'dog', duration: 'Per Month', price: 18000, features: 'All Standard Care features,30 days accommodation,Weekly vet visits,Training program', isPopular: true,  displayOrder: 8 },
        { packageName: 'Monthly Premium',  petType: 'dog', duration: 'Per Month', price: 28000, features: 'All Premium Care features,30 days accommodation,Daily health monitoring,Spa package', isPopular: false, displayOrder: 9 },
        { packageName: 'Daycare',          petType: 'dog', duration: 'Per Day',   price: 400,   features: 'Drop-off and pick-up,Supervised play,Feeding,Basic care', isPopular: false, displayOrder: 10 },
      ];
      await PricingPlan.insertMany(plans);
      results.pricing = `${plans.length} plans inserted`;
    } else {
      results.pricing = `Already has ${pricingCount} plans`;
    }

    // Seed testimonials
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany([
        { customerName: 'Priya Sharma', petName: 'Bruno', rating: 5, review: 'Excellent service! My dog was so happy and well taken care of. Highly recommended!', isFeatured: true },
        { customerName: 'Rahul Verma',  petName: 'Max',   rating: 5, review: 'Best pet hotel! My dog received amazing care and I got daily photo updates.', isFeatured: true },
        { customerName: 'Anjali Patel', petName: 'Milo',  rating: 5, review: 'Outstanding facility and caring staff. My pet was treated like family!', isFeatured: true },
      ]);
      results.testimonials = '3 testimonials inserted';
    } else {
      results.testimonials = `Already has ${testCount} testimonials`;
    }

    // Seed gallery
    const galleryCount = await GalleryImage.countDocuments();
    if (galleryCount === 0) {
      await GalleryImage.insertMany([
        { imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80', title: 'Adorable Little Explorer', description: 'Meet our precious little guest!', displayOrder: 1 },
        { imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80', title: 'Cozy Comfort Time', description: 'Wrapped in warmth and love!', displayOrder: 2 },
        { imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80', title: 'Playtime Paradise', description: 'Happy tails and joyful moments!', displayOrder: 3 },
        { imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80', title: 'Luxury Pet Suites', description: 'Premium comfort for your companions.', displayOrder: 4 },
        { imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80', title: 'Professional Care Team', description: 'Expert care with a personal touch.', displayOrder: 5 },
        { imageUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80', title: 'Happy & Healthy', description: 'Bright smiles and wagging tails!', displayOrder: 6 },
      ]);
      results.gallery = '6 images inserted';
    } else {
      results.gallery = `Already has ${galleryCount} images`;
    }

    res.json({ success: true, message: 'Database seeded!', results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PETEL Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
