const express = require('express');
const {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
} = require('../controllers/feeController');

const router = express.Router();

router.route('/').get(getFees).post(createFee);

router.route('/:id').get(getFeeById).put(updateFee).delete(deleteFee);

module.exports = router;