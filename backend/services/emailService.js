const nodemailer = require('nodemailer');

let dbStatus = 'connected';
const setDbStatus = (status) => { dbStatus = status; };
const getDbStatus = () => dbStatus;

const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
};

const sendEmail = async (options) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('⚠️ Email not configured - GMAIL_USER or GMAIL_APP_PASSWORD missing');
    return false;
  }
  try {
    const info = await transporter.sendMail(options);
    console.log(`✅ Email sent: ${info.messageId} → ${options.to}`);
    return true;
  } catch (err) {
    console.error(`❌ Email FAILED to ${options.to}: ${err.message} (code: ${err.code})`);
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
        ${dbFailed ? '<div style="background:#ff4444;color:white;padding:12px;border-radius:5px;margin-bottom:15px;"><strong>⚠️ WARNING: NOT saved to database.</strong></div>' : ''}
        <h2 style="color:#0B1F3B;border-bottom:2px solid #0B1F3B;padding-bottom:10px;">New Contact - PETEL Pet Hotel</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;">Name:</td><td style="padding:8px;">${contact.name}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone:</td><td style="padding:8px;"><a href="tel:${contact.phone}">${contact.phone}</a></td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;vertical-align:top;">Message:</td><td style="padding:8px;">${contact.message}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:20px;">Received: ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</p>
      </div>`
  });
};

// Appointment notification to admin
const sendAppointmentNotification = async (apt, dbFailed = false) => {
  const subject = dbFailed
    ? `⚠️ WARNING: Booking NOT Saved to DB - ${apt.bookingId || 'NO-ID'}`
    : `🐾 New Appointment - ${apt.bookingId} - PETEL`;

  return sendEmail({
    from: `"PETEL Website" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        ${dbFailed ? '<div style="background:#ff4444;color:white;padding:12px;border-radius:5px;margin-bottom:15px;"><strong>⚠️ WARNING: NOT saved to database.</strong></div>' : ''}
        <h2 style="color:#0B1F3B;border-bottom:2px solid #0B1F3B;padding-bottom:10px;">New Appointment - PETEL</h2>
        <div style="background:#e8f4fd;padding:10px;border-radius:5px;margin-bottom:15px;"><strong>Booking ID: ${apt.bookingId || 'N/A'}</strong></div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;">Customer:</td><td style="padding:8px;">${apt.customerName}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Phone:</td><td style="padding:8px;">${apt.phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${apt.email}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Pet:</td><td style="padding:8px;">${apt.petName} (${apt.petType})</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Service:</td><td style="padding:8px;">${apt.service} - ₹${apt.pricePerDay}/day</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Check-in:</td><td style="padding:8px;">${apt.bookingDate} at ${apt.timeSlot}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Pickup:</td><td style="padding:8px;">${apt.pickupDatetime}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Payment:</td><td style="padding:8px;">${apt.paymentMethod}</td></tr>
          ${apt.notes ? `<tr><td style="padding:8px;font-weight:bold;">Notes:</td><td style="padding:8px;">${apt.notes}</td></tr>` : ''}
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
    subject: `✅ Booking Confirmed - ${apt.bookingId} - PETEL`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#0B1F3B;">Your Booking is Confirmed! 🐾</h2>
        <p>Dear ${apt.customerName},</p>
        <p>Thank you for choosing PETEL Pet Hotel.</p>
        <div style="background:#e8f4fd;padding:15px;border-radius:8px;margin:20px 0;">
          <p><strong>Booking ID:</strong> ${apt.bookingId}</p>
          <p><strong>Pet:</strong> ${apt.petName}</p>
          <p><strong>Service:</strong> ${apt.service}</p>
          <p><strong>Check-in:</strong> ${apt.bookingDate} at ${apt.timeSlot}</p>
          <p><strong>Pickup:</strong> ${apt.pickupDatetime}</p>
          <p><strong>Price:</strong> ₹${apt.pricePerDay}/day</p>
        </div>
        <p>For queries, call <strong>+91 82838 83463</strong>.</p>
        <p style="color:#888;font-size:12px;">PETEL - A Pet Hotel | 24/7</p>
      </div>`
  });
};

// Status update email to customer
const sendStatusUpdateEmail = async (apt, newStatus) => {
  if (!apt.email) return false;
  const statusInfo = {
    confirmed: { emoji: '✅', color: '#4CAF50', text: 'Your appointment has been confirmed!' },
    cancelled:  { emoji: '❌', color: '#f44336', text: 'Your appointment has been cancelled.' },
    completed:  { emoji: '🎉', color: '#2196F3', text: 'Your appointment is completed. Thank you!' },
  };
  const info = statusInfo[newStatus] || { emoji: '📋', color: '#0B1F3B', text: `Status: ${newStatus}` };

  return sendEmail({
    from: `"PETEL Pet Hotel" <${process.env.GMAIL_USER}>`,
    to: apt.email,
    subject: `${info.emoji} Appointment ${newStatus} - ${apt.bookingId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:${info.color};">${info.emoji} ${info.text}</h2>
        <p>Dear ${apt.customerName},</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:20px 0;">
          <p><strong>Booking ID:</strong> ${apt.bookingId}</p>
          <p><strong>Pet:</strong> ${apt.petName}</p>
          <p><strong>Status:</strong> <span style="color:${info.color};font-weight:bold;">${newStatus.toUpperCase()}</span></p>
        </div>
        <p>For queries, call <strong>+91 82838 83463</strong>.</p>
      </div>`
  });
};

// DB warning email
const sendDbWarningEmail = async (error) => {
  return sendEmail({
    from: `"PETEL System" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject: '🚨 PETEL: MongoDB Connection Issue',
    html: `<h2 style="color:#f44336;">🚨 Database Warning</h2><p>Error: ${error}</p><p>Time: ${new Date().toISOString()}</p>`
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
