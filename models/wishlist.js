const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Wishlistmodel = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlistmodel
