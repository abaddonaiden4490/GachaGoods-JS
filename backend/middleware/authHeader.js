// middleware/authHeader.js
const db = require('../db'); // adjust this to your db connection

async function authHeader(req, res, next) {
    try {
        const token = req.cookies?.auth_token || req.headers['authorization'];

        if (!token) {
            res.locals.headerFile = 'header.html';
            return next();
        }

        const [rows] = await db.query('SELECT role_id FROM users WHERE auth_token = ?', [token]);

        if (!rows.length) {
            res.locals.headerFile = 'header.html';
        } else {
            const roleId = rows[0].role_id;
            if (roleId === 1) {
                res.locals.headerFile = 'header-admin.html';
            } else if (roleId === 2) {
                res.locals.headerFile = 'header-user.html';
            } else {
                res.locals.headerFile = 'header.html';
            }
        }

        next();
    } catch (err) {
        console.error('Header Middleware Error:', err);
        res.locals.headerFile = 'header.html';
        next();
    }
}

module.exports = authHeader;
