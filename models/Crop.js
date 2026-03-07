const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameTelugu: { type: String },
    nameHindi: { type: String },
    season: { type: String, enum: ['kharif', 'rabi', 'summer', 'all'] },
    soilTypes: [{ type: String }],
    waterRequirement: { type: String, enum: ['high', 'medium', 'low'] },
    duration: { type: Number }, // days
    yieldPerAcre: { type: Number }, // quintals
    minBudget: { type: Number },
    maxBudget: { type: Number },
    marketDemand: { type: String, enum: ['high', 'medium', 'low'] },
    avgPrice: { type: Number }, // per quintal
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
    description: { type: String },
    image: { type: String },
    fertilizers: [{ type: String }],
    pesticides: [{ type: String }]
});

module.exports = mongoose.model('Crop', cropSchema);
