import React from 'react';

const Logo = () => {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M7 4V3m0 1a6 6 0 100 12A6 6 0 007 5zm0 13v1m0-1a1 1 0 100 2 1 1 0 000-2zm0 0h6m0 0v2m0-2a1 1 0 100 2 1 1 0 000-2zm0 0h-6" />
                    <path d="M3 12a9 9 0 0118 0m0 0v2m0-2a1 1 0 011 1v1a7 7 0 01-14 0v-1a1 1 0 011-1h12z" />
                </svg>
            </div>
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ShopHub
                </h1>
                <p className="text-xs text-gray-500">E-Commerce Platform</p>
            </div>
        </div>
    );
};

export default Logo;
