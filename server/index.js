const express = require('express');
const paymentRoutes = require('./routes/payment');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Remove the /api prefix from the routes since it's already in the route definitions
app.use('/', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 