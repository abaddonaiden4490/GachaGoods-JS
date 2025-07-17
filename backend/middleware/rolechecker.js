module.exports = function (req, res, next) {
    // Check if the user is authenticated and is an admin
    if (!req.user || req.user.role_id !== 1) {
        // Redirect to the /forbidden route instead of sending JSON
        return res.redirect('/forbidden');
    }
    next(); // User is admin, continue to next middleware or route handler
};
