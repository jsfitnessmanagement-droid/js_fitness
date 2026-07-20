const Razorpay = require('razorpay');
const MembershipPlan = require('../models/MembershipPlan');
const crypto = require('crypto');

// Initialize razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { amount, planName } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    // If using placeholder keys, return a mock order to prevent 500 error
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      // Still record the sale for tracking purposes
      if (planName) {
        const plan = await MembershipPlan.findOne({ planName });
        if (plan) {
          plan.salesCount += 1;
          await plan.save();
        }
      }
      return res.json({ success: true, data: {
        id: `mock_order_${Date.now()}`,
        currency: "INR",
        amount: amount * 100,
        key_id: 'rzp_test_placeholder'
      }});
    }

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      const err = new Error('Payment gateway returned invalid response');
      err.statusCode = 500;
      return next(err);
    }

    res.json({ success: true, data: {
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    }});
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    return next(error);
  }
};

// @desc    Record successful payment and update sales count
// @route   POST /api/payment/record-sale
// @access  Private
const recordSale = async (req, res, next) => {
  try {
    const { planName, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!planName) {
      return res.status(400).json({ success: false, message: 'Plan name is required' });
    }

    // Verify signature if provided (and if not using test keys)
    if (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== 'secret_placeholder' && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
      
      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    }

    const plan = await MembershipPlan.findOne({ planName });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    plan.salesCount += 1;
    await plan.save();

    res.json({ success: true, message: 'Sale recorded successfully' });
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = { createOrder, recordSale };
