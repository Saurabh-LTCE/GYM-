const Trainer = require('../models/Trainer');

// Create trainer
exports.createTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch (error) {
    next(error);
  }
};

// Get all trainers
exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (error) {
    next(error);
  }
};

// Get single trainer
exports.getTrainerById = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

// Update trainer
exports.updateTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

// Delete trainer
exports.deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    next(error);
  }
};