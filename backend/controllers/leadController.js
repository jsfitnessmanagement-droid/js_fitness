const Lead = require('../models/Lead');
const { sendTrialPassEmail } = require('../services/emailService');

// @desc    Create a lead (from BMI calculator)
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res, next) => {
  try {
    const { name, email, age, height, weight, gender, bmi, calorieEstimate } = req.body;
    
    const lead = await Lead.create({
      name, email, age, height, weight, gender, bmi, calorieEstimate
    });

    // Send native email
    await sendTrialPassEmail(email, name);

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
};

module.exports = { createLead };
