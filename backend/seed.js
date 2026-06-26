const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Member = require('./models/Member');

dotenv.config();
// Only run seeding when SEED=true to avoid accidental data leaks
if (process.env.SEED !== 'true') {
  console.log('SEED flag not set. To seed, run with SEED=true node seed.js');
  process.exit(0);
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // 1. Create Admin
    const adminExists = await User.findOne({ email: 'admin@jsfitness.in' });
    if (!adminExists) {
      await User.create({
        name: 'JS Fitness Admin',
        email: 'admin@jsfitness.in',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@jsfitness.in / admin123');
    } else {
      console.log('ℹ️  Admin user already exists.');
    }

    // 2. Create Test Member User
    let memberUser = await User.findOne({ email: 'member@jsfitness.in' });
    if (!memberUser) {
      memberUser = await User.create({
        name: 'Test Member',
        email: 'member@jsfitness.in',
        password: 'member123',
        role: 'member'
      });
      console.log('✅ Member user created: member@jsfitness.in / member123');
    } else {
      console.log('ℹ️  Member user already exists.');
    }

    // 3. Create Member profile
    const memberProfileExists = await Member.findOne({ user: memberUser._id });
    if (!memberProfileExists) {
      const joinDate = new Date();
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 3);

      await Member.create({
        user: memberUser._id,
        phone: '9999999999',
        membershipTier: '3 Months',
        joinDate,
        expirationDate,
        status: 'Active'
      });
      console.log('✅ Member profile created (3 Months plan)');
    } else {
      console.log('ℹ️  Member profile already exists.');
    }

    console.log('\n🎉 Seeding complete! You can now login with:');
    console.log('   Admin:  admin@jsfitness.in / admin123');
    console.log('   Member: member@jsfitness.in / member123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
