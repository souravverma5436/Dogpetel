import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import emailjs from '@emailjs/browser'
import SplashScreen from './components/SplashScreen'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import { API_BASE_URL, EMAILJS_CONFIG } from './config'

// Initialize EmailJS once at app startup
if (EMAILJS_CONFIG.publicKey) {
  emailjs.init(EMAILJS_CONFIG.publicKey)
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    // Wake up the Render backend (free tier sleeps after inactivity)
    axios.get(`${API_BASE_URL}/test`).catch(() => {})

    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown')
    
    if (splashShown) {
      setShowSplash(false)
      setAppReady(true)
    } else {
      // Mark splash as shown for this session
      sessionStorage.setItem('splashShown', 'true')
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setAppReady(true)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (!appReady) {
    return null
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
