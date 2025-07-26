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
const userRoutes = require("./routers/user");
const productRoutes = require("./routers/product");
//API path
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.listen(port, () => {
  console.log(`hello from port : ${port}`);
});
