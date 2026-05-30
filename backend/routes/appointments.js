const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {
  bookAppointment, getAppointments, updateAppointment, deleteAppointment
} = require('../controllers/appointmentController');

// POST /api/appointments - Public: book appointment
router.post('/',
  [
    body('customer_name').trim().notEmpty().withMessage('Customer name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('pet_name').trim().notEmpty().withMessage('Pet name is required'),
    body('service').trim().notEmpty().withMessage('Service is required'),
    body('price_per_day').isNumeric().withMessage('Price per day must be a number'),
    body('booking_date').notEmpty().withMessage('Booking date is required'),
    body('time_slot').notEmpty().withMessage('Time slot is required'),
    body('pickup_datetime').notEmpty().withMessage('Pickup datetime is required'),
  ],
  validate,
  bookAppointment
);

// GET /api/admin/appointments - Admin: get all appointments
router.get('/admin', auth, getAppointments);

// PUT /api/admin/appointments/:id - Admin: update appointment
router.put('/admin/:id', auth, updateAppointment);

// DELETE /api/admin/appointments/:id - Admin: delete appointment
router.delete('/admin/:id', auth, deleteAppointment);

module.exports = router;
