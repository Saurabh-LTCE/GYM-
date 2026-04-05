const Fee = require('../models/Fee.js');

// Create fee record
exports.createFee = async (req, res, next) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    next(error);
  }
};

// Get all fee records
exports.getFees = async (req, res, next) => {
  try {
    const fees = await Fee.find()
      .populate('member', 'name email')
      .sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

// Get single fee record
exports.getFeeById = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id).populate(
      'member',
      'name email'
    );
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json(fee);
  } catch (error) {
    next(error);
  }
};

// Update fee record
exports.updateFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('member', 'name email');

    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json(fee);
  } catch (error) {
    next(error);
  }
};

// Delete fee record
exports.deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    next(error);
  }
};