const express = require("express");
const router = express.Router();
const {send_message,get_user_messages} =require("../controllers/chat")
router.post("/",send_message)
router.get("/:userId",get_user_messages)
module.exports=router