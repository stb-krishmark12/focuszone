const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Initialize Razorpay with fallback handling
let razorpay;
try {
    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
        console.warn('⚠️ Razorpay credentials missing. Payment features will be disabled.');
    } else {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET
        });
        console.log('✅ Razorpay initialized successfully');
    }
} catch (error) {
    console.error('❌ Failed to initialize Razorpay:', error);
}

router.post('/create-order', async (req, res) => {
    try {
        // Check if Razorpay is initialized
        if (!razorpay) {
            console.error('Razorpay not initialized');
            return res.status(503).json({
                error: 'Payment service unavailable',
                message: 'Payment system is currently unavailable. Please try again later.'
            });
        }

        const { amount, currency, email } = req.body;
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Validate amount
        if (amount !== 50) { // ₹50 in paise
            return res.status(400).json({
                error: 'Invalid amount',
                message: 'Amount must be ₹50'
            });
        }

        // Validate currency
        if (currency !== 'INR') {
            return res.status(400).json({
                error: 'Invalid currency'
            });
        }

        console.log('Received order request:', { amount, currency, email });

        const options = {
            amount,
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                email: email,
                product: 'The Focus Zone Template'
            }
        };

        console.log('Creating order with options:', options);

        const order = await razorpay.orders.create(options);
        console.log('Order created:', order);
        
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        // Don't expose error details in production
        res.status(500).json({ 
            error: process.env.NODE_ENV === 'production' 
                ? 'Failed to create order' 
                : error.message
        });
    }
});

module.exports = router; 