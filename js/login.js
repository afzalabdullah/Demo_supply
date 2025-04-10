$(document).ready(function() {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }

    // Handle login form submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val();
        const password = $('#password').val();
        
        // Simple validation
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }
        
        // Check credentials (hardcoded for demo)
        if (email === 'admin@example.com' && password === '123456') {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            showError('Invalid credentials');
        }
    });
    
    function showError(message) {
        $('#error-message').text(message);
        $('#login-error').removeClass('d-none');
        
        // Hide error after 3 seconds
        setTimeout(function() {
            $('#login-error').addClass('d-none');
        }, 3000);
    }
});