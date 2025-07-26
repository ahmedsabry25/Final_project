const Productmodel = require("../models/product");
//add new product
const addProduct = async (req, res) => {
  const { title, brand, stock = 1, description, price, category } = req.body;
  //plus in the stock
  try {
    const exist = await Productmodel.findOne({ title, brand });
    if (exist) {
      exist.stock += stock ;
      await exist.save();
      return res.status(200).json({
        message: "Stock updated",
        product: exist,
      });
    } else {
      const newProduct = await Productmodel.create({
        title,
        brand,
        stock,
        description,
        price,
        category,
      });
      return res.status(201).json({
        product: newProduct,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add/update product", error: error.message });
  }
};

// display ALL products function
const getAllProducts = async (req, res) => {
  try {
    const ALLproducts = await Productmodel.find();
    res.status(200).json(ALLproducts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};
// display the product by _ID function
const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Productmodel.findOne({ _id: id });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  } else res.status(200).json(product);
};
//update the peoduct by _ID function
const updateProduct = async (req, res) => {
  var id = req.params.id;
  var products = req.body;
  if (!products) {
    return res.status(400).json({ message: "product is required" });
  }
  try {
    const product = await Productmodel.findById({ _id: id });
    if (!product) {
      res.status(404).json({ message: "product not found" });
    } else {
      await Productmodel.findByIdAndUpdate({ _id: id }, products);
      res.status(201).json({ message: "product updated" });
    }
  } catch (err) {
    return res.status(500)("cannot update product");
  }
};
//delete the product by _ID function
const deleteProduct = async (req, res) => {
  var id = req.params.id;
  try {
    const product = await Productmodel.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    } else {
      product.stock = product.stock - 1;
      await product.save();
      res.status(201).json({ message: "product deleted" });
    }
  } catch (err) {
    res.status(500).send({ message: "cannot delete poduct" });
  }
};
module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
