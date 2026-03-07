const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fallback weather data for demo when API key is not configured
const DEMO_WEATHER = {
    temperature: 28.5, feelsLike: 31.2, humidity: 72, windSpeed: 12,
    description: 'Partly cloudy with chance of showers', icon: '🌦️',
    rainfallProbability: 65, rainfall: 2.4, uvIndex: 6, visibility: 10,
    city: 'Hyderabad', country: 'IN',
    forecast: [
        { day: 'Today', high: 32, low: 22, rain: 65, icon: '🌦️', desc: 'Partly cloudy' },
        { day: 'Tomorrow', high: 29, low: 20, rain: 80, icon: '🌧️', desc: 'Heavy rain expected' },
        { day: 'Day 3', high: 31, low: 21, rain: 40, icon: '⛅', desc: 'Mostly cloudy' },
        { day: 'Day 4', high: 33, low: 23, rain: 20, icon: '🌤️', desc: 'Partly sunny' },
        { day: 'Day 5', high: 35, low: 24, rain: 10, icon: '☀️', desc: 'Sunny and hot' }
    ],
    alerts: ['⚠️ Heavy rainfall expected tomorrow. Avoid pesticide spraying.', '🌡️ Heatwave warning: Day 4-5 temperatures above 35°C. Irrigate crops early morning.']
};

// GET /api/weather/current?city=Hyderabad
router.get('/current', async (req, res) => {
    try {
        const city = req.query.city || 'Hyderabad';
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey || apiKey === 'your_openweather_api_key') {
            return res.json({ ...DEMO_WEATHER, city, note: 'Demo data - add OpenWeatherMap API key for live data' });
        }
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = response.data;
        const rainfallProbability = data.clouds?.all || 50;
        const alerts = [];
        if (rainfallProbability > 60) alerts.push('⚠️ Heavy rainfall expected. Avoid pesticide spraying.');
        if (data.main.temp > 38) alerts.push('🌡️ Extreme heat! Irrigate crops early morning.');
        if (data.wind.speed > 20) alerts.push('💨 Strong winds! Protect young crops and seedlings.');
        res.json({
            temperature: data.main.temp, feelsLike: data.main.feels_like, humidity: data.main.humidity,
            windSpeed: data.wind.speed, description: data.weather[0].description, icon: data.weather[0].icon,
            rainfallProbability, rainfall: data.rain?.['1h'] || 0, city: data.name, country: data.sys.country,
            forecast: DEMO_WEATHER.forecast, alerts
        });
    } catch (err) {
        res.json({ ...DEMO_WEATHER, note: 'Using demo data. API error: ' + err.message });
    }
});

// GET /api/weather/forecast
router.get('/forecast', async (req, res) => {
    res.json({ forecast: DEMO_WEATHER.forecast, alerts: DEMO_WEATHER.alerts });
});

module.exports = router;
