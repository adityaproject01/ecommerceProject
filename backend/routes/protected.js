const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  const userId = req.user.id;
  const { name, password } = req.body;

  if (!name && !password) {
    return res.status(400).json({ message: 'Name or password required to update' });
  }

  const fields = [];
  const values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }

  if (password) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync(password, 10);
    fields.push('password = ?');
    values.push(hashedPassword);
  }

  values.push(userId);

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

  const db = require('../db');
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    res.json({ message: 'Profile updated successfully' });
  });
});

module.exports = router;
