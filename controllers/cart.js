const Cart = require("../models/cart");
const Product = require("../models/product");

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send({ message: "Product not found" });
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
        totalPrice: product.price * quantity
      });
    } else {
      const index = cart.items.findIndex(item => item.product.toString() === productId);
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart.totalPrice = 0;
      for (const item of cart.items) {
        const prod = await Product.findById(item.product);
        cart.totalPrice += prod.price * item.quantity;
      }
    }
    await cart.save();
    res.status(200).send({ message: "Added to cart", cart });
  } catch (error) {
    res.status(500).send({ message: "Error", error });
  }
};
const getCart = async (req, res) => {
  const id = req.params.id;

  try {
    const cart = await Cart.findOne( {user:id} )
      .populate({
        path: "user",
        select: "username -_id"
      })
      .populate({
        path: "items.product",
        select: "title description price"
      });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
     .populate({
        path: "user",
        select: "username -_id"
      })
      .populate({
        path: "items.product",
        select: "title description price -_id"
      });
    if (!carts) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Carts fetched successfully",data:carts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching carts", error: error.message });
  }
};
const updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.totalPrice = 0;
    for (const item of cart.items) {
      const p = await Product.findById(item.product);
      cart.totalPrice += p.price * item.quantity;
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });

  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};
const removeItem= async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
    if (itemIndex === -1)
      return res.status(404).json({ message: "Product not found in cart" });

    cart.items.splice(itemIndex, 1);

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
};
 const deleteCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const deletedCart = await Cart.findOneAndDelete({ user: userId });

    if (!deletedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart", error: error.message });
  }
};

module.exports={addToCart,getCart,getAllCarts,updateCart,removeItem,deleteCart}