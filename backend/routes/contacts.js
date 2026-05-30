const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { submitContact, getContacts, deleteContact } = require('../controllers/contactController');

// POST /api/contacts - Public: submit contact form
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  submitContact
);

// GET /api/admin/contacts - Admin: get all contacts
router.get('/admin', auth, getContacts);

// DELETE /api/admin/contacts/:id - Admin: delete contact
router.delete('/admin/:id', auth, deleteContact);

module.exports = router;
