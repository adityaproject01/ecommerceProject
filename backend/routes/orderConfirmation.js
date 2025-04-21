const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authMiddleware");

// 📦 Customer: View order confirmation after placing an order
router.get("/:order_id", verifyToken, (req, res) => {
  const user = req.user;
  const { order_id } = req.params;

  const sql = `SELECT * FROM orders WHERE id = ? AND user_id = ?`;
  db.query(sql, [order_id, user.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ confirmation: results[0] });
  });
});

// 📊 Admin: Confirm if an order has been processed successfully
router.get("/admin/:order_id", verifyToken, (req, res) => {
  const user = req.user;
  if (user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });

  const { order_id } = req.params;
  const sql = `SELECT * FROM orders WHERE id = ?`;

  db.query(sql, [order_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ adminConfirmation: results[0] });
  });
});

// 📬 Seller: Confirm order received and update fulfillment status
router.put("/seller/confirm/:order_id", verifyToken, (req, res) => {
  const user = req.user;
  if (user.role !== "seller")
    return res.status(403).json({ message: "Only sellers can access this" });

  const { order_id } = req.params;
  const sql = `
    UPDATE orders 
    SET seller_status = 'Confirmed' 
    WHERE id = ? AND seller_id = ?`;

  db.query(sql, [order_id, user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ message: "Order not found or not your order" });

    res.status(200).json({ message: "Order confirmed by seller" });
  });
});

module.exports = router;
