import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL, CONTACT_INFO } from '../config'
import './Gallery.css'

function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery.php`)
      console.log('Gallery API Response:', response.data)
      if (response.data.success) {
        setImages(response.data.data || [])
      } else {
        console.error('Gallery API returned success: false')
        setImages([])
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      console.error('Error details:', error.response?.data)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (image) => {
    setSelectedImage(image)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  return (
    <div className="gallery-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our Gallery</h1>
          <p>Happy moments with our furry friends</p>
          <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="instagram-link">
            📷 Follow us on Instagram @petel_a_doghotel
          </a>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading">Loading gallery...</div>
          ) : images.length === 0 ? (
            <div className="no-images">
              <p>No images yet. Check back soon!</p>
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                📷 Follow us on Instagram
              </a>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((image) => (
                <div key={image.id} className="gallery-item" onClick={() => openLightbox(image)}>
                  <img src={image.image_url} alt={image.title || 'Gallery image'} />
                  {image.title && <div className="image-title">{image.title}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeLightbox}>&times;</button>
            <img src={selectedImage.image_url} alt={selectedImage.title || 'Gallery image'} />
            {selectedImage.title && <h3>{selectedImage.title}</h3>}
            {selectedImage.description && <p>{selectedImage.description}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
