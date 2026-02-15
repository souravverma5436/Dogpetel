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
      if (!acc[item.service_type]) {
        acc[item.service_type] = []
      }
      acc[item.service_type].push(item)
      return acc
    }, {})
  }

  const groupedPricing = groupByType(pricing)

  const typeLabels = {
    boarding: 'Boarding Packages',
    daycare: 'Daycare Services',
    grooming: 'Grooming Services',
    pickup: 'Transportation Services',
    training: 'Training Services',
    veterinary: 'Veterinary Services',
    combo: 'Combo Packages'
  }

  const typeIcons = {
    boarding: '🏠',
    daycare: '☀️',
    grooming: '✨',
    pickup: '🚗',
    training: '🎓',
    veterinary: '🏥',
    combo: '🎁'
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
                  const isPackage = item.service_name.includes('Weekly') || 
                                   item.service_name.includes('Monthly') || 
                                   item.service_name.includes('Package') ||
                                   item.service_name.includes('Combo');
                  const hasSavings = item.description && item.description.includes('Save');
                  
                  return (
                    <div key={item.id} className={`pricing-card ${isPackage ? 'package-card' : ''}`}>
                      {isPackage && <div className="package-badge">Package Deal</div>}
                      <h3>{item.service_name}</h3>
                      <div className="price">
                        <span className="currency">₹</span>
                        <span className="amount">{item.price}</span>
                        {(type === 'boarding' || type === 'daycare') && !item.service_name.includes('Package') && !item.service_name.includes('Weekly') && !item.service_name.includes('Monthly') && (
                          <span className="period">/day</span>
                        )}
                      </div>
                      {item.description && (
                        <p className={`description ${hasSavings ? 'has-savings' : ''}`}>
                          {item.description}
                        </p>
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
