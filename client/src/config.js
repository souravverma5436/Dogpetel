// API Base URL - automatically uses environment variable in production
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const CONTACT_INFO = {
  phone: '+918283883463',
  phoneDisplay: '+91 82838 83463',
  whatsapp: 'https://wa.me/918283883463',
  email: 'komal@petel.com',
  availability: '24/7 Available'
};

export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID'; // Will be fetched from backend
