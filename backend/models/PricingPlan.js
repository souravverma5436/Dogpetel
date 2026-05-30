const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema({
  packageName:  { type: String, required: true },
  petType:      { type: String, required: true, default: 'dog' },
  duration:     { type: String, required: true },
  price:        { type: Number, required: true },
  features:     { type: String },
  isPopular:    { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
