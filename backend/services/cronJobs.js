const cron = require('node-cron');
const Member = require('../models/Member');
const { sendRenewalNoticeEmail } = require('./emailService');

const init = () => {
  // Run every day at 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily cron job for expiring memberships...');
    try {
      const today = new Date();
      
      const checkAndSend = async (daysAhead) => {
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + daysAhead);

        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const expiringMembers = await Member.find({
          status: 'Active',
          expirationDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('user', 'name email');

        if (expiringMembers.length > 0) {
          for (const m of expiringMembers) {
            if (m.user && m.user.email) {
              await sendRenewalNoticeEmail(m.user.email, m.user.name, daysAhead);
            }
          }
          console.log(`Sent ${daysAhead}-day renewal notices to ${expiringMembers.length} members.`);
        } else {
          console.log(`No memberships expiring in exactly ${daysAhead} days.`);
        }
      };

      // Send 7-day and 3-day notices
      await checkAndSend(7);
      await checkAndSend(3);

    } catch (error) {
      console.error('Error in cron job:', error.message);
    }
  });
};

module.exports = { init };
