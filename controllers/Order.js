const orderModel = require("../models/Order");
const productModel = require("../models/product");
const cartModel = require("../models/cart");

const addOrder = async (req, res) => {

  try {
    const {
      userId,
      paymentMethodType = "cash",
      shippingDetails,
      city,
      phoneNumber,
      isPaid
    } = req.body;
    //get cart
    const cart = await cartModel.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }
    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));
    let shippingPrice=50;
    const Total_Order_Price = cart.totalPrice + shippingPrice;
    const newOrder = await orderModel.create({
      user: userId,
      items: orderItems,
      productPrice: cart.totalPrice,
      ShippingPrice:shippingPrice,
      Total_Order_Price,
      paymentMethodType,
      shippingAddress: {
        address: shippingDetails,
        city,
        phone: phoneNumber
      },
      isPaid,
    });
    // check & decrement product stock
    if (newOrder) {
      for (let item of cart.items) {
        if (item.quantity > item.product.stock) {
          return res.status(400).json({ message: `Only ${item.product.stock} of "${item.product.title}" available.` });
        }
        await productModel.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity }
        });
      }
      await cartModel.deleteOne({ user: userId }); //deleted cart User

    }

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

const getOrder = async (req, res) => {
 const Id  = req.params.id;
  try {
const order = await orderModel.findOne({user:Id})
      // .populate({
      //   path: "user",
      //   select: "username -_id"
      // })
      .populate({
        path: "items.product",
        select: "title description price"
      });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};
module.exports = { addOrder,getOrder };
