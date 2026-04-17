import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, BarChart, Package, FolderOpen, Ticket, ShoppingCart, Users } from 'lucide-react';
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
        { label: 'Dashboard', path: '/admin', icon: BarChart },
        { label: 'Products', path: '/admin/products', icon: Package },
        { label: 'Categories', path: '/admin/categories', icon: FolderOpen },
        { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
        { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { label: 'Users', path: '/admin/users', icon: Users },
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
                className={`fixed md:sticky md:top-0 w-64 h-screen bg-gray-900 text-white flex flex-col z-50 transform md:transform-none transition-transform duration-300 overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                            S
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">ShopHub Admin</h2>
                            <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-indigo-600 text-white font-semibold shadow-lg'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 flex-shrink-0 space-y-4">
                    <div className="card bg-gray-800 p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed md:hidden bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all"
            >
                {isOpen ? '✕' : '☰'}
            </button>
        </>
    );
};

export default Sidebar;
