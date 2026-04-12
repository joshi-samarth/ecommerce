import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header/Navigation Bar */}
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ShopHub
                        </span>
                        <span className="text-sm text-gray-500">E-Commerce Platform</span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/products')}
                            className="text-gray-700 hover:text-blue-600 font-medium transition"
                        >
                            🛍️ Products
                        </button>

                        {/* User Menu */}
                        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {user?.name
                                            ?.split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2) || 'U'}
                                    </span>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>

                            {/* User Actions Dropdown */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate('/account/profile')}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                                >
                                    👤 My Account
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="text-center space-y-6 max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
                            Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ShopHub</span>
                        </h1>
                        <p className="text-xl text-gray-600">
                            Your favorite e-commerce destination for premium products and seamless shopping experience
                        </p>

                        {/* Quick Access Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                            {/* Account Card */}
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                <p className="text-3xl mb-3">👤</p>
                                <h3 className="font-bold text-gray-800 mb-2">My Account</h3>
                                <p className="text-gray-600 text-sm mb-4">Manage your profile, addresses, and orders</p>
                                <button
                                    onClick={() => navigate('/account/profile')}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                                >
                                    View Profile
                                </button>
                            </div>

                            {/* Addresses Card */}
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                <p className="text-3xl mb-3">📍</p>
                                <h3 className="font-bold text-gray-800 mb-2">My Addresses</h3>
                                <p className="text-gray-600 text-sm mb-4">Add and manage delivery addresses</p>
                                <button
                                    onClick={() => navigate('/account/addresses')}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                                >
                                    Manage Addresses
                                </button>
                            </div>

                            {/* Security Card */}
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                <p className="text-3xl mb-3">🔐</p>
                                <h3 className="font-bold text-gray-800 mb-2">Security</h3>
                                <p className="text-gray-600 text-sm mb-4">Update password and security settings</p>
                                <button
                                    onClick={() => navigate('/account/security')}
                                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm"
                                >
                                    Update Security
                                </button>
                            </div>
                        </div>

                        {/* Coming Soon Section */}
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 p-8 rounded-lg mt-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">🛍️ Coming Soon</h2>
                            <div className="space-y-2 text-gray-700">
                                <p>✓ Product Catalog - Browse thousands of products</p>
                                <p>✓ Shopping Cart - Add items and manage your cart</p>
                                <p>✓ Checkout - Secure payment processing</p>
                                <p>✓ Order Tracking - Track your orders in real-time</p>
                            </div>
                        </div>

                        {/* Browse Products CTA */}
                        <div className="mt-12">
                            <button
                                onClick={() => navigate('/products')}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-bold text-lg"
                            >
                                🛍️ Start Shopping
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white py-12 px-4">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold text-blue-600">1000+</p>
                            <p className="text-gray-600">Products Available</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-green-600">50k+</p>
                            <p className="text-gray-600">Happy Customers</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-purple-600">24/7</p>
                            <p className="text-gray-600">Customer Support</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-8 px-4 text-center">
                <p>&copy; 2026 ShopHub. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
