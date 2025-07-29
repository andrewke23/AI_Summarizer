const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Summary = require('../models/summary');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { url, title, summary } = req.body;
        const existingSummary = await Summary.findOne({ url: url, userId: req.user._id });
        if (existingSummary) {
            return res.status(400).json({ success: false, message: 'Summary already exists' });
        }
        const savedSummary = new Summary({ url, title, summary, userId: req.user._id });
        await savedSummary.save();
        res.status(201).json({ success: true, message: 'Summary created successfully', summary: savedSummary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating summary' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const summaries = await Summary.find({ userId: req.user._id });
        res.status(200).json({ success: true, summaries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching summaries' });
    }
});

module.exports = router;