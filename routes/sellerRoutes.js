const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth');
const { uploadSingleImage } = require('../middlewares/upload');
const {
  createProduct,
  listMyProducts,
  getMyProductById,
  updateMyProduct,
  deleteMyProduct,
} = require('../controllers/sellerController');

const router = express.Router();

// All routes here require seller or admin
router.use(protect, restrictTo('seller', 'admin'));

// Create product (supports multipart/form-data with 'photo' file)
router.post('/', uploadSingleImage, createProduct);

// List my products
router.get('/', listMyProducts);

// Get my single product
router.get('/:id', getMyProductById);

// Update my product (supports multipart/form-data with 'photo' file)
router.put('/:id', uploadSingleImage, updateMyProduct);

// Delete my product
router.delete('/:id', deleteMyProduct);

module.exports = router;
