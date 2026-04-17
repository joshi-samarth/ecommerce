import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Get page title from route
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/admin') return 'Dashboard';
        if (path === '/admin/users') return 'Manage Users';
        if (path === '/admin/products') return 'Products';
        if (path === '/admin/orders') return 'Orders';
        if (path === '/admin/categories') return 'Categories';
        if (path === '/admin/coupons') return 'Coupons';
        return 'Admin Dashboard';
    };

    // Get user initials for avatar
    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your store operations</p>
            </div>

            <div className="flex items-center gap-6">
                {/* Avatar and User Info */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{initials}</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
