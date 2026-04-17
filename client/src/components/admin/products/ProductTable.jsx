import { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Star, MoreVertical } from 'lucide-react';
import DataTable from '../DataTable';
import StatusBadge from '../StatusBadge';

export default function ProductTable({
    products,
    loading,
    onEdit,
    onDelete,
    onToggleStatus,
    onToggleFeatured,
    onUpdateStock,
}) {
    const [expandedRow, setExpandedRow] = useState(null);
    const [stockInput, setStockInput] = useState({});

    const columns = [
        {
            key: 'image',
            label: 'Image',
            render: (row) => (
                <img
                    src={row.images?.[0] || 'https://via.placeholder.com/48?text=No+Image'}
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded-lg"
                />
            ),
        },
        {
            key: 'name',
            label: 'Product',
            render: (row) => (
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
                    <p className="text-xs text-gray-500">{row.slug}</p>
                </div>
            ),
        },
        {
            key: 'category',
            label: 'Category',
            render: (row) => (
                <span className="badge badge-primary text-xs">
                    {row.category?.name || 'N/A'}
                </span>
            ),
        },
        {
            key: 'price',
            label: 'Price',
            render: (row) => (
                <div>
                    <p className="font-bold text-indigo-600">₹{row.price}</p>
                    {row.comparePrice && (
                        <p className="text-xs text-gray-500 line-through">₹{row.comparePrice}</p>
                    )}
                </div>
            ),
        },
        {
            key: 'stock',
            label: 'Stock',
            render: (row) => {
                let stockStatus = 'instock';
                if (row.stock === 0) stockStatus = 'outofstock';
                else if (row.stock <= 10) stockStatus = 'lowstock';

                return (
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{row.stock}</p>
                        <StatusBadge status={stockStatus} type="stock" />
                    </div>
                );
            },
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} type="product" />,
        },
        {
            key: 'featured',
            label: 'Featured',
            render: (row) => (
                <button
                    onClick={() => onToggleFeatured(row._id)}
                    className={`p-2.5 rounded-lg transition-all ${row.isFeatured
                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    title={row.isFeatured ? 'Remove from featured' : 'Add to featured'}
                >
                    <Star size={18} fill={row.isFeatured ? 'currentColor' : 'none'} />
                </button>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="relative">
                    <button
                        onClick={() => setExpandedRow(expandedRow === row._id ? null : row._id)}
                        className="p-2 hover:bg-gray-100 rounded transition"
                    >
                        <MoreVertical size={18} />
                    </button>

                    {expandedRow === row._id && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl z-10 min-w-44 overflow-hidden">
                            {/* Edit */}
                            <button
                                onClick={() => {
                                    onEdit(row._id);
                                    setExpandedRow(null);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 flex items-center gap-3 text-sm border-b border-gray-200 text-gray-700 hover:text-indigo-600 transition-colors"
                            >
                                <Edit size={16} />
                                Edit
                            </button>

                            {/* Toggle Status */}
                            <button
                                onClick={() => {
                                    onToggleStatus(row._id);
                                    setExpandedRow(null);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 flex items-center gap-3 text-sm border-b border-gray-200 text-gray-700 hover:text-emerald-600 transition-colors"
                            >
                                {row.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                {row.isActive ? 'Unpublish' : 'Publish'}
                            </button>

                            {/* Update Stock */}
                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Update Stock</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={stockInput[row._id] ?? row.stock}
                                        onChange={(e) =>
                                            setStockInput((prev) => ({
                                                ...prev,
                                                [row._id]: e.target.value,
                                            }))
                                        }
                                        className="input flex-1 text-sm py-2"
                                    />
                                    <button
                                        onClick={() => {
                                            onUpdateStock(row._id, parseInt(stockInput[row._id] ?? row.stock));
                                            setStockInput((prev) => {
                                                const newState = { ...prev };
                                                delete newState[row._id];
                                                return newState;
                                            });
                                            setExpandedRow(null);
                                        }}
                                        className="btn btn-primary btn-sm text-xs px-3"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={() => {
                                    onDelete(row._id);
                                    setExpandedRow(null);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return <DataTable columns={columns} data={products} loading={loading} emptyMessage="No products found" />;
}
