const express = require("express");
const router = express.Router();
const { addOrder,getOrder } = require("../controllers/Order");

router.post("/add",addOrder);
router.get("/:id",getOrder);

module.exports = router;
