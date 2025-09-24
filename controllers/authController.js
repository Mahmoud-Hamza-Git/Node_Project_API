const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role && !['user', 'seller'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role: role || 'user' });
  const token = generateToken(user);
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await user.matchPassword(password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // In production, send email instead of returning token
  res.json({ message: 'Reset token generated (use to reset password)', resetToken });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const jwt = generateToken(user);
  res.json({ message: 'Password reset successful', token: jwt });
});
