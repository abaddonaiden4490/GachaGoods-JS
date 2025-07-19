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

    // Map role_id to role name
    const roleMap = {
        1: 'Admin',
        2: 'User'
    };

    // Map status_id to status name (customize as needed)
    const statusMap = {
        1: 'Active',
        2: 'Inactive'
    };

    // Update DOM elements if present
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? 'N/A';
    };

    setText('user-id', user.id);
    setText('user-name', user.name);
    setText('user-email', user.email);
    setText('user-role', roleMap[user.role_id] || `Role #${user.role_id}`);
    setText('user-status', statusMap[user.status_id] || `Status #${user.status_id}`);
    setText('user-verified', user.email_verified_at ? 'Yes' : 'No');
});
