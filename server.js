const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const templateRouter = require('./api/send-template');
const testRouter = require('./api/test-email');
const testRoutes = require('./api/test-routes');
const ordersRouter = require('./api/orders');

// Load environment variables
dotenv.config();

// Log all environment variables (excluding secrets)
console.log('Available environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DOMAIN: process.env.DOMAIN,
    hasRazorpayKey: !!process.env.RAZORPAY_KEY,
    hasRazorpaySecret: !!process.env.RAZORPAY_SECRET,
    hasEmailConfig: !!process.env.EMAIL_USER && !!process.env.EMAIL_APP_PASSWORD,
    hasTemplateLink: !!process.env.TEMPLATE_LINK
});

// Check required environment variables but don't exit
const requiredEnvVars = [
    'RAZORPAY_KEY',
    'RAZORPAY_SECRET',
    'EMAIL_USER',
    'EMAIL_APP_PASSWORD',
    'TEMPLATE_LINK'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingEnvVars);
    console.warn('Some features may be unavailable');
} else {
    console.log('✅ All required environment variables are present');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, {
        body: req.body,
        headers: req.headers
    });
    next();
});

// Update CORS configuration based on environment
const corsOptions = process.env.NODE_ENV === 'production' 
    ? {
        origin: 'https://stbcreators.space',
        methods: ['GET', 'POST'],
        credentials: true
    } 
    : {
        origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://stbcreators.space'],
        methods: ['GET', 'POST'],
        credentials: true
    };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/api', testRoutes);
app.use('/api/send-template', templateRouter);
app.use('/api/test-email', testRouter);
app.use('/api', ordersRouter);

// Log all requests that reach this point
app.use((req, res, next) => {
    console.log('Unhandled request:', {
        method: req.method,
        url: req.url,
        body: req.body
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    console.log('Health check endpoint called');
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        env: {
            node_env: process.env.NODE_ENV,
            port: PORT,
            hasRazorpay: !!process.env.RAZORPAY_KEY && !!process.env.RAZORPAY_SECRET,
            hasEmail: !!process.env.EMAIL_USER && !!process.env.EMAIL_APP_PASSWORD
        }
    });
});

// Serve static files
app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add this route only in development
if (process.env.NODE_ENV !== 'production') {
    app.get('/debug/env', (req, res) => {
        res.json({
            environment: process.env.NODE_ENV,
            hasRazorpayKey: !!process.env.RAZORPAY_KEY,
            hasRazorpaySecret: !!process.env.RAZORPAY_SECRET,
            hasEmailConfig: !!process.env.EMAIL_USER && !!process.env.EMAIL_APP_PASSWORD,
            hasTemplateLink: !!process.env.TEMPLATE_LINK,
            domain: process.env.DOMAIN
        });
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    // Only log details in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('Request details:', {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body
        });
    }
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
    });
});

// Handle 404 errors
app.use((req, res) => {
    console.log('404 Not Found:', req.url);
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
}); 