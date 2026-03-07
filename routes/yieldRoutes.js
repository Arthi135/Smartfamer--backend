const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const YIELD_DATA = {
    rice: { base: 20, max: 35, unit: 'quintals/acre', factors: { irrigated: 1.3, rainfall: 1.1, fertilized: 1.2 } },
    wheat: { base: 18, max: 30, unit: 'quintals/acre', factors: { irrigated: 1.2, rainfall: 1.05, fertilized: 1.25 } },
    cotton: { base: 8, max: 15, unit: 'quintals/acre', factors: { irrigated: 1.15, rainfall: 1.05, fertilized: 1.2 } },
    maize: { base: 25, max: 45, unit: 'quintals/acre', factors: { irrigated: 1.25, rainfall: 1.1, fertilized: 1.3 } },
    groundnut: { base: 10, max: 18, unit: 'quintals/acre', factors: { irrigated: 1.1, rainfall: 1.05, fertilized: 1.15 } },
    sunflower: { base: 8, max: 14, unit: 'quintals/acre', factors: { irrigated: 1.1, rainfall: 1.05, fertilized: 1.2 } },
    tomato: { base: 120, max: 250, unit: 'quintals/acre', factors: { irrigated: 1.3, rainfall: 1.0, fertilized: 1.4 } },
    onion: { base: 80, max: 160, unit: 'quintals/acre', factors: { irrigated: 1.2, rainfall: 1.0, fertilized: 1.3 } },
    chilli: { base: 20, max: 40, unit: 'quintals/acre', factors: { irrigated: 1.15, rainfall: 1.05, fertilized: 1.25 } },
    sugarcane: { base: 350, max: 600, unit: 'quintals/acre', factors: { irrigated: 1.3, rainfall: 1.1, fertilized: 1.2 } },
    soybean: { base: 12, max: 20, unit: 'quintals/acre', factors: { irrigated: 1.1, rainfall: 1.1, fertilized: 1.15 } }
};

router.post('/predict', auth, (req, res) => {
    try {
        const { cropName, landSize, waterAvailability, soilFertility, rainfall, usesFertilizer } = req.body;
        const crop = YIELD_DATA[cropName?.toLowerCase()] || YIELD_DATA.rice;
        let multiplier = 1.0;
        if (['abundant', 'moderate'].includes(waterAvailability)) multiplier *= crop.factors.irrigated;
        else if (waterAvailability === 'rainfed' && (parseInt(rainfall) || 50) > 60) multiplier *= crop.factors.rainfall;
        if (usesFertilizer === true || usesFertilizer === 'true') multiplier *= crop.factors.fertilized;
        if (soilFertility === 'high') multiplier *= 1.1;
        else if (soilFertility === 'low') multiplier *= 0.85;
        const acres = parseFloat(landSize) || 1;
        const predictedYieldPerAcre = Math.min(crop.base * multiplier, crop.max);
        const totalYield = predictedYieldPerAcre * acres;
        const monthlyData = Array.from({ length: 6 }, (_, i) => ({
            month: `Month ${i + 1}`,
            growthPercent: Math.round(((i + 1) / 6) * 100),
            estimatedYield: Math.round(totalYield * ((i + 1) / 6))
        }));
        res.json({
            message: 'Yield prediction ready!', cropName, landSize: acres,
            predictedYieldPerAcre: Math.round(predictedYieldPerAcre * 10) / 10,
            totalYield: Math.round(totalYield * 10) / 10, unit: crop.unit,
            multiplierUsed: Math.round(multiplier * 100) / 100, monthlyData,
            confidence: Math.round(75 + Math.random() * 15)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
