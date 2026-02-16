import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import './Pricing.css'

function Pricing() {
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pricing.php`)
      if (response.data.success) {
        setPricing(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching pricing:', error)
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
        <div className="spinner"></div>
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
