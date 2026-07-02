import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required — Google OAuth users won't have one
  googleId: { type: String, sparse: true, unique: true }, // For Google OAuth
  avatar: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  // Only hash if password exists and was modified
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false; // Google-only users can't password-login
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
