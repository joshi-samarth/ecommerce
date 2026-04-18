import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import { TrendingUp } from 'lucide-react';
import { Users, Shield, Package, ShoppingCart, DollarSign, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/admin/stats');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch statistics');
            } finally {
                setLoading(false);
            }
        };

        const fetchRecentOrders = async () => {
            try {
                const response = await api.get('/api/admin/orders?limit=5&sort=-createdAt');
                if (response.data.success) {
                    setRecentOrders(response.data.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch recent orders:', err);
                setRecentOrders([]);
            }
        };

        fetchStats();
        fetchRecentOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[600px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full w-12 h-12 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6 flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-red-900">Error loading statistics</p>
                        <p className="text-red-800 text-sm mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Format revenue with currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="p-8 space-y-8">
            {/* Statistics Cards */}
            <div>
                <h2 className="section-title mb-6">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        icon={Users}
                        color="indigo"
                        trend={{ direction: 'up', percent: 12 }}
                    />
                    <StatCard
                        title="Total Admins"
                        value={stats?.totalAdmins || 0}
                        icon={Shield}
                        color="purple"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats?.totalProducts || 0}
                        icon={Package}
                        color="emerald"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats?.totalOrders || 0}
                        icon={ShoppingCart}
                        color="amber"
                        trend={{ direction: 'up', percent: 8 }}
                    />
                </div>
            </div>

            {/* Revenue Card */}
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <StatCard
                            title="Total Revenue"
                            value={formatCurrency(stats?.totalRevenue || 0)}
                            icon={DollarSign}
                            color="emerald"
                            trend={{ direction: 'up', percent: 24 }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Orders Section - Module 7 Implementation */}
            <div className="space-y-4">
                <h2 className="section-title">Recent Orders</h2>
                {recentOrders.length > 0 ? (
                    <div className="card overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order #</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{order.orderNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{order.userId?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.total?.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                        order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="text-indigo-600 hover:text-indigo-700 font-medium transition"
                                            >
                                                View →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium mb-2">No recent orders</p>
                        <p className="text-gray-500 text-sm">Orders will appear here as customers place them</p>
                    </div>
                )}
                <Link to="/admin/orders" className="inline-block text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                    View All Orders →
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
