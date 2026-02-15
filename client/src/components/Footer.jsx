import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../config'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PETEL</h3>
            <p>Your Dog's Home Away From Home</p>
            <p className="footer-tagline">Professional pet care services available 24/7</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>📞 {CONTACT_INFO.phoneDisplay}</p>
            <p>📧 {CONTACT_INFO.email}</p>
            <p>🕐 {CONTACT_INFO.availability}</p>
          </div>

          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href={`tel:${CONTACT_INFO.phone}`} className="social-btn">📞 Call</a>
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="social-btn">💬 WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PETEL - A Pet Hotel. All rights reserved.</p>
          <p>Founded by Komal</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
