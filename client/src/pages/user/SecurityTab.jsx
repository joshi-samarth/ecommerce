import React, { useState } from 'react';
import api from '../../api/axios';
import FormInput from '../../components/user/FormInput';

const SecurityTab = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [message, setMessage] = useState('');

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else {
            // Use same strong password validation as registration
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(formData.newPassword)) {
                newErrors.newPassword = 'Password must be min 8 characters with uppercase, lowercase, numbers & special chars (@$!%*?&)';
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await api.put('/api/user/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            if (response.data.success) {
                setSuccess('✅ Password changed successfully');
                // Clear form
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to change password';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="section-title">Security Settings</h2>
                <p className="text-gray-600">Change your password to keep your account secure</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {message && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {message}
                </div>
            )}

            {/* Change Password Form */}
            <div className="card p-8 border-2 border-indigo-200 max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        error={errors.currentPassword}
                        required
                        placeholder="••••••••"
                    />

                    <FormInput
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                        required
                        placeholder="••••••••"
                    />

                    <FormInput
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                        placeholder="••••••••"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">⏳</span> Updating...
                            </>
                        ) : (
                            <>🔐 Update Password</>
                        )}
                    </button>
                </form>
            </div>

            {/* Security Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-semibold text-amber-900 mb-3">🔒 Password Security Tips</h3>
                <ul className="space-y-2 text-amber-800 text-sm">
                    <li>✓ Use a password with at least 6 characters</li>
                    <li>✓ Mix uppercase and lowercase letters</li>
                    <li>✓ Include numbers and special characters</li>
                    <li>✓ Never share your password with anyone</li>
                    <li>✓ Change your password regularly</li>
                </ul>
            </div>
        </div>
    );
};

export default SecurityTab;
