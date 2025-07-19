document.addEventListener('DOMContentLoaded', function () {
    (function () {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');
        const path = window.location.pathname;

        // ✅ Debug Logs
        console.log('[Session Middleware] Path:', path);
        console.log('[Session Middleware] Token exists:', !!token);
        console.log('[Session Middleware] User exists:', !!user);

        // Pages that guests can access freely
        const publicPages = ['/', '/login', '/register', '/forbidden', '/about', '/contact', '/shop'];

        // Admin-only pages (role_id = 1)
        const adminPages = [
            '/admin-dashboard',
            '/total-sales',
            '/manage/categories',
            '/manage/products',
            '/manage/types',
            '/manage/users'
        ];

        // User-only pages (role_id = 2)
        const userPages = ['/user-home'];

        // Guest trying to access restricted page
        if (!token || !user) {
            if (!publicPages.includes(path)) {
                return window.location.href = '/login';
            }
            return;
        }

        // Parse stored user
        let userObj;
        try {
            userObj = JSON.parse(user);
        } catch {
            console.warn('[Session Middleware] Invalid user object, clearing storage.');
            localStorage.clear();
            return window.location.href = '/login';
        }

        // Role-based access restriction
        if (adminPages.includes(path) && userObj.role_id !== 1) {
            console.warn('[Session Middleware] Non-admin trying to access admin page.');
            return window.location.href = '/forbidden';
        }

        if (userPages.includes(path) && userObj.role_id !== 2) {
            console.warn('[Session Middleware] Non-user trying to access user page.');
            return window.location.href = '/admin-dashboard';
        }

        // Token expiration check
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && now > payload.exp) {
                console.warn('[Session Middleware] Token expired.');
                localStorage.clear();
                window.location.href = '/login?expired=1';
            }
        } catch (err) {
            console.error('[Session Middleware] Invalid token format.', err);
            localStorage.clear();
            window.location.href = '/login';
        }
    })();
});
