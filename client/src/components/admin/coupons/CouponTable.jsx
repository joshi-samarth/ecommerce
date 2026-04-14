import { Trash2, Edit2 } from 'lucide-react';
import DataTable from '../DataTable';
import StatusBadge from '../StatusBadge';

export default function CouponTable({ coupons, loading, onEdit, onDelete }) {
    const columns = [
        {
            key: 'code',
            label: 'Code',
            render: (row) => <span className="font-mono font-bold text-blue-600">{row.code}</span>,
        },
        {
            key: 'discount',
            label: 'Discount',
            render: (row) => `${row.value}${row.type === 'percent' ? '%' : '₹'}`,
        },
        {
            key: 'minOrderValue',
            label: 'Min Order',
            render: (row) => `₹${row.minOrderValue || 0}`,
        },
        {
            key: 'usageLimit',
            label: 'Usage Limit',
            render: (row) => (row.usageLimit === 0 ? '∞' : row.usageLimit),
        },
        {
            key: 'expiresAt',
            label: 'Expires',
            render: (row) => {
                const date = new Date(row.expiresAt);
                const today = new Date();
                const isExpired = date < today;
                return <span className={isExpired ? 'text-red-600' : 'text-gray-700'}>{date.toLocaleDateString()}</span>;
            },
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => {
                const isExpired = new Date(row.expiresAt) < new Date();
                return <StatusBadge status={row.isActive && !isExpired} type="coupon" />;
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(row)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return <DataTable columns={columns} data={coupons} loading={loading} emptyMessage="No coupons yet" />;
}
