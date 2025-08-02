const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  Images: {
    url: { type: String, require: true },
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    id: { type: Number },
    name: { type: String, required: [true, "name of category is required"] },
  },
  stock: {
    type: Number,
  },
  brand: {
    type: String,
    required: [true, "brand is required"],
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
});
module.exports = mongoose.model("product", productSchema);
