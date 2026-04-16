import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [adminCreationStep, setAdminCreationStep] = useState(1); // Step 1: Form, Step 2: OTP
    const [otpTimer, setOtpTimer] = useState(0);
    const [canResendAdminOTP, setCanResendAdminOTP] = useState(false);
    const { user: currentAdmin } = useAuth();

    // Create admin form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [adminOtp, setAdminOtp] = useState('');

    // OTP Timer for admin creation
    useEffect(() => {
        let interval;
        if (adminCreationStep === 2 && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => {
                    if (prev <= 1) {
                        setCanResendAdminOTP(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [adminCreationStep, otpTimer]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/admin/users');
                if (response.data.success) {
                    setUsers(response.data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Validate password strength
    const isPasswordStrong = (pwd) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        try {
            const response = await api.put(`/api/admin/users/${userId}/role`, {
                role: newRole,
            });

            if (response.data.success) {
                setUsers(
                    users.map((user) =>
                        user._id === userId ? { ...user, role: newRole } : user
                    )
                );
                setSuccess(response.data.message);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user role');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCreateAdminChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ===== STEP 1: SUBMIT ADMIN FORM & SEND OTP =====
    const handleCreateAdminStep1 = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (!isPasswordStrong(formData.password)) {
            setError('Password must be min 8 characters with uppercase, lowercase, numbers & special chars (@$!%*?&)');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/api/admin/create-admin/send-otp', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            if (response.data.success) {
                setSuccess(response.data.message);
                setAdminCreationStep(2);
                setOtpTimer(600); // 10 minutes
                setCanResendAdminOTP(false);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    // ===== STEP 2: VERIFY OTP & CREATE ADMIN =====
    const handleCreateAdminStep2 = async (e) => {
        e.preventDefault();
        setError('');

        if (!adminOtp.trim()) {
            setError('Please enter OTP');
            return;
        }

        try {
            const response = await api.post('/api/admin/create-admin/verify-otp', {
                email: formData.email,
                otp: adminOtp,
            });

            if (response.data.success) {
                setUsers([...users, response.data.data]);
                setSuccess('✅ ' + response.data.message);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                setAdminOtp('');
                setAdminCreationStep(1);
                setShowCreateAdmin(false);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create admin');
        }
    };

    // ===== RESEND OTP =====
    const handleResendAdminOTP = async () => {
        setError('');
        setCanResendAdminOTP(false);

        try {
            const response = await api.post('/api/auth/resend-otp', {
                email: formData.email,
                type: 'admin-creation',
            });

            if (response.data.success) {
                setSuccess('✅ OTP resent! Check your email');
                setOtpTimer(600);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
            setCanResendAdminOTP(true);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
                    <p className="text-gray-600 text-sm mt-1">Total users: {users.length}</p>
                </div>
                <button
                    onClick={() => {
                        setShowCreateAdmin(!showCreateAdmin);
                        setAdminCreationStep(1);
                        setFormData({
                            name: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                        });
                        setAdminOtp('');
                        setError('');
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    {showCreateAdmin ? '❌ Cancel' : '➕ Add Admin'}
                </button>
            </div>

            {/* Notifications */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                    <span>❌</span>
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2">
                    <span>✅</span>
                    <p>{success}</p>
                </div>
            )}

            {/* Create Admin Form - Step 1 */}
            {showCreateAdmin && adminCreationStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Admin Account</h3>
                    <p className="text-gray-600 text-sm mb-4">Fill all details and we'll send verification code to the email</p>
                    <form onSubmit={handleCreateAdminStep1} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleCreateAdminChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                placeholder="Admin Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleCreateAdminChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleCreateAdminChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">Min 8 chars • Uppercase • Lowercase • Numbers • Special (@$!%*?&)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleCreateAdminChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                        >
                            Send Verification Code
                        </button>
                    </form>
                </div>
            )}

            {/* Create Admin Form - Step 2: OTP Verification */}
            {showCreateAdmin && adminCreationStep === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Verify Email for New Admin</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        We sent a verification code to <strong>{formData.email}</strong>
                    </p>
                    <form onSubmit={handleCreateAdminStep2} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                                Enter 6-Digit Code
                            </label>
                            <input
                                type="text"
                                value={adminOtp}
                                onChange={(e) => setAdminOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength="6"
                                placeholder="000000"
                                className="w-full px-4 py-4 text-center text-2xl tracking-[0.5rem] font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition outline-none"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-600 px-2">
                            <span>
                                OTP expires in: <strong className="text-red-600">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</strong>
                            </span>
                            <button
                                type="button"
                                onClick={handleResendAdminOTP}
                                disabled={!canResendAdminOTP}
                                className="text-green-600 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Resend
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setAdminCreationStep(1);
                                    setAdminOtp('');
                                }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition"
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                            >
                                Verify & Create Admin
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const isCurrentUser = user._id === currentAdmin?._id;
                                    return (
                                        <tr
                                            key={user._id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800">
                                                    {user.name}
                                                    {isCurrentUser && <span className="text-xs text-blue-600 ml-2">(You)</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{formatDate(user.createdAt)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleRole(user._id, user.role)}
                                                    disabled={isCurrentUser}
                                                    className={`px-3 py-1 rounded text-sm font-medium transition ${isCurrentUser
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : user.role === 'admin'
                                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                        }`}
                                                >
                                                    {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>ℹ️ Note:</strong> Users can only be deleted by database administration. Use the "Make User" button to demote admins and restrict their access. All actions are logged for security.
                </p>
            </div>
        </div>
    );
};

export default AdminUsersPage;
