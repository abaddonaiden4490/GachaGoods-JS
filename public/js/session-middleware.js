(function () {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    const path = window.location.pathname;

    // Pages that guests can access freely
    const publicPages = [
        '/', '/login', '/register', '/forbidden',
        '/about.html', '/contact.html', '/shop.html'
    ];

    // Admin-only pages (role_id = 1)
    const adminPages = [
        '/admin-dashboard.html',
        '/total-sales.html',
        '/manage/categories',
        '/manage/products',
        '/manage/types',
        '/manage/users'
    ];

    // User-only pages (role_id = 2)
    const userPages = [
        '/user-home.html'
    ];

    // If not logged in
    if (!token || !user) {
        if (!publicPages.includes(path)) {
            window.location.href = '/login';
        }
        return;
    }

    // Parse user object
    let userObj;
    try {
        userObj = JSON.parse(user);
    } catch {
        localStorage.clear();
        return window.location.href = '/login';
    }

    // Role-based page restriction
    if (adminPages.includes(path) && userObj.role_id !== 1) {
        return window.location.href = '/forbidden';
    }
    if (userPages.includes(path) && userObj.role_id !== 2) {
        return window.location.href = '/admin-dashboard';
    }

    // Token expiration check
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && now > payload.exp) {
            localStorage.clear();
            window.location.href = '/login?expired=1';
        }
    } catch (err) {
        console.error('Invalid token format.');
        localStorage.clear();
        window.location.href = '/login';
    }
})();
