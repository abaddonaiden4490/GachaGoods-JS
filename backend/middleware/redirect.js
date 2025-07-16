function roleRedirect(req, res, next) {
    const user = req.user;

    if (!user || !user.role_id) {
        return res.status(401).json({ error: 'Unauthorized: No user role found' });
    }

    let redirectUrl;
    switch (user.role_id) {
        case 1:
            redirectUrl = '/admin-dashboard';
            break;
        case 2:
            redirectUrl = '/user-home';
            break;
        default:
            return res.status(403).json({ error: 'Forbidden: Unknown role' });
    }

    // ✅ Send as JSON so jQuery can read it and redirect on the client
    return res.json({ redirectUrl });
}

        module.exports = roleRedirect;
