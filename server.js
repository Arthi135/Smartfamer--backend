const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:3000','https://smartfamer-forntend.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crop', require('./routes/cropRoutes'));
app.use('/api/soil', require('./routes/soilRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/disease', require('./routes/diseaseRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/schemes', require('./routes/schemesRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/expense', require('./routes/expenseRoutes'));
app.use('/api/yield', require('./routes/yieldRoutes'));
app.use('/api/irrigation', require('./routes/irrigationRoutes'));

app.get('/', (req, res) => res.json({ message: '🌾 Smart Farmer API is running!', status: 'OK' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🌱 Smart Farmer Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});
