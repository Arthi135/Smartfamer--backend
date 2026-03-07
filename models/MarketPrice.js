const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    cropNameTelugu: { type: String },
    mandiName: { type: String, required: true },
    state: { type: String },
    district: { type: String },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    modalPrice: { type: Number },
    unit: { type: String, default: 'quintal' },
    date: { type: Date, default: Date.now },
    trend: { type: String, enum: ['rising', 'falling', 'stable'] }
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
