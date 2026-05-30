import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import './Admin.css'

// Attach JWT to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function Admin() {
  const [isLoggedIn, setIsLoggedIn]   = useState(() => !!localStorage.getItem('admin_token'))
  const [password, setPassword]       = useState('')
  const [appointments, setAppointments] = useState([])
  const [contacts, setContacts]       = useState([])
  const [pricing, setPricing]         = useState([])
  const [gallery, setGallery]         = useState([])
  const [searchTerm, setSearchTerm]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading]         = useState(false)
  const [message, setMessage]         = useState({ type: '', text: '' })
  const [activeTab, setActiveTab]     = useState('appointments')
  const [newImage, setNewImage]       = useState({ image_url: '', title: '', description: '' })

  useEffect(() => {
    if (isLoggedIn) {
      fetchAll()
      const interval = setInterval(fetchAll, 20000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn, searchTerm, statusFilter])

  const fetchAll = () => {
    fetchAppointments()
    fetchContacts()
    fetchPricing()
    fetchGallery()
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

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      const response = await axios.get(`${API_BASE_URL}/admin/appointments?${params}`)
      if (response.data.success) setAppointments(response.data.data)
    } catch (error) {
      if (error.response?.status === 401) handleLogout()
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/contacts`)
      if (response.data.success) setContacts(response.data.data)
    } catch (error) {
      if (error.response?.status === 401) handleLogout()
    }
  }

  const fetchPricing = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/pricing`)
      if (response.data.success) setPricing(response.data.data)
    } catch (error) {
      console.error('Error fetching pricing:', error)
    }
  }

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/gallery`)
      if (response.data.success) setGallery(response.data.data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('admin_token')
    setMessage({ type: 'error', text: 'Session expired. Please login again.' })
  }

  const updateAppointment = async (id, updates) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/appointments/${id}`, updates)
      setMessage({ type: 'success', text: 'Appointment updated' })
      fetchAppointments()
    } catch {
      setMessage({ type: 'error', text: 'Failed to update appointment' })
    }
  }

  const deleteAppointment = async (id) => {
    if (!confirm('Delete this appointment?')) return
    try {
      await axios.delete(`${API_BASE_URL}/admin/appointments/${id}`)
      setMessage({ type: 'success', text: 'Appointment deleted' })
      fetchAppointments()
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete appointment' })
    }
  }

  const deleteContact = async (id) => {
    if (!confirm('Delete this contact message?')) return
    try {
      await axios.delete(`${API_BASE_URL}/admin/contacts/${id}`)
      setMessage({ type: 'success', text: 'Contact deleted' })
      fetchContacts()
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete contact' })
    }
  }

  const updatePrice = async (id, price) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/pricing/${id}`, { price })
      setMessage({ type: 'success', text: 'Price updated' })
      fetchPricing()
    } catch {
      setMessage({ type: 'error', text: 'Failed to update price' })
    }
  }

  const addImage = async (e) => {
    e.preventDefault()
    if (!newImage.image_url) {
      setMessage({ type: 'error', text: 'Image URL is required' })
      return
    }
    try {
      await axios.post(`${API_BASE_URL}/admin/gallery`, newImage)
      setMessage({ type: 'success', text: 'Image added to gallery' })
      setNewImage({ image_url: '', title: '', description: '' })
      fetchGallery()
    } catch {
      setMessage({ type: 'error', text: 'Failed to add image' })
    }
  }

  const toggleImageStatus = async (id, currentStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/gallery/${id}`, { is_active: !currentStatus })
      setMessage({ type: 'success', text: 'Image status updated' })
      fetchGallery()
    } catch {
      setMessage({ type: 'error', text: 'Failed to update image' })
    }
  }

  const deleteImage = async (id) => {
    if (!confirm('Delete this image?')) return
    try {
      await axios.delete(`${API_BASE_URL}/admin/gallery/${id}`)
      setMessage({ type: 'success', text: 'Image deleted' })
      fetchGallery()
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete image' })
    }
  }

  // Login screen
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
                autoComplete="new-password"
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
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>

      <div className="admin-tabs">
        {['appointments', 'contacts', 'pricing', 'gallery'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'appointments' && `Appointments (${appointments.length})`}
            {tab === 'contacts' && <>Contact Messages ({contacts.length}){contacts.length > 0 && <span className="notification-badge">{contacts.length}</span>}</>}
            {tab === 'pricing' && 'Pricing Management'}
            {tab === 'gallery' && `Gallery (${gallery.length})`}
          </button>
        ))}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {/* APPOINTMENTS */}
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

      {/* CONTACTS */}
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
                  <div className="detail-row message-row">
                    <strong>Message:</strong>
                    <p>{contact.message}</p>
                  </div>
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

      {/* PRICING */}
      {activeTab === 'pricing' && (
        <div className="pricing-section">
          <h2>Manage Pricing</h2>
          <div className="pricing-list">
            {pricing.map((item) => (
              <div key={item._id || item.id} className="pricing-item">
                <div className="pricing-info">
                  <h3>{item.packageName || item.package_name}</h3>
                  <p>{item.petType || item.pet_type} - {item.duration}</p>
                </div>
                <div className="pricing-edit">
                  <span className="price-label">₹</span>
                  <input
                    type="number"
                    defaultValue={item.price}
                    onBlur={(e) => {
                      const newPrice = parseFloat(e.target.value)
                      if (newPrice !== item.price && newPrice > 0) {
                        updatePrice(item._id || item.id, newPrice)
                      }
                    }}
                    className="price-input"
                  />
                </div>
              </div>
            ))}
            {pricing.length === 0 && <div className="no-data">No pricing data</div>}
          </div>
        </div>
      )}

      {/* GALLERY */}
      {activeTab === 'gallery' && (
        <div className="gallery-section">
          <h2>Gallery Management</h2>
          <div className="add-image-form">
            <h3>Add New Image</h3>
            <form onSubmit={addImage}>
              <div className="form-group">
                <label>Image URL *</label>
                <input type="url" placeholder="https://example.com/image.jpg" value={newImage.image_url} onChange={(e) => setNewImage({...newImage, image_url: e.target.value})} required />
                <small>Upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer">Imgur</a> and paste URL</small>
              </div>
              <div className="form-group">
                <label>Title (Optional)</label>
                <input type="text" placeholder="Happy pets at PETEL" value={newImage.title} onChange={(e) => setNewImage({...newImage, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea placeholder="Description..." value={newImage.description} onChange={(e) => setNewImage({...newImage, description: e.target.value})} rows="3"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Add Image</button>
            </form>
          </div>

          <div className="gallery-list">
            <h3>Current Gallery Images ({gallery.length})</h3>
            {gallery.length === 0 ? (
              <div className="no-data">No images in gallery yet</div>
            ) : (
              <div className="gallery-grid-admin">
                {gallery.map((image) => (
                  <div key={image._id || image.id} className={`gallery-card ${!(image.isActive ?? image.is_active) ? 'inactive' : ''}`}>
                    <img src={image.imageUrl || image.image_url} alt={image.title || 'Gallery image'} />
                    <div className="gallery-card-info">
                      <h4>{image.title || 'Untitled'}</h4>
                      {image.description && <p>{image.description}</p>}
                      <div className="gallery-card-actions">
                        <button onClick={() => toggleImageStatus(image._id || image.id, image.isActive ?? image.is_active)} className={`btn ${(image.isActive ?? image.is_active) ? 'btn-secondary' : 'btn-primary'}`}>
                          {(image.isActive ?? image.is_active) ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => deleteImage(image._id || image.id)} className="btn btn-danger">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
