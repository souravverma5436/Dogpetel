const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  imageUrl:     { type: String, required: true },
  title:        { type: String, trim: true },
  description:  { type: String, trim: true },
  displayOrder: { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
