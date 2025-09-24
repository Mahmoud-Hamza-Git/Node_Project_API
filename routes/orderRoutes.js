const express = require('express');
const { protect } = require('../middlewares/auth');
const { createOrder, listOrders, getOrderById } = require('../controllers/orderController');

const router = express.Router();

router.use(protect);

// Create order (COD). Optionally from cart
router.post('/', createOrder);

// Get my orders (admin can see all or by userId)
router.get('/', listOrders);

// Get order by id (owner or admin)
router.get('/:id', getOrderById);

module.exports = router;
