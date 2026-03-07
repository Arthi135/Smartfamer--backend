const express = require('express');
const router = express.Router();

const MARKET_DATA = [
    { cropName: 'Rice', cropNameTelugu: 'వరి', mandiName: 'Kurnool Mandi', state: 'Andhra Pradesh', district: 'Kurnool', minPrice: 1700, maxPrice: 2100, modalPrice: 1860, trend: 'rising', unit: 'quintal', icon: '🌾' },
    { cropName: 'Wheat', cropNameTelugu: 'గోధుమ', mandiName: 'Guntur Mandi', state: 'Andhra Pradesh', district: 'Guntur', minPrice: 2000, maxPrice: 2400, modalPrice: 2180, trend: 'stable', unit: 'quintal', icon: '🌿' },
    { cropName: 'Cotton', cropNameTelugu: 'పత్తి', mandiName: 'Adilabad Mandi', state: 'Telangana', district: 'Adilabad', minPrice: 5800, maxPrice: 7200, modalPrice: 6450, trend: 'rising', unit: 'quintal', icon: '🤍' },
    { cropName: 'Maize', cropNameTelugu: 'మొక్కజొన్న', mandiName: 'Nizamabad Mandi', state: 'Telangana', district: 'Nizamabad', minPrice: 1300, maxPrice: 1700, modalPrice: 1480, trend: 'stable', unit: 'quintal', icon: '🌽' },
    { cropName: 'Groundnut', cropNameTelugu: 'వేరుశెనగ', mandiName: 'Narasaraopet Mandi', state: 'Andhra Pradesh', district: 'Guntur', minPrice: 4500, maxPrice: 6000, modalPrice: 5200, trend: 'rising', unit: 'quintal', icon: '🥜' },
    { cropName: 'Chilli', cropNameTelugu: 'మిర్చి', mandiName: 'Guntur Mandi', state: 'Andhra Pradesh', district: 'Guntur', minPrice: 10000, maxPrice: 15000, modalPrice: 12500, trend: 'rising', unit: 'quintal', icon: '🌶️' },
    { cropName: 'Onion', cropNameTelugu: 'ఉల్లిపాయ', mandiName: 'Kurnool Mandi', state: 'Andhra Pradesh', district: 'Kurnool', minPrice: 800, maxPrice: 2000, modalPrice: 1350, trend: 'falling', unit: 'quintal', icon: '🧅' },
    { cropName: 'Tomato', cropNameTelugu: 'టొమాటో', mandiName: 'Hyderabad Mandi', state: 'Telangana', district: 'Hyderabad', minPrice: 600, maxPrice: 2500, modalPrice: 1200, trend: 'falling', unit: 'quintal', icon: '🍅' },
    { cropName: 'Turmeric', cropNameTelugu: 'పసుపు', mandiName: 'Nizamabad Mandi', state: 'Telangana', district: 'Nizamabad', minPrice: 7000, maxPrice: 10000, modalPrice: 8500, trend: 'rising', unit: 'quintal', icon: '💛' },
    { cropName: 'Soybean', cropNameTelugu: 'సోయాబీన్', mandiName: 'Warangal Mandi', state: 'Telangana', district: 'Warangal', minPrice: 3500, maxPrice: 4500, modalPrice: 4000, trend: 'stable', unit: 'quintal', icon: '🌱' },
    { cropName: 'Sunflower', cropNameTelugu: 'సూర్యకాంతి', mandiName: 'Kurnool Mandi', state: 'Andhra Pradesh', district: 'Kurnool', minPrice: 4800, maxPrice: 6200, modalPrice: 5400, trend: 'stable', unit: 'quintal', icon: '🌻' },
    { cropName: 'Sugarcane', cropNameTelugu: 'చెరుకు', mandiName: 'Nellore Mandi', state: 'Andhra Pradesh', district: 'Nellore', minPrice: 280, maxPrice: 380, modalPrice: 330, trend: 'stable', unit: 'quintal', icon: '🎋' }
];

router.get('/prices', (req, res) => {
    const lastUpdated = new Date().toISOString();
    const pricesWithChange = MARKET_DATA.map(item => ({
        ...item,
        priceChange: item.trend === 'rising' ? `+₹${Math.floor(Math.random() * 200 + 50)}` : item.trend === 'falling' ? `-₹${Math.floor(Math.random() * 150 + 30)}` : 'Stable',
        lastUpdated
    }));
    res.json({ prices: pricesWithChange, totalCrops: MARKET_DATA.length, lastUpdated });
});

router.get('/compare', (req, res) => {
    const { crops } = req.query;
    const cropList = crops ? crops.split(',') : MARKET_DATA.map(d => d.cropName).slice(0, 6);
    const comparison = MARKET_DATA.filter(d => cropList.includes(d.cropName) || cropList.length === 0);
    res.json({ comparison });
});

module.exports = router;
