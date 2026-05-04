const express = require('express');
const router = express.Router();
const { register, login, googleLogin, verifyOTP, updateProfile , deleteAccount} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

router.post('/google', googleLogin);

router.post('/verify-otp', verifyOTP); 

router.put('/update-profile', protect, updateProfile);

router.delete('/delete-account', protect, deleteAccount);
// <--- Check this name!

module.exports = router;