import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

export default function Navbar({ showBackButton = false, title = '' }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cart, openDrawer } = useCart();
    const { wishlistItems } = useWishlist();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                {/* Left: Back button or Logo */}
                <div className="flex items-center gap-2">
                    {showBackButton && (
                        <button
                            onClick={handleBackClick}
                            className="p-2 hover:bg-gray-100 rounded transition"
                            title="Go Back"
                        >
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ShopHub
                        </span>
                        {title && (
                            <span className="text-sm text-gray-600 ml-2">{title}</span>
                        )}
                    </div>
                </div>

                {/* Center: Navigation Menu */}
                <nav className="hidden sm:flex items-center gap-6">
                    <button
                        onClick={() => navigate('/products')}
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                        🛍️ Products
                    </button>

                    {/* Cart Icon with Badge */}
                    <button
                        onClick={openDrawer}
                        className="relative text-gray-700 hover:text-blue-600 transition"
                    >
                        <ShoppingCart size={24} />
                        {cart.itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {cart.itemCount}
                            </span>
                        )}
                    </button>

                    {/* Wishlist Icon with Badge */}
                    <button
                        onClick={() => navigate('/wishlist')}
                        className="relative text-gray-700 hover:text-blue-600 transition"
                    >
                        <Heart size={24} />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {wishlistItems.length}
                            </span>
                        )}
                    </button>
                </nav>

                {/* Right: User Menu */}
                <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-gray-200">
                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                                {user?.name
                                    ?.split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2) || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-800">{user?.name?.split(' ')[0]}</p>
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/account/profile')}
                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-medium hidden sm:inline-block"
                        >
                            👤 Account
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition font-medium"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
