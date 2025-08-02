const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// check token function
async function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "You must be logged in" });
  }

  try {
    const decoded = await promisify(jwt.verify)(
      authorization,
      process.env.SECRET_KEY
    );

    req.user = {
      _id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;
