const mongoose = require('mongoose');

const soilDataSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    soilType: { type: String, required: true },
    pH: { type: Number, required: true, min: 0, max: 14 },
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    organicMatter: { type: Number, default: 0 },
    moisture: { type: Number, default: 0 },
    healthRating: { type: String, enum: ['weak', 'moderate', 'strong'] },
    healthScore: { type: Number, min: 0, max: 100 },
    suggestedFertilizers: [{ type: String }],
    organicMethods: [{ type: String }],
    cropRotation: [{ type: String }],
    analyzedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SoilData', soilDataSchema);
