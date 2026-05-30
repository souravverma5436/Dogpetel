const ContactMessage = require('../models/ContactMessage');
const { sendContactNotification } = require('../services/emailService');

// POST /api/contacts - Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const contact = await ContactMessage.create({ name, email, phone, message });

    // Send email notification (non-blocking)
    sendContactNotification(contact).catch(console.error);

    res.status(201).json({
      success: true,
      message: `Thank you for contacting us! We will get back to you soon at ${phone}`
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
};

// GET /api/admin/contacts - Get all contacts (admin)
const getContacts = async (req, res) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// DELETE /api/admin/contacts/:id - Delete contact (admin)
const deleteContact = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

module.exports = { submitContact, getContacts, deleteContact };
