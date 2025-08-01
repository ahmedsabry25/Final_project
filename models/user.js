const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Userschema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    minLength: 5,
    match: /^[A-Za-z\u0600-\u06FF.\-\s]{5,40}$/,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    match:
      /^[a-zA-Z]{4,15}[0-9]{0,3}[-._]{0,1}[a-zA-Z]{0,15}(@)(gmail|yahoo|oulook|hotmail)(.com)/,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 6,
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*\-#@$])[A-Za-z\d*\-#@$]{8,}$/,
  },
  phonenumber: {
    type: String,
    trim: true,
    required: true,
    match: /^(01)(0|1|2|5)[0-9]{8}$/,
  },
  role: {
    type: String,
    trim: true,
    enum: ["user", "seller", "admin"],
    default: "user",
  },
  gender: {
    type: String,
    trim: true,
    enum: ["male", "female"],
    required: function () {
      return this.role === "seller";
    },
  },
  BankAccount: {
    type: String,
    trim: true,
    required: function () {
      return this.role === "seller";
    },
  },
  address: {
    type: String,
    trim: true,
    required: function () {
      return this.role === "seller";
    },
  },
  age: {
    type: Number,
    min: 18,
    required: function () {
      return this.role === "seller";
    },
  },
  resetToken: {
    type: String,
  },
  resetTokenExpire: {
    type: Date,
  },
});
// hash password
Userschema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});
//compare the password and hash password
Userschema.methods.matchPassword = function (enterPassword) {
  return bcrypt.compare(enterPassword, this.password);
};
const usermodel = mongoose.model("user", Userschema);
module.exports = usermodel;
