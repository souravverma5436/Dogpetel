const ContactMessage = require('../models/ContactMessage');
const { sendContactNotification } = require('../services/emailService');

// POST /api/contacts - Submit contact form
// MongoDB-first with email fallback
const submitContact = async (req, res) => {
  const { name, email, phone, message } = req.body;
  let dbSaved = false;
  let savedContact = { name, email, phone, message };

  // Step 1: Try saving to MongoDB
  try {
    const contact = await ContactMessage.create({ name, email, phone, message });
    dbSaved = true;
    savedContact = contact;
    console.log(`✅ Contact saved to MongoDB: ${contact._id}`);
  } catch (dbErr) {
    console.error('❌ MongoDB save failed for contact:', dbErr.message);
  }

  // Step 2: Send email notification (always, regardless of DB status)
  sendContactNotification(savedContact, !dbSaved).catch(err =>
    console.error('Email notification failed:', err.message)
  );

  // Step 3: Always return success to user
  res.status(201).json({
    success: true,
    message: `Thank you for contacting us! We will get back to you soon at ${phone}`,
    saved: dbSaved
  });
};

// GET /api/admin/contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// DELETE /api/admin/contacts/:id
const deleteContact = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

module.exports = { submitContact, getContacts, deleteContact };
