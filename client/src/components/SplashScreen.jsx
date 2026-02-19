import { useEffect, useState } from 'react'
import './SplashScreen.css'

function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = prefersReducedMotion ? 500 : 2000

    // Start fade out animation
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, duration)

    // Complete and remove splash screen
    const completeTimer = setTimeout(() => {
      onComplete()
    }, duration + 500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <img src="/logo.png" alt="PETEL Logo" className="splash-logo" />
        <h1 className="splash-title">PETEL</h1>
        <p className="splash-subtitle">Your Dog's Home Away From Home</p>
        <div className="splash-loader">
          <div className="paw-loader">
            <span className="paw">🐾</span>
            <span className="paw">🐾</span>
            <span className="paw">🐾</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
