const express = require('express');
const { protect } = require('../middlewares/auth');
const { listProducts, searchProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

// Public: list products (no search for anonymous)
router.get('/', listProducts);

// Authenticated: search by product name or seller name
router.get('/search', protect, searchProducts);

// Public: get product by id
router.get('/:id', getProductById);

module.exports = router;
