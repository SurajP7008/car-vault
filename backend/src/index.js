require('dotenv').config();
const express = require('express');
const cors = require('cors');
const carsRouter = require('./routes/cars');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/cars', carsRouter);

app.listen(PORT, () => {
  console.log(`CarVault API running on http://localhost:${PORT}`);
});
