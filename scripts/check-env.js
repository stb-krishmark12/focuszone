const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
    'RAZORPAY_KEY',
    'RAZORPAY_SECRET',
    'EMAIL_USER',
    'EMAIL_APP_PASSWORD',
    'TEMPLATE_LINK',
    'DOMAIN',
    'NODE_ENV'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    process.exit(1);
} else {
    console.log('✅ All required environment variables are present');
    console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        DOMAIN: process.env.DOMAIN,
        hasRazorpayKey: !!process.env.RAZORPAY_KEY,
        hasRazorpaySecret: !!process.env.RAZORPAY_SECRET,
        hasEmailConfig: !!process.env.EMAIL_USER && !!process.env.EMAIL_APP_PASSWORD
    });
} 