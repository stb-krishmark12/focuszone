// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');

    // Initialize all payment trigger buttons
    const paymentTriggers = document.querySelectorAll('.payment-trigger');
    paymentTriggers.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showPaymentModal();
        });
    });

    // Special handling for nav CTA button
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Scroll to pricing section
            const pricingSection = document.getElementById('cta');
            if (pricingSection) {
                pricingSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Remove payment-trigger class from nav CTA
        navCta.classList.remove('payment-trigger');
    }
});

function showPaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    // Reset form
    document.getElementById('payment-form').reset();
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking the close button
    document.querySelector('.close-modal').addEventListener('click', closePaymentModal);

    // Close modal when clicking outside
    document.getElementById('payment-modal').addEventListener('click', (e) => {
        if (e.target.id === 'payment-modal') {
            closePaymentModal();
        }
    });
}); 