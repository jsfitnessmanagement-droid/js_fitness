const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

// @desc    Log attendance
// @route   POST /api/attendance
// @access  Private/Admin
const logAttendance = async (req, res, next) => {
  try {
    const { memberId, date, timeIn, timeOut } = req.body;
    
    // verify member exists
    const member = await Member.findById(memberId);
    if (!member) {
      const err = new Error('Member not found');
      err.statusCode = 404;
      return next(err);
    }

    const attendance = await Attendance.create({
      member: memberId,
      date,
      timeIn,
      timeOut
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
};

// @desc    Get attendance history for a member
// @route   GET /api/attendance/:memberId
// @access  Private
const getAttendanceHistory = async (req, res, next) => {
  try {
    // If user is a member, they can only see their own attendance
    if (req.user.role === 'member') {
      const memberProfile = await Member.findOne({ user: req.user._id });
      if (!memberProfile || memberProfile._id.toString() !== req.params.memberId) {
        const err = new Error('Not authorized to view this data');
        err.statusCode = 403;
        return next(err);
      }
    }

    const attendance = await Attendance.find({ member: req.params.memberId }).sort({ date: -1 });
    res.json({ success: true, data: attendance });
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = { logAttendance, getAttendanceHistory };
