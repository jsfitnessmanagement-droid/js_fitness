const nodemailer = require('nodemailer');

// Initialize transporter
// Using Gmail as the default assumption for the new setup.
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use host/port if using a different provider
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS // Must be an App Password, not a regular password
  }
});

const sendEmail = async (to, subject, html) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`[Email Warning] SMTP credentials missing. Did not send email to ${to}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"JS Fitness" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

const sendTrialPassEmail = async (email, name) => {
  const subject = "Your JS Fitness 3-Day Trial Pass!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">Welcome to JS Fitness, ${name}!</h2>
      <p>Here is your 3-Day Free Trial Pass. Present this email at the front desk to start your journey with us.</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0; color: #1f2937;">TRIAL PASS</h3>
        <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #ef4444;">Valid for 3 Days</p>
      </div>
      <p>We look forward to seeing you!<br>— The JS Fitness Team</p>
    </div>
  `;
  await sendEmail(email, subject, html);
};

const sendReceiptEmail = async (email, name, planName, amount) => {
  const subject = "Payment Confirmation - JS Fitness";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Payment Successful!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for your purchase. Your payment has been successfully processed.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px 0;"><strong>Plan:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${planName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px 0;"><strong>Amount Paid:</strong></td>
          <td style="padding: 10px 0; text-align: right;">₹${amount}</td>
        </tr>
      </table>
      <p>Your membership is now active. If you have any questions, please contact the front desk.</p>
      <p>Keep pushing your limits!<br>— The JS Fitness Team</p>
    </div>
  `;
  await sendEmail(email, subject, html);
};

const sendRenewalNoticeEmail = async (email, name, daysLeft) => {
  const subject = "Action Required: JS Fitness Membership Expiring Soon";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Membership Expiring in ${daysLeft} Days</h2>
      <p>Hi ${name},</p>
      <p>Your JS Fitness membership is scheduled to expire in <strong>${daysLeft} days</strong>.</p>
      <p>Don't lose your momentum! Please visit the gym or log in to your account to renew your membership and keep your fitness journey going uninterrupted.</p>
      <p>If you have already renewed, please ignore this email.</p>
      <p>Stay strong,<br>— The JS Fitness Team</p>
    </div>
  `;
  await sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendTrialPassEmail,
  sendReceiptEmail,
  sendRenewalNoticeEmail
};
