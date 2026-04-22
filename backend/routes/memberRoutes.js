const express = require('express');
const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require('../controllers/memberController.js');

const router = express.Router();

router.route('/').get(getAllMembers).post(createMember);

router.route('/:id').get(getMemberById).put(updateMember).delete(deleteMember);

module.exports = router;