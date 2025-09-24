const Order = require('../models/Order');
const Cart = require('../models/Cart');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res) => {
  let items = req.body.items;
  if (req.body.fromCart) {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    items = cart.items.map((i) => ({ product: i.product, quantity: i.quantity }));
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items are required' });
  }

  const order = await Order.create({ user: req.user._id, items, paymentMethod: 'COD' });

  if (req.body.fromCart) {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  }

  res.status(201).json(order);
});

exports.listOrders = catchAsync(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const filter = isAdmin && req.query.userId ? { user: req.query.userId } : { user: req.user._id };
  const orders = await Order.find(filter).populate('items.product').sort({ createdAt: -1 });
  res.json({ total: orders.length, data: orders });
});

exports.getOrderById = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
});
