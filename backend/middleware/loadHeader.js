const path = require('path');

module.exports = function (req, res, next) {
    // Default header for non-logged in users
    let headerFile = 'header.html';

    if (req.user) {
        if (req.user.role_id === 1) {
            headerFile = 'header-admin.html';
        } else if (req.user.role_id === 2) {
            headerFile = 'header-user.html';
        }
    }

    // Set the resolved header path to be accessible in your route/view
    res.locals.headerPath = path.join(__dirname, '..', 'public', 'partials', headerFile);
    next();
};
