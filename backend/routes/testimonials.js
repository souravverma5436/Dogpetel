const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTestimonials, seedTestimonials } = require('../controllers/testimonialController');

// GET /api/testimonials - Public
router.get('/', getTestimonials);

// POST /api/admin/testimonials/seed - Admin: seed
router.post('/admin/seed', auth, seedTestimonials);

module.exports = router;
