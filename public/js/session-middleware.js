document.addEventListener('DOMContentLoaded', function () {
    (function () {
        const normalize = (path) => path.replace(/\/+$/, '') || '/';
        const path = normalize(window.location.pathname);

        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');

        console.log('[Session Middleware] Path:', path);
        console.log('[Session Middleware] Token exists:', !!token);
        console.log('[Session Middleware] User exists:', !!user);

        const publicPages = ['/', '/login', '/register', '/forbidden', '/about', '/contact', '/shop'].map(normalize);
        const adminPages = ['/admin-dashboard', '/total-sales', '/manage/categories', '/manage/products', '/manage/types', '/manage/users'].map(normalize);
        const userPages = ['/user-home', '/cart', '/order/:id'].map(normalize);
        const guestOnlyPages = ['/', '/login', '/register'].map(normalize);

        // 🚫 Guest access to protected pages
        if (!token || !user) {
            if (!publicPages.includes(path)) {
                console.warn('[Session Middleware] Guest tried to access restricted:', path);
                return window.location.href = '/login';
            }
            return;
        }

        // ✅ Parse user object
        let userObj;
        try {
            userObj = JSON.parse(user);
        } catch {
            console.warn('[Session Middleware] Invalid user object, clearing storage.');
            localStorage.clear();
            return window.location.href = '/login';
        }

        // ✅ Token expiration check FIRST
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && now > payload.exp) {
                console.warn('[Session Middleware] Token expired.');
                localStorage.clear();
                return window.location.href = '/login?expired=1';
            }
        } catch (err) {
            console.error('[Session Middleware] Invalid token format.', err);
            localStorage.clear();
            return window.location.href = '/login';
        }

        // ✅ Redirect logged-in users away from guest-only pages
        console.log('[Session Middleware] Checking guest redirect for:', path);
        console.log('[Session Middleware] guestOnlyPages includes path:', guestOnlyPages.includes(path));
        console.log('[Session Middleware] User role ID:', userObj.role_id, 'Type:', typeof userObj.role_id);
        if (guestOnlyPages.includes(path)) {
            if (parseInt(userObj.role_id) === 1) {
                return window.location.href = '/admin-dashboard';
            } else if (parseInt(userObj.role_id) === 2) {
                return window.location.href = '/user-home';
            }
        }

        // 🚫 Role-based restriction
        if (adminPages.includes(path) && userObj.role_id !== 1) {
            console.warn('[Session Middleware] Non-admin trying to access admin page.');
            return window.location.href = '/forbidden';
        }

        if (userPages.includes(path) && userObj.role_id !== 2) {
            console.warn('[Session Middleware] Non-user trying to access user page.');
            return window.location.href = '/admin-dashboard';
        }
    })();
});
