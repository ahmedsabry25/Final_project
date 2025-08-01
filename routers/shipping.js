const express = require('express');
const router = express.Router();

const {
  addShipping,
  getAllShipping,
  getShippingById,
  updateShipping,
  deleteShipping
} = require('../controllers/shipping.js');

router.post('/add', addShipping);
router.get('/', getAllShipping);
router.get('/:userId', getShippingById);
router.put('/update/:userId', updateShipping);
router.delete('/delete/:userId', deleteShipping);

module.exports = router;
