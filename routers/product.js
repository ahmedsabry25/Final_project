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

const { isSeller, isAdmin } = require("../middlewares/roles");

router.post("/", auth, isSeller, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", auth, isSeller, updateProduct);
router.delete("/:id", auth, isSeller, deleteProduct);

module.exports = router;