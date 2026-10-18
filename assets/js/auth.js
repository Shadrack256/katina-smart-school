// assets/js/auth.js

async function redirectUserBasedOnRole(user) {
    // 1. Check if Admin
    if (user.email === 'admin@katikamu.ac.ug') {
        window.location.href = 'pages/admin-dashboard.html';
        return;
    }

    // 2. Check if Teacher
    // We use maybeSingle() so it doesn't crash if the user isn't a teacher
    const { data: teacher } = await db.from('teachers').select('id').eq('user_id', user.id).maybeSingle();
    if (teacher) {
        window.location.href = 'pages/teacher-portal.html';
        return;
    }

    // 3. Check if Student
    const { data: student } = await db.from('students').select('id').eq('user_id', user.id).maybeSingle();
    if (student) {
        window.location.href = 'pages/student-portal.html';
        return;
    }

    // 4. Fallback (If not found in ANY table)
    alert("Your account is not linked to a Teacher or Student profile. Please contact the Admin.");
    await db.auth.signOut();
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check if already logged in
    const { data: { session } } = await db.auth.getSession();
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    
    if (session && isLoginPage) {
        redirectUserBasedOnRole(session.user);
        return;
    }

    // 2. Handle Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const errorMsg = document.createElement('p');
        errorMsg.style.cssText = 'color: #dc3545; font-size: 13px; margin-top: 10px; text-align: center; font-weight: bold;';
        loginForm.appendChild(errorMsg);

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMsg.textContent = '';
            
            let username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username.includes('@')) {
                username = `${username}@katikamu.ac.ug`;
            }

            const btn = document.querySelector('.login-btn');
            const originalBtnText = btn.textContent;
            btn.textContent = 'Loading...';
            btn.disabled = true;

            const { data, error } = await db.auth.signInWithPassword({
                email: username,
                password: password,
            });

            if (error) {
                errorMsg.textContent = "Login failed: Invalid username or password.";
                btn.textContent = originalBtnText;
                btn.disabled = false;
            } else {
                redirectUserBasedOnRole(data.user);
            }
        });
    }
});