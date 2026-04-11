import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../../components/admin/StatCard';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
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

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    <p className="font-medium">❌ Error</p>
                    <p className="text-sm mt-1">{error}</p>
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
        <div className="p-6 space-y-8">
            {/* Statistics Cards */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        icon="👤"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Admins"
                        value={stats?.totalAdmins || 0}
                        icon="🛡️"
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats?.totalProducts || 0}
                        icon="📦"
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats?.totalOrders || 0}
                        icon="🛒"
                        color="bg-orange-500"
                    />
                </div>

                {/* Revenue Card */}
                <div className="mt-6">
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats?.totalRevenue || 0)}
                        icon="💰"
                        color="bg-emerald-500"
                    />
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 text-lg">📦 Recent Orders section</p>
                    <p className="text-gray-500 text-sm mt-2">Coming in Module 7 (Orders)</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
