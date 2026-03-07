const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    sessionId: { type: String },
    messages: [{
        role: { type: String, enum: ['user', 'assistant'] },
        content: { type: String },
        language: { type: String, enum: ['english', 'telugu', 'hindi'], default: 'english' },
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
