const jwt = require('jsonwebtoken');
const db = require('../db'); // make sure this uses mysql2 without /promise
const secretKey = process.env.JWT_SECRET;

module.exports = function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer token"

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(403).json({ error: 'Forbidden: Failed to authenticate token' });
    }

    // Check if user + token exists in DB (auth_token check optional)
    db.query(
        'SELECT * FROM users WHERE id = ? AND auth_token = ?',
        [decoded.id, token],
        (err, results) => {
            if (err) {
                console.error('DB error during token check:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (!results.length) {
                return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
            }

            req.user = decoded; // Attach user info to request
            next();
        }
    );
};
