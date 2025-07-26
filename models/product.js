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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    id: { type: Number },
    name: { type: String, required:[ true,"name of category is required"] },
  },
 stock:{
    type:Number
 },
 brand:{
    type:String,
    required:[true,"brand is required"]
 }
});
module.exports = mongoose.model("Product", productSchema);
