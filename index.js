const express = require("express");
const app = express();
app.use(express.json());

//Encryption
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const mongourl = process.env.MONGO_URL;
const port = process.env.PORT;
// connect with database
mongoose
  .connect(mongourl)
  .then(() => {
    console.log(`hello from mongodb`);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

//import routes
const chatRoutes = require("./routers/chat");
const userRoutes = require("./routers/user");
const productRoutes = require("./routers/product");
const wishlistRoutes = require("./routers/wishlist");
const shippingRoutes = require("./routers/shipping");

//API path
app.use("/shipping", shippingRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/chat", chatRoutes);
app.listen(port, () => {
  console.log(`hello from port : ${port}`);
});
