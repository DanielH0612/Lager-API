const express = require("express");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const pool = require("./db/db");

app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use(errorHandler);

module.exports = app;
