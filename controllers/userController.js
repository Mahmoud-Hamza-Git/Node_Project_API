const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.getMe = catchAsync(async (req, res) => {
  res.json(req.user);
});

exports.updateMe = catchAsync(async (req, res) => {
  const updates = {};
  const allowed = ['name', 'email', 'password'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (updates.email) {
    const exists = await User.findOne({ email: updates.email, _id: { $ne: req.user._id } });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  Object.assign(user, updates);
  await user.save();

  const sanitized = await User.findById(user._id).select('-password');
  res.json(sanitized);
});

exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: 'Account deleted' });
});
