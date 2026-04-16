const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const { generateOTP, sendOTPEmail, verifyOTP } = require('../utils/otpUtils');

// @desc    Register user - Step 1: Send OTP
// @route   POST /api/auth/register/send-otp
// @access  Public
const sendRegistrationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete previous OTPs for this email
        await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'user_registration' });

        // Save OTP
        await OTP.create({
            email: email.toLowerCase(),
            otp,
            purpose: 'user_registration'
        });

        // Send OTP via email in background (DON'T WAIT - faster response)
        setImmediate(() => {
            sendOTPEmail(email, otp, 'user_registration').catch(err => {
                console.error('Background email send failed:', err);
            });
        });

        // Return response immediately
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email. Check your inbox!',
            data: {
                email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Register user - Step 2: Verify OTP and register
// @route   POST /api/auth/register/verify-otp
// @access  Public
const verifyRegistrationOTP = async (req, res) => {
    try {
        const { email, otp, name, password } = req.body;

        // Validation
        if (!email || !otp || !name || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, OTP, name and password'
            });
        }

        // Verify OTP
        const otpVerification = await verifyOTP(OTP, email, otp, 'user_registration');

        if (!otpVerification.success) {
            return res.status(400).json({
                success: false,
                message: otpVerification.message
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password
        });

        // Delete used OTP
        await OTP.deleteOne({ email: email.toLowerCase(), purpose: 'user_registration', verified: true });

        // Generate token
        generateToken(res, user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Register user (OLD - without OTP) - KEPT FOR BACKWARD COMPATIBILITY
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    // Redirect to new OTP flow
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please use the new registration flow. Step 1: POST /api/auth/register/send-otp'
            });
        }

        // Call sendRegistrationOTP
        await sendRegistrationOTP(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user (regular user login - NO OTP for users, only for admin)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // If user is admin, redirect to admin login
        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Admins must use /api/auth/admin/login for secure OTP-based authentication'
            });
        }

        // Generate token for regular users
        generateToken(res, user._id);

        // Remove password from response
        user.password = undefined;

        // Return success response
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
    res.clearCookie('jwt');

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============ ADMIN OTP LOGIN (2FA) ============

// @desc    Admin Login - Step 1: Verify password and send OTP
// @route   POST /api/auth/admin/login
// @access  Public
const adminLoginSendOTP = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for admin user
        const admin = await User.findOne({ email }).select('+password');

        if (!admin || admin.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Check if password matches
        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete previous OTPs for this admin
        await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'admin_login' });

        // Save OTP
        await OTP.create({
            email: email.toLowerCase(),
            otp,
            purpose: 'admin_login'
        });

        // Send OTP via email in background (DON'T WAIT - faster response)
        setImmediate(() => {
            sendOTPEmail(email, otp, 'admin_login').catch(err => {
                console.error('Background email send failed:', err);
            });
        });

        // Return response immediately with OTP expiry hint
        res.status(200).json({
            success: true,
            message: 'OTP sent to your email! Check your inbox (expires in 10 minutes)',
            data: {
                email,
                tempSessionId: admin._id.toString(),
                otpExpiry: 10 // minutes
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Admin Login - Step 2: Verify OTP and grant access
// @route   POST /api/auth/admin/verify-otp
// @access  Public
const adminLoginVerifyOTP = async (req, res) => {
    try {
        const { email, otp, tempSessionId } = req.body;

        // Validation
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and OTP'
            });
        }

        // Verify OTP
        const otpVerification = await verifyOTP(OTP, email, otp, 'admin_login');

        if (!otpVerification.success) {
            return res.status(400).json({
                success: false,
                message: otpVerification.message
            });
        }

        // Get admin user
        const admin = await User.findOne({ email: email.toLowerCase() });

        if (!admin || admin.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Delete used OTP
        await OTP.deleteOne({ email: email.toLowerCase(), purpose: 'admin_login', verified: true });

        // Generate token
        generateToken(res, admin._id);

        res.status(200).json({
            success: true,
            message: 'Admin login verified successfully',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Resend OTP (for both registration and admin login)
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body; // purpose: 'user_registration' or 'admin_login'

        if (!email || !purpose) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and purpose'
            });
        }

        if (!['user_registration', 'admin_login'].includes(purpose)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid purpose'
            });
        }

        // Check if OTP exists
        const otpRecord = await OTP.findOne({
            email: email.toLowerCase(),
            purpose,
            verified: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'No pending OTP found. Please start fresh.'
            });
        }

        // Generate new OTP
        const newOtp = generateOTP();
        otpRecord.otp = newOtp;
        otpRecord.attempts = 0;
        await otpRecord.save();

        // Send OTP via email
        const emailResult = await sendOTPEmail(email, newOtp, purpose);

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to resend OTP. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP resent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    sendRegistrationOTP,
    verifyRegistrationOTP,
    loginUser,
    adminLoginSendOTP,
    adminLoginVerifyOTP,
    resendOTP,
    logoutUser,
    getMe,
};
