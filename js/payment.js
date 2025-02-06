// Payment handling with Razorpay
class PaymentHandler {
    constructor() {
        this.razorpayKey = 'rzp_test_BGdw0v0ZviO0up'
        this.amount = 5000; // Amount in paise (₹50)
        this.currency = 'INR';
        
        // Initialize Razorpay options
        this.options = {
            key: this.razorpayKey,
            amount: this.amount,
            currency: this.currency,
            name: 'The Focus Zone',
            description: 'Notion Template Purchase',
            image: 'images/logo.png', // Add your logo image
            handler: this.handlePaymentSuccess.bind(this),
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment modal closed');
                }
            },
            notes: {
                template_name: 'The Focus Zone'
            },
            theme: {
                color: '#0984E3'
            }
        };
    }

    // Initialize payment
    initiatePayment() {
        // Show email/phone collection modal
        const email = prompt('Please enter your email:');
        const phone = prompt('Please enter your phone number:');
        
        if (!email || !phone) {
            alert('Email and phone number are required');
            return;
        }
        
        // Update Razorpay options with user details
        this.options.prefill.email = email;
        this.options.prefill.contact = phone;
        
        const rzp = new Razorpay(this.options);
        
        rzp.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            alert('Payment failed. Please try again.');
        });

        rzp.open();
    }

    // Handle successful payment
    async handlePaymentSuccess(response) {
        try {
            const paymentData = {
                razorpay_payment_id: response.razorpay_payment_id,
                amount: this.amount,
                currency: this.currency,
                email: this.options.prefill.email
            };

            // Send confirmation email
            await this.sendConfirmationEmail(paymentData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Optional: Redirect to thank you page
            // window.location.href = '/thank-you';
            
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('There was an error processing your payment. Our team has been notified.');
        }
    }

    // Send confirmation email
    async sendConfirmationEmail(paymentData) {
        try {
            const response = await fetch('/api/send-template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentId: paymentData.razorpay_payment_id,
                    email: paymentData.email
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send confirmation email');
            }

        } catch (error) {
            console.error('Error sending confirmation email:', error);
            throw error;
        }
    }

    // Show success message
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'payment-success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <h3>🎉 Thank You for Your Purchase!</h3>
                <p>Your template link has been sent to your email.</p>
                <p>Please check your inbox (and spam folder) for further instructions.</p>
            </div>
        `;

        document.body.appendChild(successMessage);

        // Remove message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
}

// Initialize payment handler
const paymentHandler = new PaymentHandler();

// Global function to initiate payment (called from HTML)
function initiatePayment() {
    paymentHandler.initiatePayment();
} 