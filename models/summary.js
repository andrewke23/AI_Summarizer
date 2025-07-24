const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
        maxLength: [2083, 'Error: url must be less than 2083 characters'],
        match: [
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            'Error: invalid url'
        ]
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [200, 'Error: title must be less than 200 characters']
    },
    summary: {
        type: String,
        required: true,
        trim: true,
        maxLength: [2000, 'Error: summary must be less than 2000 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        timestamps: true
    },
    originalText: {
        type: String,
        required: true,
        trim: true,
        maxLength: [50000, 'Error: original text must be less than 50000 characters']
    },
    userId: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    }
});

// create a unique index so different users can have the same url
summarySchema.index({ url: 1, userId: 1 }, { unique: true });
summarySchema.index({ userId: 1, createdAt: -1 });

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;