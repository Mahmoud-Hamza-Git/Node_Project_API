const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createOrReplaceCart,
  getCart,
  updateCartById,
  deleteCartById,
} = require('../controllers/cartController');

const router = express.Router();

router.use(protect);

// Create or replace my cart
router.post('/', createOrReplaceCart);

// Get my cart or by userId if admin via query
router.get('/', getCart);

// Update a cart by id (only owner or admin)
router.put('/:id', updateCartById);

// Delete a cart by id (only owner or admin)
router.delete('/:id', deleteCartById);

module.exports = router;
