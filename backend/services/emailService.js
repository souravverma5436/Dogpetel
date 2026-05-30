// Email Service - Uses EmailJS REST API (works on Render - no SMTP needed)
// EmailJS sends via HTTP, not SMTP, so it's never blocked by hosting providers

let dbStatus = 'connected';
const setDbStatus = (status) => { dbStatus = status; };
const getDbStatus = () => dbStatus;

const EMAILJS_SERVICE_ID  = 'service_jylmpym';
const EMAILJS_PUBLIC_KEY  = '7Xigree0oJJUpQ51q';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || 'fJ4NRz6jf0eAtvF_uXPPP';
const ADMIN_EMAIL         = process.env.ADMIN_EMAIL || 'petelpethotel@gmail.com';

// Send via EmailJS REST API
const sendViaEmailJS = async (templateId, templateParams) => {
  console.log(`📧 EmailJS call: service=${EMAILJS_SERVICE_ID}, template=${templateId}, key=${EMAILJS_PUBLIC_KEY.substring(0,6)}...`);

  try {
    const payload = {
      service_id:      EMAILJS_SERVICE_ID,
      template_id:     templateId,
      user_id:         EMAILJS_PUBLIC_KEY,
      template_params: templateParams
    };

    if (EMAILJS_PRIVATE_KEY) {
      payload.accessToken = EMAILJS_PRIVATE_KEY;
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`✅ EmailJS sent via template: ${templateId}`);
      return true;
    } else {
      const text = await response.text();
      console.error(`❌ EmailJS failed (${response.status}): ${text}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ EmailJS error: ${err.message}`);
    return false;
  }
};

// Contact notification to admin
const sendContactNotification = async (contact, dbFailed = false) => {
  console.log(`📧 Sending contact notification for: ${contact.name}`);
  return sendViaEmailJS('template_wcdhd06', {
    name:        contact.name,
    email:       contact.email,
    phone:       contact.phone,
    message:     dbFailed
      ? `⚠️ WARNING: NOT SAVED TO DATABASE\n\n${contact.message}`
      : contact.message,
    date:        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    to_email:    ADMIN_EMAIL,
    reply_to:    contact.email,
    subject:     dbFailed
      ? `⚠️ DB FAILED - Contact from ${contact.name}`
      : `New Contact from ${contact.name}`
  });
};

// Appointment notification to admin
const sendAppointmentNotification = async (apt, dbFailed = false) => {
  console.log(`📧 Sending appointment notification: ${apt.bookingId}`);
  return sendViaEmailJS('template_r5yrr8w', {
    owner_name:      apt.customerName,
    from_name:       apt.customerName,
    from_email:      apt.email,
    phone:           apt.phone,
    pet_name:        apt.petName,
    pet_type:        apt.petType,
    breed:           apt.breed || 'Not specified',
    service:         apt.service,
    price_per_day:   `₹${apt.pricePerDay}`,
    booking_date:    apt.bookingDate,
    time_slot:       apt.timeSlot,
    pickup_datetime: apt.pickupDatetime,
    payment_method:  apt.paymentMethod,
    notes:           apt.notes || 'None',
    booking_id:      apt.bookingId || 'N/A',
    to_email:        ADMIN_EMAIL,
    reply_to:        apt.email,
    message:         dbFailed
      ? `⚠️ WARNING: NOT SAVED TO DATABASE\nBooking ID: ${apt.bookingId}`
      : `Booking ID: ${apt.bookingId}`
  });
};

// Customer confirmation - reuse contact template with different content
const sendCustomerConfirmation = async (apt) => {
  if (!apt.email) return false;
  console.log(`📧 Sending customer confirmation to: ${apt.email}`);
  return sendViaEmailJS('template_wcdhd06', {
    name:        'PETEL Pet Hotel',
    email:       ADMIN_EMAIL,
    phone:       '+91 82838 83463',
    date:        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    to_email:    apt.email,
    reply_to:    ADMIN_EMAIL,
    subject:     `✅ Booking Confirmed - ${apt.bookingId}`,
    message:     `Dear ${apt.customerName},\n\nYour booking is confirmed!\n\nBooking ID: ${apt.bookingId}\nPet: ${apt.petName}\nService: ${apt.service}\nCheck-in: ${apt.bookingDate} at ${apt.timeSlot}\nPickup: ${apt.pickupDatetime}\nPrice: ₹${apt.pricePerDay}/day\n\nFor queries call: +91 82838 83463\n\nThank you,\nPETEL Pet Hotel`
  });
};

// Status update email to customer
const sendStatusUpdateEmail = async (apt, newStatus) => {
  if (!apt.email) return false;
  console.log(`📧 Sending status update (${newStatus}) to: ${apt.email}`);
  return sendViaEmailJS('template_wcdhd06', {
    name:        'PETEL Pet Hotel',
    email:       ADMIN_EMAIL,
    date:        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    to_email:    apt.email,
    reply_to:    ADMIN_EMAIL,
    subject:     `Appointment ${newStatus} - ${apt.bookingId}`,
    message:     `Dear ${apt.customerName},\n\nYour appointment status has been updated to: ${newStatus.toUpperCase()}\n\nBooking ID: ${apt.bookingId}\nPet: ${apt.petName}\n\nFor queries call: +91 82838 83463\n\nPETEL Pet Hotel`
  });
};

// DB warning email
const sendDbWarningEmail = async (error) => {
  return sendViaEmailJS('template_wcdhd06', {
    name:        'PETEL System',
    email:       ADMIN_EMAIL,
    date:        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    to_email:    ADMIN_EMAIL,
    reply_to:    ADMIN_EMAIL,
    subject:     '🚨 MongoDB Connection Issue',
    message:     `Database connection error:\n${error}\n\nTime: ${new Date().toISOString()}`
  });
};

module.exports = {
  sendContactNotification,
  sendAppointmentNotification,
  sendCustomerConfirmation,
  sendStatusUpdateEmail,
  sendDbWarningEmail,
  setDbStatus,
  getDbStatus
};
