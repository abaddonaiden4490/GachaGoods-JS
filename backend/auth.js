const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./db');
require('dotenv').config();

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Allow login by email or username
    let userRows;
    if (email) {
      [userRows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    } else if (username) {
      [userRows] = await db.promise().query('SELECT * FROM users WHERE name = ?', [username]);
    } else {
      return res.status(400).json({ message: 'Missing email or username' });
    }

    if (!userRows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userRows[0];

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token (not JWT, just random string for now)
    const token = crypto.randomBytes(32).toString('hex');

    // Save token to auth_token column
    await db.promise().query('UPDATE users SET auth_token = ? WHERE id = ?', [token, user.id]);

    // Return token and user info (omit password)
    const { password: _, ...userInfo } = user;
    return res.json({ message: 'Login successful', token, user: userInfo });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
