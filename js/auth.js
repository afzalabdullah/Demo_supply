$(document).ready(function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && !window.location.href.includes('login.html')) {
        // Uncomment this in a real application
        // window.location.href = 'login.html';
    }
    
    // Handle login form submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        // Simple validation (in a real app, this would be server-side)
        if (username === 'admin' && password === 'password') {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', username);
            window.location.href = 'dashboard.html';
        } else {
            $('#login-error').text('Invalid username or password').show();
        }
    });
});