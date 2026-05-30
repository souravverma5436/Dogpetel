const Appointment = require('../models/Appointment');
const {
  sendAppointmentNotification,
  sendCustomerConfirmation,
  sendStatusUpdateEmail
} = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');

// POST /api/appointments - Book appointment
// MongoDB-first with email fallback
const bookAppointment = async (req, res) => {
  const {
    customer_name, email, phone, pet_name, pet_type, breed, age,
    service, price_per_day, booking_date, time_slot, pickup_datetime,
    notes, payment_method
  } = req.body;

  const bookingId = 'PETEL' + uuidv4().replace(/-/g,'').substring(0,8).toUpperCase();
  let dbSaved = false;
  let aptData = {
    bookingId, customerName: customer_name, email, phone,
    petName: pet_name, petType: pet_type || 'Dog', breed, age,
    service, pricePerDay: price_per_day,
    bookingDate: booking_date, timeSlot: time_slot,
    pickupDatetime: pickup_datetime, notes,
    paymentMethod: payment_method || 'cash'
  };

  // Step 1: Try saving to MongoDB
  try {
    const appointment = await Appointment.create(aptData);
    dbSaved = true;
    aptData = appointment;
    console.log(`✅ Appointment saved to MongoDB: ${appointment.bookingId}`);
  } catch (dbErr) {
    console.error('❌ MongoDB save failed for appointment:', dbErr.message);
  }

  // Step 2: Send emails (always, regardless of DB status)
  console.log(`📧 Sending appointment emails - Admin: ${process.env.ADMIN_EMAIL || 'NOT SET'}, Customer: ${aptData.email}`);
  try {
    const adminSent = await sendAppointmentNotification(aptData, !dbSaved);
    console.log(`📧 Admin appointment email: ${adminSent ? 'SENT' : 'FAILED'}`);
    const customerSent = await sendCustomerConfirmation(aptData);
    console.log(`📧 Customer confirmation email: ${customerSent ? 'SENT' : 'FAILED'}`);
  } catch (err) {
    console.error('📧 Appointment email exception:', err.message);
  }

  // Step 3: Always return success to user
  res.status(201).json({
    success: true,
    booking_id: aptData.bookingId,
    message: `Appointment booked successfully! Booking ID: ${aptData.bookingId}. Check your email for confirmation.`,
    saved: dbSaved
  });
};

// GET /api/admin/appointments
const getAppointments = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } }
      ];
    }
    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    const data = appointments.map(a => ({
      id: a._id,
      booking_id: a.bookingId,
      customer_name: a.customerName,
      email: a.email,
      phone: a.phone,
      pet_name: a.petName,
      pet_type: a.petType,
      breed: a.breed,
      age: a.age,
      service: a.service,
      price_per_day: a.pricePerDay,
      booking_date: a.bookingDate,
      time_slot: a.timeSlot,
      pickup_datetime: a.pickupDatetime,
      notes: a.notes,
      payment_method: a.paymentMethod,
      payment_status: a.paymentStatus,
      status: a.status,
      actual_pickup_datetime: a.actualPickup,
      late_days: a.lateDays,
      late_charges: a.lateCharges,
      created_at: a.createdAt
    }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// PUT /api/admin/appointments/:id - Update + send status email
const updateAppointment = async (req, res) => {
  try {
    const { status, payment_status, actual_pickup_datetime } = req.body;
    const update = {};
    if (status) update.status = status;
    if (payment_status) update.paymentStatus = payment_status;
    if (actual_pickup_datetime) update.actualPickup = actual_pickup_datetime;

    const apt = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });

    // Send status update email to customer if status changed
    if (status && apt && ['confirmed', 'cancelled', 'completed'].includes(status)) {
      sendStatusUpdateEmail(apt, status).catch(err =>
        console.error('Status email failed:', err.message)
      );
    }

    res.json({ success: true, message: 'Appointment updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// DELETE /api/admin/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

module.exports = { bookAppointment, getAppointments, updateAppointment, deleteAppointment };
