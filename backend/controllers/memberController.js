const Member = require('../models/Member');
const User = require('../models/User');
const MembershipPlan = require('../models/MembershipPlan');
const axios = require('axios');
const crypto = require('crypto');

// @desc    Create a new member (for signup flow)
// @route   POST /api/members
// @access  Private
const createMember = async (req, res, next) => {
  try {
    const { name, email, phone, password, membershipTier, durationMonths, membershipPlan } = req.body;
    
    let userId = req.user._id;
    let defaultPassword = null;

    // If admin provides name and email, create or find the User
    if (name && email) {
      let user = await User.findOne({ email });
      if (!user) {
        defaultPassword = password || 'JSFitness@123';
        user = await User.create({
          name,
          email,
          password: defaultPassword,
          role: 'member'
        });
      }
      userId = user._id;
    }
    
    // Get the membership plan by ID or Name
    let plan;
    if (membershipPlan) {
      plan = await MembershipPlan.findById(membershipPlan);
    } else if (membershipTier) {
      plan = await MembershipPlan.findOne({ planName: membershipTier });
    }

    if (!plan) {
      const err = new Error('Membership plan not found');
      err.statusCode = 404;
      return next(err);
    }

    const joinDate = new Date();
    const expirationDate = new Date();
    
    if (durationMonths) {
      expirationDate.setMonth(expirationDate.getMonth() + parseInt(durationMonths));
    } else {
      expirationDate.setDate(expirationDate.getDate() + plan.durationInDays);
    }

    const member = await Member.create({
      user: userId,
      phone,
      membershipPlan: plan._id,
      joinDate,
      expirationDate,
      status: 'Active'
    });

    // Populate the membership plan for the response
    await member.populate('membershipPlan');
    await member.populate('user', 'name email');

    res.status(201).json({ success: true, data: member, defaultPassword });
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
};

// @desc    Get all members
// @route   GET /api/members
// @access  Private/Admin
const getMembers = async (req, res, next) => {
  try {
    const members = await Member.find({}).populate('user', 'name email');
    res.json({ success: true, data: members });
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMember = async (req, res, next) => {
  try {
    const { phone, membershipPlan, expirationDate, email, password } = req.body;
    
    const member = await Member.findById(req.params.id).populate('user');
    if (member) {
      // Update User credentials if provided
      if (email || password) {
        const user = await User.findById(member.user._id);
        if (user) {
          if (email) user.email = email;
          if (password) user.password = password;
          await user.save();
        }
      }

      member.phone = phone || member.phone;
      if (membershipPlan) {
        member.membershipPlan = membershipPlan;
        // Recalculate expiration date if plan changed
        const plan = await MembershipPlan.findById(membershipPlan);
        if (plan) {
          const newExpiration = new Date();
          newExpiration.setDate(newExpiration.getDate() + plan.durationInDays);
          member.expirationDate = newExpiration;
        }
      }
      if (expirationDate) member.expirationDate = expirationDate;
      
      const updatedMember = await member.save();
      await updatedMember.populate('membershipPlan');
      await updatedMember.populate('user', 'name email');
      res.json({ success: true, data: updatedMember });
    } else {
      const err = new Error('Member not found');
      err.statusCode = 404;
      return next(err);
    }
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
};

// @desc    Update member status
// @route   PATCH /api/members/:id/status
// @access  Private/Admin
const updateMemberStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Active' or 'Inactive'
    
    const member = await Member.findById(req.params.id);
    if (member) {
      member.status = status;
      const updatedMember = await member.save();
      res.json({ success: true, data: updatedMember });
    } else {
      const err = new Error('Member not found');
      err.statusCode = 404;
      return next(err);
    }
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
};

// @desc    Get current member profile
// @route   GET /api/members/profile
// @access  Private
const getMemberProfile = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id }).populate('user', 'name email');
    if (member) {
      res.json({ success: true, data: member });
    } else {
      const err = new Error('Member profile not found');
      err.statusCode = 404;
      return next(err);
    }
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

// @desc    Delete a member and their user account
// @route   DELETE /api/members/:id
// @access  Private/Admin
const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id).populate('user');
    if (!member) {
      const err = new Error('Member not found');
      err.statusCode = 404;
      return next(err);
    }

    // Delete the associated User account (only if they are a member, not admin)
    if (member.user && member.user.role !== 'admin') {
      await User.findByIdAndDelete(member.user._id);
    }

    // Delete the member record
    await Member.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = { createMember, getMembers, updateMember, updateMemberStatus, getMemberProfile, deleteMember };

