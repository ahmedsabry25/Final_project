const express = require("express");
const router = express.Router();
const { addToCart,getCart,getAllCarts ,updateCart,removeItem,deleteCart} = require("../controllers/cart");

router.post("/add", addToCart);
router.get("/get", getAllCarts);
router.get("/:id", getCart);
router.patch("/update", updateCart);
router.delete("/removeItem", removeItem);
router.delete("/", deleteCart);

module.exports = router;
