const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authMiddleware");

// ➕ Create Order (Only Customers)
router.post("/add", verifyToken, async (req, res) => {
  const user = req.user;
  const { items, total_price, address_id } = req.body;

  if (user.role !== "customer") {
    return res.status(403).json({ message: "Only customers can place orders" });
  }

  if (!items || !total_price || !address_id) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  const sql = `
    INSERT INTO orders (user_id, address_id, total, status) 
    VALUES (?, ?, ?, 'pending')
  `;

  db.query(sql, [user.id, address_id, total_price], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    const orderId = result.insertId;
    const orderItems = items.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
    ]);

    const orderItemsSql =
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";

    db.query(orderItemsSql, [orderItems], (err) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({ message: "Order placed successfully", orderId });
    });
  });
});

// 🚨 Add this line to fix the crash!
module.exports = router;
