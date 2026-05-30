const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getGallery, getAdminGallery, addImage, updateImage, deleteImage, seedGallery
} = require('../controllers/galleryController');

// GET /api/gallery - Public
router.get('/', getGallery);

// GET /api/admin/gallery - Admin
router.get('/admin', auth, getAdminGallery);

// POST /api/admin/gallery - Admin: add image
router.post('/admin', auth, addImage);

// POST /api/admin/gallery/seed - Admin: seed images
router.post('/admin/seed', auth, seedGallery);

// PUT /api/admin/gallery/:id - Admin: update image
router.put('/admin/:id', auth, updateImage);

// DELETE /api/admin/gallery/:id - Admin: delete image
router.delete('/admin/:id', auth, deleteImage);

module.exports = router;
