const mongoose = require('mongoose');
const { setDbStatus, sendDbWarningEmail } = require('../services/emailService');

let warningEmailSent = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    setDbStatus('connected');
    warningEmailSent = false;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    setDbStatus('disconnected');
    if (!warningEmailSent) {
      warningEmailSent = true;
      sendDbWarningEmail(error.message).catch(() => {});
    }
    // Don't exit - let the app run with email fallback
    console.log('⚠️  Running in degraded mode - email fallback active');
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.error('❌ MongoDB disconnected');
  setDbStatus('disconnected');
  if (!warningEmailSent) {
    warningEmailSent = true;
    sendDbWarningEmail('MongoDB connection lost').catch(() => {});
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
  setDbStatus('connected');
  warningEmailSent = false;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
  setDbStatus('error');
});

module.exports = connectDB;
