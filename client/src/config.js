// API Base URL - local dev uses the PHP server; production can override with VITE_API_BASE_URL.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:8000/api' : 'https://dogpetel.onrender.com/api');

export const CONTACT_INFO = {
  phone: '+918283883463',
  phoneDisplay: '+91 82838 83463',
  whatsapp: 'https://wa.me/918283883463',
  email: 'komal@petel.com',
  availability: '24/7 Available',
  instagram: 'https://www.instagram.com/petel_a_doghotel'
};

export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID'; // Will be fetched from backend
