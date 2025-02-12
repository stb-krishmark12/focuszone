// Payment handling with Razorpay
class PaymentHandler {
    constructor() {
        this.razorpayKey = 'rzp_live_pwylTqA4kZTsI4'
        this.amount = 5000; // Amount in paise (₹50)
        this.currency = 'INR';
    }

    // Create order on the server
    async createOrder() {
        try {
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: this.amount,
                    currency: this.currency
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // Initialize payment
    async initiatePayment(event) {
        event.preventDefault();

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
            // Create order first
            const orderData = await this.createOrder();
            
            // Configure Razorpay options with order_id
            const options = {
                key: this.razorpayKey,
                amount: this.amount,
                currency: this.currency,
                name: 'The Focus Zone',
                description: 'Notion Template Purchase',
                image: 'images/logo.png',
                order_id: orderData.id,
                handler: (response) => this.handlePaymentSuccess(response),
                prefill: {
                    name: name,
                    email: email,
                    contact: phone
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

            const rzp = new Razorpay(options);
            
            rzp.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                alert('Payment failed. Please try again.');
            });

            rzp.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Unable to initiate payment. Please try again.');
        }
    }

    // Handle successful payment
    async handlePaymentSuccess(response) {
        try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                })
            });

            if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
            }

            const paymentData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                amount: this.amount,
                currency: this.currency,
                email: document.getElementById('email').value
            };

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