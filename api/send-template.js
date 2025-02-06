const express = require('express');
const router = express.Router();
const emailService = require('../js/email-service');

router.post('/api/send-template', async (req, res) => {
    try {
        const { paymentId, email } = req.body;
        
        await emailService.sendTemplateEmail(email, paymentId);
        
        res.status(200).json({ message: 'Template email sent successfully' });
    } catch (error) {
        console.error('Error in send-template endpoint:', error);
        res.status(500).json({ error: 'Failed to send template email' });
    }
});

module.exports = router; 