
function isAdmin(req, res, next) {
  if ( req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
}

function isSeller(req, res, next) {
  if (req.user.role === "seller") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Sellers only." });
}

module.exports = { isAdmin, isSeller };
