const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authMiddleware");

// 📦 Customer: View personal order history
router.get("/customer", verifyToken, (req, res) => {
  const user = req.user;
  if (user.role !== "customer")
    return res.status(403).json({ message: "Only customers can access this" });

  const sql = `
    SELECT * FROM orders 
    WHERE user_id = ? 
    ORDER BY order_date DESC`;

  db.query(sql, [user.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json({ orderHistory: results });
  });
});

// 🧾 Seller: View all orders containing their products
router.get("/seller", verifyToken, (req, res) => {
  const user = req.user;
  if (user.role !== "seller")
    return res.status(403).json({ message: "Only sellers can access this" });

  const sql = `
    SELECT * FROM orders 
    WHERE seller_id = ? 
    ORDER BY order_date DESC`;

  db.query(sql, [user.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json({ sellerOrders: results });
  });
});

// 🧮 Admin: View all order history across platform
router.get("/admin", verifyToken, (req, res) => {
  const user = req.user;
  if (user.role !== "admin")
    return res.status(403).json({ message: "Only admins can access this" });

  const sql = `
    SELECT * FROM orders 
    ORDER BY order_date DESC`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json({ allOrders: results });
  });
});

module.exports = router;
