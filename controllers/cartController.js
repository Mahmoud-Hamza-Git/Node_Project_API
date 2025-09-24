const Cart = require('../models/Cart');
const catchAsync = require('../utils/catchAsync');

exports.createOrReplaceCart = catchAsync(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, items },
    { new: true, upsert: true }
  );
  res.status(201).json(cart);
});

exports.getCart = catchAsync(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const userId = isAdmin && req.query.userId ? req.query.userId : req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  res.json(cart || { user: userId, items: [] });
});

exports.updateCartById = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  if (cart.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  cart.items = Array.isArray(req.body.items) ? req.body.items : cart.items;
  await cart.save();
  res.json(cart);
});

exports.deleteCartById = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  if (cart.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await cart.deleteOne();
  res.json({ message: 'Cart deleted' });
});
