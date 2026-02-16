import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import './Admin.css'

// Configure axios to send JWT token with requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('admin_token')
  })
  const [password, setPassword] = useState('')
  const [appointments, setAppointments] = useState([])
  const [contacts, setContacts] = useState([])
  const [pricing, setPricing] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeTab, setActiveTab] = useState('appointments')

  useEffect(() => {
    if (isLoggedIn) {
      fetchAppointments()
      fetchContacts()
      fetchPricing()
      const interval = setInterval(() => {
        fetchAppointments()
        fetchContacts()
      }, 20000) // Poll every 20 seconds
      return () => clearInterval(interval)
    }
  }, [isLoggedIn, searchTerm, statusFilter])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login.php`, { password })
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token)
        setIsLoggedIn(true)
        setMessage({ type: 'success', text: 'Login successful' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid password' })
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await axios.get(`${API_BASE_URL}/admin/appointments.php?${params}`)
      if (response.data.success) {
        setAppointments(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/contacts.php`)
      if (response.data.success) {
        setContacts(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      if (error.response?.status === 401) {
        // Token expired, logout
        setIsLoggedIn(false)
        localStorage.removeItem('admin_token')
        setMessage({ type: 'error', text: 'Session expired. Please login again.' })
      }
    }
  }

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

  const updateAppointment = async (id, updates) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/appointments.php`, { id, ...updates })
      setMessage({ type: 'success', text: 'Appointment updated' })
      fetchAppointments()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update appointment' })
    }
  }

  const deleteAppointment = async (id) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/appointments.php`, { data: { id } })
      setMessage({ type: 'success', text: 'Appointment deleted' })
      fetchAppointments()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete appointment' })
    }
  }

  const deleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/contacts.php`, { data: { id } })
      setMessage({ type: 'success', text: 'Contact deleted' })
      fetchContacts()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete contact' })
    }
  }

  const updatePrice = async (id, price) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/pricing.php`, { id, price })
      setMessage({ type: 'success', text: 'Price updated' })
      fetchPricing()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update price' })
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {message.text && (
              <div className={`message ${message.type}`}>{message.text}</div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>PETEL Admin Dashboard</h1>
        <button onClick={() => {
          setIsLoggedIn(false)
          localStorage.removeItem('admin_token')
        }} className="btn btn-secondary">Logout</button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments ({appointments.length})
        </button>
        <button 
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contact Messages ({contacts.length})
          {contacts.length > 0 && <span className="notification-badge">{contacts.length}</span>}
        </button>
        <button 
          className={`tab ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing Management
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {activeTab === 'appointments' && (
        <div className="appointments-section">
          <div className="filters">
            <input
              type="text"
              placeholder="Search by name, email, phone, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="appointments-list">
            {appointments.map((apt) => (
              <div key={apt.id} className="appointment-card">
                <div className="apt-header">
                  <h3>{apt.booking_id}</h3>
                  <span className={`status-badge ${apt.status}`}>{apt.status}</span>
                </div>
                
                <div className="apt-details">
                  <div className="detail-row">
                    <strong>Customer:</strong> {apt.customer_name}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {apt.phone}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {apt.email}
                  </div>
                  <div className="detail-row">
                    <strong>Pet:</strong> {apt.pet_name} ({apt.pet_type})
                  </div>
                  {apt.breed && (
                    <div className="detail-row">
                      <strong>Breed:</strong> {apt.breed}
                    </div>
                  )}
                  <div className="detail-row">
                    <strong>Service:</strong> {apt.service}
                  </div>
                  <div className="detail-row">
                    <strong>Price/Day:</strong> ₹{apt.price_per_day}
                  </div>
                  <div className="detail-row">
                    <strong>Check-in:</strong> {apt.booking_date} at {apt.time_slot}
                  </div>
                  <div className="detail-row">
                    <strong>Expected Pickup:</strong> {new Date(apt.pickup_datetime).toLocaleString()}
                  </div>
                  <div className="detail-row">
                    <strong>Payment:</strong> {apt.payment_method} ({apt.payment_status})
                  </div>
                  {apt.late_days > 0 && (
                    <div className="detail-row late-info">
                      <strong>Late Days:</strong> {apt.late_days} days
                      <strong>Late Charges:</strong> ₹{apt.late_charges}
                    </div>
                  )}
                  {apt.notes && (
                    <div className="detail-row">
                      <strong>Notes:</strong> {apt.notes}
                    </div>
                  )}
                </div>

                <div className="apt-actions">
                  <select
                    value={apt.status}
                    onChange={(e) => updateAppointment(apt.id, { status: e.target.value })}
                    className="action-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={apt.payment_status}
                    onChange={(e) => updateAppointment(apt.id, { payment_status: e.target.value })}
                    className="action-select"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>

                  <button
                    onClick={() => {
                      const datetime = prompt('Enter actual pickup datetime (YYYY-MM-DD HH:MM:SS):')
                      if (datetime) {
                        updateAppointment(apt.id, { actual_pickup_datetime: datetime })
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Mark Pickup
                  </button>

                  <button
                    onClick={() => deleteAppointment(apt.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="no-data">No appointments found</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="contacts-section">
          <h2>Contact Messages</h2>
          <div className="contacts-list">
            {contacts.map((contact) => (
              <div key={contact.id} className="contact-card">
                <div className="contact-header">
                  <h3>{contact.name}</h3>
                  <span className="contact-date">{new Date(contact.created_at).toLocaleString()}</span>
                </div>
                
                <div className="contact-details">
                  <div className="detail-row">
                    <strong>Email:</strong> {contact.email}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {contact.phone}
                  </div>
                  <div className="detail-row message-row">
                    <strong>Message:</strong>
                    <p>{contact.message}</p>
                  </div>
                </div>

                <div className="contact-actions">
                  <a href={`tel:${contact.phone}`} className="btn btn-primary">
                    📞 Call
                  </a>
                  <a href={`mailto:${contact.email}`} className="btn btn-secondary">
                    📧 Email
                  </a>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {contacts.length === 0 && (
              <div className="no-data">No contact messages</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="pricing-section">
          <h2>Manage Pricing</h2>
          <div className="pricing-list">
            {pricing.map((item) => (
              <div key={item.id} className="pricing-item">
                <div className="pricing-info">
                  <h3>{item.package_name}</h3>
                  <p>{item.pet_type} - {item.duration}</p>
                </div>
                <div className="pricing-edit">
                  <span className="price-label">₹</span>
                  <input
                    type="number"
                    defaultValue={item.price}
                    onBlur={(e) => {
                      const newPrice = parseFloat(e.target.value)
                      if (newPrice !== item.price && newPrice > 0) {
                        updatePrice(item.id, newPrice)
                      }
                    }}
                    className="price-input"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
