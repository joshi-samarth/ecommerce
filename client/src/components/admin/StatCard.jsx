import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'bg-indigo-100 text-indigo-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        amber: 'bg-amber-100 text-amber-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    const borderClasses = {
        indigo: 'border-indigo-200 hover:border-indigo-300',
        emerald: 'border-emerald-200 hover:border-emerald-300',
        amber: 'border-amber-200 hover:border-amber-300',
        purple: 'border-purple-200 hover:border-purple-300',
    };

    return (
        <div className={`card border-l-4 ${borderClasses[color]} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
                    {trend && (
                        <p className={`text-xs font-semibold ${trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {trend.direction === 'up' ? '↑' : '↓'} {trend.percent}% from last month
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`${colorClasses[color]} p-4 rounded-xl flex-shrink-0`}>
                        <Icon size={28} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
