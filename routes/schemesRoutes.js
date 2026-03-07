const express = require('express');
const router = express.Router();

const SCHEMES = [
    { id: 1, name: 'PM-KISAN Samman Nidhi', nameTelugu: 'పీఎం కిసాన్', icon: '💰', ministry: 'Ministry of Agriculture', benefit: '₹6,000 per year direct benefit transfer in 3 installments of ₹2,000', eligibility: ['Land-holding farmer families', 'Subject to certain exclusion criteria', 'Should have valid Aadhaar'], documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records (Pahani/Adangal)', 'Mobile Number linked to Aadhaar'], applyLink: 'https://pmkisan.gov.in', status: 'Active', category: 'income_support' },
    { id: 2, name: 'PM Fasal Bima Yojana', nameTelugu: 'పంట భీమా', icon: '🛡️', ministry: 'Ministry of Agriculture', benefit: 'Crop insurance against natural calamities, pests, and diseases', eligibility: ['All farmers - loanee and non-loanee', 'Sharecroppers and tenant farmers eligible', 'Kharif and Rabi crop coverage'], documents: ['Aadhaar Card', 'Bank Passbook', 'Sowing Certificate from Village Officer', 'Land Records'], applyLink: 'https://pmfby.gov.in', status: 'Active', category: 'insurance' },
    { id: 3, name: 'Kisan Credit Card (KCC)', nameTelugu: 'కిసాన్ క్రెడిట్ కార్డ్', icon: '💳', ministry: 'RBI / NABARD', benefit: 'Affordable credit up to ₹3 lakh at 4% interest rate for crop cultivation', eligibility: ['All farmers, croppers, allied and non-farm activities', 'Tenant farmers and sharecroppers', 'Self Help Group members'], documents: ['Application Form', 'Identity Proof', 'Address Proof', 'Land Records', 'Passport Photo'], applyLink: 'https://www.nabard.org', status: 'Active', category: 'credit' },
    { id: 4, name: 'Soil Health Card Scheme', nameTelugu: 'నేల ఆరోగ్య కార్డు', icon: '🌱', ministry: 'Ministry of Agriculture', benefit: 'Free soil testing and personalized fertilizer recommendations for your farm', eligibility: ['All farmers across India', 'Testing done every 2 years'], documents: ['Aadhaar Card', 'Land Record or Patta', 'Mobile Number'], applyLink: 'https://soilhealth.dac.gov.in', status: 'Active', category: 'technical_support' },
    { id: 5, name: 'eNAM - National Agriculture Market', nameTelugu: 'ఈ-నామ్', icon: '🏪', ministry: 'Ministry of Agriculture', benefit: 'Online trading platform for agri commodities - better prices without middlemen', eligibility: ['Farmers with registered produce', 'Available in 1000+ mandis across India'], documents: ['Aadhaar Card', 'Bank Account', 'Mandi registration'], applyLink: 'https://enam.gov.in', status: 'Active', category: 'marketing' },
    { id: 6, name: 'PM Krishi Sinchai Yojana', nameTelugu: 'పీఎం సించాయి', icon: '💧', ministry: 'Ministry of Agriculture', benefit: 'Subsidy up to 55% for drip/sprinkler irrigation equipment', eligibility: ['Small and marginal farmers priority', 'SC/ST farmers get 10% extra subsidy', 'Self Help Groups eligible'], documents: ['Aadhaar', 'Bank Details', 'Land Records', 'Quotation from dealer'], applyLink: 'https://pmksy.gov.in', status: 'Active', category: 'irrigation' },
    { id: 7, name: 'National Food Security Mission', nameTelugu: 'ఆహార భద్రతా మిషన్', icon: '🌾', ministry: 'Ministry of Agriculture', benefit: 'Free quality seeds, demonstrations, and training for rice, wheat, pulse farmers', eligibility: ['Farmers in mission districts', 'Focus on small and marginal farmers'], documents: ['Farmer Identity Card', 'Land Records', 'Aadhaar'], applyLink: 'https://nfsm.gov.in', status: 'Active', category: 'seeds' },
    { id: 8, name: 'Rashtriya Krishi Vikas Yojana', nameTelugu: 'రాష్ట్రీయ వ్యవసాయ వికాస యోజన', icon: '📈', ministry: 'Ministry of Agriculture', benefit: 'Grants for agricultural infrastructure, storage, processing units up to ₹25 lakhs', eligibility: ['Farmer Producer Organizations', 'State Government implementing agencies', 'Individual farmers through state projects'], documents: ['Project Report', 'Land Records', 'Bank Statement', 'Aadhaar'], applyLink: 'https://rkvy.nic.in', status: 'Active', category: 'infrastructure' }
];

router.get('/schemes', (req, res) => {
    const { category } = req.query;
    let schemes = SCHEMES;
    if (category) schemes = SCHEMES.filter(s => s.category === category);
    res.json({ schemes, total: schemes.length });
});

router.get('/schemes/:id', (req, res) => {
    const scheme = SCHEMES.find(s => s.id === parseInt(req.params.id));
    if (!scheme) return res.status(404).json({ message: 'Scheme not found.' });
    res.json(scheme);
});

module.exports = router;
