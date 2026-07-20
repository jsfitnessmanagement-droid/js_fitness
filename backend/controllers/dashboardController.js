const Member = require('../models/Member');

// @desc    Get dashboard analytics
// @route   GET /api/dashboard/analytics
// @access  Private/Admin
const getDashboardAnalytics = async (req, res, next) => {
  try {
    // 1. Total Active Members
    const activeMembersCount = await Member.countDocuments({ status: 'Active' });

    // 2. Memberships Expiring in 7 Days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const expiringMembers = await Member.find({
      status: 'Active',
      expirationDate: { $lte: sevenDaysFromNow, $gte: new Date() }
    }).populate('user', 'name email');

    // 3. Revenue This Month (Mock implementation)
    // In a real app with payments, we'd sum up the actual transactions this month.
    // For now, we estimate based on active members joined this month.
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const membersJoinedThisMonth = await Member.find({
      status: 'Active',
      joinDate: { $gte: startOfMonth }
    }).populate('membershipPlan');

    let revenueThisMonth = 0;
    
    membersJoinedThisMonth.forEach(m => {
      if (m.membershipPlan && m.membershipPlan.price) {
        revenueThisMonth += m.membershipPlan.price;
      }
    });

    res.json({ success: true, data: {
      activeMembersCount,
      revenueThisMonth,
      expiringMembersCount: expiringMembers.length,
      expiringMembers
    }});
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = { getDashboardAnalytics };
