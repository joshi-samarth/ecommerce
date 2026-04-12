import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AccountSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const navItems = [
        { label: 'My Profile', path: '/account/profile', icon: '👤' },
        { label: 'My Addresses', path: '/account/addresses', icon: '📍' },
        { label: 'My Orders', path: '/account/orders', icon: '📦' },
        { label: 'Security', path: '/account/security', icon: '🔐' },
    ];

    return (
        <>
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <div className="bg-white rounded-lg shadow-md p-6 space-y-6 sticky top-8">
                    {/* User Avatar & Info */}
                    <div className="text-center pb-6 border-b border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{getInitials(user?.name || 'U')}</span>
                        </div>
                        <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${isActive ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-6 pt-6 border-t border-gray-200 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium flex items-center justify-center gap-2"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Mobile Tabs - Visible only on mobile */}
            <div className="lg:hidden bg-white rounded-lg shadow-md p-3 mb-6 overflow-x-auto">
                <div className="flex gap-2 min-w-min">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    ))}
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full mt-3 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                >
                    🚪 Logout
                </button>
            </div>
        </>
    );
};

export default AccountSidebar;
