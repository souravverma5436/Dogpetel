import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import './Admin.css'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function Admin() {
  const [isLoggedIn, setIsLoggedIn]     = useState(() => !!localStorage.getItem('admin_token'))
  const [password, setPassword]         = useState('')
  const [appointments, setAppointments] = useState([])
  const [contacts, setContacts]         = useState([])
  const [pricing, setPricing]           = useState([])
  const [searchTerm, setSearchTerm]     = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading]           = useState(false)
  const [message, setMessage]           = useState({ type: '', text: '' })
  const [activeTab, setActiveTab]       = useState('appointments')
  const [health, setHealth]             = useState(null)
  const [editingPrices, setEditingPrices] = useState({})

  useEffect(() => {
    if (isLoggedIn) {
      fetchAll()
      fetchHealth()
      const interval = setInterval(() => { fetchAll(); fetchHealth(); }, 30000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn, searchTerm, statusFilter])

  const fetchAll = () => {
    fetchAppointments()
    fetchContacts()
    fetchPricing()
  }

  const fetchHealth = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/system/health`)
      setHealth(res.data)
    } catch { setHealth(null) }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, { password })
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token)
        setIsLoggedIn(true)
        setMessage({ type: 'success', text: 'Login successful' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Invalid password' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('admin_token')
  }

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      const res = await axios.get(`${API_BASE_URL}/admin/appointments?${params}`)
      if (res.data.success) setAppointments(res.data.data)
    } catch (err) {
      if (err.response?.status === 401) handleLogout()
    }
  }

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/contacts`)
      if (res.data.success) setContacts(res.data.data)
    } catch (err) {
      if (err.response?.status === 401) handleLogout()
    }
  }

  const fetchPricing = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/pricing`)
      if (res.data.success) {
        setPricing(res.data.data)
        // Initialize editing prices
        const prices = {}
        res.data.data.forEach(item => { prices[item._id] = item.price })
        setEditingPrices(prices)
      }
    } catch (err) { console.error('Error fetching pricing:', err) }
  }

  const updateAppointment = async (id, updates) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/appointments/${id}`, updates)
      showMsg('success', 'Appointment updated' + (updates.status ? ` - Customer notified via email` : ''))
      fetchAppointments()
    } catch { showMsg('error', 'Failed to update appointment') }
  }

  const deleteAppointment = async (id) => {
    if (!confirm('Delete this appointment?')) return
    try {
      await axios.delete(`${API_BASE_URL}/admin/appointments/${id}`)
      showMsg('success', 'Appointment deleted')
      fetchAppointments()
    } catch { showMsg('error', 'Failed to delete appointment') }
  }

  const deleteContact = async (id) => {
    if (!confirm('Delete this contact message?')) return
    try {
      await axios.delete(`${API_BASE_URL}/admin/contacts/${id}`)
      showMsg('success', 'Contact deleted')
      fetchContacts()
    } catch { showMsg('error', 'Failed to delete contact') }
  }

  const savePrice = async (id) => {
    const newPrice = parseFloat(editingPrices[id])
    if (!newPrice || newPrice <= 0) return showMsg('error', 'Invalid price')
    try {
      await axios.put(`${API_BASE_URL}/admin/pricing/${id}`, { price: newPrice })
      showMsg('success', 'Price updated successfully!')
      fetchPricing()
    } catch { showMsg('error', 'Failed to update price') }
  }

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 4000)
  }

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
            </div>
            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>PETEL Admin Dashboard</h1>
          {health && (
            <div style={{ display:'flex', gap:'12px', marginTop:'8px', flexWrap:'wrap' }}>
              <span style={{ fontSize:'13px', padding:'4px 10px', borderRadius:'20px', background: health.database==='connected' ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)', color: health.database==='connected' ? '#4CAF50' : '#f44336', border: `1px solid ${health.database==='connected' ? '#4CAF50' : '#f44336'}` }}>
                🗄️ DB: {health.database}
              </span>
              <span style={{ fontSize:'13px', padding:'4px 10px', borderRadius:'20px', background:'rgba(33,150,243,0.2)', color:'#2196F3', border:'1px solid #2196F3' }}>
                📧 Email: {health.email}
              </span>
              <span style={{ fontSize:'13px', padding:'4px 10px', borderRadius:'20px', background:'rgba(76,175,80,0.2)', color:'#4CAF50', border:'1px solid #4CAF50' }}>
                🚀 Server: {health.server}
              </span>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>

      <div className="admin-tabs">
        {['appointments', 'contacts', 'pricing'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'appointments' && `Appointments (${appointments.length})`}
            {tab === 'contacts' && <>Contact Messages ({contacts.length}){contacts.length > 0 && <span className="notification-badge">{contacts.length}</span>}</>}
            {tab === 'pricing' && 'Pricing Management'}
          </button>
        ))}
      </div>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {/* ── APPOINTMENTS ── */}
      {activeTab === 'appointments' && (
        <div className="appointments-section">
          <div className="filters">
            <input type="text" placeholder="Search by name, email, phone, or booking ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="appointments-list">
            {appointments.map((apt) => (
              <div key={apt.id || apt._id} className="appointment-card">
                <div className="apt-header">
                  <h3>{apt.booking_id}</h3>
                  <span className={`status-badge ${apt.status}`}>{apt.status}</span>
                </div>
                <div className="apt-details">
                  <div className="detail-row"><strong>Customer:</strong> {apt.customer_name}</div>
                  <div className="detail-row"><strong>Phone:</strong> {apt.phone}</div>
                  <div className="detail-row"><strong>Email:</strong> {apt.email}</div>
                  <div className="detail-row"><strong>Pet:</strong> {apt.pet_name} ({apt.pet_type})</div>
                  {apt.breed && <div className="detail-row"><strong>Breed:</strong> {apt.breed}</div>}
                  <div className="detail-row"><strong>Service:</strong> {apt.service}</div>
                  <div className="detail-row"><strong>Price/Day:</strong> ₹{apt.price_per_day}</div>
                  <div className="detail-row"><strong>Check-in:</strong> {apt.booking_date} at {apt.time_slot}</div>
                  <div className="detail-row"><strong>Pickup:</strong> {apt.pickup_datetime}</div>
                  <div className="detail-row"><strong>Payment:</strong> {apt.payment_method} ({apt.payment_status})</div>
                  {apt.notes && <div className="detail-row"><strong>Notes:</strong> {apt.notes}</div>}
                </div>
                <div className="apt-actions">
                  <select value={apt.status} onChange={(e) => updateAppointment(apt.id || apt._id, { status: e.target.value })} className="action-select">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select value={apt.payment_status} onChange={(e) => updateAppointment(apt.id || apt._id, { payment_status: e.target.value })} className="action-select">
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                  <button onClick={() => deleteAppointment(apt.id || apt._id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))}
            {appointments.length === 0 && <div className="no-data">No appointments found</div>}
          </div>
        </div>
      )}

      {/* ── CONTACTS ── */}
      {activeTab === 'contacts' && (
        <div className="contacts-section">
          <h2>Contact Messages</h2>
          <div className="contacts-list">
            {contacts.map((contact) => (
              <div key={contact._id || contact.id} className="contact-card">
                <div className="contact-header">
                  <h3>{contact.name}</h3>
                  <span className="contact-date">{new Date(contact.createdAt || contact.created_at).toLocaleString()}</span>
                </div>
                <div className="contact-details">
                  <div className="detail-row"><strong>Email:</strong> {contact.email}</div>
                  <div className="detail-row"><strong>Phone:</strong> {contact.phone}</div>
                  <div className="detail-row message-row"><strong>Message:</strong><p>{contact.message}</p></div>
                </div>
                <div className="contact-actions">
                  <a href={`tel:${contact.phone}`} className="btn btn-primary">📞 Call</a>
                  <a href={`mailto:${contact.email}`} className="btn btn-secondary">📧 Email</a>
                  <button onClick={() => deleteContact(contact._id || contact.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))}
            {contacts.length === 0 && <div className="no-data">No contact messages</div>}
          </div>
        </div>
      )}

      {/* ── PRICING ── */}
      {activeTab === 'pricing' && (
        <div className="pricing-section">
          <h2>Manage Pricing</h2>
          <p style={{ color:'rgba(255,255,255,0.7)', marginBottom:'20px', fontSize:'14px' }}>
            Edit prices below and click Save to update. Changes reflect immediately on the website.
          </p>
          <div className="pricing-list">
            {pricing.map((item) => (
              <div key={item._id || item.id} className="pricing-item">
                <div className="pricing-info">
                  <h3>{item.packageName || item.package_name}</h3>
                  <p>{item.petType || item.pet_type} — {item.duration}</p>
                </div>
                <div className="pricing-edit" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span className="price-label">₹</span>
                  <input
                    type="number"
                    value={editingPrices[item._id] ?? item.price}
                    onChange={(e) => setEditingPrices(prev => ({ ...prev, [item._id]: e.target.value }))}
                    className="price-input"
                    min="1"
                  />
                  <button
                    onClick={() => savePrice(item._id)}
                    className="btn btn-primary"
                    style={{ padding:'8px 16px', fontSize:'13px', whiteSpace:'nowrap' }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
            {pricing.length === 0 && <div className="no-data">No pricing data. <a href={`${API_BASE_URL}/seed`} target="_blank" rel="noopener noreferrer" style={{color:'#4fc3f7'}}>Run seed</a></div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
