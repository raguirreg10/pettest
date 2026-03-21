document.addEventListener('DOMContentLoaded', () => {
    
    // Select login form elements
    const loginForm = document.getElementById('loginForm');
    const toast = document.getElementById('toast');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default since there's no real DB integration
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Signing In...';
            submitBtn.style.opacity = '0.8';

            // Show success toast after small mock delay
            setTimeout(() => {
                submitBtn.textContent = 'Sign In';
                submitBtn.style.opacity = '1';

                if(toast) {
                    toast.classList.add('show');
                    
                    // Simulate redirect back to home after reading the toast
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            }, 800);
        });
    }

});
