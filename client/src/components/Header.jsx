import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CONTACT_INFO } from '../config'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="PETEL Logo" className="logo-img" />
            <div className="logo-text">
              <h1>PETEL</h1>
              <p>A Pet Hotel</p>
            </div>
          </Link>

          <nav className={`nav ${menuOpen ? 'active' : ''}`}>
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/services" className={isActive('/services') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Services</Link>
            <Link to="/pricing" className={isActive('/pricing') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link to="/gallery" className={isActive('/gallery') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Gallery</Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/admin" className={`admin-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>🔐 Admin</Link>
          </nav>

          <div className="header-actions">
            <a href={`tel:${CONTACT_INFO.phone}`} className="btn btn-primary">
              📞 Call Now
            </a>
            <div className="availability-badge">24/7</div>
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
