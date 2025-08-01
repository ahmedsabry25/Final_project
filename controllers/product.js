const Productmodel = require("../models/product");
//add new product
const addProduct = async (req, res) => {
  const { title, brand, stock = 1, description, price, category } = req.body;

  try {
    const exist = await Productmodel.findOne({ title, brand });
    if (exist) {
      exist.stock += stock;
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
        ownerId: req.user._id
      });

      return res.status(201).json({
        message: "Product added successfully",
        product: newProduct,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to add/update product",
      error: error.message,
    });
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
  const id = req.params.id;
  const data = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    const product = await Productmodel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }


    if (userRole === "admin") {
      await Productmodel.findByIdAndUpdate(id, data, { new: true }); //new بيرجع اخر نسخة معدلة يعني بغد التحديث
      return res.status(200).json({ message: "Product updated by admin" });
    }

    // السماح للسيلر لو هو صاحب المنتج
    if (!product.ownerId || product.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    await Productmodel.findByIdAndUpdate(id, data, { new: true });
    return res.status(200).json({ message: "Product updated by seller" });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      message: "Cannot update product",
      error: err.message,
    });
  }
};


//delete the product by _ID function
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    const product = await Productmodel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (userRole === "admin") {
      await Productmodel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Product deleted by admin" });
    }

    if (!product.ownerId || product.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    if (product.stock > 1) {
      product.stock -= 1;
      await product.save();
      return res.status(200).json({ message: "Stock decreased by 1" });
    } else {
      await Productmodel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Product deleted completely by seller" });
    }

  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({
      message: "Error deleting product",
      error: err.message,
    });
  }
};



module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
