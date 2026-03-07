const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    cropName: { type: String, required: true },
    season: { type: String },
    expenses: {
        seeds: { type: Number, default: 0 },
        fertilizers: { type: Number, default: 0 },
        pesticides: { type: Number, default: 0 },
        labor: { type: Number, default: 0 },
        irrigation: { type: Number, default: 0 },
        machinery: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    totalExpense: { type: Number, default: 0 },
    expectedRevenue: { type: Number, default: 0 },
    actualRevenue: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    landSize: { type: Number },
    notes: { type: String },
    status: { type: String, enum: ['ongoing', 'harvested', 'sold'], default: 'ongoing' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
