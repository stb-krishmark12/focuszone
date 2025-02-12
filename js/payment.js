// Payment handling with Razorpay
class PaymentHandler {
    constructor() {
        // Update Razorpay key to use environment variable
        this.razorpayKey = 'rzp_live_ZQ3iVCqTSjcUUu';
        this.amount = 50; // Amount in paise (₹50)
        this.currency = 'INR';
        
        // Get API base URL based on environment
        this.apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:3000'
            : 'https://stbcreators.space';

        // Initialize base Razorpay options
        this.options = {
            key: this.razorpayKey,
            currency: this.currency,
            name: 'The Focus Zone',
            description: 'Notion Template Purchase',
            image: 'images/logo.png',
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
    async initiatePayment(event) {
        event.preventDefault();
        console.log('Starting payment flow...');

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        // Validate form
        if (!name || !email || !phone) {
            alert('Please fill in all fields');
            return;
        }

        try {
            console.log('Creating order with data:', {
                amount: this.amount,
                currency: this.currency,
                email: email
            });

            const orderResponse = await fetch(`${this.apiBaseUrl}/api/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: this.amount,
                    currency: this.currency,
                    email: email
                })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                console.error('Server error:', errorData);
                throw new Error(errorData.error || 'Failed to create order');
            }

            const orderData = await orderResponse.json();
            console.log('Order created successfully:', orderData);

            // Update Razorpay options with order and user details
            this.options.order_id = orderData.id;
            this.options.amount = orderData.amount;
            this.options.prefill.name = name;
            this.options.prefill.email = email;
            this.options.prefill.contact = phone;
            
            const rzp = new Razorpay(this.options);
            
            rzp.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                alert('Payment failed. Please try again.');
            });

            rzp.open();
        } catch (error) {
            console.error('Detailed payment error:', {
                message: error.message,
                stack: error.stack
            });
            alert('Unable to initiate payment. Please try again.');
        }
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

            console.log('Payment successful:', paymentData);

            // Send confirmation email
            await this.sendConfirmationEmail(paymentData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Close modal
            closePaymentModal();
            
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('There was an error processing your payment. Please contact support.');
        }
    }

    // Send confirmation email
    async sendConfirmationEmail(paymentData) {
        try {
            console.log('Sending confirmation email to:', paymentData.email);
            const response = await fetch(`${this.apiBaseUrl}/api/send-template`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentId: paymentData.razorpay_payment_id,
                    email: paymentData.email
                })
            });

            console.log('Email API response:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Email API error:', errorData);
                throw new Error('Failed to send confirmation email');
            }

            const responseData = await response.json();
            console.log('Email sent successfully:', responseData);

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
function initiatePayment(event) {
    if (event) {
        event.preventDefault();
    }
    paymentHandler.initiatePayment(event);
} 