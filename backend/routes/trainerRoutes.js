const express = require('express');
const {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
} = require('../controllers/trainerController.js');

const router = express.Router();

router.route('/').get(getAllTrainers).post(createTrainer);

router
  .route('/:id')
  .get(getTrainerById)
  .put(updateTrainer)
  .delete(deleteTrainer);

module.exports = router;