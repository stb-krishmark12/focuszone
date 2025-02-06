const express = require('express');
const router = express.Router();
const emailService = require('../js/email-service');
const crypto = require('crypto');

// Pageclip API key from your Pageclip dashboard
const PAGECLIP_API_KEY = process.env.PAGECLIP_API_KEY;

// Verify Pageclip webhook signature
function verifySignature(req) {
    const signature = req.headers['x-pageclip-signature'];
    const hmac = crypto.createHmac('sha256', PAGECLIP_API_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');
    
    return signature === hmac;
}

router.post('/webhook', async (req, res) => {
    try {
        // Verify webhook signature
        if (!verifySignature(req)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const { data } = req.body;
        
        // Extract customer information
        const customerEmail = data.email;
        const customerName = data.name;
        const orderID = `ORDER_${Date.now()}`;

        // Send template email
        await emailService.sendTemplateEmail(customerEmail, orderID);
        
        // Respond to Pageclip
        res.status(200).json({ 
            message: 'Email sent successfully',
            orderID 
        });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Failed to process webhook' });
    }
});

module.exports = router; 