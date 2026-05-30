const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

const sendContactNotification = async (contact) => {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"PETEL Website" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject: `📩 New Contact Message from ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0B1F3B; border-bottom: 2px solid #0B1F3B; padding-bottom: 10px;">
            New Contact Message - PETEL
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 8px;">${contact.name}</td></tr>
            <tr style="background: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px;"><a href="tel:${contact.phone}">${contact.phone}</a></td></tr>
            <tr style="background: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                <td style="padding: 8px;">${contact.message}</td></tr>
          </table>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      `
    });
    console.log('Contact notification email sent');
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

const sendAppointmentNotification = async (apt) => {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"PETEL Website" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject: `🐾 New Appointment Booking - ${apt.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0B1F3B; border-bottom: 2px solid #0B1F3B; padding-bottom: 10px;">
            New Appointment - PETEL Pet Hotel
          </h2>
          <div style="background: #e8f4fd; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
            <strong>Booking ID: ${apt.bookingId}</strong>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Customer:</td>
                <td style="padding: 8px;">${apt.customerName}</td></tr>
            <tr style="background: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px;">${apt.phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px;">${apt.email}</td></tr>
            <tr style="background: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555;">Pet:</td>
                <td style="padding: 8px;">${apt.petName} (${apt.petType})</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Service:</td>
                <td style="padding: 8px;">${apt.service} - ₹${apt.pricePerDay}/day</td></tr>
            <tr style="background: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555;">Check-in:</td>
                <td style="padding: 8px;">${apt.bookingDate} at ${apt.timeSlot}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #555;">Pickup:</td>
                <td style="padding: 8px;">${apt.pickupDatetime}</td></tr>
            <tr style="background: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; color: #555;">Payment:</td>
                <td style="padding: 8px;">${apt.paymentMethod}</td></tr>
            ${apt.notes ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Notes:</td>
                <td style="padding: 8px;">${apt.notes}</td></tr>` : ''}
          </table>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            Booked at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      `
    });
    console.log('Appointment notification email sent');
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

module.exports = { sendContactNotification, sendAppointmentNotification };
