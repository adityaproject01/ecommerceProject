// backend/routes/address.js

const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authMiddleware");

// 📮 CREATE: Add New Address
router.post("/", verifyToken, (req, res) => {
  const user = req.user;
  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  if (
    !full_name ||
    !phone ||
    !address_line1 ||
    !city ||
    !state ||
    !postal_code ||
    !country
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  const sql = `
    INSERT INTO address 
    (user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user.id,
      full_name,
      phone,
      address_line1,
      address_line2 || "",
      city,
      state,
      postal_code,
      country,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        message: "Address added successfully",
        addressId: result.insertId,
      });
    }
  );
});

// 📋 READ: Get All Addresses for Logged-in User
router.get("/", verifyToken, (req, res) => {
  const user = req.user;

  const sql = "SELECT * FROM address WHERE user_id = ?";
  db.query(sql, [user.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    res.status(200).json({ addresses: results });
  });
});

// ✏️ UPDATE: Update an Address
router.put("/:id", verifyToken, (req, res) => {
  const user = req.user;
  const addressId = req.params.id;
  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  if (
    !full_name ||
    !phone ||
    !address_line1 ||
    !city ||
    !state ||
    !postal_code ||
    !country
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  const sql = `
    UPDATE address SET 
      full_name = ?, phone = ?, address_line1 = ?, address_line2 = ?, 
      city = ?, state = ?, postal_code = ?, country = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      full_name,
      phone,
      address_line1,
      address_line2 || "",
      city,
      state,
      postal_code,
      country,
      addressId,
      user.id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Address not found or unauthorized" });
      }

      res.status(200).json({ message: "Address updated successfully" });
    }
  );
});

// ❌ DELETE: Delete an Address
router.delete("/:id", verifyToken, (req, res) => {
  const user = req.user;
  const addressId = req.params.id;

  const sql = "DELETE FROM address WHERE id = ? AND user_id = ?";

  db.query(sql, [addressId, user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Address not found or unauthorized" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  });
});

module.exports = router;
