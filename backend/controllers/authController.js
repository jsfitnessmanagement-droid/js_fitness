const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
// use Node's crypto.randomUUID to avoid ESM-only uuid package issues in tests
const mongoose = require('mongoose');
// No per-request DB reconnects; server connects once at startup

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '7d' });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      // generate access and refresh tokens
      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken();
      const tokenId = crypto.randomUUID();

      // store hashed refresh token on user with id for efficient lookup
      const hash = await bcrypt.hash(refreshToken, 10);
      user.refreshTokens = user.refreshTokens || [];
      user.refreshTokens.push({ id: tokenId, tokenHash: hash });
      await user.save();

      // set httpOnly cookie for refresh token containing id:token
      const cookieVal = `${tokenId}:${refreshToken}`;
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.COOKIE_SAMESITE || 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
      };
      if (process.env.COOKIE_DOMAIN) cookieOptions.domain = process.env.COOKIE_DOMAIN;
      // if sameSite is 'none' ensure secure is true (required by browsers)
      if ((cookieOptions.sameSite === 'none' || String(cookieOptions.sameSite).toLowerCase() === 'none') && !cookieOptions.secure) cookieOptions.secure = true;
      res.cookie('refreshToken', cookieVal, cookieOptions);

      res.json({ success: true, data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: accessToken
      }});
    } else {
      return res.status(401).json({ success: false, error: { message: 'Invalid email or password' } });
    }
    } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc    Register a new user (for initial setup or admin use)
// @route   POST /api/auth/register
// @access  Public (should be protected in production, or seeded)
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const role = 'member'; // Force member role, prevent escalation

    // Disallow open registration unless explicitly enabled
    if (process.env.ALLOW_REGISTRATION !== 'true') {
      return res.status(403).json({ success: false, error: { message: 'Registration is disabled' } });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: { message: 'User already exists' } });
    }

    const user = await User.create({ name, email, password, role });
    if (user) {
      res.status(201).json({ success: true, data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }});
    } else {
      return res.status(400).json({ success: false, error: { message: 'Invalid user data' } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc Refresh access token using httpOnly refresh cookie
// @route POST /api/auth/refresh
// @access Public (cookie required)
const refreshTokenHandler = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, error: { message: 'No refresh token' } });
    }

    // cookie contains tokenId:token
    const parts = token.split(':');
    if (!parts || parts.length !== 2) {
      return res.status(401).json({ success: false, error: { message: 'Invalid refresh token format' } });
    }
    const [tokenId, tokenValue] = parts;

    // find user by token id
    const user = await User.findOne({ 'refreshTokens.id': tokenId });
    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'Invalid refresh token' } });
    }

    const rtEntry = user.refreshTokens.find(r => r.id === tokenId);
    if (!rtEntry) {
      return res.status(401).json({ success: false, error: { message: 'Invalid refresh token' } });
    }

    const ok = await bcrypt.compare(tokenValue, rtEntry.tokenHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: { message: 'Invalid refresh token' } });
    }

    const accessToken = generateToken(user._id);
    res.json({ success: true, data: { token: accessToken } });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc Logout (invalidate refresh token cookie)
// @route POST /api/auth/logout
const logoutHandler = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.refreshToken;
    if (token) {
      // expect token format tokenId:token
      const parts = token.split(':');
      if (parts && parts.length === 2) {
        const tokenId = parts[0];
        // remove token entry by id
        const user = await User.findOne({ 'refreshTokens.id': tokenId });
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(rt => rt.id !== tokenId);
          await user.save();
        }
      }
    }
    const clearOptions = { path: '/' };
    if (process.env.COOKIE_DOMAIN) clearOptions.domain = process.env.COOKIE_DOMAIN;
    res.clearCookie('refreshToken', clearOptions);
    res.json({ success: true, data: { message: 'Logged out' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc Change user password
// @route PUT /api/auth/change-password
// @access Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: { message: 'Current and new password are required' } });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: { message: 'Incorrect current password' } });
    }

    // Update password (mongoose pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, data: { message: 'Password updated successfully' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc Send password reset email
// @route POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: { message: 'Email is required' } });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists for security
      return res.json({ success: true, data: { message: 'If that email is registered, a reset link has been sent.' } });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // Build the reset URL using the frontend origin
    const frontendUrl = process.env.CORS_ORIGIN || 'https://js-fitness-sandy.vercel.app';
    const resetUrl = `${frontendUrl.split(',')[0].trim()}/reset-password?token=${resetToken}`;

    // Send the email
    const { sendEmail } = require('../services/emailService');
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset for your JS Fitness account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset My Password</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
        <p>Stay strong,<br>— The JS Fitness Team</p>
      </div>
    `;
    await sendEmail(user.email, 'Password Reset - JS Fitness', html);

    res.json({ success: true, data: { message: 'If that email is registered, a reset link has been sent.' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc Reset password using token
// @route POST /api/auth/reset-password
// @access Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: { message: 'Token and new password are required' } });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: { message: 'Invalid or expired reset token. Please request a new one.' } });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, data: { message: 'Password reset successfully! You can now log in.' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

module.exports = { authUser, registerUser, refreshTokenHandler, logoutHandler, changePassword, forgotPassword, resetPassword };

