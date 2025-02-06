// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');

    // Initialize Pageclip
    Pageclip.form('.pageclip-form', {
        successTemplate: `
            <div class="success-content">
                <h3>🎉 Thank You for Your Purchase!</h3>
                <p>Your template link has been sent to your email.</p>
                <p>Please check your inbox (and spam folder) for further instructions.</p>
            </div>
        `,
        onSubmit: function (form) {
            // Optional: Add loading state
            form.querySelector('button').disabled = true;
        },
        onResponse: function (error, response) {
            // Handle response
            if (error) {
                console.error('Error:', error);
                alert('There was an error processing your request. Please try again.');
            }
        }
    });
}); 