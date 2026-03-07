const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Comprehensive crop database with AI scoring logic
const CROP_DATABASE = [
    { name: 'Rice', nameTelugu: 'వరి', nameHindi: 'चावल', season: ['kharif'], soilTypes: ['clay', 'alluvial', 'loamy'], waterReq: 'high', duration: 120, yieldPerAcre: 20, minBudget: 8000, maxBudget: 15000, marketDemand: 'high', avgPrice: 1800, riskLevel: 'low', emoji: '🌾', description: 'Staple crop with high market demand. Best for waterlogged soils.' },
    { name: 'Wheat', nameTelugu: 'గోధుమ', nameHindi: 'गेहूं', season: ['rabi'], soilTypes: ['loamy', 'clay', 'alluvial'], waterReq: 'medium', duration: 120, yieldPerAcre: 18, minBudget: 6000, maxBudget: 12000, marketDemand: 'high', avgPrice: 2200, riskLevel: 'low', emoji: '🌿', description: 'Major rabi crop with government MSP support.' },
    { name: 'Cotton', nameTelugu: 'పత్తి', nameHindi: 'कपास', season: ['kharif'], soilTypes: ['black', 'loamy'], waterReq: 'medium', duration: 180, yieldPerAcre: 8, minBudget: 10000, maxBudget: 20000, marketDemand: 'high', avgPrice: 6500, riskLevel: 'medium', emoji: '🤍', description: 'High value cash crop. Excellent for black cotton soil.' },
    { name: 'Maize', nameTelugu: 'మొక్కజొన్న', nameHindi: 'मक्का', season: ['kharif', 'rabi', 'summer'], soilTypes: ['loamy', 'sandy', 'red'], waterReq: 'medium', duration: 90, yieldPerAcre: 25, minBudget: 5000, maxBudget: 10000, marketDemand: 'high', avgPrice: 1500, riskLevel: 'low', emoji: '🌽', description: 'Versatile crop for multiple seasons with rising demand.' },
    { name: 'Groundnut', nameTelugu: 'వేరుశెనగ', nameHindi: 'मूंगफली', season: ['kharif', 'summer'], soilTypes: ['sandy', 'red', 'loamy'], waterReq: 'low', duration: 105, yieldPerAcre: 10, minBudget: 7000, maxBudget: 14000, marketDemand: 'high', avgPrice: 5000, riskLevel: 'low', emoji: '🥜', description: 'Profitable oilseed crop perfect for sandy and red soils.' },
    { name: 'Sunflower', nameTelugu: 'సూర్యకాంతి', nameHindi: 'सूरजमुखी', season: ['rabi', 'summer'], soilTypes: ['loamy', 'red', 'black'], waterReq: 'medium', duration: 90, yieldPerAcre: 8, minBudget: 6000, maxBudget: 11000, marketDemand: 'medium', avgPrice: 5500, riskLevel: 'low', emoji: '🌻', description: 'Drought-tolerant oilseed with good market returns.' },
    { name: 'Tomato', nameTelugu: 'టొమాటో', nameHindi: 'टमाटर', season: ['rabi', 'summer'], soilTypes: ['loamy', 'red', 'alluvial'], waterReq: 'medium', duration: 75, yieldPerAcre: 120, minBudget: 15000, maxBudget: 30000, marketDemand: 'high', avgPrice: 1000, riskLevel: 'high', emoji: '🍅', description: 'High yield vegetable with volatile market prices.' },
    { name: 'Onion', nameTelugu: 'ఉల్లిపాయ', nameHindi: 'प्याज', season: ['rabi', 'kharif'], soilTypes: ['loamy', 'alluvial', 'red'], waterReq: 'medium', duration: 90, yieldPerAcre: 80, minBudget: 12000, maxBudget: 25000, marketDemand: 'high', avgPrice: 1500, riskLevel: 'medium', emoji: '🧅', description: 'Essential vegetable with consistently high demand.' },
    { name: 'Turmeric', nameTelugu: 'పసుపు', nameHindi: 'हल्दी', season: ['kharif'], soilTypes: ['loamy', 'red', 'black'], waterReq: 'medium', duration: 270, yieldPerAcre: 25, minBudget: 20000, maxBudget: 40000, marketDemand: 'high', avgPrice: 8000, riskLevel: 'low', emoji: '💛', description: 'High-value spice crop with export potential.' },
    { name: 'Chilli', nameTelugu: 'మిర్చి', nameHindi: 'मिर्च', season: ['kharif', 'rabi'], soilTypes: ['red', 'black', 'loamy'], waterReq: 'medium', duration: 120, yieldPerAcre: 20, minBudget: 20000, maxBudget: 40000, marketDemand: 'high', avgPrice: 12000, riskLevel: 'medium', emoji: '🌶️', description: 'Andhra Pradesh specialty with global market demand.' },
    { name: 'Sugarcane', nameTelugu: 'చెరుకు', nameHindi: 'गन्ना', season: ['all'], soilTypes: ['loamy', 'alluvial', 'clay'], waterReq: 'high', duration: 365, yieldPerAcre: 350, minBudget: 25000, maxBudget: 50000, marketDemand: 'medium', avgPrice: 350, riskLevel: 'low', emoji: '🎋', description: 'Long-duration crop with guaranteed mill purchase.' },
    { name: 'Soybean', nameTelugu: 'సోయాబీన్', nameHindi: 'सोयाबीन', season: ['kharif'], soilTypes: ['black', 'loamy', 'red'], waterReq: 'medium', duration: 100, yieldPerAcre: 12, minBudget: 6000, maxBudget: 12000, marketDemand: 'high', avgPrice: 4000, riskLevel: 'low', emoji: '🌱', description: 'Protein-rich crop with strong oil and food industry demand.' },
    { name: 'Jowar', nameTelugu: 'జొన్న', nameHindi: 'ज्वार', season: ['kharif', 'rabi'], soilTypes: ['black', 'red', 'loamy'], waterReq: 'low', duration: 100, yieldPerAcre: 15, minBudget: 3000, maxBudget: 8000, marketDemand: 'medium', avgPrice: 2500, riskLevel: 'low', emoji: '🌾', description: 'Drought-resistant crop ideal for low-rainfall areas.' },
    { name: 'Bajra', nameTelugu: 'సజ్జ', nameHindi: 'बाजरा', season: ['kharif', 'summer'], soilTypes: ['sandy', 'red', 'loamy'], waterReq: 'low', duration: 75, yieldPerAcre: 12, minBudget: 2500, maxBudget: 6000, marketDemand: 'medium', avgPrice: 2200, riskLevel: 'low', emoji: '🌿', description: 'Most drought-tolerant crop. Ideal for water-scarce regions.' },
    { name: 'Bengalgram', nameTelugu: 'సెనగలు', nameHindi: 'चना', season: ['rabi'], soilTypes: ['black', 'red', 'loamy'], waterReq: 'low', duration: 90, yieldPerAcre: 8, minBudget: 5000, maxBudget: 10000, marketDemand: 'high', avgPrice: 5500, riskLevel: 'low', emoji: '🫘', description: 'Protein-rich pulse with soil nitrogen-fixing ability.' }
];

// AI Crop Recommendation Engine
function recommendCrops(input) {
    const { soilType, season, rainfallProbability, waterAvailability, budgetRange, marketDemand } = input;
    const budget = parseInt(budgetRange) || 15000;

    const scoredCrops = CROP_DATABASE.map(crop => {
        let score = 0;
        // Soil match (35 points)
        if (crop.soilTypes.includes(soilType)) score += 35;
        // Season match (25 points)
        if (crop.season.includes(season) || crop.season.includes('all')) score += 25;
        // Water availability (20 points)
        const waterMap = { 'abundant': 'high', 'moderate': 'medium', 'scarce': 'low', 'rainfed': 'low' };
        const reqMap = { 'high': 3, 'medium': 2, 'low': 1 };
        const farmerWater = reqMap[waterMap[waterAvailability]] || 2;
        const cropWater = reqMap[crop.waterReq] || 2;
        if (farmerWater >= cropWater) score += 20; else if (farmerWater === cropWater - 1) score += 10;
        // Budget match (10 points)
        if (budget >= crop.minBudget) score += 10;
        // Market demand match (10 points)
        if (marketDemand === 'high' && crop.marketDemand === 'high') score += 10;
        else if (marketDemand !== 'high') score += 5;
        // Rainfall bonus
        if (rainfallProbability > 60 && crop.waterReq === 'high') score += 5;
        if (rainfallProbability < 30 && crop.waterReq === 'low') score += 5;

        const profitPerAcre = (crop.yieldPerAcre * crop.avgPrice) - crop.minBudget;
        return { ...crop, score, profitPerAcre };
    });

    return scoredCrops
        .filter(c => c.score > 30)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(c => ({
            name: c.name, nameTelugu: c.nameTelugu, emoji: c.emoji, score: c.score,
            season: c.season.join('/'), duration: `${c.duration} days`,
            yieldPerAcre: `${c.yieldPerAcre} quintals`, avgPrice: `₹${c.avgPrice}/quintal`,
            estimatedProfit: `₹${c.profitPerAcre.toLocaleString()}/acre`,
            riskLevel: c.riskLevel, marketDemand: c.marketDemand, description: c.description,
            requiredBudget: `₹${c.minBudget.toLocaleString()} - ₹${c.maxBudget.toLocaleString()}`,
            waterRequirement: c.waterReq, matchScore: Math.min(Math.round((c.score / 105) * 100), 98)
        }));
}

// POST /api/crop/recommend
router.post('/recommend', auth, (req, res) => {
    try {
        const recommendations = recommendCrops(req.body);
        if (!recommendations.length) return res.json({ message: 'No perfect match found. Showing best options.', recommendations: recommendCrops({ ...req.body, soilType: 'loamy' }) });
        res.json({ message: 'Crop recommendations ready!', count: recommendations.length, recommendations });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/crop/list
router.get('/list', (req, res) => {
    res.json({ crops: CROP_DATABASE.map(c => ({ name: c.name, nameTelugu: c.nameTelugu, emoji: c.emoji, season: c.season })) });
});

module.exports = router;
