const express = require('express');
const {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    createAdmin,
} = require('../controllers/adminController');
const protect = require('../middleware/protect');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// All routes protected with protect + isAdmin middleware
router.use(protect, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.post('/create-admin', createAdmin);

module.exports = router;
