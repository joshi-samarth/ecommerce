import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin', icon: '📊' },
        { label: 'Products', path: '/admin/products', icon: '📦', disabled: true },
        { label: 'Orders', path: '/admin/orders', icon: '🛒', disabled: true },
        { label: 'Users', path: '/admin/users', icon: '👥' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative w-60 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col z-50 transform md:transform-none transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <span className="text-xl">🛍️</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Admin Panel</h2>
                            <p className="text-xs text-gray-400">ShopHub</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${item.disabled
                                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                                    : isActive
                                        ? 'bg-blue-600 text-white border-l-4 border-blue-400 font-semibold'
                                        : 'text-gray-300 hover:bg-gray-700'
                                }`
                            }
                            onClick={(e) => {
                                if (item.disabled) {
                                    e.preventDefault();
                                } else {
                                    setIsOpen(false);
                                }
                            }}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                            {item.disabled && <span className="text-xs ml-auto">Soon</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 space-y-3">
                    <div className="text-sm">
                        <p className="text-gray-400 text-xs">Logged in as</p>
                        <p className="font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed md:hidden bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
            >
                {isOpen ? '✕' : '☰'}
            </button>
        </>
    );
};

export default Sidebar;
