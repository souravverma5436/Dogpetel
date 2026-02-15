import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../config'
import './About.css'

function About() {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1>About PETEL</h1>
          <p>Your Dog's Home Away From Home</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-content-grid">
            <div className="about-text">
              <h2>Welcome to PETEL - A Pet Hotel</h2>
              <p>
                At PETEL, we believe that every pet deserves the best care possible. 
                We understand that your furry friend is not just a pet, but a beloved 
                member of your family. That's why we've created a safe, comfortable, 
                and loving environment where your dog can thrive while you're away.
              </p>
              <p>
                Our mission is simple: to provide professional, compassionate pet care 
                services that give you peace of mind and give your pet a home away from home. 
                Whether it's boarding, daycare, grooming, or transportation, we treat every 
                pet with the love and attention they deserve.
              </p>
            </div>
            <div className="about-image">
              <div className="about-placeholder">🐕</div>
            </div>
          </div>
        </div>
      </section>

      <section className="founder-section">
        <div className="container">
          <div className="founder-content">
            <div className="founder-image">
              <div className="founder-placeholder">👩</div>
            </div>
            <div className="founder-text">
              <h2>Founded by Komal</h2>
              <p>
                PETEL was founded by Komal, a passionate animal lover with years of 
                experience in pet care. Growing up surrounded by dogs, Komal developed 
                a deep understanding of their needs, behaviors, and the special bond 
                between pets and their owners.
              </p>
              <p>
                Recognizing the need for reliable, professional pet care services in 
                the community, Komal established PETEL with a vision to create a place 
                where pets receive the same love and attention they get at home. Under 
                Komal's leadership, PETEL has become a trusted name in pet care, known 
                for its dedication to animal welfare and customer satisfaction.
              </p>
              <p>
                "Every pet that comes through our doors is treated like family. That's 
                not just our promise – it's our passion." - Komal
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our <span>Values</span></h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Love & Care</h3>
              <p>We treat every pet with genuine love and compassion</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Safety First</h3>
              <p>Your pet's safety and well-being are our top priorities</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Excellence</h3>
              <p>We strive for excellence in every aspect of pet care</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Trust</h3>
              <p>Building lasting relationships based on trust and reliability</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-petel">
        <div className="container">
          <h2 className="section-title">Why Choose <span>PETEL?</span></h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="check">✓</span>
              <div>
                <h3>24/7 Availability</h3>
                <p>We're always here when you need us, day or night</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <div>
                <h3>Experienced Staff</h3>
                <p>Our team is trained and passionate about animal care</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <div>
                <h3>Clean & Safe Facilities</h3>
                <p>Regularly sanitized spaces designed for pet comfort</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <div>
                <h3>Regular Updates</h3>
                <p>Stay connected with photos and updates about your pet</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <div>
                <h3>Affordable Pricing</h3>
                <p>Quality care at competitive rates with transparent pricing</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="check">✓</span>
              <div>
                <h3>Personalized Care</h3>
                <p>Every pet receives individual attention based on their needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Experience the PETEL Difference</h2>
          <p>Contact us today at {CONTACT_INFO.phoneDisplay} or book an appointment online</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Book Appointment</Link>
            <a href={`tel:${CONTACT_INFO.phone}`} className="btn btn-secondary">Call Now</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
