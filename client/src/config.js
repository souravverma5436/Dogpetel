// API Base URL Configuration
// - Local dev: uses localhost:8000 (PHP server)
// - Production (Vercel): uses Render backend
// - Can be overridden by VITE_API_BASE_URL environment variable

const RENDER_BACKEND = 'https://dogpetel.onrender.com/api';
const LOCAL_BACKEND = 'http://localhost:8000/api';

// In production build (Vercel), import.meta.env.DEV is false
// So it will always use RENDER_BACKEND unless VITE_API_BASE_URL is explicitly set
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : (import.meta.env.DEV ? LOCAL_BACKEND : RENDER_BACKEND);

export const CONTACT_INFO = {
  phone: '+918283883463',
  phoneDisplay: '+91 82838 83463',
  whatsapp: 'https://wa.me/918283883463',
  email: 'komal@petel.com',
  availability: '24/7 Available',
  instagram: 'https://www.instagram.com/petel_a_doghotel'
};

export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID';
