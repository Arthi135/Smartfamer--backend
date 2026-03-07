const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const inMemoryExpenses = [];

router.post('/', auth, (req, res) => {
    try {
        const { cropName, season, expenses, expectedRevenue, landSize, notes } = req.body;
        const totalExpense = Object.values(expenses || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
        const profit = (parseFloat(expectedRevenue) || 0) - totalExpense;
        const expense = { id: Date.now().toString(), farmerId: req.farmer.id, cropName, season, expenses, totalExpense, expectedRevenue: parseFloat(expectedRevenue) || 0, profit, landSize, notes, status: 'ongoing', createdAt: new Date().toISOString() };
        inMemoryExpenses.push(expense);
        res.status(201).json({ message: 'Expense recorded!', expense });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', auth, (req, res) => {
    const farmerExpenses = inMemoryExpenses.filter(e => e.farmerId === req.farmer.id);
    const totalProfit = farmerExpenses.reduce((sum, e) => sum + (e.profit || 0), 0);
    const totalSpent = farmerExpenses.reduce((sum, e) => sum + (e.totalExpense || 0), 0);
    res.json({ expenses: farmerExpenses, summary: { totalExpenses: totalSpent, totalProfit, totalRecords: farmerExpenses.length } });
});

router.delete('/:id', auth, (req, res) => {
    const idx = inMemoryExpenses.findIndex(e => e.id === req.params.id && e.farmerId === req.farmer.id);
    if (idx === -1) return res.status(404).json({ message: 'Expense not found.' });
    inMemoryExpenses.splice(idx, 1);
    res.json({ message: 'Expense deleted.' });
});

module.exports = router;
