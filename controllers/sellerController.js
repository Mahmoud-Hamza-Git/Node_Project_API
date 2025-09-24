const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    photo: req.file ? `/uploads/${req.file.filename}` : req.body.photo,
    price: req.body.price,
    seller: req.user._id,
  };
  if (data.price === undefined || Number.isNaN(Number(data.price)) || Number(data.price) < 0) {
    return res.status(400).json({ message: 'price is required and must be a non-negative number' });
  }
  const product = await Product.create(data);
  res.status(201).json(product);
});

exports.listMyProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json({ total: products.length, data: products });
});

exports.getMyProductById = catchAsync(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

exports.updateMyProduct = catchAsync(async (req, res) => {
  const update = {};
  if (req.body.name !== undefined) update.name = req.body.name;
  if (req.body.description !== undefined) update.description = req.body.description;
  if (req.body.price !== undefined) update.price = req.body.price;
  if (req.file) update.photo = `/uploads/${req.file.filename}`;
  
  if (update.price !== undefined && (Number.isNaN(Number(update.price)) || Number(update.price) < 0)) {
    return res.status(400).json({ message: 'price must be a non-negative number' });
  }
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user._id },
    update,
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

exports.deleteMyProduct = catchAsync(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});
