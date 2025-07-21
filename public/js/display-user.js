document.addEventListener('DOMContentLoaded', function () {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    let user;
    try {
        user = JSON.parse(userStr);
    } catch (err) {
        console.warn('[User Display] Invalid user object');
        return;
    }

    const roleMap = {
        1: 'Admin',
        2: 'User'
    };

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? 'N/A';
    };

    setText('user-name', user.name);
    setText('user-email', user.email);
    setText('user-role', roleMap[user.role_id] || `Role #${user.role_id}`);
});
