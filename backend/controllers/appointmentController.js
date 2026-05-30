const Appointment = require('../models/Appointment');
const { sendAppointmentNotification } = require('../services/emailService');

// POST /api/appointments - Book appointment
const bookAppointment = async (req, res) => {
  try {
    const {
      customer_name, email, phone, pet_name, pet_type, breed, age,
      service, price_per_day, booking_date, time_slot, pickup_datetime,
      notes, payment_method
    } = req.body;

    const appointment = await Appointment.create({
      customerName: customer_name,
      email, phone,
      petName: pet_name,
      petType: pet_type || 'Dog',
      breed, age, service,
      pricePerDay: price_per_day,
      bookingDate: booking_date,
      timeSlot: time_slot,
      pickupDatetime: pickup_datetime,
      notes,
      paymentMethod: payment_method || 'cash'
    });

    // Send email notification (non-blocking)
    sendAppointmentNotification(appointment).catch(console.error);

    res.status(201).json({
      success: true,
      booking_id: appointment.bookingId,
      message: `Appointment booked successfully! Booking ID: ${appointment.bookingId}`
    });
  } catch (err) {
    console.error('Appointment booking error:', err);
    res.status(500).json({ error: 'Failed to book appointment. Please try again.' });
  }
};

// GET /api/admin/appointments - Get all appointments (admin)
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

    // Map to match frontend expected field names
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

// PUT /api/admin/appointments/:id - Update appointment (admin)
const updateAppointment = async (req, res) => {
  try {
    const { status, payment_status, actual_pickup_datetime } = req.body;
    const update = {};
    if (status) update.status = status;
    if (payment_status) update.paymentStatus = payment_status;
    if (actual_pickup_datetime) update.actualPickup = actual_pickup_datetime;

    await Appointment.findByIdAndUpdate(req.params.id, update);
    res.json({ success: true, message: 'Appointment updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// DELETE /api/admin/appointments/:id - Delete appointment (admin)
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

module.exports = { bookAppointment, getAppointments, updateAppointment, deleteAppointment };
