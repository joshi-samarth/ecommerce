const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
} = require('../controllers/authController');
const { seedUsers } = require('../controllers/seedController');
const protect = require('../middleware/protect');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.post('/seed', seedUsers); // Demo route - create default admin & user

module.exports = router;
