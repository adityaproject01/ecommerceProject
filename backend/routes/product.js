const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to add a product
router.post('/add', verifyToken, (req, res) => {
   const user = req.user;

  // ✅ Role check
  if (user.role !== 'seller') {
    return res.status(403).json({ message: 'Only sellers can add products' });
  }

  const { name, description, price, category, image_url } = req.body;

  // ✅ Validation
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, Price, and Category are required' });
  }

  const sql = `INSERT INTO products (name, description, price, category, image_url, seller_id) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [name, description, price, category, image_url || null, user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        message: 'Product added successfully',
        productId: result.insertId
      });
    }
  );
});
// Get all products
router.get('/all', (req, res) => {
    const sql = `
      SELECT 
        p.id, p.name, p.description, p.price, p.category, p.image_url,
        u.name AS seller_name, u.email AS seller_email
      FROM products p
      JOIN users u ON p.seller_id = u.id
      ORDER BY p.created_at DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
  
      res.status(200).json(results);
    });
  });

module.exports = router;