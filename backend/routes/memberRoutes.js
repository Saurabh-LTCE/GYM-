const express = require('express');
const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require('../controllers/memberController.js');

const router = express.Router();

router.route('/').get(getMembers).post(createMember);

router.route('/:id').get(getMemberById).put(updateMember).delete(deleteMember);

module.exports = router;