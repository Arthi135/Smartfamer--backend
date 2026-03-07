const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

// In-memory fallback store when MongoDB is unavailable
const inMemoryFarmers = [];

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, mobile, email, password, location, landSize, soilType, waterAvailability, preferredLanguage } = req.body;
        if (!name || !mobile || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }
        try {
            const existing = await Farmer.findOne({ $or: [{ email }, { mobile }] });
            if (existing) return res.status(400).json({ message: 'Farmer with this email or mobile already exists.' });
            const farmer = new Farmer({ name, mobile, email, password, location, landSize, soilType, waterAvailability, preferredLanguage });
            await farmer.save();
            const token = jwt.sign({ id: farmer._id, name: farmer.name, email: farmer.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ message: 'Registration successful!', token, farmer: { id: farmer._id, name: farmer.name, email: farmer.email, preferredLanguage: farmer.preferredLanguage, soilType: farmer.soilType, location: farmer.location } });
        } catch (dbErr) {
            // Fallback: in-memory
            const exists = inMemoryFarmers.find(f => f.email === email || f.mobile === mobile);
            if (exists) return res.status(400).json({ message: 'Farmer already exists.' });
            const bcrypt = require('bcryptjs');
            const passwordHash = await bcrypt.hash(password, 12);
            const farmer = { id: Date.now().toString(), name, mobile, email, passwordHash, location, landSize, soilType, waterAvailability, preferredLanguage };
            inMemoryFarmers.push(farmer);
            const token = jwt.sign({ id: farmer.id, name: farmer.name, email: farmer.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ message: 'Registration successful! (offline mode)', token, farmer: { id: farmer.id, name: farmer.name, email: farmer.email, preferredLanguage, soilType, location } });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
        try {
            const farmer = await Farmer.findOne({ email });
            if (!farmer) return res.status(401).json({ message: 'Invalid credentials.' });
            const isMatch = await farmer.comparePassword(password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
            const token = jwt.sign({ id: farmer._id, name: farmer.name, email: farmer.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ message: 'Login successful!', token, farmer: { id: farmer._id, name: farmer.name, email: farmer.email, preferredLanguage: farmer.preferredLanguage, soilType: farmer.soilType, location: farmer.location, landSize: farmer.landSize } });
        } catch (dbErr) {
            const bcrypt = require('bcryptjs');
            const farmer = inMemoryFarmers.find(f => f.email === email);
            if (!farmer) return res.status(401).json({ message: 'Invalid credentials.' });
            const isMatch = await bcrypt.compare(password, farmer.passwordHash);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
            const token = jwt.sign({ id: farmer.id, name: farmer.name, email: farmer.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ message: 'Login successful! (offline mode)', token, farmer: { id: farmer.id, name: farmer.name, email: farmer.email, preferredLanguage: farmer.preferredLanguage, soilType: farmer.soilType, location: farmer.location } });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/auth/profile
router.get('/profile', require('../middleware/auth'), async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.farmer.id).select('-password');
        if (!farmer) return res.status(404).json({ message: 'Farmer not found.' });
        res.json(farmer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
