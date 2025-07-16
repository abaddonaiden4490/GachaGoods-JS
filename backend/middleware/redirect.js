function roleRedirect(req, res, next) {
    const user = req.user; // This assumes you have a middleware that attaches the user info to req.user

    if (!user || !user.role_id) {
        return res.status(401).json({ error: 'Unauthorized: No user role found' });
    }

    switch (user.role_id) {
        case 1:
            return res.redirect('/admin-dashboard.html');
        case 2:
            return res.redirect('/user-home.html');
        default:
            return res.status(403).json({ error: 'Forbidden: Unknown role' });
    }
}

module.exports = roleRedirect;
