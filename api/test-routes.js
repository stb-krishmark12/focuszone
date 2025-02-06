const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({
        message: 'API is working',
        endpoints: {
            sendTemplate: '/api/send-template',
            testEmail: '/api/test-email'
        }
    });
});

module.exports = router; 