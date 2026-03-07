const mongoose = require('mongoose');

const diseaseReportSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    imagePath: { type: String, required: true },
    cropType: { type: String },
    diseaseName: { type: String },
    diseaseNameTelugu: { type: String },
    cause: { type: String },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
    severityScore: { type: Number, min: 0, max: 100 },
    preventionMethods: [{ type: String }],
    recommendedFertilizers: [{ type: String }],
    recommendedPesticides: [{ type: String }],
    organicTreatments: [{ type: String }],
    estimatedRecoveryTime: { type: String },
    confidence: { type: Number, min: 0, max: 100 },
    detectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiseaseReport', diseaseReportSchema);
