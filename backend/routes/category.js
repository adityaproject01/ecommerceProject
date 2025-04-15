// backend/routes/category.js

const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
// ➕ Add category (admin only)

router.post("/add", verifyToken, upload.single("image"), (req, res) => {
  const user = req.user;
  const { name } = req.body;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can add categories" });
  }

  if (!name || !req.file) {
    return res
      .status(400)
      .json({ message: "Category name and image are required" });
  }

  const image_url = `/uploads/${req.file.filename}`;

  const sql = `INSERT INTO categories (name, image_url) VALUES (?, ?)`;
  db.query(sql, [name, image_url], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    res
      .status(201)
      .json({ message: "Category created", categoryId: result.insertId });
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
