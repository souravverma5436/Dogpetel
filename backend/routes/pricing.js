const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPricing, getAdminPricing, updatePrice, seedPricing } = require('../controllers/pricingController');

// GET /api/pricing - Public
router.get('/', getPricing);

// GET /api/admin/pricing - Admin
router.get('/admin', auth, getAdminPricing);

// PUT /api/admin/pricing/:id - Admin
router.put('/admin/:id', auth, updatePrice);

// POST /api/admin/pricing/seed - Admin: seed default data
router.post('/admin/seed', auth, seedPricing);

module.exports = router;
