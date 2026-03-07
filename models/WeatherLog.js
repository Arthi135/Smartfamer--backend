const mongoose = require('mongoose');

const weatherLogSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    location: { type: String },
    temperature: { type: Number },
    humidity: { type: Number },
    rainfall: { type: Number },
    rainfallProbability: { type: Number },
    windSpeed: { type: Number },
    description: { type: String },
    alerts: [{ type: String }],
    recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherLog', weatherLogSchema);
