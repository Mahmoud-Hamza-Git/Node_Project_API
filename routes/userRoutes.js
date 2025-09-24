const express = require('express');
const { protect } = require('../middlewares/auth');
const { getMe, updateMe, deleteMe } = require('../controllers/userController');

const router = express.Router();

// Get my profile
router.get('/me', protect, getMe);

// Update my profile
router.put('/me', protect, updateMe);

// Delete my account
router.delete('/me', protect, deleteMe);

module.exports = router;
