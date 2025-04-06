const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // ✅ replaces body-parser

// ✅ API Routes
app.use('/api/auth', authRoutes);

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('E-Commerce API is running...');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
