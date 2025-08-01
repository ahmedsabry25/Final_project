
function isAdmin(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
}

function isSeller(req, res, next) {
  if (req.user.role === "seller" || req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Sellers or Admin only." });
}

module.exports = { isAdmin, isSeller };
