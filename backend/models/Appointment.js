const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const appointmentSchema = new mongoose.Schema({
  bookingId:       { type: String, default: () => 'PETEL' + uuidv4().replace(/-/g,'').substring(0,8).toUpperCase(), unique: true },
  customerName:    { type: String, required: true, trim: true },
  email:           { type: String, required: true, trim: true, lowercase: true },
  phone:           { type: String, required: true, trim: true },
  petName:         { type: String, required: true, trim: true },
  petType:         { type: String, required: true, default: 'Dog' },
  breed:           { type: String, trim: true },
  age:             { type: String, trim: true },
  service:         { type: String, required: true },
  pricePerDay:     { type: Number, required: true },
  bookingDate:     { type: String, required: true },
  timeSlot:        { type: String, required: true },
  pickupDatetime:  { type: String, required: true },
  notes:           { type: String, trim: true },
  paymentMethod:   { type: String, enum: ['cash', 'online'], default: 'cash' },
  paymentStatus:   { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  status:          { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  actualPickup:    { type: String },
  lateDays:        { type: Number, default: 0 },
  lateCharges:     { type: Number, default: 0 },
  createdAt:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
