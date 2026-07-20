const Progress = require('../models/Progress');
const Member = require('../models/Member');

// @desc    Log weight progress
// @route   POST /api/progress
// @access  Private (Member)
const logProgress = async (req, res, next) => {
  try {
    const { date, weight } = req.body;
    
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      const err = new Error('Member profile not found');
      err.statusCode = 404;
      return next(err);
    }

    const progress = await Progress.create({
      member: member._id,
      date: date || new Date(),
      weight
    });

    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
};

// @desc    Get progress history
// @route   GET /api/progress/:memberId
// @access  Private
const getProgressHistory = async (req, res, next) => {
  try {
    if (req.user.role === 'member') {
      const memberProfile = await Member.findOne({ user: req.user._id });
      if (!memberProfile || memberProfile._id.toString() !== req.params.memberId) {
        const err = new Error('Not authorized to view this data');
        err.statusCode = 403;
        return next(err);
      }
    }

    const progress = await Progress.find({ member: req.params.memberId }).sort({ date: 1 });
    res.json({ success: true, data: progress });
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = { logProgress, getProgressHistory };
