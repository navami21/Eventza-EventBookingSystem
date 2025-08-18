
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'user', 'controller'],
    default: 'user'
  },
  approved: {
    type: Boolean,
    default: false 
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  

}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userData = mongoose.model('User', userSchema);
module.exports = userData;