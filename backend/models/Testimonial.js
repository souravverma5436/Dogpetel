const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  petName:      { type: String, trim: true },
  rating:       { type: Number, min: 1, max: 5, default: 5 },
  review:       { type: String, required: true, trim: true },
  isFeatured:   { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
