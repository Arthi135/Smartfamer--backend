const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fallback weather data for demo when API key is not configured
const DEMO_WEATHER = {
    temperature: 28.5, feelsLike: 31.2, humidity: 72, windSpeed: 12,
    description: 'Partly cloudy with chance of showers', icon: '🌦️',
    rainfallProbability: 65, rainfall: 2.4, uvIndex: 6, visibility: 10,
    country: 'IN',
    forecast: [
        { day: 'Today', high: 32, low: 22, rain: 65, icon: '🌦️', desc: 'Partly cloudy' },
        { day: 'Tomorrow', high: 29, low: 20, rain: 80, icon: '🌧️', desc: 'Heavy rain expected' },
        { day: 'Day 3', high: 31, low: 21, rain: 40, icon: '⛅', desc: 'Mostly cloudy' },
        { day: 'Day 4', high: 33, low: 23, rain: 20, icon: '🌤️', desc: 'Partly sunny' },
        { day: 'Day 5', high: 35, low: 24, rain: 10, icon: '☀️', desc: 'Sunny and hot' }
    ],
    alerts: ['⚠️ Heavy rainfall expected tomorrow. Avoid pesticide spraying.', '🌡️ Heatwave warning: Day 4-5 temperatures above 35°C. Irrigate crops early morning.']
};

// GET /api/weather/current?city=Hyderabad or ?lat=17.3850&lon=78.4867
router.get('/current', async (req, res) => {
    const { city } = req.query;
    const demoCity = city || 'Hyderabad';
    res.json({ ...DEMO_WEATHER, city: demoCity, country: 'IN' });
});

// GET /api/weather/forecast
router.get('/forecast', async (req, res) => {
    res.json({ forecast: DEMO_WEATHER.forecast, alerts: DEMO_WEATHER.alerts });
});

// GET /api/weather/history
router.get('/history', async (req, res) => {
    const history = [
        { date: '2024-03-01', temperature: 26.5, humidity: 65, rainfall: 0, description: 'Sunny' },
        { date: '2024-03-02', temperature: 28.2, humidity: 70, rainfall: 1.2, description: 'Light rain' },
        { date: '2024-03-03', temperature: 27.8, humidity: 68, rainfall: 0, description: 'Partly cloudy' },
        { date: '2024-03-04', temperature: 29.1, humidity: 72, rainfall: 0.5, description: 'Scattered showers' },
        { date: '2024-03-05', temperature: 30.5, humidity: 75, rainfall: 0, description: 'Hot and humid' },
        { date: '2024-03-06', temperature: 25.3, humidity: 60, rainfall: 2.1, description: 'Heavy rain' },
        { date: '2024-03-07', temperature: 24.5, humidity: 55, rainfall: 0, description: 'Clear sky' }
    ];
    res.json({ history });
});

module.exports = router;
