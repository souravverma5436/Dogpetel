import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL, CONTACT_INFO } from '../config'
import './Home.css'

function Home() {
  const [testimonials, setTestimonials] = useState([])
  const [faqOpen, setFaqOpen] = useState(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/testimonials.php`)
      if (response.data.success) {
        setTestimonials(response.data.data.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    }
  }

  const faqs = [
    {
      question: 'What are your operating hours?',
      answer: 'We are available 24/7 for your convenience. You can drop off or pick up your pet anytime.'
    },
    {
      question: 'What happens if my pet gets sick during their stay?',
      answer: 'We monitor all pets closely. If any health issue arises, we will contact you immediately and arrange for veterinary care if needed.'
    },
    {
      question: 'What is your late pickup policy?',
      answer: 'If you do not pick up your pet on the scheduled pickup date/time, an extra day charge will be added automatically at the same rate as your selected package.'
    },
    {
      question: 'Do you provide pick-up and drop services?',
      answer: 'Yes! We offer convenient pick-up and drop services. Check our Services page for more details.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept both online payments via Razorpay and cash payment at pickup.'
    }
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>PETEL - A Pet Hotel</h1>
              <p className="tagline">Your Dog's Home Away From Home</p>
              <p className="hero-description">
                Professional pet boarding, daycare, and grooming services with love and care. 
                Your furry friend deserves the best!
              </p>
              <div className="hero-buttons">
                <Link to="/contact" className="btn btn-primary">Book Appointment</Link>
                <a href={`tel:${CONTACT_INFO.phone}`} className="btn btn-secondary">📞 Call Now</a>
                <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  💬 WhatsApp
                </a>
              </div>
              <div className="hero-badge">
                <span className="badge-24">24/7 Available</span>
                <span className="badge-contact">{CONTACT_INFO.phoneDisplay}</span>
              </div>
            </div>
            <div className="hero-image">
              <img src="/dogpetel-logo.png" alt="PETEL - A Pet Hotel" className="hero-logo" />
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section about-preview">
        <div className="container">
          <h2 className="section-title">Welcome to <span>PETEL</span></h2>
          <div className="about-content">
            <p>
              At PETEL, we understand that your pet is family. That's why we provide a safe, 
              comfortable, and loving environment where your dog can play, rest, and receive 
              the care they deserve while you're away.
            </p>
            <p>
              Founded by Komal, PETEL offers professional pet care services including boarding, 
              daycare, grooming, and transportation. We're available 24/7 to ensure your pet 
              gets the attention they need, whenever they need it.
            </p>
            <Link to="/about" className="btn btn-primary">Learn More About Us</Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section services-preview">
        <div className="container">
          <h2 className="section-title">Our <span>Services</span></h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏠</div>
              <h3>Pet Boarding</h3>
              <p>Comfortable and safe overnight stays with personalized care</p>
            </div>
            <div className="service-card">
              <div className="service-icon">☀️</div>
              <h3>Daycare</h3>
              <p>Fun-filled days with supervised play and socialization</p>
            </div>
            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>Grooming</h3>
              <p>Professional grooming services to keep your pet looking great</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚗</div>
              <h3>Pick-up & Drop</h3>
              <p>Convenient transportation services for your pet</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/services" className="btn btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title">What Pet Parents <span>Say</span></h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="rating">
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p className="review">"{testimonial.review}"</p>
                <p className="customer-name">
                  - {testimonial.customer_name}
                  {testimonial.pet_name && ` (${testimonial.pet_name}'s parent)`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className={`faq-question ${faqOpen === index ? 'active' : ''}`}
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                >
                  {faq.question}
                  <span className="faq-icon">{faqOpen === index ? '−' : '+'}</span>
                </button>
                {faqOpen === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Book Your Pet's Stay?</h2>
          <p>Contact us today and give your pet the care they deserve!</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Book Now</Link>
            <a href={`tel:${CONTACT_INFO.phone}`} className="btn btn-secondary">Call {CONTACT_INFO.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
