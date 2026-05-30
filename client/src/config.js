// API Base URL Configuration
const RENDER_BACKEND = 'https://dogpetel.onrender.com/api';
const LOCAL_BACKEND  = 'http://localhost:5000/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : (import.meta.env.DEV ? LOCAL_BACKEND : RENDER_BACKEND);

export const CONTACT_INFO = {
  phone:        '+918283883463',
  phoneDisplay: '+91 82838 83463',
  whatsapp:     'https://wa.me/918283883463',
  email:        'petelpethotel@gmail.com',
  availability: '24/7 Available',
  instagram:    'https://www.instagram.com/petel_a_doghotel'
};

// EmailJS Configuration (frontend fallback when backend is down)
export const EMAILJS_CONFIG = {
  serviceId:           'service_q73gazm',
  contactTemplateId:   'template_wcdhd06',
  appointmentTemplateId: 'template_r5yrr8w',
  publicKey:           import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
};

export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID';
