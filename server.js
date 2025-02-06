const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const templateRouter = require('./api/send-template');
const testRouter = require('./api/test-email');
const testRoutes = require('./api/test-routes');

// Load environment variables
dotenv.config();

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/api', testRoutes);
app.use('/api/send-template', templateRouter);
app.use('/api/test-email', testRouter);

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
            port: PORT
        }
    });
});

// Serve static files
app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    console.error('Request details:', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    });
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message
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