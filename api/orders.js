const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Check for required environment variables
if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    console.error('Missing required environment variables: RAZORPAY_KEY and/or RAZORPAY_SECRET');
    throw new Error('Missing required Razorpay configuration');
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

router.post('/create-order', async (req, res) => {
    try {
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