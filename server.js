const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const summaries = require('./routes/summaries');

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
    res.send('AI Summarizer API is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/summaries', summaries);