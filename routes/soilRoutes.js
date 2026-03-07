const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

function analyzeSoil({ soilType, pH, nitrogen, phosphorus, potassium }) {
    let score = 0;
    const suggestions = [];
    const organic = [];
    const rotation = [];

    // pH scoring (optimal 6.0–7.5)
    if (pH >= 6.0 && pH <= 7.5) score += 30;
    else if (pH >= 5.5 && pH < 6.0) { score += 20; suggestions.push('Apply lime to raise pH (Dolomite limestone recommended)'); }
    else if (pH > 7.5 && pH <= 8.5) { score += 15; suggestions.push('Apply sulfur or gypsum to lower pH'); }
    else { score += 0; suggestions.push('Critical pH imbalance - consult agricultural officer'); }

    // Nitrogen (optimal 200-400 kg/ha)
    if (nitrogen >= 200 && nitrogen <= 400) score += 25;
    else if (nitrogen >= 100 && nitrogen < 200) { score += 15; suggestions.push('Apply Urea (46-0-0) @ 50 kg/acre'); }
    else if (nitrogen < 100) { score += 5; suggestions.push('Urgent: Apply nitrogen fertilizer - DAP or Urea'); organic.push('Add farm yard manure (FYM) 5 tons/acre'); }
    else { score += 10; suggestions.push('Reduce nitrogen - risk of toxicity'); }

    // Phosphorus (optimal 25-50 kg/ha available)
    if (phosphorus >= 25 && phosphorus <= 50) score += 25;
    else if (phosphorus >= 10 && phosphorus < 25) { score += 15; suggestions.push('Apply Single Super Phosphate (SSP) @ 40 kg/acre'); }
    else if (phosphorus < 10) { score += 5; suggestions.push('Urgent: Apply DAP (18-46-0) @ 30 kg/acre'); organic.push('Add bone meal or rock phosphate'); }
    else { score += 10; }

    // Potassium (optimal 150-300 kg/ha)
    if (potassium >= 150 && potassium <= 300) score += 20;
    else if (potassium >= 80 && potassium < 150) { score += 12; suggestions.push('Apply Muriate of Potash (MOP) @ 30 kg/acre'); }
    else if (potassium < 80) { score += 4; suggestions.push('Urgent: Low potassium - apply K2O fertilizer'); organic.push('Add wood ash or banana peel compost'); }
    else { score += 8; }

    // Soil type bonus
    if (['loamy', 'alluvial'].includes(soilType)) score += 5;
    organic.push('Add vermicompost 2 tons/acre for organic carbon');
    organic.push('Practice green manuring with Dhaincha or Sesbania');
    rotation.push('Cereal → Legume → Vegetable rotation recommended');
    rotation.push('After rice: sow dal crops to restore nitrogen');
    if (soilType === 'black') rotation.push('Black soil: Cotton → Jowar → Bengalgram cycle');
    if (soilType === 'red') rotation.push('Red soil: Groundnut → Sunflower → Pearl millet');

    let healthRating = 'weak';
    if (score >= 75) healthRating = 'strong';
    else if (score >= 50) healthRating = 'moderate';

    return { healthScore: Math.min(score, 100), healthRating, suggestedFertilizers: suggestions, organicMethods: organic, cropRotation: rotation };
}

// POST /api/soil/analyze
router.post('/analyze', auth, (req, res) => {
    try {
        const { soilType, pH, nitrogen, phosphorus, potassium, organicMatter, moisture } = req.body;
        if (!soilType || pH === undefined || nitrogen === undefined) {
            return res.status(400).json({ message: 'Please provide soilType, pH, nitrogen, phosphorus, potassium values.' });
        }
        const result = analyzeSoil({ soilType, pH: parseFloat(pH), nitrogen: parseFloat(nitrogen), phosphorus: parseFloat(phosphorus || 0), potassium: parseFloat(potassium || 0) });
        res.json({ message: 'Soil analysis complete!', ...result, soilType, pH, nitrogen, phosphorus, potassium });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
