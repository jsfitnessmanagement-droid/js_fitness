const express = require('express');
const router = express.Router();
const { createMember, getMembers, updateMember, updateMemberStatus, getMemberProfile, deleteMember } = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody, Joi } = require('../middleware/validateMiddleware');

const createMemberSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().allow('', null),
  password: Joi.string().allow('', null).optional(),
  membershipPlan: Joi.string().optional(),
  membershipTier: Joi.string().optional(),
  durationMonths: Joi.number().optional()
});

const updateMemberSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().allow('', null).optional(),
  password: Joi.string().allow('', null).optional(),
  membershipPlan: Joi.string().optional(),
  expirationDate: Joi.date().optional()
});

const updateStatusSchema = Joi.object({ status: Joi.string().valid('Active','Inactive').required() });

router.route('/')
  .post(protect, validateBody(createMemberSchema), createMember)
  .get(protect, admin, getMembers);

router.get('/profile', protect, getMemberProfile);

router.route('/:id')
  .put(protect, admin, validateBody(updateMemberSchema), updateMember)
  .delete(protect, admin, deleteMember);

router.patch('/:id/status', protect, admin, validateBody(updateStatusSchema), updateMemberStatus);

module.exports = router;
