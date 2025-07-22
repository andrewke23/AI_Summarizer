const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    originalText: {
        type: String,
        trim: true,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;