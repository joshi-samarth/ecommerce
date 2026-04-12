import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import FormInput from '../../components/user/FormInput';
import AddressCard from '../../components/user/AddressCard';

const AddressTab = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false,
    });

    // Fetch addresses on mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user/addresses');
            if (response.data.success) {
                setAddresses(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Special handling for phone field - only allow digits
        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, ''); // Remove all non-digit characters
            setFormData((prev) => ({
                ...prev,
                [name]: digitsOnly,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }

        // Clear error
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (formData.phone.length !== 10) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must contain only digits';
        }
        if (!formData.line1) newErrors.line1 = 'Address line 1 is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pincode) newErrors.pincode = 'Pincode is required';

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            setError('Please fill all required fields');
            return;
        }

        try {
            let response;
            if (editingId) {
                response = await api.put(`/api/user/addresses/${editingId}`, formData);
            } else {
                response = await api.post('/api/user/addresses', formData);
            }

            if (response.data.success) {
                setAddresses(response.data.data);
                setSuccess(editingId ? '✅ Address updated successfully' : '✅ Address added successfully');
                resetForm();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save address');
        }
    };

    const handleEdit = (address) => {
        setFormData({
            fullName: address.fullName,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: 'India', // Always set to India
            isDefault: address.isDefault,
        });
        setEditingId(address._id);
        setShowForm(true);
        setFormErrors({});
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const response = await api.delete(`/api/user/addresses/${addressId}`);
                if (response.data.success) {
                    setAddresses(response.data.data);
                    setSuccess('✅ Address deleted successfully');
                    setTimeout(() => setSuccess(''), 3000);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete address');
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const response = await api.put(`/api/user/addresses/${addressId}/default`);
            if (response.data.success) {
                setAddresses(response.data.data);
                setSuccess('✅ Default address updated');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set default address');
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            isDefault: false,
        });
        setEditingId(null);
        setShowForm(false);
        setFormErrors({});
    };

    if (loading) {
        return <div className="text-center py-8">Loading addresses...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">My Addresses</h2>
                    <p className="text-gray-600">Manage your delivery addresses</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        ➕ Add New Address
                    </button>
                )}
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Add/Edit Address Form */}
            {showForm && (
                <div className="bg-gray-50 border-2 border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        {editingId ? '✏️ Edit Address' : '📍 Add New Address'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                error={formErrors.fullName}
                                required
                                placeholder="John Doe"
                            />
                            <FormInput
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                error={formErrors.phone}
                                required
                                placeholder="9876543210"
                                maxLength="10"
                            />
                            <FormInput
                                label="Address Line 1"
                                name="line1"
                                value={formData.line1}
                                onChange={handleChange}
                                error={formErrors.line1}
                                required
                                placeholder="123 Main Street"
                            />
                            <FormInput
                                label="Address Line 2 (Optional)"
                                name="line2"
                                value={formData.line2}
                                onChange={handleChange}
                                placeholder="Apartment, suite, etc."
                            />
                            <FormInput
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={formErrors.city}
                                required
                                placeholder="New York"
                            />
                            <FormInput
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={formErrors.state}
                                required
                                placeholder="NY"
                            />
                            <FormInput
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                error={formErrors.pincode}
                                required
                                placeholder="10001"
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Country <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold cursor-not-allowed">
                                    🇮🇳 India
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Country is fixed to India</p>
                            </div>
                        </div>

                        {/* Set as Default Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                            />
                            <label htmlFor="isDefault" className="text-gray-700 font-medium">
                                Set as default delivery address
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                            >
                                {editingId ? '✅ Update Address' : '✅ Add Address'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address Cards List */}
            {addresses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-3xl mb-3">📍</p>
                    <p className="text-gray-600 text-lg">No addresses saved yet</p>
                    <p className="text-gray-500">Add your first address to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address._id}
                            address={address}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressTab;
