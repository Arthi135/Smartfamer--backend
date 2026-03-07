const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    location: {
        state: { type: String, required: true },
        district: { type: String, required: true },
        village: { type: String, required: true }
    },
    landSize: { type: Number, required: true },
    soilType: { type: String, enum: ['black', 'red', 'loamy', 'sandy', 'clay', 'alluvial', 'laterite'], required: true },
    waterAvailability: { type: String, enum: ['abundant', 'moderate', 'scarce', 'rainfed'], required: true },
    preferredLanguage: { type: String, enum: ['english', 'telugu', 'hindi'], default: 'english' },
    avatar: { type: String, default: '' },
    farmingExperience: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

farmerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

farmerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Farmer', farmerSchema);
