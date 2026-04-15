const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        // Fetch all stats in parallel
        const [totalUsers, totalAdmins] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'admin' }),
        ]);

        // Safe model imports for Product, Order (don't exist yet in Module 2)
        let totalProducts = 0;
        let totalOrders = 0;
        let totalRevenue = 0;

        try {
            const Product = mongoose.model('Product');
            totalProducts = await Product.countDocuments();
        } catch (e) {
            // Product model doesn't exist yet
        }

        try {
            const Order = mongoose.model('Order');
            const [orderCount, revenueData] = await Promise.all([
                Order.countDocuments(),
                Order.aggregate([
                    { $match: { paymentStatus: 'paid' } },
                    { $group: { _id: null, total: { $sum: '$total' } } },
                ]),
            ]);
            totalOrders = orderCount;
            totalRevenue = revenueData[0]?.total || 0;
        } catch (e) {
            // Order model doesn't exist yet
        }

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalAdmins,
                totalProducts,
                totalOrders,
                totalRevenue,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password');

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be either "user" or "admin"',
            });
        }

        // Prevent admin from changing their own role
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot change your own role',
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: user,
            message: `User role updated to ${role}`,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new admin
// @route   POST /api/admin/create-admin
// @access  Private/Admin (with secret key)
const createAdmin = async (req, res, next) => {
    try {
        const { name, email, password, secretKey } = req.body;

        // Validate secret key
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin secret key',
            });
        }

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password',
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use',
            });
        }

        // Create new admin
        const newAdmin = await User.create({
            name,
            email,
            password,
            role: 'admin',
        });

        res.status(201).json({
            success: true,
            data: {
                _id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role,
            },
            message: 'New admin created successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    createAdmin,
};
