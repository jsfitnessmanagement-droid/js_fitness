const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  planName: { type: String, required: true, unique: true },
  durationInDays: { type: Number, required: true }, // e.g., 30, 90, 180, 365
  displayDuration: { type: String, required: true }, // e.g., '/month', '/3 months', '/6 months', '/year'
  price: { type: Number, required: true },
  features: [{ type: String, required: true }],
  savings: { type: String }, // e.g., 'Save ₹900'
  isActive: { type: Boolean, default: true },
  salesCount: { type: Number, default: 0 }, // Track number of sales
  isPopular: { type: Boolean, default: false }, // Will be calculated dynamically
  order: { type: Number, default: 0 } // For display order
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
