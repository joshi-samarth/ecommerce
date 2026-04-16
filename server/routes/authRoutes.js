const express = require('express');
const {
    registerUser,
    sendRegistrationOTP,
    verifyRegistrationOTP,
    loginUser,
    adminLoginSendOTP,
    adminLoginVerifyOTP,
    resendOTP,
    logoutUser,
    getMe,
} = require('../controllers/authController');
const { seedUsers } = require('../controllers/seedController');
const protect = require('../middleware/protect');

const router = express.Router();

// Regular User Registration with OTP
router.post('/register/send-otp', sendRegistrationOTP);
router.post('/register/verify-otp', verifyRegistrationOTP);
router.post('/register', registerUser); // Backward compatibility

// Regular User Login
router.post('/login', loginUser);

// Admin Login with OTP (2FA)
router.post('/admin/login', adminLoginSendOTP);
router.post('/admin/verify-otp', adminLoginVerifyOTP);

// Resend OTP (for both registration and admin)
router.post('/resend-otp', resendOTP);

// Logout
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

// Demo route - create default admin & user
router.post('/seed', seedUsers);

module.exports = router;
