const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./db'); // your DB connection
require('dotenv').config();

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find user by email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Step 2: Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 3: Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        status_id: user.status_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Step 4: Save token to auth_token column
    await db.query('UPDATE users SET auth_token = ? WHERE id = ?', [token, user.id]);

    // Step 5: Return token
    return res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
