const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const KB_ENGLISH = {
    crop_recommendation: { patterns: ['best crop', 'which crop', 'grow what', 'crop for', 'suggest crop', 'recommend crop'], response: '🌱 For crop recommendations, visit the **Crop Recommendation** section. I need your soil type, season, and water availability to suggest the best crops. Common choices:\n• **Black soil** → Cotton, Soybean, Jowar\n• **Red soil** → Groundnut, Chilli, Sunflower\n• **Loamy soil** → Rice, Wheat, Maize, Vegetables' },
    fertilizer: { patterns: ['fertilizer', 'manure', 'npk', 'nitrogen', 'urea', 'dap', 'what to apply', 'soil nutrition'], response: '🌿 **Fertilizer Guide:**\n• **Nitrogen (N)**: Urea 46% N - for leafy growth\n• **Phosphorus (P)**: DAP 18-46-0 - for roots & flowering\n• **Potassium (K)**: MOP - for fruit quality & disease resistance\n• **Organic**: Vermicompost 2 tons/acre for long-term soil health\n\nFor specific recommendations, use the **Soil Health Analysis** tool! 🔬' },
    pest_control: { patterns: ['pest', 'insect', 'bug', 'caterpillar', 'aphid', 'control', 'spray', 'pesticide'], response: '🐛 **Integrated Pest Management (IPM):**\n**Biological**: Neem oil 5ml/L water, Trichogramma cards\n**Chemical**: Use pesticides only when pest crosses threshold level\n**Preventive**: Crop rotation, light traps, pheromone traps\n\n⚠️ Upload a leaf photo to **Disease Detection** for AI diagnosis!' },
    weather: { patterns: ['rain', 'weather', 'rainfall', 'temperature', 'drought', 'flood', 'monsoon', 'irrigate', 'irrigation'], response: '🌦️ **Weather Advisory:**\n• **Rainfall > 60%**: Avoid spraying pesticides or fertilizers\n• **High temperature (>35°C)**: Irrigate early morning (5-7 AM)\n• **Drought conditions**: Use drip/sprinkler irrigation, mulching\n• **Flood/waterlogging**: Ensure drainage channels are clear\n\nCheck real-time weather in the **Weather Widget**! 📊' },
    government: { patterns: ['scheme', 'subsidy', 'loan', 'pm kisan', 'insurance', 'government', 'benefit', 'apply'], response: '🏛️ **Key Government Schemes:**\n• **PM-KISAN**: ₹6,000/year direct transfer\n• **PM Fasal Bima**: Crop insurance against losses\n• **KCC**: Loans at just 4% interest\n• **PM Krishi Sinchai**: 55% subsidy on drip irrigation\n\nVisit **Government Schemes** section for eligibility & apply links!' },
    market: { patterns: ['price', 'market', 'sell', 'mandi', 'rate', 'profit', 'income', 'earnings', 'how much'], response: '💰 **Market Intelligence:**\n• Check live mandi prices in **Market Prices** section\n• Currently rising: Cotton (₹6,450/q), Chilli (₹12,500/q), Turmeric (₹8,500/q)\n• Use **Profit Calculator** to estimate earnings\n• Sell on **eNAM** portal for better prices without middlemen' },
    soil: { patterns: ['soil', 'ph', 'black soil', 'red soil', 'loamy', 'sandy', 'clay', 'fertile', 'soil health'], response: '🌍 **Soil Types & Best Crops:**\n• **Black (Regur) soil**: Cotton, Soybean, Jowar - holds moisture well\n• **Red soil**: Groundnut, Chilli, Sunflower - needs more fertilizer\n• **Loamy soil**: Rice, Wheat, Vegetables - most fertile type\n• **Sandy soil**: Bajra, Groundnut - needs drip irrigation\n\nUse **Soil Health Analysis** to know your soil\'s NPK levels!' },
    seed: { patterns: ['seed', 'variety', 'hybrid', 'improved variety', 'breed', 'seedling'], response: '🌰 **Quality Seeds Guide:**\n• Buy seeds from certified agencies (NSCM, NSC, state seed corporations)\n• Prefer **hybrid varieties** for 20-30% higher yield\n• Treat seeds with Thiram or Captan fungicide before sowing\n• Popular varieties: IR-64 (rice), HD-2967 (wheat), BT cotton\n\nCheck PM Fasal Bima for seed cost coverage!' },
    greeting: { patterns: ['hello', 'hi', 'help', 'hey', 'namaste', 'good morning', 'good evening', 'how are', 'who are'], response: '👋 **Namaste! I\'m AgriBot, your Smart Farming Assistant!**\n\nI can help you with:\n🌱 Crop selection & planning\n🌿 Fertilizer recommendations\n🐛 Pest & disease control\n🌦️ Weather advisories\n💰 Market prices & profit estimation\n🏛️ Government schemes & subsidies\n\nAsk me anything about farming! 🚜' },
    default: '🤔 I\'m here to help with farming questions! Ask me about:\n• Crop selection for your soil\n• Fertilizer & pest control\n• Weather & irrigation timing\n• Market prices & government schemes\n\nYou can also use voice input - press the 🎤 button!'
};

const KB_TELUGU = {
    crop_recommendation: { patterns: ['ఏ పంట', 'పంట ఏమి', 'పంట సూచన', 'పంట అడగు', 'పంట వేయాలి', 'మంచి పంట'], response: '🌱 **పంట సూచనలు:**\n• **నల్ల నేల** → పత్తి, సోయాబీన్, జొన్న\n• **ఎర్ర నేల** → వేరుశెనగ, మిర్చి, సూర్యకాంతి\n• **నల్లి నేల** → వరి, గోధుమ, మొక్కజొన్న\n\n**పంట సూచన** విభాగంలో మీ నేల రకం, సీజన్ వివరాలు ఇవ్వండి! 🌾' },
    fertilizer: { patterns: ['ఎరువు', 'యూరియా', 'డిఎపి', 'నత్రజని', 'పొటాషియం', 'ఫాస్పరస్', 'ఎరువులు'], response: '🌿 **ఎరువుల మార్గదర్శి:**\n• **నత్రజని (N)**: యూరియా - ఆకు పెరుగుదలకు\n• **ఫాస్పరస్ (P)**: డిఎపి - వేర్లు, పూత కోసం\n• **పొటాషియం (K)**: MOP - ఫలాల నాణ్యత\n• **సేంద్రియ**: వర్మీ కంపోస్ట్ - నేల సారం\n\n**నేల ఆరోగ్య విశ్లేషణ** వినియోగించండి! 🔬' },
    pest_control: { patterns: ['చీడ', 'పురుగు', 'తెగులు', 'వ్యాధి', 'వేప', 'పురుగు మందు'], response: '🐛 **సమీకృత చీడ నిర్వహణ:**\n**జీవ పద్ధతి**: వేప నూనె 5ml/లీటర్, ట్రైకోగ్రామా\n**రసాయన పద్ధతి**: అవసరమైనప్పుడే పురుగు మందులు\n**నివారణ**: పంట మార్పిడి, కాంతి ఉచ్చులు\n\n⚠️ ఆకు ఫోటో అప్లోడ్ చేసి **వ్యాధి గుర్తింపు** వినియోగించండి!' },
    weather: { patterns: ['వర్షం', 'వాతావరణం', 'ఉష్ణోగ్రత', 'కరువు', 'నీరు', 'సేద్యం', 'వాన'], response: '🌦️ **వాతావరణ సలహా:**\n• **వర్షపాత అవకాశం >60%**: పురుగు మందులు వేయవద్దు\n• **అధిక ఉష్ణం (>35°C)**: తెల్లవారుజామున నీరు పెట్టండి\n• **కరువు**: బొట్టు నీటి సేద్యం వాడండి\n\n**వాతావరణ విడ్జెట్**లో లైవ్ అప్డేట్లు చూడండి! 📊' },
    government: { patterns: ['పథకం', 'రాయితీ', 'రుణం', 'పీఎం కిసాన్', 'బీమా', 'ప్రభుత్వం'], response: '🏛️ **ప్రధాన ప్రభుత్వ పథకాలు:**\n• **పీఎం-కిసాన్**: సంవత్సరానికి ₹6,000 నేరుగా\n• **పీఎం పంట బీమా**: ప్రకృతి విపత్తుల నుండి రక్షణ\n• **కిసాన్ క్రెడిట్ కార్డ్**: 4% వడ్డీతో రుణాలు\n\n**ప్రభుత్వ పథకాలు** విభాగం చూడండి!' },
    market: { patterns: ['ధర', 'మార్కెట్', 'అమ్మకం', 'మండి', 'రేటు', 'లాభం', 'సంపాదన'], response: '💰 **మార్కెట్ సమాచారం:**\n• నేటి మండి ధరలు **మార్కెట్ ధరలు** విభాగంలో చూడండి\n• పెరుగుతున్నవి: పత్తి (₹6,450/q), మిర్చి (₹12,500/q)\n• **లాభ లెక్కల పరికరం** వాడి అంచనా వేయండి\n\neNAM పోర్టల్లో మధ్యవర్తి లేకుండా అమ్మకం చేయండి!' },
    greeting: { patterns: ['నమస్కారం', 'హలో', 'హాయ్', 'అందరికి', 'వందనాలు', 'ఎలా ఉన్నారు'], response: '👋 **నమస్కారం! నేను అగ్రిబాట్, మీ స్మార్ట్ వ్యవసాయ సహాయకుడు!**\n\nనేను సహాయపడగలను:\n🌱 పంట ఎంపిక & ప్రణాళిక\n🌿 ఎరువుల సిఫార్సులు\n🐛 చీడ & వ్యాధి నియంత్రణ\n🌦️ వాతావరణ సలహాలు\n💰 మార్కెట్ ధరలు & లాభ అంచనా\n\nఏదైనా అడగండి! 🚜' },
    default: '🤔 వ్యవసాయ విషయాలలో నేను సహాయపడతాను! అడగండి:\n• పంట ఎంపిక\n• ఎరువులు & చీడ నియంత్రణ\n• మార్కెట్ ధరలు\n• ప్రభుత్వ పథకాలు'
};

function getAIResponse(message, language = 'english') {
    const msg = message.toLowerCase();
    const kb = language === 'telugu' ? KB_TELUGU : KB_ENGLISH;
    for (const [key, data] of Object.entries(kb)) {
        if (key === 'default') continue;
        if (data.patterns && data.patterns.some(p => msg.includes(p))) {
            return data.response;
        }
    }
    return kb.default;
}

router.post('/', auth, (req, res) => {
    try {
        const { message, language = 'english' } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required.' });
        const response = getAIResponse(message, language);
        const timestamp = new Date().toISOString();
        res.json({ message: 'Response generated!', response, language, timestamp, sessionId: `session_${req.farmer.id}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
