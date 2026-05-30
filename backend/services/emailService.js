const nodemailer = require('nodemailer');

let dbStatus = 'connected'; // track DB status for email subjects

const setDbStatus = (status) => { dbStatus = status; };
const getDbStatus = () => dbStatus;

const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
  });
};

const sendEmail = async (options) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email not configured - skipping notification');
    return false;
  }
  try {
    await transporter.sendMail(options);
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

// Contact notification to admin
const sendContactNotification = async (contact, dbFailed = false) => {
  const subject = dbFailed
    ? `⚠️ WARNING: MongoDB Save Failed - Contact from ${contact.name}`
    : `📩 New Contact Message from ${contact.name} - PETEL`;

  return sendEmail({
    from: `"PETEL Website" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        ${dbFailed ? '<div style="background:#ff4444;color:white;padding:12px;border-radius:5px;margin-bottom:15px;"><strong>⚠️ WARNING: This message was NOT saved to database. Please save manually.</strong></div>' : ''}
        <h2 style="color:#0B1F3B;border-bottom:2px solid #0B1F3B;padding-bottom:10px;">New Contact - PETEL Pet Hotel</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Name:</td><td style="padding:8px;">${contact.name}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Email:</td><td style="padding:8px;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Phone:</td><td style="padding:8px;"><a href="tel:${contact.phone}">${contact.phone}</a></td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;vertical-align:top;">Message:</td><td style="padding:8px;">${contact.message}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:20px;">Received: ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</p>
      </div>`
  });
};

// Appointment notification to admin
const sendAppointmentNotification = async (apt, dbFailed = false) => {
  const subject = dbFailed
    ? `⚠️ WARNING: Booking Received But Database Save Failed - ${apt.bookingId || 'NO-ID'}`
    : `🐾 New Appointment Booking - ${apt.bookingId} - PETEL`;

  return sendEmail({
    from: `"PETEL Website" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        ${dbFailed ? '<div style="background:#ff4444;color:white;padding:12px;border-radius:5px;margin-bottom:15px;"><strong>⚠️ WARNING: This booking was NOT saved to database. Please record manually.</strong></div>' : ''}
        <h2 style="color:#0B1F3B;border-bottom:2px solid #0B1F3B;padding-bottom:10px;">New Appointment - PETEL Pet Hotel</h2>
        <div style="background:#e8f4fd;padding:10px;border-radius:5px;margin-bottom:15px;"><strong>Booking ID: ${apt.bookingId || 'N/A'}</strong></div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Customer:</td><td style="padding:8px;">${apt.customerName}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Phone:</td><td style="padding:8px;">${apt.phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Email:</td><td style="padding:8px;">${apt.email}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Pet:</td><td style="padding:8px;">${apt.petName} (${apt.petType})</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Service:</td><td style="padding:8px;">${apt.service} - ₹${apt.pricePerDay}/day</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Check-in:</td><td style="padding:8px;">${apt.bookingDate} at ${apt.timeSlot}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Pickup:</td><td style="padding:8px;">${apt.pickupDatetime}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Payment:</td><td style="padding:8px;">${apt.paymentMethod}</td></tr>
          ${apt.notes ? `<tr><td style="padding:8px;font-weight:bold;color:#555;">Notes:</td><td style="padding:8px;">${apt.notes}</td></tr>` : ''}
        </table>
        <p style="color:#888;font-size:12px;margin-top:20px;">Booked: ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</p>
      </div>`
  });
};

// Confirmation email to customer
const sendCustomerConfirmation = async (apt) => {
  if (!apt.email) return false;
  return sendEmail({
    from: `"PETEL Pet Hotel" <${process.env.GMAIL_USER}>`,
    to: apt.email,
    subject: `✅ Booking Confirmed - ${apt.bookingId} - PETEL Pet Hotel`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#0B1F3B;">Your Booking is Confirmed! 🐾</h2>
        <p>Dear ${apt.customerName},</p>
        <p>Thank you for choosing PETEL Pet Hotel. Your booking has been received.</p>
        <div style="background:#e8f4fd;padding:15px;border-radius:8px;margin:20px 0;">
          <h3 style="margin:0 0 10px;color:#0B1F3B;">Booking Details</h3>
          <p><strong>Booking ID:</strong> ${apt.bookingId}</p>
          <p><strong>Pet:</strong> ${apt.petName}</p>
          <p><strong>Service:</strong> ${apt.service}</p>
          <p><strong>Check-in:</strong> ${apt.bookingDate} at ${apt.timeSlot}</p>
          <p><strong>Expected Pickup:</strong> ${apt.pickupDatetime}</p>
          <p><strong>Price:</strong> ₹${apt.pricePerDay}/day</p>
        </div>
        <p>We will confirm your booking shortly. For any queries, call us at <strong>+91 82838 83463</strong>.</p>
        <p style="color:#888;font-size:12px;">PETEL - A Pet Hotel | Available 24/7</p>
      </div>`
  });
};

// Status update email to customer
const sendStatusUpdateEmail = async (apt, newStatus) => {
  if (!apt.email) return false;
  const statusMessages = {
    confirmed:  { emoji: '✅', text: 'Your appointment has been confirmed!', color: '#4CAF50' },
    cancelled:  { emoji: '❌', text: 'Your appointment has been cancelled.', color: '#f44336' },
    completed:  { emoji: '🎉', text: 'Your appointment is marked as completed. Thank you!', color: '#2196F3' },
  };
  const info = statusMessages[newStatus] || { emoji: '📋', text: `Status updated to: ${newStatus}`, color: '#0B1F3B' };

  return sendEmail({
    from: `"PETEL Pet Hotel" <${process.env.GMAIL_USER}>`,
    to: apt.email,
    subject: `${info.emoji} Appointment ${newStatus.charAt(0).toUpperCase()+newStatus.slice(1)} - ${apt.bookingId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:${info.color};">${info.emoji} ${info.text}</h2>
        <p>Dear ${apt.customerName},</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:20px 0;">
          <p><strong>Booking ID:</strong> ${apt.bookingId}</p>
          <p><strong>Pet:</strong> ${apt.petName}</p>
          <p><strong>Service:</strong> ${apt.service}</p>
          <p><strong>New Status:</strong> <span style="color:${info.color};font-weight:bold;">${newStatus.toUpperCase()}</span></p>
        </div>
        <p>For queries, call <strong>+91 82838 83463</strong>.</p>
        <p style="color:#888;font-size:12px;">PETEL - A Pet Hotel</p>
      </div>`
  });
};

// DB warning email to admin
const sendDbWarningEmail = async (error) => {
  return sendEmail({
    from: `"PETEL System" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject: '🚨 PETEL: MongoDB Connection Issue Detected',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#f44336;">🚨 Database Connection Warning</h2>
        <p>MongoDB Atlas connection issue detected on PETEL backend.</p>
        <div style="background:#fff3cd;padding:15px;border-radius:8px;border:1px solid #ffc107;">
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</p>
        </div>
        <p>The website is still operational. Contact forms and bookings will be sent via email.</p>
        <p>Please check MongoDB Atlas dashboard immediately.</p>
      </div>`
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
