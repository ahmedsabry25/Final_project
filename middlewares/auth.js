const jwt = require("jsonwebtoken");
const { promisify } = require("util");
//check token function
async function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  // Decryption the token function
  try {
    const decoded = await promisify(jwt.verify)(
      authorization,
      process.env.SECRET_KEY
    );
    req.id = decoded._id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;
