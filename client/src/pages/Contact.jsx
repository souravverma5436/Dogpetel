import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL, CONTACT_INFO } from '../config'
import './Contact.css'

function Contact() {
  const [activeTab, setActiveTab] = useState('contact')
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // Appointment Form State
  const [appointmentForm, setAppointmentForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    pet_name: '',
    pet_type: 'Dog',
    breed: '',
    age: '',
    service: '',
    price_per_day: 0,
    booking_date: '',
    time_slot: '',
    pickup_datetime: '',
    notes: '',
    payment_method: 'cash',
    terms_agreed: false
  })

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
    }
  }

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM'
  ]

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await axios.post(`${API_BASE_URL}/contacts.php`, contactForm)
      setMessage({ type: 'success', text: response.data.message })
      setContactForm({ name: '', email: '', phone: '', message: '' })
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to send message' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (!appointmentForm.terms_agreed) {
      setMessage({ type: 'error', text: 'Please agree to terms and conditions' })
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/appointments.php`, appointmentForm)
      setMessage({ 
        type: 'success', 
        text: `Booking confirmed! Your booking ID is ${response.data.booking_id}. Check your email for details.` 
      })
      // Reset form
      setAppointmentForm({
        customer_name: '',
        email: '',
        phone: '',
        pet_name: '',
        pet_type: 'Dog',
        breed: '',
        age: '',
        service: '',
        price_per_day: 0,
        booking_date: '',
        time_slot: '',
        pickup_datetime: '',
        notes: '',
        payment_method: 'cash',
        terms_agreed: false
      })
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to book appointment' })
    } finally {
      setLoading(false)
    }
  }

  const handleServiceChange = (e) => {
    const selectedService = e.target.value
    const priceItem = pricing.find(p => p.service_name === selectedService)
    setAppointmentForm({
      ...appointmentForm,
      service: selectedService,
      price_per_day: priceItem ? priceItem.price : 0
    })
  }

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch or book an appointment</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-info-cards">
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Phone</h3>
              <p>{CONTACT_INFO.phoneDisplay}</p>
              <a href={`tel:${CONTACT_INFO.phone}`} className="btn btn-primary">Call Now</a>
            </div>
            <div className="info-card">
              <div className="info-icon">💬</div>
              <h3>WhatsApp</h3>
              <p>Chat with us anytime</p>
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Open WhatsApp
              </a>
            </div>
            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3>Availability</h3>
              <p>{CONTACT_INFO.availability}</p>
              <p className="highlight">Always here for you!</p>
            </div>
          </div>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Form
            </button>
            <button 
              className={`tab ${activeTab === 'appointment' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointment')}
            >
              Book Appointment
            </button>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'contact' && (
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <h2>Send us a Message</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows="5"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}

          {activeTab === 'appointment' && (
            <form className="appointment-form" onSubmit={handleAppointmentSubmit}>
              <h2>Book an Appointment</h2>
              
              <div className="form-section">
                <h3>Customer Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      required
                      value={appointmentForm.customer_name}
                      onChange={(e) => setAppointmentForm({...appointmentForm, customer_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={appointmentForm.email}
                      onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      required
                      value={appointmentForm.phone}
                      onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Pet Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Pet Name *</label>
                    <input
                      type="text"
                      required
                      value={appointmentForm.pet_name}
                      onChange={(e) => setAppointmentForm({...appointmentForm, pet_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pet Type *</label>
                    <select
                      required
                      value={appointmentForm.pet_type}
                      onChange={(e) => setAppointmentForm({...appointmentForm, pet_type: e.target.value})}
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Breed</label>
                    <input
                      type="text"
                      value={appointmentForm.breed}
                      onChange={(e) => setAppointmentForm({...appointmentForm, breed: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="text"
                      placeholder="e.g., 2 years"
                      value={appointmentForm.age}
                      onChange={(e) => setAppointmentForm({...appointmentForm, age: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Service & Schedule</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Service *</label>
                    <select
                      required
                      value={appointmentForm.service}
                      onChange={handleServiceChange}
                    >
                      <option value="">Select Service</option>
                      {pricing.map((item) => (
                        <option key={item.id} value={item.service_name}>
                          {item.service_name} - ₹{item.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={appointmentForm.booking_date}
                      onChange={(e) => setAppointmentForm({...appointmentForm, booking_date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-in Time *</label>
                    <select
                      required
                      value={appointmentForm.time_slot}
                      onChange={(e) => setAppointmentForm({...appointmentForm, time_slot: e.target.value})}
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Expected Pickup Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={appointmentForm.pickup_datetime}
                      onChange={(e) => setAppointmentForm({...appointmentForm, pickup_datetime: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Any special requirements or information about your pet..."
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={appointmentForm.payment_method === 'cash'}
                      onChange={(e) => setAppointmentForm({...appointmentForm, payment_method: e.target.value})}
                    />
                    <span>Cash at Pickup</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={appointmentForm.payment_method === 'online'}
                      onChange={(e) => setAppointmentForm({...appointmentForm, payment_method: e.target.value})}
                    />
                    <span>Online Payment (Razorpay)</span>
                  </label>
                </div>
                {appointmentForm.payment_method === 'online' && (
                  <div className="payment-note">
                    <p>Note: Online payment integration will be processed after booking confirmation.</p>
                  </div>
                )}
              </div>

              <div className="terms-section">
                <h3>Terms & Conditions</h3>
                <div className="terms-box">
                  <p><strong>1.</strong> If your pet faces any health issue during stay, we will inform you immediately.</p>
                  <p><strong>2.</strong> If you notice any issue after pickup, contact us immediately.</p>
                  <p><strong>3.</strong> <strong>Late Pickup Policy:</strong> If you do not pick up your pet on the fixed pickup date/time selected, an extra day charge will be added.</p>
                  <p><strong>Penalty Rule:</strong> Extra day charge = ₹{appointmentForm.price_per_day || '___'} per day (same as selected package daily price)</p>
                </div>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    required
                    checked={appointmentForm.terms_agreed}
                    onChange={(e) => setAppointmentForm({...appointmentForm, terms_agreed: e.target.checked})}
                  />
                  <span>I agree to PETEL terms & late pickup policy *</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

export default Contact
