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
router.post("/",auth, addProduct);
router.get("/",getAllProducts);
router.get("/:id", getProductById);
router.put("/:id",auth, updateProduct);
router.delete("/:id" ,auth,deleteProduct);
module.exports = router;
