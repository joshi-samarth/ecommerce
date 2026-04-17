import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import { TrendingUp } from 'lucide-react';
import { Users, Shield, Package, ShoppingCart, DollarSign, Activity } from 'lucide-react';

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

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="space-y-4">
                <h2 className="section-title">Recent Activity</h2>
                <div className="card p-12 text-center">
                    <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-2">Recent Orders section</p>
                    <p className="text-gray-500 text-sm">Coming in Module 7 (Orders Management)</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
