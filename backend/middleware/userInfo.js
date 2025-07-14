// routes/userInfo.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/user-info', async (req, res) => {
    const token = req.cookies?.auth_token || req.headers['authorization'];

    if (!token) return res.json({ role_id: null });

    try {
        const [rows] = await db.query('SELECT role_id FROM users WHERE auth_token = ?', [token]);

        if (rows.length === 0) return res.json({ role_id: null });

        res.json({ role_id: rows[0].role_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
