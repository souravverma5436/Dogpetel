const GalleryImage = require('../models/GalleryImage');

// GET /api/gallery - Get active images (public)
const getGallery = async (req, res) => {
  try {
    const images = await GalleryImage.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: images, count: images.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// GET /api/admin/gallery - Get all images (admin)
const getAdminGallery = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// POST /api/admin/gallery - Add image (admin)
const addImage = async (req, res) => {
  try {
    const { image_url, title, description, display_order } = req.body;
    if (!image_url) return res.status(400).json({ error: 'Image URL is required' });

    const image = await GalleryImage.create({
      imageUrl: image_url,
      title,
      description,
      displayOrder: display_order || 0
    });

    res.status(201).json({ success: true, message: 'Image added to gallery', id: image._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add image' });
  }
};

// PUT /api/admin/gallery/:id - Update image (admin)
const updateImage = async (req, res) => {
  try {
    const { image_url, title, description, display_order, is_active } = req.body;
    const update = {};
    if (image_url !== undefined) update.imageUrl = image_url;
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (display_order !== undefined) update.displayOrder = display_order;
    if (is_active !== undefined) update.isActive = is_active;

    await GalleryImage.findByIdAndUpdate(req.params.id, update);
    res.json({ success: true, message: 'Image updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update image' });
  }
};

// DELETE /api/admin/gallery/:id - Delete image (admin)
const deleteImage = async (req, res) => {
  try {
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// POST /api/admin/gallery/seed - Seed default gallery images
const seedGallery = async (req, res) => {
  try {
    const count = await GalleryImage.countDocuments();
    if (count > 0) {
      return res.json({ success: true, message: `Gallery already has ${count} images` });
    }

    const images = [
      { imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80', title: 'Adorable Little Explorer', description: 'Meet our precious little guest! This fluffy bundle of joy loves exploring every corner of our pet hotel.', displayOrder: 1 },
      { imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80', title: 'Cozy Comfort Time', description: 'Wrapped in warmth and love! Our furry friend enjoying a peaceful moment in their favorite cozy blanket.', displayOrder: 2 },
      { imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80', title: 'Playtime Paradise', description: 'Happy tails and joyful moments! Our guests enjoying their favorite activities in our spacious play areas.', displayOrder: 3 },
      { imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80', title: 'Luxury Pet Suites', description: 'Premium comfort for your beloved companions with plush bedding and climate control.', displayOrder: 4 },
      { imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80', title: 'Professional Care Team', description: 'Expert care with a personal touch. Our trained staff ensures every pet receives individual attention.', displayOrder: 5 },
      { imageUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80', title: 'Happy & Healthy', description: 'Bright smiles and wagging tails! We maintain the highest standards of cleanliness and health.', displayOrder: 6 },
    ];

    await GalleryImage.insertMany(images);
    res.json({ success: true, message: `Seeded ${images.length} gallery images` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed gallery' });
  }
};

module.exports = { getGallery, getAdminGallery, addImage, updateImage, deleteImage, seedGallery };
