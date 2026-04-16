import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, ArrowLeft, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

export default function Navbar({ showBackButton = false, title = '' }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cart, openDrawer } = useCart();
    const { wishlistItems } = useWishlist();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setUserDropdownOpen(false);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Left: Back button or Logo */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {showBackButton && (
                        <button
                            onClick={handleBackClick}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="Go Back"
                        >
                            <ArrowLeft size={20} className="text-gray-700" />
                        </button>
                    )}
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-bold text-gray-900 text-sm leading-none">ShopHub</p>
                            {title && <p className="text-xs text-gray-500 mt-0.5">{title}</p>}
                        </div>
                    </div>
                </div>

                {/* Center: Navigation Menu (Desktop) */}
                <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition border-b-2 border-transparent hover:border-indigo-600"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition border-b-2 border-transparent hover:border-indigo-600"
                    >
                        Products
                    </button>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Search (can be hidden on mobile) */}
                    <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:inline-flex"
                        title="Search"
                    >
                        <Search size={20} className="text-gray-700" />
                    </button>

                    {/* Wishlist Icon */}
                    <button
                        onClick={() => navigate('/wishlist')}
                        className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Wishlist"
                    >
                        <Heart size={20} className="text-gray-700" />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {wishlistItems.length}
                            </span>
                        )}
                    </button>

                    {/* Cart Icon */}
                    <button
                        onClick={openDrawer}
                        className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Cart"
                    >
                        <ShoppingCart size={20} className="text-gray-700" />
                        {cart.itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {cart.itemCount}
                            </span>
                        )}
                    </button>

                    {/* User Dropdown (Desktop) */}
                    <div className="hidden md:block relative">
                        <button
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs">
                                    {user?.name
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2) || 'U'}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user?.name?.split(' ')[0]}</span>
                        </button>
                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                                <button
                                    onClick={() => { navigate('/account/profile'); setUserDropdownOpen(false); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                                >
                                    <User size={16} /> My Account
                                </button>
                                <button
                                    onClick={() => { navigate('/account/orders'); setUserDropdownOpen(false); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                                >
                                    📦 My Orders
                                </button>
                                <div className="border-t border-gray-200 my-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        {mobileMenuOpen ? (
                            <X size={24} className="text-gray-700" />
                        ) : (
                            <Menu size={24} className="text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4">
                    <nav className="space-y-2 mb-4">
                        <button
                            onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => { navigate('/products'); setMobileMenuOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                        >
                            Products
                        </button>
                    </nav>
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <button
                            onClick={() => { navigate('/account/profile'); setMobileMenuOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                        >
                            My Account
                        </button>
                        <button
                            onClick={() => { navigate('/account/orders'); setMobileMenuOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                        >
                            My Orders
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

// Note: Add Search icon import from lucide-react if not already imported
import { Search } from 'lucide-react';
