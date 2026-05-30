import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import './Pricing.css'

// Static fallback pricing data - DOG ONLY
const STATIC_PRICING = [
  { id:1, package_name:'Basic Care', pet_type:'dog', duration:'Per Day', price:500, features:'Daily walks,Basic grooming,Regular feeding,Clean accommodation', is_popular:false },
  { id:2, package_name:'Standard Care', pet_type:'dog', duration:'Per Day', price:800, features:'Multiple walks,Basic grooming,Premium food,Spacious room,Play time', is_popular:true },
  { id:3, package_name:'Premium Care', pet_type:'dog', duration:'Per Day', price:1200, features:'Unlimited walks,Full grooming,Gourmet meals,Luxury suite,Personal attention', is_popular:false },
  { id:4, package_name:'Weekly Basic', pet_type:'dog', duration:'Per Week', price:3000, features:'All Basic Care features,7 days accommodation,Weekly health check', is_popular:false },
  { id:5, package_name:'Weekly Standard', pet_type:'dog', duration:'Per Week', price:5000, features:'All Standard Care features,7 days accommodation,Vet consultation,Photo updates', is_popular:true },
  { id:6, package_name:'Weekly Premium', pet_type:'dog', duration:'Per Week', price:7500, features:'All Premium Care features,7 days accommodation,Daily vet check,Spa treatment', is_popular:false },
  { id:7, package_name:'Monthly Basic', pet_type:'dog', duration:'Per Month', price:12000, features:'All Basic Care features,30 days accommodation,Bi-weekly health check', is_popular:false },
  { id:8, package_name:'Monthly Standard', pet_type:'dog', duration:'Per Month', price:18000, features:'All Standard Care features,30 days accommodation,Weekly vet visits,Training program', is_popular:true },
  { id:9, package_name:'Monthly Premium', pet_type:'dog', duration:'Per Month', price:28000, features:'All Premium Care features,30 days accommodation,Daily health monitoring,Spa package', is_popular:false },
  { id:10, package_name:'Daycare', pet_type:'dog', duration:'Per Day', price:400, features:'Drop-off and pick-up,Supervised play,Feeding,Basic care', is_popular:false },
]

function Pricing() {
  const [pricing, setPricing] = useState(STATIC_PRICING)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pricing.php`)
      if (response.data.success && response.data.data.length > 0) {
        // Only show dog packages
        const dogPricing = response.data.data.filter(p => p.pet_type === 'dog')
        setPricing(dogPricing.length > 0 ? dogPricing : STATIC_PRICING)
      }
    } catch (error) {
      console.error('Error fetching pricing, using static data:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupByType = (items) => {
    return items.reduce((acc, item) => {
      const type = item.pet_type || 'other'
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(item)
      return acc
    }, {})
  }

  const groupedPricing = groupByType(pricing)

  const typeLabels = {
    dog: 'Dog Care Packages',
    cat: 'Cat Care Packages',
    bird: 'Bird Care Packages',
    other: 'Other Services'
  }

  const typeIcons = {
    dog: '🐕',
    cat: '🐈',
    bird: '🦜',
    other: '🐾'
  }

  if (loading) {
    return (
      <div className="pricing-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="pricing-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our Pricing</h1>
          <p>Transparent and affordable pricing for quality pet care</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {Object.keys(groupedPricing).map((type) => (
            <div key={type} className="pricing-category">
              <h2 className="category-title">
                <span className="category-icon">{typeIcons[type]}</span>
                {typeLabels[type]}
              </h2>
              <div className="pricing-grid">
                {groupedPricing[type].map((item) => {
                  const isPopular = item.is_popular;
                  const features = item.features ? item.features.split(',').map(f => f.trim()) : [];
                  
                  return (
                    <div key={item.id} className={`pricing-card ${isPopular ? 'popular-card' : ''}`}>
                      {isPopular && <div className="package-badge">Popular</div>}
                      <h3>{item.package_name}</h3>
                      <div className="price">
                        <span className="currency">₹</span>
                        <span className="amount">{item.price}</span>
                        <span className="period">/{item.duration}</span>
                      </div>
                      {features.length > 0 && (
                        <ul className="features-list">
                          {features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      )}
                      <Link to="/contact" className="btn btn-primary">Book Now</Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-info">
        <div className="container">
          <h2 className="section-title">Important <span>Information</span></h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">💳</div>
              <h3>Payment Methods</h3>
              <p>We accept online payments via Razorpay and cash payment at pickup</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h3>Late Pickup Policy</h3>
              <p>If you do not pick up your pet on the scheduled date/time, an extra day charge will be added at the same rate</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>We're available round the clock for any questions or emergencies</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎁</div>
              <h3>Special Offers</h3>
              <p>Contact us for long-term boarding discounts and package deals</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Book?</h2>
          <p>Choose the perfect package for your pet and book today!</p>
          <Link to="/contact" className="btn btn-primary">Book Appointment</Link>
        </div>
      </section>
    </div>
  )
}

export default Pricing
