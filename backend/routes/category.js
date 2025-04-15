// backend/routes/category.js

const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authMiddleware");

// ➕ Add category (admin only)
// Expects: { "name": "Category Name", "image_url": "https://example.com/image_url.jpg" }
router.post("/add", verifyToken, (req, res) => {
  const user = req.user;
  const { name, image_url } = req.body;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can add categories" });
  }

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const sql = "INSERT INTO categories (name, image_url) VALUES (?, ?)";
  db.query(sql, [name, image_url || ""], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Category already exists" });
      }
      return res.status(500).json({ message: err.message });
    }

    res.status(201).json({
      message: "Category added successfully",
      categoryId: result.insertId,
    });
  });
});

// 🌐 Get all categories
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(results);
  });
});

// 🔄 Update category (admin only)
// Expects JSON body with fields to update, for example: { "name": "New Name", "image_url": "https://example.com/new-image_url.jpg" }
router.put("/:id", verifyToken, (req, res) => {
  const user = req.user;
  const categoryId = req.params.id;
  const { name, image_url } = req.body;

  if (user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can update categories" });
  }

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const sql = "UPDATE categories SET name = ?, image_url = ? WHERE id = ?";
  db.query(sql, [name, image_url || "", categoryId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully" });
  });
});

// ❌ Delete category (admin only)
router.delete("/:id", verifyToken, (req, res) => {
  const user = req.user;
  const categoryId = req.params.id;

  if (user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can delete categories" });
  }

  const sql = "DELETE FROM categories WHERE id = ?";
  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  });
});

// Optional: Get single category by ID
router.get("/:id", (req, res) => {
  const categoryId = req.params.id;
  const sql = "SELECT * FROM categories WHERE id = ?";
  db.query(sql, [categoryId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(results[0]);
  });
});

module.exports = router;
