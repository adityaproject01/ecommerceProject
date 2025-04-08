// backend/routes/category.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// ➕ Add category (admin only, optional)
router.post('/add', verifyToken, (req, res) => {
  const user = req.user;
  const { name } = req.body;

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can add categories' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Category already exists' });
      }
      return res.status(500).json({ message: err.message });
    }

    res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
  });
});

// 🌐 Get all categories
router.get('/', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(results);
  });
});

module.exports = router;
