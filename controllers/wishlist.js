const Wishlistmodel = require('../models/wishlist');

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const newwish = req.body;
    const exist = await Wishlistmodel.findOne({userId:newwish.userId,product:newwish.product});
    if (exist) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }
      const wish = await Wishlistmodel.create(newwish);
    res.status(201).json({ message: "Added to wishlist",wish});
  } catch (error) {
    res.status(500).json({ message: "Failed to add to wishlist", error: error.message });
  }
};

// Get wishlist by user ID
const getWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;
     if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
    const list = await Wishlistmodel.find({userId})
    .populate("userId","username")
    .populate("product","title")
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};

// Remove single item
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, product } = req.body;

    const result = await Wishlistmodel.deleteOne({ userId, product });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

// Clear wishlist for user
const clearWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;
    await Wishlistmodel.deleteMany({ userId: userId });
    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear wishlist", error: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
};
