const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;
const authRoutes = require('./routes/auth');
const summaries = require('./routes/summaries');

console.log('=== DEPLOYMENT DEBUG INFO ===');
console.log('Environment PORT:', process.env.PORT);
console.log('Using port:', port);
console.log('Node environment:', process.env.NODE_ENV);

// Enable CORS for Chrome extension
app.use(cors({
    origin: true, // Allow all origins for Chrome extensions
    credentials: true
}));

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Initial connection to MongoDB is successful');
}).catch((err) => {
    console.error('Initial connection to MongoDB failed:', err);
    process.exit(1);
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log('Root endpoint hit');
    res.send('AI Summarizer API is running!');
});

app.get('/health', (req, res) => {
    console.log('Health check endpoint hit');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/summaries', summaries);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port} and bound to 0.0.0.0`);
    console.log('=== SERVER STARTED SUCCESSFULLY ===');
});