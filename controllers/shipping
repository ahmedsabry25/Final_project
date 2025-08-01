const Shippingmodel = require('../models/shipping');

// Add new shipping info
const Shipping = require('../models/shipping');

const addShipping = async (req, res) => {
  try {
    const data = req.body;
    const shipping = new Shipping(data);
    await shipping.save();
    res.status(201).json({ message: 'Shipping added', shipping });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add shipping', error: err.message });
  }
};

// Get all shipping infos
const getAllShipping = async (req, res) => {
  try {
    const shippingList = await Shipping.find().populate('product');
    res.status(200).json(shippingList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch shipping', error: err.message });
  }
};
// Get shipping by ID
const getShippingById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const shipping = await Shippingmodel.findOne({userId}).populate('userId', 'full_name');

    if (!shipping) {
      return res.status(404).json({ message: "Shipping info not found" });
    }

    res.status(200).json(shipping);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shipping info", error: error.message });
  }
};

// Update shipping
const updateShipping = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const shipping = await Shippingmodel.findOne({userId});
    if (!shipping) {
      return res.status(404).json({ message: "Shipping info not found" });
    }
    await Shippingmodel.updateOne({userId:userId},data);
    res.status(200).json({ message: "Shipping info updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update shipping info", error: error.message });
  }
};

// Delete shipping
const deleteShipping = async (req, res) => {
  try {
    const userId = req.params.userId;
    const shipping = await Shippingmodel.findOne({userId});
    if (!shipping) {
      return res.status(404).json({ message: "Shipping info not found" });
    }

    await Shippingmodel.deleteOne({userId});
    res.status(200).json({ message: "Shipping info deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete shipping info", error: error.message });
  }
};

module.exports = {
  addShipping,
  getAllShipping,
  getShippingById,
  updateShipping,
  deleteShipping
};
