const pool = require("../db/db");

const getOrders = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemsResult = await pool.query(
      `SELECT oi.id, oi.quantity, p.name, p.sku
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { customer_name, items } = req.body;

    if (!customer_name || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders (customer_name)
       VALUES ($1)
       RETURNING *`,
      [customer_name]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        throw new Error("Each order item must include a valid product_id and quantity");
      }

      const productResult = await client.query(
        "SELECT * FROM products WHERE id = $1",
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product with id ${item.product_id} does not exist`);
      }

      const product = productResult.rows[0];

      if (product.stock_quantity < item.quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [order.id, item.product_id, item.quantity]
      );

      await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const allowedStatuses = ["received", "picked", "sent"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};
