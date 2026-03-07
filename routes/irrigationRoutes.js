const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/suggest', auth, (req, res) => {
    try {
        const { soilMoisture, rainfallProbability, temperature, cropType, soilType } = req.body;
        const moisture = parseFloat(soilMoisture) || 50;
        const rainProb = parseFloat(rainfallProbability) || 30;
        const temp = parseFloat(temperature) || 28;
        let suggestion = {};
        let urgency = 'normal';

        if (rainProb > 70) {
            suggestion = { action: 'Skip Irrigation', reason: `High rainfall probability (${rainProb}%). Nature will water your crops!`, timing: 'Skip next 2-3 days', amount: '0 mm', urgency: 'low', tips: ['Ensure drainage channels are clear', 'Protect crops from waterlogging', 'Hold fertilizer application'] };
            urgency = 'low';
        } else if (moisture < 30) {
            suggestion = { action: 'Irrigate Immediately', reason: `Critical soil moisture level (${moisture}%). Crops are under moisture stress!`, timing: 'Within next 6 hours', amount: temp > 35 ? '50-60 mm' : '40-50 mm', urgency: 'critical', tips: ['Irrigate early morning (5-7 AM) to reduce evaporation', 'Use drip irrigation if available', 'Mulch soil surface to retain moisture'] };
            urgency = 'critical';
        } else if (moisture < 50) {
            suggestion = { action: 'Irrigate Today', reason: `Moderate soil moisture (${moisture}%). Crops need water soon.`, timing: 'Early morning tomorrow (5-7 AM)', amount: '30-40 mm', urgency: 'moderate', tips: ['Best time: early morning or late evening', 'Check soil 5cm deep before irrigating', 'Apply fertilizer with irrigation (fertigation)'] };
            urgency = 'moderate';
        } else {
            suggestion = { action: 'No Irrigation Needed', reason: `Adequate soil moisture (${moisture}%). Crops are well-hydrated.`, timing: 'Check again in 3-4 days', amount: '0 mm', urgency: 'low', tips: ['Monitor weather forecast daily', 'Maintain drainage readiness', 'Optimal: irrigate every 5-7 days for most crops'] };
            urgency = 'low';
        }

        res.json({ message: 'Irrigation suggestion ready!', suggestion, soilMoisture: moisture, rainfallProbability: rainProb, temperature: temp, cropType, nextCheckDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN') });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
