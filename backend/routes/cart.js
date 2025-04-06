const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// 🛒 Add to Cart (Only Customers)
router.post('/add', verifyToken, (req, res) => {
  const user = req.user;

  if (user.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers can add to cart' });
  }

  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  db.query(sql, [user.id, product_id, quantity], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    res.status(201).json({ message: 'Product added to cart' });
  });
});
// 🛒 View Cart Items
router.get('/items', verifyToken, (req, res) => {
    const user = req.user;
  
    if (user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can view cart items' });
    }
  
    const sql = `
      SELECT 
        c.id AS cart_id,
        p.id AS product_id,
        p.name,
        p.price,
        p.category,
        p.image_url,
        c.quantity,
        (p.price * c.quantity) AS total_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
  
    db.query(sql, [user.id], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
  
      res.status(200).json(results);
    });
  });
  

module.exports = router;
