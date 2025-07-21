document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const path = window.location.pathname;

    const targetPaths = [
        '/shop',
        '/about',
        '/contact',
        /^\/item\/\d+$/,
        '/search-results.html',
        '/cart'
    ];

    const matchesTarget = targetPaths.some((route) =>
        typeof route === 'string' ? route === path : route.test(path)
    );

    if (matchesTarget) {
        let headerToUse = '/header.html';

        if (token && user && user.role_id === 2) {
            headerToUse = '/header-user.html';
        }

        // Load header into a container like <div id="header-container"></div>
        fetch(headerToUse)
            .then(res => res.text())
            .then(html => {
                document.getElementById('header-placeholder').innerHTML = html;
            })
            .catch(err => console.error('Error loading header:', err));
    }
});
