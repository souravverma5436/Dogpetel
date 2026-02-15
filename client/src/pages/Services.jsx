import { Link } from 'react-router-dom'
import './Services.css'

function Services() {
  const services = [
    {
      icon: '🏠',
      title: 'Pet Boarding',
      description: 'Safe and comfortable overnight stays for your beloved pet',
      features: [
        'Comfortable sleeping areas',
        'Regular feeding schedule',
        'Daily exercise and playtime',
        'Medication administration if needed',
        '24/7 supervision',
        'Regular updates to owners'
      ]
    },
    {
      icon: '☀️',
      title: 'Daycare',
      description: 'Fun-filled days with supervised activities and socialization',
      features: [
        'Supervised group play',
        'Individual attention',
        'Socialization with other pets',
        'Indoor and outdoor activities',
        'Rest periods',
        'Healthy snacks provided'
      ]
    },
    {
      icon: '✨',
      title: 'Grooming',
      description: 'Professional grooming services to keep your pet looking and feeling great',
      features: [
        'Bath and blow dry',
        'Brush and de-shedding',
        'Nail trimming',
        'Ear cleaning',
        'Teeth brushing',
        'Styling and haircuts'
      ]
    },
    {
      icon: '🚗',
      title: 'Pick-up & Drop',
      description: 'Convenient transportation services for your pet',
      features: [
        'Safe and comfortable transport',
        'Flexible scheduling',
        'Door-to-door service',
        'Experienced handlers',
        'GPS tracking available',
        'Climate-controlled vehicles'
      ]
    }
  ]

  return (
    <div className="services-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive pet care solutions tailored to your needs</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-detailed">
            {services.map((service, index) => (
              <div key={index} className="service-detailed-card">
                <div className="service-header">
                  <div className="service-icon-large">{service.icon}</div>
                  <div>
                    <h2>{service.title}</h2>
                    <p className="service-desc">{service.description}</p>
                  </div>
                </div>
                <div className="service-features">
                  <h3>What's Included:</h3>
                  <ul>
                    {service.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
                <Link to="/contact" className="btn btn-primary">Book Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-choose">
        <div className="container">
          <h2 className="section-title">Why Choose <span>PETEL?</span></h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">🏆</div>
              <h3>Professional Care</h3>
              <p>Experienced and trained staff who genuinely love animals</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🏥</div>
              <h3>Health & Safety</h3>
              <p>Clean, sanitized facilities with regular health monitoring</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📱</div>
              <h3>24/7 Availability</h3>
              <p>Round-the-clock service and emergency support</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💰</div>
              <h3>Affordable Pricing</h3>
              <p>Quality care at competitive rates with transparent pricing</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Book a Service?</h2>
          <p>Contact us today to schedule your pet's appointment</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Book Appointment</Link>
            <Link to="/pricing" className="btn btn-secondary">View Pricing</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
