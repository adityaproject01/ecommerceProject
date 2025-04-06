const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing JSON requests

// API Routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api', protectedRoutes);  // Apply after other routes that need to be public
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('E-Commerce API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
