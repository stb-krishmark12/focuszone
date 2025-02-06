const express = require('express');
const router = express.Router();
const emailService = require('../js/email-service');

// Test route to verify the endpoint is working
router.get('/', (req, res) => {
    res.json({ message: 'Send template endpoint is working' });
});

router.post('/', async (req, res) => {
    try {
        console.log('Received email request:', req.body);
        const { paymentId, email } = req.body;
        
        if (!email || !paymentId) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                received: { email, paymentId }
            });
        }
        
        await emailService.sendTemplateEmail(email, paymentId);
        
        console.log('Email sent successfully to:', email);
        res.status(200).json({ message: 'Template email sent successfully' });
    } catch (error) {
        console.error('Error in send-template endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to send template email',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 