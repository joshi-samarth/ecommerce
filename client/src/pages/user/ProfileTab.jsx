import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/user/FormInput';

const ProfileTab = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setMessage('');
        setErrors({});

        try {
            const response = await api.put('/api/user/profile', {
                name: formData.name,
                email: formData.email,
            });

            if (response.data.success) {
                setSuccess('✅ Profile updated successfully');
                // Update global auth context
                if (setUser) {
                    setUser(response.data.data);
                }
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update profile';
            setMessage(errorMsg);
            if (errorMsg.includes('Email')) {
                setErrors({ email: errorMsg });
            }
        } finally {
            setLoading(false);
        }
    };

    // Format date - handle both Date objects and date strings
    const formatDate = (date) => {
        try {
            if (!date) return 'N/A';
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return 'Invalid Date';
            }
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (err) {
            return 'Invalid Date';
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">My Profile</h2>
                <p className="text-gray-600">Update your personal information</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {message && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {message}
                </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                        placeholder="Your full name"
                    />
                    <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                        placeholder="your@email.com"
                    />
                </div>

                {/* User Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">Account Type</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-2xl">{user.role === 'admin' ? '👑' : '👤'}</span>
                            <span className={`text-lg font-semibold ${user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'}`}>
                                {user.role === 'admin' ? 'Admin User' : 'Regular User'}
                            </span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">Member Since</p>
                        <p className="text-lg font-semibold text-purple-600 mt-2">
                            {formatDate(user.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">⏳</span> Saving...
                            </>
                        ) : (
                            <>✅ Save Changes</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;
