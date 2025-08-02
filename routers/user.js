const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { isAdmin, isSeller } = require("../middlewares/roles");

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


router.get("/", auth, isAdmin, getAllUser);
router.get("/:id", auth, isAdmin, getUser);
router.delete("/:id", auth, isAdmin, deleteUser);
router.put("/:id", auth, isAdmin, updateUser);

router.post("/register", register);
router.post("/login", login);
router.post("/forget", forgetpassword);
router.post("/update", updatepassword);
router.post("/reset/:token", resetpassword);

module.exports = router;
