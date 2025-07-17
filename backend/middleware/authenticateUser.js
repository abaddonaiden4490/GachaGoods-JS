const jwt = require('jsonwebtoken');
const db = require('../db'); // adjust path if needed
const secretKey = process.env.JWT_SECRET;

module.exports = async function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer token"

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        // Optional but secure: check if the token is still in DB
        const [rows] = await db.query(
            'SELECT * FROM users WHERE id = ? AND auth_token = ?',
            [decoded.id, token]
        );

        if (!rows.length) {
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
        }

        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(403).json({ error: 'Forbidden: Failed to authenticate token' });
    }
};
