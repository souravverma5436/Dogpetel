const PricingPlan = require('../models/PricingPlan');

// GET /api/pricing - Get all dog pricing (public)
const getPricing = async (req, res) => {
  try {
    const pricing = await PricingPlan.find({ petType: 'dog' }).sort({ displayOrder: 1 });
    res.json({ success: true, data: pricing });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
};

// GET /api/admin/pricing - Get all pricing (admin)
const getAdminPricing = async (req, res) => {
  try {
    const pricing = await PricingPlan.find({ petType: 'dog' }).sort({ displayOrder: 1 });
    res.json({ success: true, data: pricing });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
};

// PUT /api/admin/pricing/:id - Update price (admin)
const updatePrice = async (req, res) => {
  try {
    const { price } = req.body;
    if (!price || price <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    await PricingPlan.findByIdAndUpdate(req.params.id, { price });
    res.json({ success: true, message: 'Price updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update price' });
  }
};

// POST /api/admin/pricing/seed - Seed default pricing
const seedPricing = async (req, res) => {
  try {
    const count = await PricingPlan.countDocuments();
    if (count > 0) {
      return res.json({ success: true, message: `Pricing already has ${count} records` });
    }

    const plans = [
      { packageName: 'Basic Care',      petType: 'dog', duration: 'Per Day',   price: 500,   features: 'Daily walks,Basic grooming,Regular feeding,Clean accommodation', isPopular: false, displayOrder: 1 },
      { packageName: 'Standard Care',   petType: 'dog', duration: 'Per Day',   price: 800,   features: 'Multiple walks,Basic grooming,Premium food,Spacious room,Play time', isPopular: true,  displayOrder: 2 },
      { packageName: 'Premium Care',    petType: 'dog', duration: 'Per Day',   price: 1200,  features: 'Unlimited walks,Full grooming,Gourmet meals,Luxury suite,Personal attention', isPopular: false, displayOrder: 3 },
      { packageName: 'Weekly Basic',    petType: 'dog', duration: 'Per Week',  price: 3000,  features: 'All Basic Care features,7 days accommodation,Weekly health check', isPopular: false, displayOrder: 4 },
      { packageName: 'Weekly Standard', petType: 'dog', duration: 'Per Week',  price: 5000,  features: 'All Standard Care features,7 days accommodation,Vet consultation,Photo updates', isPopular: true,  displayOrder: 5 },
      { packageName: 'Weekly Premium',  petType: 'dog', duration: 'Per Week',  price: 7500,  features: 'All Premium Care features,7 days accommodation,Daily vet check,Spa treatment', isPopular: false, displayOrder: 6 },
      { packageName: 'Monthly Basic',   petType: 'dog', duration: 'Per Month', price: 12000, features: 'All Basic Care features,30 days accommodation,Bi-weekly health check', isPopular: false, displayOrder: 7 },
      { packageName: 'Monthly Standard',petType: 'dog', duration: 'Per Month', price: 18000, features: 'All Standard Care features,30 days accommodation,Weekly vet visits,Training program', isPopular: true,  displayOrder: 8 },
      { packageName: 'Monthly Premium', petType: 'dog', duration: 'Per Month', price: 28000, features: 'All Premium Care features,30 days accommodation,Daily health monitoring,Spa package', isPopular: false, displayOrder: 9 },
      { packageName: 'Daycare',         petType: 'dog', duration: 'Per Day',   price: 400,   features: 'Drop-off and pick-up,Supervised play,Feeding,Basic care', isPopular: false, displayOrder: 10 },
    ];

    await PricingPlan.insertMany(plans);
    res.json({ success: true, message: `Seeded ${plans.length} pricing plans` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed pricing' });
  }
};

module.exports = { getPricing, getAdminPricing, updatePrice, seedPricing };
