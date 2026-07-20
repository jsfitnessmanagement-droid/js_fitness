const express = require('express');
const router = express.Router();

const { authUser, registerUser, refreshTokenHandler, logoutHandler, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody, Joi } = require('../middleware/validateMiddleware');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('member', 'admin').optional()
});

router.post('/login', validateBody(loginSchema), authUser);
router.post('/register', validateBody(registerSchema), registerUser);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', logoutHandler);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
