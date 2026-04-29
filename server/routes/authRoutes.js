const express = require('express');
const router = express.Router();
const { register, login, googleLogin, verifyOTP } = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

router.post('/google', googleLogin);

router.post('/verify-otp', verifyOTP); // <--- Check this name!

module.exports = router;