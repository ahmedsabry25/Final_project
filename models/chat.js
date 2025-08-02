const mongoose = require("mongoose");

const chatschema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  message: {
    type: String,
    required: true,
  },

  reply: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatmodel = mongoose.model("chat", chatschema);
module.exports = chatmodel;
