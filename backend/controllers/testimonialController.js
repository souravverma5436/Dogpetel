const Testimonial = require('../models/Testimonial');

// GET /api/testimonials - Get featured testimonials (public)
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// POST /api/admin/testimonials/seed - Seed default testimonials
const seedTestimonials = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    if (count > 0) {
      return res.json({ success: true, message: `Testimonials already has ${count} records` });
    }

    await Testimonial.insertMany([
      { customerName: 'Priya Sharma', petName: 'Bruno', rating: 5, review: 'Excellent service! My dog was so happy and well taken care of. The staff is very professional and caring. Highly recommended!', isFeatured: true },
      { customerName: 'Rahul Verma',  petName: 'Max',   rating: 5, review: 'Best pet hotel! My dog received amazing care and I got daily photo updates. Will definitely come back!', isFeatured: true },
      { customerName: 'Anjali Patel', petName: 'Milo',  rating: 5, review: 'Outstanding facility and caring staff. My pet was treated like family. Thank you PETEL!', isFeatured: true },
    ]);

    res.json({ success: true, message: 'Seeded 3 testimonials' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed testimonials' });
  }
};

module.exports = { getTestimonials, seedTestimonials };
