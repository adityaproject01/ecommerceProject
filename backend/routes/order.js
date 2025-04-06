// backend/routes/order.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// 🛒 Place an Order
router.post('/place', verifyToken, (req, res) => {
  const user = req.user;

  if (user.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers can place orders' });
  }

  // 1. Get cart items
  const getCartQuery = 'SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?';
  db.query(getCartQuery, [user.id], (err, cartItems) => {
    if (err) return res.status(500).json({ message: err.message });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Calculate total price
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // 3. Begin transaction
    db.beginTransaction(err => {
      if (err) return res.status(500).json({ message: err.message });

      // 4. Insert into orders table
      const insertOrderQuery = 'INSERT INTO orders (user_id, total) VALUES (?, ?)';
      db.query(insertOrderQuery, [user.id, total], (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ message: err.message }));

        const orderId = result.insertId;

        // 5. Insert into order_items
        const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
        const itemsData = cartItems.map(item => [orderId, item.product_id, item.quantity, item.price]);

        db.query(orderItemsQuery, [itemsData], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ message: err.message }));

          // 6. Clear the cart
          db.query('DELETE FROM cart WHERE user_id = ?', [user.id], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ message: err.message }));

            // 7. Commit
            db.commit(err => {
              if (err) return db.rollback(() => res.status(500).json({ message: err.message }));

              res.status(201).json({ message: 'Order placed successfully', orderId });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
