import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import axios from '../../api/axios';

import ProductTable from '../../components/admin/products/ProductTable';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(20);

    // Filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [categories, setCategories] = useState([]);

    // Confirm dialog
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null });
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/admin/categories');
                if (res.data.success) {
                    setCategories(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, [page, search, category, status]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page,
                limit,
                ...(search && { search }),
                ...(category && { category }),
                ...(status && { status }),
            });

            const [productsRes, statsRes] = await Promise.all([
                axios.get(`/api/admin/products?${params}`),
                axios.get('/api/admin/products/stats'),
            ]);

            if (productsRes.data.success) {
                setProducts(productsRes.data.data);
                setPage(productsRes.data.pagination.page);
                setPages(productsRes.data.pagination.pages);
                setTotal(productsRes.data.pagination.total);
            }

            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (productId) => {
        try {
            const res = await axios.put(`/api/admin/products/${productId}/status`);
            if (res.data.success) {
                toast.success(`Product ${res.data.data.isActive ? 'published' : 'unpublished'}`);
                setProducts((prev) =>
                    prev.map((p) => (p._id === productId ? res.data.data : p))
                );
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleUpdateStock = async (productId, newStock) => {
        try {
            const res = await axios.put(`/api/admin/products/${productId}/stock`, {
                stock: newStock,
            });
            if (res.data.success) {
                toast.success('Stock updated');
                setProducts((prev) =>
                    prev.map((p) => (p._id === productId ? res.data.data : p))
                );
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update stock');
        }
    };

    const handleToggleFeatured = async (productId) => {
        try {
            const res = await axios.put(`/api/admin/products/${productId}/featured`);
            if (res.data.success) {
                toast.success(`Product ${res.data.data.isFeatured ? 'featured' : 'unfeatured'}`);
                setProducts((prev) =>
                    prev.map((p) => (p._id === productId ? res.data.data : p))
                );
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update featured status');
        }
    };

    const handleDelete = async (productId) => {
        try {
            setActionLoading(true);
            const res = await axios.delete(`/api/admin/products/${productId}`);
            if (res.data.success) {
                toast.success('Product deleted');
                setProducts((prev) => prev.filter((p) => p._id !== productId));
                setDeleteConfirm({ isOpen: false, product: null });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete product');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = (productId) => {
        navigate(`/admin/products/${productId}/edit`);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleCategoryFilter = (e) => {
        setCategory(e.target.value);
        setPage(1);
    };

    const handleStatusFilter = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <button
                    onClick={() => navigate('/admin/products/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold">Total Products</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold">Active</div>
                        <div className="text-2xl font-bold text-green-600 mt-1">{stats.activeProducts}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold">Out of Stock</div>
                        <div className="text-2xl font-bold text-red-600 mt-1">{stats.outOfStock}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold">Low Stock</div>
                        <div className="text-2xl font-bold text-amber-600 mt-1">{stats.lowStock}</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearch}
                            className="flex-1 outline-none text-sm"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={category}
                        onChange={handleCategoryFilter}
                        className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={handleStatusFilter}
                        className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <ProductTable
                products={products}
                loading={loading}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onUpdateStock={handleUpdateStock}
                onToggleFeatured={handleToggleFeatured}
                onDelete={(productId) => {
                    const product = products.find((p) => p._id === productId);
                    setDeleteConfirm({ isOpen: true, product });
                }}
            />

            {/* Pagination */}
            <Pagination
                page={page}
                pages={pages}
                total={total}
                limit={limit}
                onPageChange={setPage}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteConfirm.product?.name}"? This will make it inactive but keep it in the database.`}
                confirmLabel="Delete"
                confirmVariant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, product: null })}
            />
        </div>
    );
}
