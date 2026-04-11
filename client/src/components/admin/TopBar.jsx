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
        return 'Admin Dashboard';
    };

    // Get user initials for avatar
    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>

            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{initials}</span>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
