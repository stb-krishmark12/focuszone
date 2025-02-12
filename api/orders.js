const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Initialize Razorpay with fallback handling
let razorpay;
try {
    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
        console.error('❌ Razorpay credentials missing:', {
            hasKey: !!process.env.RAZORPAY_KEY,
            hasSecret: !!process.env.RAZORPAY_SECRET
        });
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
    console.log('📦 Create order request received:', req.body);
    
    try {
        // Check if Razorpay is initialized
        if (!razorpay) {
            console.error('❌ Razorpay not initialized');
            return res.status(503).json({
                error: 'Payment service unavailable',
                message: 'Payment system is currently unavailable. Please try again later.'
            });
        }

        const { amount, currency, email } = req.body;
        
        // Log received data
        console.log('💰 Order details:', { amount, currency, email });

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('❌ Invalid email format:', email);
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Convert amount to paise (₹50 = 5000 paise)
        const amountInPaise = amount * 100;
        console.log('💵 Amount in paise:', amountInPaise);

        // Validate amount
        if (amountInPaise !== 5000) {
            console.error('❌ Invalid amount:', amountInPaise);
            return res.status(400).json({
                error: 'Invalid amount',
                message: 'Amount must be ₹50'
            });
        }

        // Validate currency
        if (currency !== 'INR') {
            console.error('❌ Invalid currency:', currency);
            return res.status(400).json({
                error: 'Invalid currency'
            });
        }

        const options = {
            amount: amountInPaise,
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                email: email,
                product: 'The Focus Zone Template'
            },
            payment_capture: 1 // Auto capture the payment when completed
        };

        console.log('🛠️ Creating order with options:', options);

        // This internally calls https://api.razorpay.com/v1/orders
        const order = await razorpay.orders.create(options);
        console.log('✅ Order created successfully:', order);
        
        res.json(order);
    } catch (error) {
        console.error('❌ Error creating order:', error);
        res.status(500).json({ 
            error: process.env.NODE_ENV === 'production' 
                ? 'Failed to create order' 
                : error.message
        });
    }
});

module.exports = router; 