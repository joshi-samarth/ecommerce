import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className={`h-2 ${color}`}></div>
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">{title}</p>
                        <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
                    </div>
                    <div className="text-4xl">{icon}</div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
