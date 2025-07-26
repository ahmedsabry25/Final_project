const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  deleteUser,
  updateUser,
  getAllUser,
  getUser,
  register,
  login,
  forgetpassword,
  resetpassword,
  updatepassword
} = require("../controllers/user");
router.get("/", auth, getAllUser);
router.get("/:id", auth, getUser);
router.delete("/:id", auth, deleteUser);
router.put("/:id", auth, updateUser);
router.post("/register", register);
router.post("/login", login);
router.post("/forget", forgetpassword);
router.post("/update", updatepassword);
router.post("/reset/:token", resetpassword);

module.exports = router;
