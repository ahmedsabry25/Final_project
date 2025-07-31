const usermodel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Generate Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role, 
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};


const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phonenumber,
      role,
      gender,
      BankAccount,
      address,
      age
    } = req.body;

    // تحقق من وجود المستخدم
    const exist = await usermodel.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // إنشاء يوزر جديد
    const newUser = new usermodel({
      username,
      email,
      password,
      phonenumber,
      role,
      gender,
      BankAccount,
      address,
      age,
    });

   
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};


// Login function
const login = async (req, res) => {
  const { email, password } = req.body;
  const User = await usermodel.findOne({ email });

  if (!User || !(await bcrypt.compare(password, User.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ User, token: generateToken(User) });
};

// Delete user by ID
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await usermodel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await usermodel.deleteOne({ _id: id });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Cannot delete user", error: err.message });
  }
};

// Update username
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await usermodel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    await user.save();

    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Cannot update user", error: err.message });
  }
};

// Get all users
const getAllUser = async (req, res) => {
  const users = await usermodel.find();
  res.status(200).json(users);
};

// Get user by ID
const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await usermodel.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

// Forget password
const forgetpassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const link = `http://localhost:${process.env.PORT}/user/reset/${token}`;
    res.status(200).json({ message: link });

  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

// Reset password
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
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });

  } catch (err) {
    res.status(400).json({ message: "Error", error: err.message });
  }
};

// Update password
const updatepassword = async (req, res) => {
  const { email, password, newpassword } = req.body;

  if (!email || !password || !newpassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated" });

  } catch (err) {
    res.status(500).json({ message: "Cannot update password", error: err.message });
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
