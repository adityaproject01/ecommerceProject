const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

// 🔒 Add a product — Only sellers allowed
router.post('/add', verifyToken, (req, res) => {
  const user = req.user;

  // 🔐 Check role
  if (user.role !== 'seller') {
    return res.status(403).json({ message: 'Only sellers can add products' });
  }

  const { name, description, price, category, image_url } = req.body;

  // ✅ Validate input
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, Price, and Category are required' });
  }

  const sql = `
    INSERT INTO products (name, description, price, category, image_url, seller_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description || '', price, category, image_url || '', user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        message: 'Product added successfully',
        productId: result.insertId
      });
    }
  );
});

// 🌐 Get products with Search, Sort, Pagination, and Filters
router.get('/', (req, res) => {
  const {
    search,
    category,
    minPrice = 0,
    maxPrice = 999999,
    sortBy = 'id',
    sortOrder = 'asc',
    limit = 10,
    page = 1
  } = req.query;

  const validSortFields = ['price', 'name', 'id'];
  const validSortOrder = ['asc', 'desc'];

  const sortField = validSortFields.includes(sortBy) ? sortBy : 'id';
  const order = validSortOrder.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'ASC';

  const offset = (parseInt(page) - 1) * parseInt(limit);

  let baseSql = 'SELECT * FROM products';
  let countSql = 'SELECT COUNT(*) as total FROM products';
  let conditions = [];
  let values = [];

  // 🟡 Filtering Conditions
  if (search) {
    conditions.push('(name LIKE ? OR category LIKE ?)');
    values.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    conditions.push('category = ?');
    values.push(category);
  }

  conditions.push('price BETWEEN ? AND ?');
  values.push(minPrice, maxPrice);

  // 🧩 Apply WHERE clause
  if (conditions.length > 0) {
    const whereClause = ' WHERE ' + conditions.join(' AND ');
    baseSql += whereClause;
    countSql += whereClause;
  }

  baseSql += ` ORDER BY ${sortField} ${order} LIMIT ? OFFSET ?`;
  values.push(parseInt(limit), offset);

  // 🔁 First get total count
  db.query(countSql, values.slice(0, -2), (err, countResult) => {
    if (err) return res.status(500).json({ message: err.message });

    const total = countResult[0].total;

    // 🧪 Get filtered products
    db.query(baseSql, values, (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(200).json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        products: results
      });
    });
  });
});

// 🌐 Get product by ID (Public)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(results[0]);
  });
});

// ✏️ Update product (Only the owner or admin should be allowed ideally)
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  db.query(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ? WHERE id = ?',
    [name, description, price, category, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ message: 'Product updated successfully' });
    }
  );
});

// ❌ Delete product by ID
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;
