const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MembershipPlan = require('./models/MembershipPlan');

dotenv.config();

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if plans already exist
    const existingPlans = await MembershipPlan.countDocuments();
    if (existingPlans > 0) {
      console.log('Membership plans already exist. Skipping seed.');
      process.exit(0);
    }

    // Clear existing plans (if any)
    await MembershipPlan.deleteMany();
    console.log('Cleared existing membership plans');

    // Create initial plans
    const plans = [
      {
        planName: '1 Month',
        durationInDays: 30,
        displayDuration: '/month',
        price: 1500,
        features: ['Full Gym Access', 'All Equipment Use', 'Basic Guidance'],
        savings: null,
        isActive: true,
        salesCount: 0,
        order: 1
      },
      {
        planName: '3 Months',
        durationInDays: 90,
        displayDuration: '/3 months',
        price: 3600,
        features: ['Full Gym Access', 'All Equipment Use', 'Trainer Support'],
        savings: 'Save ₹900',
        isActive: true,
        salesCount: 0,
        order: 2
      },
      {
        planName: '6 Months',
        durationInDays: 180,
        displayDuration: '/6 months',
        price: 6000,
        features: ['Full Gym Access', 'All Equipment Use', 'Trainer Support'],
        savings: 'Save ₹3,000',
        isActive: true,
        salesCount: 0,
        order: 3
      },
      {
        planName: '1 Year',
        durationInDays: 365,
        displayDuration: '/year',
        price: 10000,
        features: ['Full Gym Access', 'All Equipment Use', 'Personal Training'],
        savings: 'Save ₹8,000',
        isActive: true,
        salesCount: 0,
        order: 4
      }
    ];

    await MembershipPlan.insertMany(plans);
    console.log('Membership plans seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding membership plans:', error);
    process.exit(1);
  }
};

seedPlans();
