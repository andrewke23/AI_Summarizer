const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Summary = require('../models/summary');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { url, title, originalText } = req.body;
        const existingSummary = await Summary.findOne({ url: url, userId: req.user._id });
        if (existingSummary) {
            return res.status(400).json({ success: false, message: 'Summary already exists' });
        }
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes text. Summarize the following text into 5 sentences, ignoring any boilerplate text that is irrelevant to the main content: " + originalText
                }
            ],
            max_tokens: 500
        });
        const summary = completion.choices[0].message.content;
        const savedSummary = new Summary({ url, title, summary, originalText, userId: req.user._id });
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

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        // ensure users can only delete their own summaries
        const summary = await Summary.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!summary) {
            return res.status(404).json({ success: false, message: 'Summary not found' });
        }
        
        res.status(200).json({ success: true, message: 'Summary deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting summary' });
    }
});

module.exports = router;