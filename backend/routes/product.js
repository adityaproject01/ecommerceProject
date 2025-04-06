// backend/routes/product.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// 🔒 Add a product — Only sellers allowed
router.post('/add', verifyToken, (req, res) => {
  const user = req.user;

  // 🔐 Check role
  if (user.role !== 'seller') {
    return res.status(403).json({ message: 'Only sellers can add products' });
  }

  const { name, description, price, category, image_url } = req.body;

  // ✅ Validate input
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, Price, and Category are required' });
  }

  const sql = `
    INSERT INTO products (name, description, price, category, image_url, seller_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description || '', price, category, image_url || '', user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        message: 'Product added successfully',
        productId: result.insertId
      });
    }
  );
});

// 🌐 Get all products (Public)
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(results);
  });
});

// 🌐 Get product by ID (Public)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(results[0]);
  });
});

// ✏️ Update product (Only the owner or admin should be allowed ideally)
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  db.query(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ? WHERE id = ?',
    [name, description, price, category, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ message: 'Product updated successfully' });
    }
  );
});

// ❌ Delete product by ID
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;
