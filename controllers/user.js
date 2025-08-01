const usermodel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//delete user by _ID function
const deleteUser = async (req, res) => {
  var id = req.params.id;
  try {
    const User = await usermodel.findOne({ _id: id });
    if (!User) {
      return res.status(404).json({ message: "user not found" });
    } else {
      await usermodel.deleteOne({ _id: id });
      res.status(201).json({ message: "user deleted" });
    }
  } catch (err) {
    res.status(500).send({ message: "cannot delete user" });
  }
};
//update username of user by _ID function
const updateUser = async (req, res) => {
  var id = req.params.id;
  var { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "user name is required" });
  }
  try {
    const User = await usermodel.findOne({ _id: id });
    if (!User) {
      res.status(404).json({ message: "user not found" });
    } else {
      await usermodel.updateOne({ _id: id }, { username: username });
      res.status(201).json({ message: "user updated" });
    }
  } catch (err) {
    return res.status(500)("cannot update user");
  }
};
//get all user function
const getAllUser = async (req, res) => {
  const Allusers = await usermodel.find();
  res.status(200).json(Allusers);
};
//get user by _ID function
const getUser = async (req, res) => {
  const id = req.params.id;
  const User = await usermodel.findOne({ _id: id });
  if (!User) {
    return res.status(404).send({ message: "user not found" });
  } else {
    res.status(200).json(User);
  }
};

//Generate Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};
//register function
const register = async (req, res) => {
  const newUser = req.body;
  const exist = await usermodel.findOne({ email: newUser.email });
  if (exist) {
    return res.status(400).json({ message: "User already exists" });
  }
  const User = await usermodel.create(newUser);
  res.status(201).json({
    User,
    token: generateToken(User),
  });
};
//login function
const login = async (req, res) => {
  const { email, password } = req.body;
  const User = await usermodel.findOne({ email });
  if (!User || !(await User.matchPassword(password))) {
    return res.status(401).json({ message: "invalid email or password" });
  }
  res.status(200).json({
    User,
    token: generateToken(User),
  });
};
//forget password function
const forgetpassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }
  try {
    const User = await usermodel.findOne({ email: email });
    if (!User) {
      return res.status(404).json({ message: "email not found" });
    }
    const token = jwt.sign({ id: User._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    User.resetToken = token;
    User.resetTokenExpire = new (Date.now() + 10 * 60 * 1000)();
    await User.save();
    const link = `http://localhost:${process.env.PORT}/user/reset/${token}`;
    res.status(200).json({ message: link });
  } catch (err) {
    res.status(500).json({ message: "Error password" });
  }
};
//create new password
const resetpassword = async (req, res) => {
  const { token } = req.params;
  const { newpassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await usermodel.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "end" });
    }
    const salt = bcrypt.genSaltSync(15);
    var hashpassword = await bcrypt.hash(newpassword, salt);
    user.password = hashpassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    res.status(200).json({ message: "reset password successfully" });
  } catch (err) {
    res.status(400).json({ message: "error", error: err.message });
  }
};
//update password function
const updatepassword = async (req, res) => {
  const { email, password, newpassword } = req.body;
  if (!email || !password || !newpassword) {
    res.status(400).json({ message: "this fiealds is requird" });
  }
  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "user not found" });
    } else {
      await usermodel.updateOne({ email: email }, { password: newpassword });
      const salt = bcrypt.genSaltSync(15);
      var hashpassword = await bcrypt.hash(newpassword, salt);
      user.password = hashpassword;
      await user.save();
      res.status(201).json({ message: "password updated" });
    }
  } catch (err) {
    return res.status(500)("cannot update user");
  }
};
module.exports = {
  deleteUser,
  updateUser,
  getAllUser,
  getUser,
  register,
  login,
  updatepassword,
  forgetpassword,
  resetpassword,
};
