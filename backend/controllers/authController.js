const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'komal123';

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign(
    { admin: true, iat: Date.now() },
    process.env.JWT_SECRET || 'petel_secret_key',
    { expiresIn: '7d' }
  );

  res.json({ success: true, message: 'Login successful', token });
};

module.exports = { login };
