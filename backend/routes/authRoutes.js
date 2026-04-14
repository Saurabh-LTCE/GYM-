const express = require('express');
const { firebaseAuth } = require('../controllers/authController.js');

const router = express.Router();

router.post('/firebase', firebaseAuth);

module.exports = router;
