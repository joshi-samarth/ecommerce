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
                    className="w-12 h-12 object-cover rounded"
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
                <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {row.category?.name || 'N/A'}
                </span>
            ),
        },
        {
            key: 'price',
            label: 'Price',
            render: (row) => (
                <div>
                    <p className="font-semibold text-gray-900">₹{row.price}</p>
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
                    className={`p-2 rounded transition ${row.isFeatured
                            ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
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
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                            {/* Edit */}
                            <button
                                onClick={() => {
                                    onEdit(row._id);
                                    setExpandedRow(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm border-b"
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
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm border-b"
                            >
                                {row.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                {row.isActive ? 'Unpublish' : 'Publish'}
                            </button>

                            {/* Update Stock */}
                            <div className="px-4 py-2 border-b">
                                <div className="flex gap-1">
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
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
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
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
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
                                className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
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
