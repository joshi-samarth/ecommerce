import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountSidebar from '../components/user/AccountSidebar';

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Fixed width on desktop, responsive on mobile */}
                    <div className="lg:w-60 flex-shrink-0">
                        <AccountSidebar />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLayout;
