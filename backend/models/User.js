const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  // store refresh tokens as { id, tokenHash, createdAt } to allow efficient lookup
  refreshTokens: { type: [{ id: { type: String }, tokenHash: { type: String }, createdAt: { type: Date, default: Date.now } }], default: [] }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
