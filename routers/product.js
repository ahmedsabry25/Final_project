const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/product");

const { isSellerOrAdmin, isAdmin } = require("../middlewares/roles");

router.post("/", auth, isSellerOrAdmin, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", auth, isSellerOrAdmin, updateProduct);
router.delete("/:id", auth, isSellerOrAdmin, deleteProduct);

module.exports = router;