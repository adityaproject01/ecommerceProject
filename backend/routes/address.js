const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// 📮 CREATE: Add New Address
router.post('/', verifyToken, (req, res) => {
  const user = req.user;
  const { street, city, state, zipcode, country, phone_number } = req.body;

  if (!street || !city || !state || !zipcode || !country) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO address
    (user_id, address_line, city, state, pincode, country, phone_number) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user.id, street, city, state, zipcode, country, phone_number], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    res.status(201).json({
      message: 'Address added successfully',
      addressId: result.insertId
    });
  });
});

// 📋 READ: Get All Addresses for Logged-in User
router.get('/', verifyToken, (req, res) => {
  const user = req.user;

  const sql = 'SELECT * FROM addresses WHERE user_id = ?';
  db.query(sql, [user.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    res.status(200).json({ addresses: results });
  });
});

// ✏️ UPDATE: Update an Address
router.put('/:id', verifyToken, (req, res) => {
  const user = req.user;
  const { street, city, state, zipcode, country, phone_number } = req.body;
  const addressId = req.params.id;

  if (!street || !city || !state || !zipcode || !country) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    UPDATE addresses 
    SET address_line = ?, city = ?, state = ?, pincode = ?, country = ?, phone_number = ? 
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [street, city, state, zipcode, country, phone_number, addressId, user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found or unauthorized' });
    }

    res.status(200).json({ message: 'Address updated successfully' });
  });
});

// ❌ DELETE: Delete an Address
router.delete('/:id', verifyToken, (req, res) => {
  const user = req.user;
  const addressId = req.params.id;

  const sql = 'DELETE FROM addresses WHERE id = ? AND user_id = ?';

  db.query(sql, [addressId, user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found or unauthorized' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  });
});

module.exports = router;
