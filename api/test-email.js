const express = require('express');
const router = express.Router();
const emailService = require('../js/email-service');

router.post('/test-email', async (req, res) => {
    try {
        const testEmail = process.env.TEST_EMAIL || process.env.EMAIL_USER;
        await emailService.sendTemplateEmail(testEmail, 'TEST_PAYMENT_ID');
        res.status(200).json({ message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ error: 'Failed to send test email' });
    }
});

module.exports = router; 