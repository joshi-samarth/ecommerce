import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/api/user/orders');
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
                <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">Your orders will appear here. Start shopping to see them!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
                    >
                        🛍️ Browse Products
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Data will be populated in Module 7 */}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>ℹ️ Note:</strong> Order tracking will be available in Module 7. For now, you can browse and add products
                    to your cart.
                </p>
            </div>
        </div>
    );
};

export default OrdersTab;
