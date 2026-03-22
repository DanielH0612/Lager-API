const pool = require("../db/db");

const getProducts = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, price, stock_quantity } = req.body;

    if (!name || !sku || price == null || stock_quantity == null) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    const result = await pool.query(
      `INSERT INTO products (name, sku, price, stock_quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, sku, price, stock_quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (stock_quantity == null) {
      return res.status(400).json({ message: "stock_quantity is required" });
    }

    const result = await pool.query(
      `UPDATE products
       SET stock_quantity = $1
       WHERE id = $2
       RETURNING *`,
      [stock_quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateStock,
  deleteProduct
};
