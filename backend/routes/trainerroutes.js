const express = require('express');
const {
  createTrainer,
  getTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
} = require('../controllers/trainerController');

const router = express.Router();

router.route('/').get(getTrainers).post(createTrainer);

router
  .route('/:id')
  .get(getTrainerById)
  .put(updateTrainer)
  .delete(deleteTrainer);

module.exports = router;