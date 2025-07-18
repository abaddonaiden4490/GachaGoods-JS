(function () {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');

    // Pages that guests can access freely
    const publicPages = ['/', '/login', '/register', '/forbidden', '/about', '/contact', '/shop', ];

    // If not logged in
    if (!token || !user) {
        if (!publicPages.includes(window.location.pathname)) {
            // Redirect guest trying to access protected page
            window.location.href = '/login';
        }
        return; // Guest browsing allowed page
    }

    // Parse user object
    const userObj = JSON.parse(user);

    // Redirect based on role if needed
    const path = window.location.pathname;

    if (userObj.role_id === 1 && path.startsWith('/user')) {
        window.location.href = '/admin-dashboard';
    } else if (userObj.role_id !== 1 && path.startsWith('/admin')) {
        window.location.href = '/forbidden';
    }

    // Optional: Token expiration check (if your JWT includes exp)
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