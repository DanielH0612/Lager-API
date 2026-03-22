const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateStock,
  deleteProduct
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id/stock", updateStock);
router.delete("/:id", deleteProduct);

module.exports = router;
