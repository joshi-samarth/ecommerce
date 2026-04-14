import { Edit, Trash2, MoreVertical } from 'lucide-react';
import DataTable from '../DataTable';
import StatusBadge from '../StatusBadge';

export default function CategoryTable({ categories, loading, onEdit, onDelete }) {
    const columns = [
        {
            key: 'image',
            label: 'Image',
            render: (row) => (
                <img
                    src={row.image || 'https://via.placeholder.com/48?text=No+Image'}
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded"
                />
            ),
        },
        {
            key: 'name',
            label: 'Name',
            render: (row) => (
                <div>
                    <p className="font-semibold text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-500">{row.slug}</p>
                </div>
            ),
        },
        {
            key: 'productCount',
            label: 'Products',
            render: (row) => (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {row.productCount || 0}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} type="product" />,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(row)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded transition"
                        title="Edit"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(row)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return <DataTable columns={columns} data={categories} loading={loading} emptyMessage="No categories found" />;
}
