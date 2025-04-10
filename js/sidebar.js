import $ from 'jquery';

$(document).ready(function() {
    // Sidebar toggle
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
    
    // Close sidebar on small screens when clicking outside
    $(document).on('click', function(e) {
        const sidebar = $('#sidebar');
        const sidebarToggle = $('#sidebarCollapse');
        
        // If sidebar is active on mobile and click is outside sidebar and not on toggle button
        if (sidebar.hasClass('active') && 
            !sidebar[0].contains(e.target) && 
            !sidebarToggle[0].contains(e.target) &&
            window.innerWidth <= 768) {
            sidebar.removeClass('active');
        }
    });
    
    // Handle logout button
    $('#logout-btn').on('click', function() {
        // In a real application, you would implement proper logout functionality
        // For this example, we'll just redirect to the login page
        window.location.href = 'login.html';
    });
});