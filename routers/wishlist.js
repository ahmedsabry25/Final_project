const express = require('express');
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} = require('../controllers/wishlist.js');

router.post('/add', addToWishlist);
router.get('/:userId', getWishlist);
router.delete('/remove', removeFromWishlist);
router.delete('/clear/:userId', clearWishlist);

module.exports = router;
