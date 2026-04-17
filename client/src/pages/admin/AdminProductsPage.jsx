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
            if (!productId) {
                toast.error('Product ID missing');
                return;
            }
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
            if (!productId) {
                toast.error('Product ID missing');
                return;
            }
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
            if (!productId) {
                toast.error('Product ID missing');
                return;
            }
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
            if (!productId) {
                toast.error('Product ID missing');
                return;
            }
            setActionLoading(true);
            // Use hard delete endpoint to permanently remove from database
            const res = await axios.delete(`/api/admin/products/${productId}/hard`);
            if (res.data.success) {
                toast.success('Product permanently deleted');
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
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 text-sm mt-1">Manage your product catalog</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/new')}
                    className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card border-l-4 border-indigo-200">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Total Products</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <div className="card border-l-4 border-emerald-200">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Active</p>
                        <p className="text-3xl font-bold text-emerald-600">{stats.activeProducts}</p>
                    </div>
                    <div className="card border-l-4 border-red-200">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Out of Stock</p>
                        <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
                    </div>
                    <div className="card border-l-4 border-amber-200">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Low Stock</p>
                        <p className="text-3xl font-bold text-amber-600">{stats.lowStock}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="card space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearch}
                            className="input pl-10 w-full"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={category}
                        onChange={handleCategoryFilter}
                        className="input"
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
                        className="input"
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
                message={`Are you sure you want to permanently delete "${deleteConfirm.product?.name}"? This action cannot be undone. The product will be completely removed from the database and all images will be deleted from Cloudinary.`}
                confirmLabel="Delete Permanently"
                confirmVariant="danger"
                onConfirm={() => handleDelete(deleteConfirm.product?._id)}
                onCancel={() => setDeleteConfirm({ isOpen: false, product: null })}
            />
        </div>
    );
}


