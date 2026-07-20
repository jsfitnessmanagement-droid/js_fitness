const cron = require('node-cron');
const Member = require('../models/Member');
const { sendRenewalNoticeEmail } = require('./emailService');

const init = () => {
  // Run every day at 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily cron job for expiring memberships...');
    try {
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);

      // Find members whose expiration date is exactly 3 days from now
      // Using start and end of that day
      const startOfDay = new Date(threeDaysFromNow);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(threeDaysFromNow);
      endOfDay.setHours(23, 59, 59, 999);

      const expiringMembers = await Member.find({
        status: 'Active',
        expirationDate: { $gte: startOfDay, $lte: endOfDay }
      }).populate('user', 'name email');

      if (expiringMembers.length > 0) {
        for (const m of expiringMembers) {
          if (m.user && m.user.email) {
            await sendRenewalNoticeEmail(m.user.email, m.user.name, 3);
          }
        }
        console.log(`Sent renewal notices to ${expiringMembers.length} members.`);
      } else {
        console.log('No memberships expiring in exactly 3 days.');
      }
    } catch (error) {
      console.error('Error in cron job:', error.message);
    }
  });
};

module.exports = { init };
