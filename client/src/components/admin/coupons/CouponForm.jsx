import { useState, useEffect } from 'react';

export default function CouponForm({ coupon, onSubmit, loading, onCancel }) {
    const [formData, setFormData] = useState({
        code: '',
        type: 'flat',
        value: '',
        minOrderValue: '',
        maxDiscount: '',
        usageLimit: '',
        expiresAt: '',
        isActive: true,
    });

    useEffect(() => {
        if (coupon) {
            setFormData({
                code: coupon.code || '',
                type: coupon.type || 'flat',
                value: coupon.value || '',
                minOrderValue: coupon.minOrderValue || '',
                maxDiscount: coupon.maxDiscount || '',
                usageLimit: coupon.usageLimit || '',
                expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
                isActive: coupon.isActive !== false,
            });
        }
    }, [coupon]);

    const handleCodeChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            code: e.target.value.toUpperCase(),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.code.trim()) return;
        if (!formData.type) return;
        if (!formData.value) return;

        const submitData = {
            ...formData,
            value: parseFloat(formData.value),
            minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : 0,
            maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
            usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 0,
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
            {/* Code */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code *</label>
                <input
                    type="text"
                    value={formData.code}
                    onChange={handleCodeChange}
                    placeholder="e.g., WELCOME10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase"
                    required
                />
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="percent"
                            checked={formData.type === 'percent'}
                            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                            className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">Percent Off</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="flat"
                            checked={formData.type === 'flat'}
                            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                            className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">Flat Amount</span>
                    </label>
                </div>
            </div>

            {/* Value */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Value {formData.type === 'percent' ? '(%)' : '(₹)'} *
                </label>
                <input
                    type="number"
                    min="0"
                    max={formData.type === 'percent' ? '100' : undefined}
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                />
            </div>

            {/* Min Order Value */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Order Value (₹)</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minOrderValue: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Max Discount (only for percent) */}
            {formData.type === 'percent' && (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Discount (₹)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, maxDiscount: e.target.value }))}
                        placeholder="Unlimited"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            )}

            {/* Usage Limit */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Usage Limit</label>
                <input
                    type="number"
                    min="0"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, usageLimit: e.target.value }))}
                    placeholder="0 = Unlimited"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Expires At */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expires At</label>
                <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.expiresAt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Active */}
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 accent-blue-600"
                />
                <span className="text-sm font-semibold text-gray-700">
                    {formData.isActive ? '✅ Active' : '❌ Inactive'}
                </span>
            </label>

            {/* Preview */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <span className="font-semibold">{formData.code}</span>: {formData.value}
                {formData.type === 'percent' ? '%' : '₹'} off on orders ₹{formData.minOrderValue || '0'}+
                {formData.maxDiscount && ` (Max ₹${formData.maxDiscount})`}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                    {loading ? 'Saving...' : 'Save Coupon'}
                </button>
            </div>
        </form>
    );
}
