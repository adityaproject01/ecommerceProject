const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");

// ➕ Setup Multer Storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/"); // Save images to 'uploads/products/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Save file with unique name
  },
});

const upload = multer({ storage: storage });

// 🔒 Add a product — Only sellers allowed
router.post("/add", verifyToken, upload.single("image"), async (req, res) => {
  const user = req.user;

  if (user.role !== "seller") {
    return res.status(403).json({ message: "Only sellers can add products" });
  }

  const { name, description } = req.body;
  const baseUrl = req.protocol + "://" + req.get("host");
  const imageFilename = req.file
    ? `${baseUrl}/uploads/products/${req.file.filename}`
    : null;
  const price = parseFloat(req.body.price);
  const category_id = parseInt(req.body.category_id);

  if (!name || !price || !category_id || !imageFilename) {
    return res.status(400).json({
      message: "Name, Price, Category ID, and Image are required",
    });
  }

  const sql = `
    INSERT INTO products (name, description, price, category_id, image_url, seller_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description || "", price, category_id, imageFilename, user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        message: "Product added successfully",
        productId: result.insertId,
      });
    }
  );
});

// 🧾 Get products added by the current seller
router.get("/my-products", verifyToken, (req, res) => {
  const user = req.user;

  if (user.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Only sellers can view their products" });
  }

  const sql = `SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC`;

  db.query(sql, [user.id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    res.status(200).json({
      sellerId: user.id,
      products: results,
    });
  });
});

// 🌐 Get products with Search, Sort, Pagination, and Filters
router.get("/", (req, res) => {
  const {
    search,
    category,
    minPrice = 0,
    maxPrice = 999999,
    sortBy = "id",
    sortOrder = "asc",
    limit = 10,
    page = 1,
  } = req.query;

  const validSortFields = ["price", "name", "id"];
  const validSortOrder = ["asc", "desc"];

  const sortField = validSortFields.includes(sortBy) ? sortBy : "id";
  const order = validSortOrder.includes(sortOrder.toLowerCase())
    ? sortOrder
    : "ASC";

  const offset = (parseInt(page) - 1) * parseInt(limit);

  let baseSql = "SELECT * FROM products";
  let countSql = "SELECT COUNT(*) as total FROM products";
  let conditions = [];
  let values = [];

  // 🟡 Filtering Conditions
  if (search) {
    conditions.push("(name LIKE ? OR category LIKE ?)");
    values.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    conditions.push("category = ?");
    values.push(category);
  }

  conditions.push("price BETWEEN ? AND ?");
  values.push(minPrice, maxPrice);

  // 🧩 Apply WHERE clause
  if (conditions.length > 0) {
    const whereClause = " WHERE " + conditions.join(" AND ");
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
        products: results,
      });
    });
  });
});

// 🌐 Get product by ID (Public)
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(results[0]);
  });
});

// ✏️ Update product (Only the owner or admin should be allowed ideally)

router.put("/:id", verifyToken, upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const user = req.user;
  const baseUrl = req.protocol + "://" + req.get("host");
  const imageFilename = req.file
    ? `${baseUrl}/uploads/products/${req.file.filename}`
    : null;
  const price = parseFloat(req.body.price);
  const category_id = parseInt(req.body.category_id);

  // Get the product and check if seller matches
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Product not found" });

    const product = results[0];

    if (user.role !== "admin" && user.id !== product.seller_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this product" });
    }

    const baseUrl = req.protocol + "://" + req.get("host");
    const image_url = req.file
      ? `${baseUrl}/uploads/products/${req.file.filename}`
      : product.image_url; // keep old image if new one isn't uploaded

    const updateSQL = `
      UPDATE products
      SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?
      WHERE id = ?
    `;

    db.query(
      updateSQL,
      [
        name,
        description,
        parseFloat(price),
        parseInt(category_id),
        image_url,
        id,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        return res
          .status(200)
          .json({ message: "Product updated successfully" });
      }
    );
  });
});
// DELETE product by ID
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  console.log("Deleting product with ID:", id);

  // Step 1: Delete from cart
  db.query("DELETE FROM cart WHERE product_id = ?", [id], (cartErr) => {
    if (cartErr) {
      console.error("Error deleting from cart:", cartErr);
      return res.status(500).json({
        message: "Failed to delete from cart",
        error: cartErr.message,
      });
    }
    db.query(
      "DELETE FROM order_items WHERE product_id = ?",
      [id],
      (orderErr) => {
        if (orderErr) {
          console.error("Error deleting from order_items:", orderErr);
          return res.status(500).json({
            message: "Failed to delete from order_items",
            error: orderErr.message,
          });
        }

        db.query(
          "DELETE FROM products WHERE id = ?",
          [id],
          (productErr, result) => {
            if (productErr) {
              console.error("Error deleting from products:", productErr);
              return res.status(500).json({
                message: "Failed to delete product",
                error: productErr.message,
              });
            }

            if (result.affectedRows === 0) {
              return res.status(404).json({ message: "Product not found" });
            }

            return res
              .status(200)
              .json({ message: "Product deleted successfully" });
          }
        );
      }
    );
  });
});

module.exports = router;
