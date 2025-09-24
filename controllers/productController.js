const Product = require('../models/Product');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.listProducts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '20');
  const skip = (page - 1) * limit;

  const products = await Product.find()
    .populate('seller', 'name role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments();
  res.json({ total, page, limit, data: products });
});

exports.searchProducts = catchAsync(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ message: 'q is required' });

  const nameRegex = new RegExp(q, 'i');
  const sellers = await User.find({ name: nameRegex, role: 'seller' }).select('_id');
  const sellerIds = sellers.map((s) => s._id);

  const products = await Product.find({
    $or: [{ name: nameRegex }, { seller: { $in: sellerIds } }],
  }).populate('seller', 'name role');

  res.json({ total: products.length, data: products });
});

exports.getProductById = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name role');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});
