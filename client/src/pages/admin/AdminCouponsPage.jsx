import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import axios from '../../api/axios';

import CouponTable from '../../components/admin/coupons/CouponTable';
import CouponForm from '../../components/admin/coupons/CouponForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, coupon: null });

    // Fetch coupons
    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const [couponsRes, statsRes] = await Promise.all([
                axios.get('/api/admin/coupons'),
                axios.get('/api/admin/coupons/stats'),
            ]);

            if (couponsRes.data.success) {
                setCoupons(couponsRes.data.data);
            }

            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setEditingCoupon(null);
        setShowForm(true);
    };

    const handleEditClick = (coupon) => {
        setEditingCoupon(coupon);
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            setFormLoading(true);
            const isEdit = !!editingCoupon;
            const endpoint = isEdit ? `/api/admin/coupons/${editingCoupon._id}` : '/api/admin/coupons';
            const method = isEdit ? 'put' : 'post';

            const res = await axios[method](endpoint, formData);

            if (res.data.success) {
                toast.success(isEdit ? 'Coupon updated' : 'Coupon created');
                setShowForm(false);
                setEditingCoupon(null);
                fetchCoupons();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save coupon');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (coupon) => {
        setDeleteConfirm({ isOpen: true, coupon });
    };

    const handleDeleteConfirm = async () => {
        try {
            setFormLoading(true);
            const res = await axios.delete(`/api/admin/coupons/${deleteConfirm.coupon._id}`);
            if (res.data.success) {
                toast.success('Coupon deleted');
                setDeleteConfirm({ isOpen: false, coupon: null });
                fetchCoupons();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete coupon');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (couponId) => {
        try {
            const res = await axios.put(`/api/admin/coupons/${couponId}/status`);
            if (res.data.success) {
                toast.success('Coupon status updated');
                setCoupons((prev) =>
                    prev.map((c) => (c._id === couponId ? res.data.data : c))
                );
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
                <button
                    onClick={handleCreateClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                    <Plus size={18} />
                    Create Coupon
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold">Total Coupons</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCoupons}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold">Active</div>
                        <div className="text-2xl font-bold text-green-600 mt-1">{stats.activeCoupons}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold">Expired</div>
                        <div className="text-2xl font-bold text-red-600 mt-1">{stats.expiredCoupons}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold">Total Discount</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">₹{stats.totalDiscountGiven}</div>
                    </div>
                </div>
            )}

            {/* Coupons Table */}
            <CouponTable
                coupons={coupons}
                loading={loading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            {/* Coupon Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                            </h2>

                            <CouponForm
                                coupon={editingCoupon}
                                onSubmit={handleFormSubmit}
                                loading={formLoading}
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditingCoupon(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Coupon"
                message={`Are you sure you want to delete coupon "${deleteConfirm.coupon?.code}"?`}
                confirmLabel="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirm({ isOpen: false, coupon: null })}
            />
        </div>
    );
}
