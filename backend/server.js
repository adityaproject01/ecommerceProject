const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');


// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// API Routes
app.use('/api/auth', authRoutes);  // Authentication routes

// Protected Routes (Ensure this is only for protected routes)
app.use('/api', protectedRoutes);  // Apply after other routes that need to be public

// Default Route
app.get('/', (req, res) => {
  res.send('E-Commerce API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
