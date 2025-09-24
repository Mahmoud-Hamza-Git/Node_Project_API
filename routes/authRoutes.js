const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Register (user or seller). Admin creation not allowed here.
router.post('/register', register);

// Login
router.post('/login', login);

// Forgot Password (returns reset token for testing/demo)
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

module.exports = router;
