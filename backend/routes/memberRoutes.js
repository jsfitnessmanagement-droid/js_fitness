const express = require('express');
const router = express.Router();
const { createMember, getMembers, updateMember, updateMemberStatus, getMemberProfile } = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody, Joi } = require('../middleware/validateMiddleware');

const createMemberSchema = Joi.object({
  phone: Joi.string().allow('', null),
  membershipPlan: Joi.string().required()
});

const updateMemberSchema = Joi.object({
  phone: Joi.string().optional(),
  membershipPlan: Joi.string().optional(),
  expirationDate: Joi.date().optional()
});

const updateStatusSchema = Joi.object({ status: Joi.string().valid('Active','Inactive').required() });

router.route('/')
  .post(protect, validateBody(createMemberSchema), createMember)
  .get(protect, admin, getMembers);

router.get('/profile', protect, getMemberProfile);

router.route('/:id')
  .put(protect, admin, validateBody(updateMemberSchema), updateMember);

router.patch('/:id/status', protect, admin, validateBody(updateStatusSchema), updateMemberStatus);

module.exports = router;
