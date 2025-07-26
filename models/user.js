const mongoose = require("mongoose");
const bcrypt=require("bcrypt")
const validator = require("validator");
const Userschema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "seller"],
    default: "user"
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: function () {
      return this.role === "seller";
    },
  },
  BankAccount: {
    type: String,
    required: function () {
      return this.role === "seller";
    }
  },
  address: {
    type: String,
    required: function () {
      return this.role === "seller";
    }
  },
  age: {
    type: Number,
    min: 18,
    required: function () {
      return this.role === "seller";
    }
  },
  resetToken: {
  type: String
},
resetTokenExpire: {
  type: Date
}
});
// hash password
Userschema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) {
        next(err);
    }

});
//compare the password and hash password
Userschema.methods.matchPassword = function(enterPassword) {
    return bcrypt.compare(enterPassword, this.password);
};
const usermodel=mongoose.model("user",Userschema)
module.exports=usermodel

